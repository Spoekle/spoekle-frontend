import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostContent from './components/posts/PostContent';
import NewPostForm from './components/posts/NewPostForm';
import LoadingBar from 'react-top-loading-bar';
import Pagination from '@mui/material/Pagination';

import background from '../media/background.jpg';

const Posts = () => {
  const { postId } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [currentPosts, setCurrentPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(postId || null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [progress, setProgress] = useState(0);

  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [isPostLoading, setIsPostLoading] = useState(false);

  const postsPerPage = 6;

  useEffect(() => {
    fetchInitialData();
  }, []);
  
  const fetchInitialData = async () => {
    try {
      await fetchUser();
      setProgress(10);
      checkLoginStatus();
      setProgress(20);
      setProgress(50);
      if (!expandedPost) {
        await fetchPosts();
      }
      setProgress(100);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };


  const fetchPosts = async () => {
    setIsPostsLoading(true);
    try {
      const response = await axios.get('https://api-main.spoekle.com/api/posts');
      setPosts(response.data);
      setIsPostsLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setIsPostsLoading(false);
    }
  };

  useEffect(() => {
    if (expandedPost && expandedPost !== 'new') {
      setIsPostLoading(true);
      axios
        .get(`https://api-main.spoekle.com/api/posts/${expandedPost}`)
        .then((response) => {
          setCurrentPost(response.data);
          setIsPostLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching post:', error);
          setIsPostLoading(false);
        });
    }
  }, [expandedPost]);

  useEffect(() => {
    sortPosts();
  }, [sortOption, currentPage, posts]);

  const sortPosts = () => {
    let sortedPosts = [...posts];
    switch (sortOption) {
      case 'newest':
        sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        sortedPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highestUpvotes':
        sortedPosts.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'highestDownvotes':
        sortedPosts.sort((a, b) => b.downvotes - a.downvotes);
        break;
      default:
        break;
    }
    setTotalPages(Math.ceil(sortedPosts.length / postsPerPage));
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    setCurrentPosts(sortedPosts.slice(startIndex, endIndex));
  };

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      fetchUser();
    }
  };

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

  const paginate = (page) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    if (expandedPost === 'new') {
      return <NewPostForm setExpandedPost={setExpandedPost} fetchPosts={fetchPosts} />;
    } else if (expandedPost) {
      if (isPostLoading) {
        return <div className="text-center py-8">Loading post...</div>;
      } else if (currentPost) {
        return (
          <PostContent
            post={currentPost}
            setExpandedPost={setExpandedPost}
            user={user}
            isLoggedIn={isLoggedIn}
            fetchPosts={fetchPosts}
          />
        );
      } else {
        return <div className="text-center py-8">Post not found.</div>;
      }
    } else {
      if (isPostsLoading) {
        return <div className="text-center py-8">Loading posts...</div>;
      } else {
        return (
          <>
            <div className="text-center py-4 justify-center items-center z-30">
              <div className="pb-4 flex justify-center">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white transition duration-200 py-2 px-4 rounded-md border-2 border-neutral-800 dark:border-white"
                >
                  <option value="newest">Newest Posts</option>
                  <option value="oldest">Oldest Posts</option>
                  <option value="highestUpvotes">Most Likes</option>
                  <option value="highestDownvotes">Most Dislikes</option>
                </select>
              </div>
              {isLoggedIn && (user?.role === 'admin' || user?.role === 'uploader') && (
                <div className="flex justify-center items-center mt-4">
                  <button
                    className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white transition duration-200 py-2 px-4 rounded-md border-2 border-neutral-800 dark:border-white"
                    onClick={() => setExpandedPost('new')}
                  >
                    New Post!
                  </button>
                </div>
              )}
            </div>
            <div className="w-full min-w-full my-4 justify-center items-center rounded-2xl animate-fade animate-delay-500">
              <div className="w-full min-w-full justify-center grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentPosts.length > 0 ? (
                  currentPosts.map((post) => (
                    <div
                      key={post._id}
                      className="grid grid-cols-2 max-h-72 h-72 shadow-2xl relative drop-shadow-md overflow-clip bg-white dark:bg-neutral-800 rounded-xl hover:scale-105 transition duration-200"
                    >
                      <div
                        className="rounded-t-xl rounded-tr-3xl"
                        style={{
                          backgroundImage: `url(${post.file})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      ></div>

                      <div className="relative z-10 m-2 flex flex-col transition duration-200">
                        <p className="mb-2 dark:text-neutral-300 text-neutral-700 font-semibold">
                          {post.author}
                        </p>
                        <h2 className="mb-2 dark:text-white text-neutral-950 w-40 text-lg font-bold text-ellipsis h-20 overflow-hidden">
                          {post.title}
                        </h2>
                        <p className="dark:text-white text-neutral-950 w-36 text-sm text-ellipsis overflow-hidden h-24">
                          {post.message}
                        </p>
                        <div className="absolute z-20 bottom-0 bg-gradient-to-b from-transparent to-white dark:to-neutral-800 transition duration-200 w-full h-30 p-8 pt-16">
                          
                        </div>
                      </div>
                      <Link
                        to={`/posts/${post._id}`}
                        onClick={() => setExpandedPost(post._id)}
                        className='bg-neutral-200/50 dark:bg-neutral-900/50 text-neutral-900 dark:text-white transition duration-200 py-2 px-4 rounded-bl-xl hover:bg-neutral-300/50 hover:dark:bg-neutral-950/50'
                      >
                        <h2 className='text-center text-lg font-bold'>Read More!</h2>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="my-2 mx-4 text-center bg-black/30 p-4 rounded-md font-semibold text-xl text-white col-span-full">
                    No posts available.
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="items-center bg-white justify-center rounded-md py-2 px-4">
                <Pagination
                  showFirstButton
                  showLastButton
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, page) => paginate(page)}
                />
              </div>
            </div>
          </>
        );
      }
    };
  };

  return (
    <div className="min-h-screen w-full top-0 text-white absolute bg-neutral-200 dark:bg-neutral-900 transition duration-200">
      <div className="w-full">
        <LoadingBar
          color="#f11946"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
      </div>
      <div
        className="flex w-full h-96 justify-center items-center drop-shadow-xl animate-fade"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex bg-black/20 backdrop-blur-lg justify-center items-center w-full h-full">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-4 text-center">Posts</h1>
            <h1 className="text-3xl mb-4 text-center">
              These are some projects that I have worked on!
            </h1>
          </div>
        </div>
      </div>

      <div className="container justify-self-center text-white p-4 pt-8 bg-neutral-200 dark:bg-neutral-900 transition duration-200 justify-center items-center animate-fade">
        {renderContent()}
      </div>
    </div>
  );
};

export default Posts;
