"use server";
import { db } from "@/lib/db";
import { decrypt } from "@/utils/Encryption";
import { cookies } from "next/headers";





type BlogPostData = {
    title: string;
    content: string;
    imageUrl?: string;
    tags: string[];
    questions: [string, string][]; // Array of [question, answer] tuples
};
export const createBlogPost = async (data: BlogPostData) => {
    try {
        const encrypted_host_id = cookies().get('encrypted-uid');
        if (!encrypted_host_id) {
            // console.error("No encrypted-uid cookie found");
            return { success: false, error: "User not authenticated" };
        }
        const userId: string = await decrypt(encrypted_host_id.value);
        const userData: any = await db.users.findUnique({
            where: {
                user_id: userId,
            }
        });
        console.log(userData);

        const authorName: string = userData
            ? `${userData?.first_name} ${userData?.last_name}`
            : 'Unknown Author';
        console.log(data);
        const newPost = await db.blog.create({
            data: {
                title: data.title,
                content: data.content,
                imageUrl: data.imageUrl || null,
                authorId: userId,
                authorName: authorName,
                Tags: data.tags,
                qa: data.questions, // Store the question-answer pairs
            },
        });
        return {
            success: true,
            data: newPost,
        };
    } catch (error) {
        console.error('Error creating blog post:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create blog post',
        };

    }
};



export const getBlogsByTag = async (tag: string) => {
    try {
      if (!tag) {
        return { success: false, message: "Tag is required" };
      }
  
      const blogPosts = await db.blog.findMany({
        where: {
          Tags: {
            has: tag, // Matches if the specified tag exists in the Tags array
          },
        },
        orderBy: {
          createdAt: "desc", // Optional: Order by most recent
        },
      });
  
      if (blogPosts.length === 0) {
        return {
          success: false,
          message: "No blogs found with the specified tag",
        };
      }
  
      return {
        success: true,
        data: blogPosts,
      };
    } catch (error) {
      console.error("Error fetching blogs by tag:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch blogs by tag",
      };
    }
  };
  

export const getExploreBlogs = async (search: string) => {
    try {
        let blogPosts;

        if (search === 'NA' || search.trim() === '') {
            // Fetch all blogs if search is 'NA' or empty
            blogPosts = await db.blog.findMany({
                orderBy: {
                    createdAt: "desc", // Sort by most recent posts
                },
            });
        } else {
            // Replace spaces with '|' for tsquery
            const searchQuery = search.split(' ').join(' | ');
            
            // Use raw SQL for full-text search
            blogPosts = await db.$queryRaw`
                SELECT *, 
                       ts_rank_cd(to_tsvector('english', title), to_tsquery('english', ${searchQuery})) AS rank
                FROM "Blog"
                WHERE to_tsvector('english', title) @@ to_tsquery('english', ${searchQuery})
                   OR title ILIKE '%' || ${search} || '%'
                ORDER BY rank DESC;
            `;
        }

        return {
            success: true,
            data: blogPosts,
        };
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch blog posts',
        };
    }
};






export const updateBlogPost = async (data: any) => {
    try {
        const encrypted_host_id = cookies().get('encrypted-uid');
        if (!encrypted_host_id) {
            return { success: false, error: "User not authenticated" };
        }

        const userId: string = await decrypt(encrypted_host_id.value);
        const userData: any = await db.users.findUnique({
            where: {
                user_id: userId,
            }
        });

        const authorName: string = userData
            ? `${userData?.first_name} ${userData?.last_name}`
            : 'Unknown Author';

        const updatedPost = await db.blog.update({
            where: {
                id: data.id, // Use the ID to identify the blog post to update
            },
            data: {
                title: data.title || undefined, // Update only if new data is provided
                content: data.content || undefined,
                imageUrl: data.imageUrl || undefined,
                authorId: userId, // Update the authorId in case it needs to be reassigned
                authorName: authorName, // Update the authorName if needed
                Tags: data.tags || undefined,
                qa: data.questions || undefined, // Update the question-answer pairs
            },
        });

        return {
            success: true,
            data: updatedPost,
        };
    } catch (error) {
        console.error('Error updating blog post:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update blog post',
        };
    }
};



// interface RelatedBlogPost extends BlogPost {}

export const getBlogPostById = async (id: string) => {
    try {
        // Fetch the current blog post along with its tags

        const encrypted_host_id = cookies().get('encrypted-uid');
        if (!encrypted_host_id) {
            return { success: false, error: "User not authenticated" };
        }

        const userId: string = await decrypt(encrypted_host_id.value);
        const blogPost = await db.blog.findUnique({
            where: {
                id: id,
            },
        });

        if (!blogPost) {
            return {
                success: false,
                message: "Blog post not found",
            };
        }

        // Extract tags from the current blog post
        const blogTags = blogPost.Tags;

        // Fetch related blog posts with at least one common tag
        const relatedBlogs = await db.blog.findMany({
            where: {
                id: { not: id }, // Exclude the current blog post
                Tags: {
                    hasSome: blogTags, // Find blog posts with at least one common tag
                },
            },
            take: 3, // Limit to 3 related blog posts
        });
        console.log(relatedBlogs);

        return {
            success: true,
            data: {
                blogPost,
                relatedBlogs,
                author: blogPost.authorId === userId
            },
        };
    } catch (error) {
        console.error('Error fetching blog post by ID:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch blog post',
        };
    }
};

export const getBlogPostByIdForEdit = async (id: string) => {
    try {
        // Fetch the current blog post along with its tags

        const encrypted_host_id = cookies().get('encrypted-uid');
        if (!encrypted_host_id) {
            return { success: false, error: "User not authenticated" };
        }

        const userId: string = await decrypt(encrypted_host_id.value);
        const blogPost = await db.blog.findUnique({
            where: {
                id: id,
                authorId: userId
            },
        });

        if (!blogPost) {
            return {
                success: false,
                message: "Blog post not found",
            };
        };

        return {
            success: true,
            data: {
                blogPost
            },
        };
    } catch (error) {
        console.error('Error fetching blog post by ID:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch blog post',
        };
    }
};

export const getBlogBy_Particular_Host= async (userId:any) => {


    try {
      // Fetch data from the database
      const blogs = await db.blog.findMany({
        where: {
          authorId: userId,
        },
      });
      return {
        success: true,
        data: blogs,
        message: "blogs fetched and formatted successfully",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: "Error fetching or formatting blogs",
      };
    }
  };