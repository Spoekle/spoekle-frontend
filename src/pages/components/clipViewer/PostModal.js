import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import CommentComponent from './CommentComponent';
import axios from 'axios';

const PostModal = ({ expandedPost, posts, setExpandedPost, isLoggedIn, token, user, fetchPosts }) => {
    const [file, setFile] = useState(null);
    const [newPost, setNewPost] = useState({
        author: user?.username || '',
        title: '',
        message: '',
        file: file,
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setNewPost((prevPost) => ({
            ...prevPost,
            file: selectedFile,
        }));
    };

    if (expandedPost === null) return null;

    const post = expandedPost === "new" ? newPost : posts.find((post) => post._id === expandedPost);

    const handleClickOutside = (event) => {
        if (event.target.className.includes('modal-overlay')) {
            closeModal();
        }
    };

    const handleCloseButton = () => {
        closeModal();
    };

    const closeModal = () => {
        const modalContent = document.querySelector('.modal-content');
        const modalOverlay = document.querySelector('.modal-overlay');
        modalContent.style.transition = 'transform 600ms';
        modalContent.style.transform = 'scale(0)';
        modalOverlay.style.transition = 'opacity 200ms';
        modalOverlay.style.opacity = '0';

        setTimeout(() => {
            setExpandedPost(null);
            modalContent.style.transform = '';
            modalOverlay.style.opacity = '';
        }, 200);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('author', newPost.author);
        formData.append('title', newPost.title);
        formData.append('message', newPost.message);
        formData.append('file', newPost.file);

        try {
            const response = await axios.post(
                'https://api-main.spoekle.com/api/posts',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log('Post created successfully:', response.data);
            fetchPosts();
            setExpandedPost(null);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const date = new Date(post.createdAt);
    const editDate = new Date(post.updatedAt);
    const formattedEditDate = editDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedEditTime = editDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
    const readableEditDate = `${formattedEditDate} at ${formattedEditTime}`;

    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
    const readableDate = `${formattedDate} at ${formattedTime}`;

    return ReactDOM.createPortal(
        <div
            className="modal-overlay fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50 duration-300"
            onClick={handleClickOutside}
        >
            <div className="modal-content relative max-h-screen max-w-screen rounded-lg animate-fade">
                {expandedPost === "new" && isLoggedIn && (user.role === 'admin' || user.role === 'uploader') ? (
                    <div className="relative z-10 flex flex-col max-h-screen max-w-screen bg-neuteral-800 backdrop-blur-md rounded-lg drop-shadow-xl">
                        <div className="clip-content flex-grow items-center justify-center">
                            <div className='flex bg-black/20 rounded-t-lg drop-shadow-md w-full'>
                                <div className='flex justify-between w-full'>
                                    <div className='flex flex-col p-4'>
                                        <input
                                            type="text"
                                            name="author"
                                            value={newPost.author}
                                            onChange={handleInputChange}
                                            placeholder="Author"
                                            className="text-gray-200 text-sm bg-transparent border-b border-gray-200 focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            name="title"
                                            value={newPost.title}
                                            onChange={handleInputChange}
                                            placeholder="Title"
                                            className="text-gray-200 text-sm bg-transparent border-b border-gray-200 focus:outline-none"
                                        />
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="text-sm text-gray-200 mt-2"
                                        />
                                    </div>
                                    <div className='flex justify-end m-4'>
                                        <button
                                            className="text-white bg-red-500/60 hover:bg-red-500/80 rounded-md transition duration-300 p-2"
                                            onClick={() => handleCloseButton()}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex p-4">
                                <div className="flex flex-col w-96">
                                    <div className="bg-black/20 text-white p-4 drop-shadow-md rounded-lg mb-2 w-full">
                                        <textarea
                                            name="message"
                                            value={newPost.message}
                                            onChange={handleInputChange}
                                            placeholder="Message"
                                            className="text-white bg-transparent border-b border-gray-200 focus:outline-none w-full"
                                        />
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <button
                                            className="text-white bg-green-500/60 hover:bg-green-500/80 rounded-md transition duration-300 p-2"
                                            onClick={handleSubmit}
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="relative z-10 flex flex-col max-h-screen max-w-screen bg-neutral-200 dark:bg-neutral-800 backdrop-blur-md rounded-xl drop-shadow-xl">
                            <div className="clip-content flex-grow items-center justify-center">
                                <div className='flex drop-shadow-md w-full'>
                                    <div className='flex justify-between w-full'>
                                        <div className='flex flex-col p-4'>
                                            <h2 className="text-xl text-white font-bold">
                                                {post.author}
                                            </h2>
                                            <h3 className="text-gray-200 text-sm">{post.title}</h3>
                                            <h3 className="text-sm text-gray-200">Uploaded on: {readableDate}</h3>
                                            <h3 className="text-sm text-gray-200">Last edited on: {readableEditDate}</h3>
                                        </div>
                                        <div className='flex justify-end m-4'>
                                            <button
                                                className="text-white bg-red-500/60 hover:bg-red-500/80 rounded-md transition duration-300 p-2"
                                                onClick={() => handleCloseButton()}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex p-4">
                                    <div className="flex flex-col w-96">
                                        <div className="bg-black/20 text-white p-4 drop-shadow-md rounded-lg mb-2 w-full">
                                            <div className="flex flex-col w-full">
                                                <p className="text-white font-bold">{post.message}</p>
                                            </div>
                                        </div>
                                        <div className="flex md:hidden justify-center items-center"> 
                                            <p className="text-center bg-white drop-shadow-md rounded-lg p-4 font-bold text-lg mt-4">View this page on a computer to chat!</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col max-w-96 items-center ml-4">
                                    <div className="flex-col justify-center items-center hidden md:flex">
                                        <CommentComponent post={post} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div >,
    document.body
    );
};

export default PostModal;
