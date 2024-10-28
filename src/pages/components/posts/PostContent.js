import React from 'react';
import { useState } from 'react';

const PostContent = ({ post, setExpandedPost, isLoggedin, user }) => {
  const [newMessage, setNewMessage] = useState('');

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleSendMessage = async () => {
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://api-main.spoekle.com/api/posts/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: newMessage }),
      });
      const updatedPost = await response.json();
      post.comments = updatedPost.comments;
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const deletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      fetch(`https://api-main.spoekle.com/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(() => setExpandedPost(null));
    }
  }

  return (
    <div className="p-4">
      { user && user.role === 'admin' && (
        <div className="bg-neutral-700 p-4 rounded-lg mb-4">
          <h3 className="text-lg text-white font-bold mb-2">Admin Actions</h3>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            onClick={() => { deletePost(); }
            }
          >
            Delete Post
          </button>
        </div>
      )}
      <div className="flex justify-between items-center bg-neutral-700 p-2 rounded-t-xl">
        <div className="text-gray-200 text-sm">
          <p>Posted At: {new Date(post.createdAt).toLocaleString()}</p>
        </div>
        <h2 className="text-xl text-white font-bold">{post.author}</h2>
        <button className="bg-neutral-800 hover:bg-neutral-900 text-white px-4 py-2 rounded-lg"
          onClick={() => setExpandedPost(null)}
        >
          <h2 className="text-xl text-white font-bold">Back to Posts</h2>
        </button>
      </div>
      <div className="flex flex-grow p-4 overflow-auto">
        <div className="flex-shrink-0 w-48 h-48 bg-cover bg-center rounded-lg mr-4" style={{ backgroundImage: `url(${post.file})` }}></div>
        <div className="flex flex-col flex-grow">
          <h3 className="text-2xl text-white font-bold mb-2">{post.title}</h3>
          <div className="bg-black/20 text-white p-4 drop-shadow-md rounded-lg mb-2 flex-grow overflow-auto">
            <p className="text-white">{post.message}</p>
          </div>
        </div>
      </div>
      <div className="bg-neutral-700 p-4 rounded-b-xl">
        <h3 className="text-lg text-white font-bold mb-2">Comments</h3>
        <div className="flex flex-col space-y-2 bg-neutral-800 rounded-lg p-4">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <div key={index} className="bg-neutral-600 p-2 rounded-lg text-white">
                <p className="font-bold">{comment.username}</p>
                <p>{comment.comment}</p>
                <p className="text-sm text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-white">No comments yet.</p>
          )}
          {isLoggedin ? (
            <div className="bg-neutral-700 p-4 rounded-b-xl">
              <h3 className="text-lg text-white font-bold mb-2">Add Comment</h3>
              <form className="flex flex-col" onSubmit={handleSendMessage}>
                <h2 className="p-2 rounded-t-lg bg-neutral-600 text-white">Comment as: {user.username}</h2>
                <textarea placeholder="Comment" className="p-2 rounded-b-lg bg-neutral-600 text-white"></textarea>
                <button type="submit" disabled className="mt-2 bg-neutral-800 hover:bg-neutral-900 text-white px-4 py-2 rounded-lg">Add Comment</button>
              </form>
            </div>
          ) : (
            <div className="bg-neutral-700 p-4 rounded-b-xl">
              <h3 className="text-lg text-white font-bold mb-2">Add Comment</h3>
              <p className="text-white">You must be logged in to add a comment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostContent;