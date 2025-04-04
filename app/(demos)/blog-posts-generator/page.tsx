"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Icon from '@/components/Icon';
import './BlogPostsGeneratorDemo.css';

interface BlogPost {
  Title: string;
  Tags: string;
  Content: string;
  "Image URL": string;
}

const BlogPostsGeneratorDemo: React.FC = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  const [generated, setGenerated] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<BlogPost[]>([]); 

  const [aiLoading, setAiLoading] = useState(false);
  const [aiMultipleLoading, setAiMultipleLoading] = useState(false);


  const handleGeneratePost = () => {
    setGeneratedPosts([]);
    setGenerated(true);
  };


  const handleWriteWithAI = async () => {
    setAiLoading(true);
    try {
      const response = await fetch("https://stagingapi.neuralseek.com/v1/testnew/maistro", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "apikey": "bbd04989-613cbbb9-553e52fb-d0cd4033",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ agent: "generatePostWebScrape" })
      });
      const data = await response.json();
 
      const answerObj = JSON.parse(data.answer);


      setTitle(answerObj.Title || '');
      setTags(answerObj.Tags || '');
      setContent(answerObj.Content || '');
      setImageUrl(answerObj["Image URL"] || '');

      setGeneratedPosts([]);
      setGenerated(true);
    } catch (error) {
      console.error("Error calling Write with AI API:", error);
    } finally {
      setAiLoading(false);
    }
  };


  const handleWriteWithAI10 = async () => {
    setAiMultipleLoading(true);
    try {
      const response = await fetch("https://stagingapi.neuralseek.com/v1/testnew/maistro", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "apikey": "bbd04989-613cbbb9-553e52fb-d0cd4033",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ agent: "generatePostWebScrape10" })
      });
      const data = await response.json();
      let articlesArray: BlogPost[];
      try {
        articlesArray = JSON.parse(data.answer);
      } catch (err) {
        let fixedAnswer = data.answer.trim();
        if (!fixedAnswer.endsWith("]")) {
          fixedAnswer += "]";
        }
        articlesArray = JSON.parse(fixedAnswer);
      }
      setGeneratedPosts(articlesArray);
 
      setGenerated(false);
    } catch (error) {
      console.error("Error calling Write with AI 10 Articles API:", error);
    } finally {
      setAiMultipleLoading(false);
    }
  };


  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, newComment.trim()]);
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Animated Title */}
        <h1 className="animated-title text-4xl font-extrabold mb-6 text-center">
          AI Content Generator
        </h1>

        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            />
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., React, Next.js, Tailwind"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            />
          </div>

          {/* Markdown Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content (Markdown Supported)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content in markdown..."
              rows={8}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            />
          </div>

          {/* Image URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleGeneratePost}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Generate Post
            </button>
            <button
              onClick={handleWriteWithAI}
              disabled={aiLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center space-x-2 disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <span>Write with AI</span>
              )}
            </button>
            <button
              onClick={handleWriteWithAI10}
              disabled={aiMultipleLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50"
            >
              {aiMultipleLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <span>Generating 10 Articles...</span>
                </>
              ) : (
                <span>Write with AI 10 Articles</span>
              )}
            </button>
          </div>
        </div>

        {/* Render the Generated Blog Post(s) */}
        {generatedPosts.length > 0 ? (
          <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-6">
            {generatedPosts.map((post, index) => (
              <div key={index} className="mb-10">
                <h2 className="text-2xl font-semibold mb-2 text-center">
                  {post.Title || 'Blog Title'}
                </h2>
                {post["Image URL"] && (
                  <img
                    src={post["Image URL"]}
                    alt="Blog Post"
                    className="w-full h-auto rounded-md mb-4"
                  />
                )}
                <div className="prose max-w-none mb-4 dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.Content || `# Sample Heading\n\nThis is **markdown** content.`}
                  </ReactMarkdown>
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Tags: </span>
                  {post.Tags
                    ? post.Tags.split(',').map((tag, i) => (
                        <span
                          key={i}
                          className="inline-block bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 py-1 mr-2 rounded"
                        >
                          {tag.trim()}
                        </span>
                      ))
                    : <span>No tags provided</span>}
                </div>
              </div>
            ))}
          </div>
        ) : generated ? (
          // Render single generated post preview if no multiple posts exist
          <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              {title || 'Blog Title'}
            </h2>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Blog Post"
                className="w-full h-auto rounded-md mb-4"
              />
            )}
            <div className="prose max-w-none mb-4 dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || `# Sample Heading\n\nThis is **markdown** content. Feel free to edit.`}
              </ReactMarkdown>
            </div>
            <div className="mb-4">
              <span className="font-semibold">Tags: </span>
              {tags
                ? tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 py-1 mr-2 rounded"
                    >
                      {tag.trim()}
                    </span>
                  ))
                : <span>No tags provided</span>}
            </div>

            {/* Comments Section */}
            <div className="mb-6">
              <h3 className="font-semibold text-xl mb-2">Comments</h3>
              {comments.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
              ) : (
                <ul className="space-y-2">
                  {comments.map((comment, index) => (
                    <li key={index} className="border-b border-gray-300 dark:border-gray-700 pb-2">
                      {comment}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
                />
                <button
                  onClick={handleAddComment}
                  className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <Icon name="send" />
                  <span className="ml-1">Send</span>
                </button>
              </div>
            </div>

            {/* Reactions Section */}
            <div>
              <h3 className="font-semibold text-xl mb-2">Reactions</h3>
              <div className="flex space-x-6">
                <button className="flex items-center space-x-1">
                  <Icon name="like" />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-1">
                  <Icon name="love" />
                  <span>Love</span>
                </button>
                <button className="flex items-center space-x-1">
                  <Icon name="clap" />
                  <span>Clap</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BlogPostsGeneratorDemo;
