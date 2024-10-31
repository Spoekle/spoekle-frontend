import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const PostContent = ({ post, setExpandedPost, isLoggedIn, user, fetchPosts }) => {
  const [currentPost, setCurrentPost] = useState(post);
  const [newComment, setNewComment] = useState('');

  if (!currentPost) {
    return <div>Loading...</div>;
  }

  const closeExpandedPost = () => {
    fetchPosts();
    setExpandedPost(null);
  };

  const handleUpvote = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `https://api-main.spoekle.com/api/posts/${currentPost._id}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentPost(response.data);
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  const handleDownvote = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `https://api-main.spoekle.com/api/posts/${currentPost._id}/downvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentPost(response.data);
    } catch (error) {
      console.error('Error downvoting post:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `https://api-main.spoekle.com/api/posts/${currentPost._id}/comment`,
        { comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentPost(response.data);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.delete(
          `https://api-main.spoekle.com/api/posts/${currentPost._id}/comment/${commentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCurrentPost(response.data);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`https://api-main.spoekle.com/api/posts/${currentPost._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpandedPost(null);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center bg-blue-600 p-2 rounded-t-xl">
        <div className="text-gray-200 text-sm">
          <p>Posted At: {new Date(currentPost.createdAt).toLocaleString()}</p>
        </div>
        <h2 className="text-xl text-white font-bold">{currentPost.author}</h2>
        <Link
          to={`/posts/`}
          className="bg-neutral-800 hover:bg-neutral-900 text-white px-4 py-2 rounded-lg"
          onClick={closeExpandedPost}
        >
          Back to Posts!
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-4 bg-neutral-800 flex-grow p-4 overflow-auto">
        <div
          className="col-span-4 md:col-span-1 w-full h-32 md:h-auto md:aspect-square bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${currentPost.file})` }}
        ></div>
        <div className="col-span-4 md:col-span-3 flex-col flex-grow">
          <h3 className="text-2xl text-white font-bold mb-2">{currentPost.title}</h3>
          <div className="bg-black/20 text-white p-4 drop-shadow-md rounded-lg mb-2 flex-grow overflow-auto">
            <p className="text-white">{currentPost.message}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 bg-neutral-700 rounded-b-xl">
        <div className="flex items-center">
          <button
            className="flex items-center mr-4 text-white hover:text-green-400"
            onClick={handleUpvote}
          >
            <FaThumbsUp className="mr-1" /> {currentPost.upvotes}
          </button>
          <button
            className="flex items-center mr-4 text-white hover:text-red-400"
            onClick={handleDownvote}
          >
            <FaThumbsDown className="mr-1" /> {currentPost.downvotes}
          </button>
        </div>
        {user && user.role === 'admin' && (
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            onClick={handleDeletePost}
          >
            Delete Post
          </button>
        )}
      </div>

      <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-xl mt-4">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Comments</h3>
        <div className="space-y-4">
          {currentPost.comments && currentPost.comments.length > 0 ? (
            currentPost.comments.map((comment, index) => (
              <div key={index} className="bg-neutral-200 dark:bg-neutral-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <p className="font-semibold text-neutral-900 dark:text-white mr-2">
                      {comment.username}
                    </p>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      on {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {user && (user.username === comment.username || user.role === 'admin') && (
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-neutral-800 dark:text-gray-200">{comment.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-neutral-700 dark:text-gray-300">No comments yet.</p>
          )}
        </div>
        {isLoggedIn ? (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Add Comment</h3>
            <form className="flex flex-col" onSubmit={handleAddComment}>
              <textarea
                placeholder="Write your comment here..."
                className="p-3 mb-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
              ></textarea>
              <button
                type="submit"
                className="self-end bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
              >
                Post Comment
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-neutral-700 dark:text-gray-300">
              You must be logged in to add a comment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostContent;