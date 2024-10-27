import React, { useState, useEffect } from 'react';
import { AiOutlineSend, AiOutlineDelete } from 'react-icons/ai';
import axios from 'axios';

const CommentComponent = ({ post }) => {
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('https://api-main.spoekle.com/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
    fetchUser();
  }, []);

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

  const handleDeleteComment = async (id) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`https://api-main.spoekle.com/api/messages/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: user._id, role: user.role })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Failed to delete message:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="message-container w-96 bg-black/30 text-white p-4 drop-shadow-md rounded-lg">
      <p className="text-center font-bold text-2xl mb-4">Comments:</p>
      <div className="messages bg-gray-100/40 p-2 rounded-lg overflow-y-scroll h-80">
        {post.comments.map((comment) => {
          const date = new Date(comment.timestamp);
          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          });
          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });
          const readableDate = `${formattedDate} at ${formattedTime}`;
          const isOwnMessage = user && comment.userId === user._id;

          return (
            <div
              key={comment._id}
              className={`mb-4 w-4/5`}
            >
              <div className='flex flex-col m-4'>
                <div className='flex items-center m-2 rounded-xl w-full'>
                  <div className={`flex relative flex-col p-2 rounded-xl w-full drop-shadow-md ${isOwnMessage ? 'bg-blue-500 rounded-br-none text-white' : 'bg-white rounded-bl-none text-gray-800'}`}>
                    <p className="font-semibold">{comment.username}:</p>
                    <p>{comment.comment}</p>
                    <p className={`flex text-gray-800 text-xs`}>{readableDate}</p> 
                  </div>
                  {user && (user.role === 'admin') && (
                    <button onClick={() => handleDeleteComment(comment._id)} className={`ml-2 text-red-500`}>
                      <AiOutlineDelete size={20} />
                    </button>
                  )}
                </div>   
              </div>
            </div>
          );
        })}
      </div>

      {user ? (
        <div className="send-message text-neutral-900 mt-4 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow p-2 rounded-l-lg border"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="text-blue-500 bg-white p-2 rounded-r-lg flex items-center hover:text-blue-400 transition duration-200"
          >
            <AiOutlineSend size={24} />
          </button>
        </div>
      ) : (
        <p className="text-center text-red-500 mt-4">You must be logged in to comment.</p>
      )}
    </div>
  );
};

export default CommentComponent;
