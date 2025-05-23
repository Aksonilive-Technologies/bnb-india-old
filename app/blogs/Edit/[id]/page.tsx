'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { AiOutlinePlus } from 'react-icons/ai';
import { RxCross2 } from 'react-icons/rx';
import { formatTimestampInMonthFormat } from "@/utils/formatTimeStamp";
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from "@/firebase/firebaseConfig";
import toast from 'react-hot-toast';
import { getBlogPostByIdForEdit, updateBlogPost } from '@/actions/blog/blog.action';
import { useUserStore } from '@/store/store';
import { useRouter } from 'next/navigation';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import MultiSelectTags from '@/components/shared/MutliSelect';
import CollapsibleQA from '../../components/Qa';
import { FiTrash2 } from 'react-icons/fi';
import DynamicHead from "@/components/DynamicHead";

const tagsOptions = [
    'Adventure',
    'Life',
    'Greenery',
    'Travel',
    'Nature',
    'Photography',
    'Food',
    'Culture',
];
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

export default function EditBlogPage({ params }: any) {
    const id = params.id;
    const { user } = useUserStore();
    const [blogData, setBlogData] = useState<any>({
        title: '',
        image: null,
        blogContent: "",
        author: user.first_name + " " + user.last_name,
        time: Date.now(),
        tags: [],
        questions: [],
    });
    const [initialData, setInitialData] = useState<any>({});
    const [fetching, setFetching] = useState(false);

    const fetchBlogData = async () => {
        try {
            setFetching(true);
            const result: any = await getBlogPostByIdForEdit(id);
            if (result.success) {
                const { blogPost } = result.data;
                console.log("data in blog post is ", blogPost);

                const updatedBlogData = {
                    title: blogPost.title,
                    image: blogPost.imageUrl,
                    blogContent: blogPost.content,
                    author: user.first_name + " " + user.last_name,
                    time: new Date(blogPost.createdAt).getTime(), // Using created time from the data
                    tags: blogPost.Tags,
                    questions: blogPost.qa,
                };
                setSelectedTags(blogPost.Tags);
                setBlogData(updatedBlogData);
                setImagePreview(blogPost.imageUrl);
                setInitialData(updatedBlogData);
                setFetching(false);
            } else {
                toast.error("You Dont have access to edit this blog !!");
                setMessage("You Dont have access to edit this blog !!");
                // setFetching(false);
            }
        } catch (error) {
            console.error('Error fetching blog post data:', error);
            setMessage("Error fetching blog post data: ");
            // setFetching(false);
        }
    };

    useEffect(() => {
        fetchBlogData();
    }, []);


    const RichTextEditor = useMemo(() => dynamic(
        () => import('@/components/shared/RichTextEditor'),
        { ssr: false }
    ), []);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [preview, setPreview] = useState(false);
    const [message, setMessage] = useState('loading ...');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBlogData((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setBlogData((prev: any) => ({
                ...prev,
                image: file // Temporarily store the file
            }));
            setImagePreview(URL.createObjectURL(file)); // Show preview locally
        }
    };

    const handleRemoveImage = () => {
        setBlogData((prev: any) => ({
            ...prev,
            image: null
        }));
        setImagePreview(null);
    };

    const handleDescriptionChange = (value: string) => {
        setBlogData((prev: any) => ({
            ...prev,
            blogContent: value
        }));
    };
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadUrl, setUploadUrl] = useState(null);
    const handleUploadImage = async () => {
        if (blogData.image) {
            try {
                // Create a storage reference for the image
                const imageRef = ref(storage, `images/${Date.now()}-${blogData.image}`);

                // Create an upload task
                const uploadTask = uploadBytesResumable(imageRef, blogData.image);

                // Return a promise that resolves with the download URL
                return new Promise<string>((resolve, reject) => {
                    // Monitor the upload progress
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Upload is ${progress}% done`);
                        },
                        (error) => {
                            console.error('Error uploading file:', error);
                            reject(error); // Reject on error
                        },
                        async () => {
                            try {
                                // Get the download URL
                                const downloadURL: any = await getDownloadURL(uploadTask.snapshot.ref);
                                setUploadUrl(downloadURL); // Set URL for further use
                                setBlogData((prevData: any) => ({
                                    ...prevData,
                                    image: downloadURL,
                                }));
                                setImagePreview(downloadURL); // Preview the image
                                resolve(downloadURL); // Resolve the promise with the download URL
                            } catch (error) {
                                console.error('Error getting download URL:', error);
                                reject(error); // Reject if unable to get URL
                            }
                        }
                    );
                });
            } catch (error) {
                console.error('Error processing image upload:', error);
                throw error;
            }
        }
        return null;
    };

    const handleSubmit = async () => {
        if (!loading) {
            // Ensure that title, image, and content are not empty
            if (!blogData.title.trim()) {
                toast.error('Title is required.');
                return;
            }

            if (!blogData.image) {
                toast.error('Image is required.');
                return;
            }

            if (!blogData.blogContent.trim()) {
                toast.error('Content is required.');
                return;
            }

            // Create an object to store the fields that need to be updated
            setLoading(true);
            const updateData: any = {};

            // Compare title
            if (blogData.title !== initialData.title) {
                updateData.title = blogData.title;
            }

            // Compare image
            if (blogData.image !== initialData.image) {
                await handleUploadImage();
                updateData.imageUrl = uploadUrl;
            }

            // Compare content
            if (blogData.blogContent !== initialData.blogContent) {
                updateData.content = blogData.blogContent;
            }

            // Compare tags
            if (JSON.stringify(selectedTags) !== JSON.stringify(initialData.tags)) {
                updateData.tags = selectedTags;
            }

            // Compare questions
            if (JSON.stringify(blogData.questions) !== JSON.stringify(initialData.questions)) {
                updateData.questions = blogData.questions;
            }

            // Only proceed if there are changes to be made
            if (Object.keys(updateData).length > 0) {
                try {
                    updateData.id = id; // Add the blog post ID
                    const response = await updateBlogPost(updateData);

                    if (response.success) {
                        toast.success('Blog post updated successfully!');
                        setInitialData(blogData);
                        router.push(`/blogs/${id}`); // Update the initial data to the latest saved data
                    } else {
                        toast.error(`Failed to update blog post: ${response.message}`);
                    }
                } catch (error) {
                    console.error('Error submitting blog post update:', error);
                    toast.error('An error occurred while updating the blog post.');
                }
            } else {
                toast.error('No changes detected.');
            }

            setLoading(false);
        }
    };


    const handleAddQuestion = () => {
        setBlogData({
            ...blogData,
            questions: [...blogData.questions, ["", ""]],
        });
    };

    const handleQuestionChange = (index: number, field: string, value: string) => {
        const updatedQuestions = blogData.questions.map((qa: string[], i: number) =>
            i === index ? (field === "question" ? [value, qa[1]] : [qa[0], value]) : qa
        );
        setBlogData({ ...blogData, questions: updatedQuestions });
    };

    const handleRemoveQuestion = (index: number) => {
        const updatedQuestions = blogData.questions.filter((_: any, i: number) => i !== index);
        setBlogData({ ...blogData, questions: updatedQuestions });
    };

    const tagsOptions = ['Adventure', 'Life', 'Greenery', 'Travel', 'Nature', 'Photography', 'Food', 'Culture'];
    return (

        <div className='mb-[5vh] w-full flex justify-center flex-col  '>
            <DynamicHead title={"Blog - Edit"} />
            {
                fetching ?
                    <div className='w-full flex items-center justify-center min-h-screen'>
                        {message}
                    </div> :
                    <>
                        <SwitchTransition mode="out-in">
                            <CSSTransition
                                key={preview ? 1 : 0}
                                timeout={300}
                                classNames="step"
                                unmountOnExit
                                mountOnEnter
                            >
                                <div>
                                    {
                                        !preview ?
                                            <div className="w-full mx-auto min-h-[85vh] flex flex-col items-left md:max-w-4xl justify-center p-6 bg-white ">
                                                {/* Title Section */}
                                                <div className="mb-8">
                                                    <h1 className="mb-2 text-2xl font-bold text-gray-800">Add a Catchy Title</h1>
                                                    <p className="text-gray-600 mb-4 pb-3">
                                                        A good title attracts readers. Make it interesting and informative.
                                                    </p>
                                                    <label className="field flex flex-col border border-gray-300 rounded p-3 focus-within:border-pink-500">
                                                        <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-2">Blog Title</span>
                                                        <input
                                                            className="field__input bg-transparent text-lg font-bold focus:outline-none"
                                                            type="text"
                                                            id="title"
                                                            name="title"
                                                            value={blogData.title}
                                                            onChange={handleInputChange}
                                                            placeholder="Enter your blog title..."
                                                        />
                                                    </label>
                                                </div>
                                                <div className="mb-8">
                                                    <h1 className="mb-2 text-2xl font-bold text-gray-800">Select Relevant Tags</h1>
                                                    <p className="text-gray-600 mb-4 pb-3">
                                                        Tags play a crucial role in making your content discoverable. Choose tags that best represent the key themes of your content to reach the right audience and enhance visibility.
                                                    </p>
                                                    <div>
                                                        <MultiSelectTags
                                                            tagsOptions={tagsOptions}
                                                            selectedTags={selectedTags}
                                                            setSelectedTags={setSelectedTags}
                                                        />
                                                    </div>
                                                </div>


                                                {/* Image Upload Section */}
                                                <div className="mb-8">
                                                    <h1 className="mb-2 text-2xl font-bold text-gray-800">Add a Featured Image</h1>
                                                    <p className="text-gray-600 mb-4 pb-3">
                                                        This image will be the cover of your blog post.
                                                    </p>
                                                    <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start max-h-[400px] overflow-y-auto no-scrollbar">

                                                        {imagePreview ? (
                                                            <div className="flex flex-col items-center shadow-lg rounded-md overflow-hidden border relative w-full h-[50vh]">
                                                                <Image
                                                                    src={imagePreview}
                                                                    alt="Blog Image"
                                                                    width={800}
                                                                    height={800}
                                                                    className="object-cover w-full h-full"
                                                                />
                                                                <button
                                                                    onClick={handleRemoveImage}
                                                                    className="absolute top-2 right-2 bg-black text-white rounded-full p-1 hover:bg-gray-800 shadow-md"
                                                                >
                                                                    <RxCross2 />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            // <div className="flex items-center justify-center w-40 h-40 bg-gray-200 rounded-md">
                                                            //     <span className="text-gray-500">No Image</span>
                                                            // </div>

                                                            <div className="w-full h-40 flex flex-col items-center justify-center border-2 border-dotted border-gray-300 rounded-md cursor-pointer relative">
                                                                <input
                                                                    type="file"
                                                                    id="image"
                                                                    name="image"
                                                                    accept="image/*"
                                                                    onChange={handleImageChange}
                                                                    className="absolute w-full h-full opacity-0 cursor-pointer"
                                                                />
                                                                <AiOutlinePlus size={30} className="text-gray-500" />
                                                                {/* <div className="flex items-center justify-center w-40 h-40 bg-gray-200 rounded-md"> */}
                                                                <span className="text-gray-500">Select Your image</span>
                                                                {/* </div> */}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Description Section */}
                                                <div className="mb-8">
                                                    <h1 className="mb-2 text-2xl font-bold text-gray-800">Write Your Blog Content</h1>
                                                    <p className="text-gray-600 mb-4 pb-3">
                                                        Share your thoughts, stories, and insights. Use the editor below to create your content.
                                                    </p>
                                                    <RichTextEditor
                                                        value={blogData.blogContent}
                                                        onChange={handleDescriptionChange}
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <div className="flex flex-row items-center justify-between">
                                                        <div>
                                                            <h1 className="mb-2 text-lg md:text-xl font-bold text-gray-800">
                                                                Common Questions & Answers
                                                            </h1>
                                                            <p className="text-gray-600 mb-4 pb-3 text-sm md:text-base">
                                                                Provide answers to some of the common questions related to your blog.
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center flex-row justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={handleAddQuestion}
                                                                className="bg-gray-200 text-gray-800 font-semibold rounded-md p-2 hover:red-gradient hover:text-white gap-1  flex items-center flex-row justify-center"
                                                            >
                                                                <AiOutlinePlus size={14} className="text-inherit font-bold " /> Questions
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {blogData.questions.map((qa: any, index: number) => (
                                                        <div key={index} className="mb-4 border border-gray-300 rounded p-4">
                                                            <div className="flex justify-between items-center">
                                                                <label className="field flex flex-col mb-2 w-full">
                                                                    <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-2">Question</span>
                                                                    <input
                                                                        className="field__input bg-transparent text-lg focus:outline-none"
                                                                        type="text"
                                                                        value={qa[0]}
                                                                        onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                                                                        placeholder="Enter the question..."
                                                                    />
                                                                </label>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveQuestion(index)}
                                                                    className="ml-4 text-gray-500 hover:text-red-600"
                                                                >
                                                                    <FiTrash2 size={18} />
                                                                </button>
                                                            </div>
                                                            <label className="field flex flex-col">
                                                                <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-2">Answer</span>
                                                                <textarea
                                                                    className="field__input bg-transparent text-lg focus:outline-none"
                                                                    value={qa[1]}
                                                                    onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
                                                                    placeholder="Enter the answer..."
                                                                />
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div> :

                                            <main className="w-full px-4 mx-auto md:max-w-6xl  p-4 flex justify-center items-center">
                                                <article className="flex flex-col gap-6 w-full sm:w-[95%] bg-white p-8 rounded-lg ">
                                                    {/* Title Section */}
                                                    <h1 className="text-2xl md:text-4xl font-bold text-left">
                                                        {blogData.title || "Add Title"}
                                                    </h1>

                                                    {/* Image Section */}
                                                    <figure className="h-60 md:h-[350px] w-full rounded-lg overflow-hidden">
                                                        {imagePreview ? (
                                                            <Image
                                                                src={imagePreview}
                                                                alt={blogData.title || "Blog Image"}
                                                                width={1200}
                                                                height={800}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                <span className="text-gray-500">No Image Provided</span>
                                                            </div>
                                                        )}
                                                    </figure>

                                                    {/* Tag and Author Section */}
                                                    <div className="flex flex-col md:flex-row items-center justify-between font-semibold text-gray-700 mt-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedTags.map((tag) => (
                                                                <span key={tag} className="font-semibold underline text-gray-600">
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div>
                                                            Published by <span className="font-bold">{blogData.author}</span>{" "}
                                                            <span className="font-normal"> - {formatTimestampInMonthFormat(new Date())}</span>
                                                        </div>
                                                    </div>

                                                    {/* Content and Related Questions Section */}
                                                    <hr className="my-6" />
                                                    <div className="flex flex-col md:flex-row md:justify-between gap-8 mt-6">
                                                        {/* Main Article (70%) */}
                                                        <article className="w-full md:w-[70%] flex flex-col gap-6">
                                                            <div
                                                                className="prose prose-lg prose-gray max-w-none space-y-4"
                                                                dangerouslySetInnerHTML={{ __html: blogData.blogContent || "<p>Add your content here...</p>" }}
                                                            />
                                                        </article>

                                                        {/* Related Questions (30%) */}
                                                        <aside className="w-full md:w-[30%] flex flex-col gap-6 sticky top-0">
                                                            <div>
                                                                <h3 className="text-lg md:text-xl font-semibold pb-2 text-gray-800">Related Questions</h3>
                                                                {blogData.questions && blogData.questions.length > 0 ? (
                                                                    blogData.questions.map((qa: any, index: any) => (
                                                                        <CollapsibleQA key={index} question={qa[0]} answer={qa[1]} />
                                                                    ))
                                                                ) : (
                                                                    <p className="text-gray-500">No questions available.</p>
                                                                )}
                                                            </div>
                                                        </aside>
                                                    </div>
                                                </article>
                                            </main>

                                    }

                                </div>
                            </CSSTransition>
                        </SwitchTransition>
                        <div className='flex flex-row-reverse w-full mx-auto md:w-[70vw] justify-between px-4'>
                            {preview && (
                                <div
                                    className={`w-[180px] flex justify-center items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-center cursor-pointer hover:red-gradient hover:text-white transition-colors`}
                                    onClick={() => handleSubmit()}
                                >
                                    {loading && (
                                        <svg
                                            className="animate-spin h-5 w-5 text-white mr-2"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                    )}
                                    {loading ? "Editing Blog " : "Submit"}
                                </div>

                            )}

                            <div
                                className={`w-[180px] px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-center cursor-pointer hover:red-gradient hover:text-white transition-colors`}
                                onClick={() => setPreview(!preview)}
                            >
                                {preview ? "Edit" : "Preview"}
                            </div>
                        </div>

                    </>
            }

        </div>
    );
};
