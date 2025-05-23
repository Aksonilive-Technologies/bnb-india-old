'use server'
import Image from "next/image";
import { formatTimestampInMonthFormat } from "@/utils/formatTimeStamp";
import { getBlogPostById } from "@/actions/blog/blog.action";
import Link from "next/link";
import truncateText from "@/utils/CommonFunctions";
import CollapsibleQA from "../components/Qa";
import DynamicHead from "@/components/DynamicHead";


// Define the BlogPost interface
interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  authorName: string;
  Tags: string[];
  qa?: [string, string][]; // Add questions field here
}

// Define a function to fetch the blog post
const fetchBlogPost = async (id: string): Promise<{ blogPost: BlogPost; relatedArticles: BlogPost[], author: Boolean } | null> => {
  try {
    const result: any = await getBlogPostById(id);
    if (result.success) {
      const { blogPost, relatedBlogs, author } = result.data;
      return {
        blogPost,
        relatedArticles: relatedBlogs,
        author
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching blog post data:', error);
    return null;
  }
};

// Server Component for BlogPostPage
export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const data = await fetchBlogPost(params.id);

  if (!data) {
    return <p>Blog post not found</p>;
  }

  const { blogPost, relatedArticles, author } = data;

  return (
    <main className="px-4 my-[5vh] mx-auto md:w-[90vw] md:px-10 p-4">
      <DynamicHead title={`${blogPost.title} || 'blogs`} />
      <div className="max-w-screen-xl mx-auto">
        {/* Title Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-4xl font-bold text-left">
            {blogPost.title}
          </h1>
          {
            author && <Link href={`/blogs/Edit/${blogPost.id}`}>
              Edit
            </Link>
          }

        </div>


        {/* Image Section */}
        <figure className="h-80 md:h-[450px] w-full rounded-xl overflow-hidden mt-4">
          <Image
            src={blogPost.imageUrl || '/default-image.jpg'} // Provide a fallback image
            alt={blogPost.title}
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
          />
        </figure>
        {/* 
        <h2 className="text-right w-full mt-3 font-semibold text-gray-700">
          <span className="font-bold">{blogPost.authorName}</span>
          <span className="font-normal block sm:inline-block"> - {formatTimestampInMonthFormat(blogPost.createdAt)}</span>
        </h2> */}

        {/* Tag and Author Section */}
        <div className="flex flex-col md:flex-row items-center justify-between font-semibold text-gray-700 mt-4">
          <div className="flex flex-wrap gap-2">
            {blogPost.Tags.map((tag) => (<>
              <div className=' font-semibold underline text-gray-600 mx-2'>
                #{
                  tag
                }
              </div>
            </>))}
          </div>
          <div>
            published by <span className="font-extrabold">{blogPost.authorName}</span>{" "}
            <span className="font-normal block sm:inline-block"> {formatTimestampInMonthFormat(blogPost.createdAt)}</span>

          </div>
        </div>

        {/* Content and Related Articles Section */}
        <div className="flex flex-col md:flex-row md:justify-between gap-8 mt-8">

          {/* Main Article (70%) */}
          <article className="w-full md:w-[70%] flex flex-col gap-6">
            <div
              className="prose prose-lg prose-pink max-w-none mb-10 leading-relaxed text-gray-800"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />

          </article>

          {/* Related Articles (30%) */}
          <aside className="w-full md:w-[30%] flex flex-col sticky top-0 gap-6">

            {/* Common Questions & Answers Section */}
            <div className="mb-4">

              <h3 className="text-lg md:text-xl font-bold pb-2 text-gray-800">Related Question</h3>
              {blogPost.qa && blogPost.qa.length > 0 ? (
                blogPost.qa.map((qa, index) => (
                  <CollapsibleQA key={index} question={qa[0]} answer={qa[1]} />
                ))
              ) : (
                <p className="text-gray-500">No questions Available.</p>
              )}
            </div>

            {/* Related Articles */}
            <div className="mt-8">
              <h3 className="text-lg md:text-xl font-bold pb-2 text-gray-800">Related Articles</h3>
              {relatedArticles.map((article) => (
                <div
                  key={article.id}
                  className="relative border border-gray-200 p-4 my-4 rounded-lg bg-white transition-colors hover:bg-gray-100"
                >
                  <Link href={`/blogs/${article.id}`}>
                    <figure className="rounded-lg overflow-hidden mb-3 h-40 md:h-46">
                      <Image
                        src={article.imageUrl || '/default-image.jpg'} // Provide a fallback image
                        alt={`Featured blog thumbnail - ${article.id}`}
                        width={400}
                        height={250}
                        className="object-cover w-full h-full"
                      />
                    </figure>
                    <h4 className="text-md font-bold text-gray-900 mb-1">
                      {article.title}
                    </h4>
                    <p
                      className="text-sm text-gray-600 leading-tight line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: truncateText(article.content, 100) }}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}




