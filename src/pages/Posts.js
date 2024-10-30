import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostContent from './components/posts/PostContent';
import NewPostForm from './components/posts/NewPostForm';
import LoadingBar from 'react-top-loading-bar';
import Pagination from '@mui/material/Pagination';

import winterBg from '../media/winter.webp';
import springBg from '../media/spring.jpg';
import summerBg from '../media/summer.jpg';
import fallBg from '../media/fall.jpg';

const Posts = () => {
  const { postId } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentPosts, setCurrentPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(postId || null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [progress, setProgress] = useState(0);
  const [seasonInfo, setSeasonInfo] = useState({ season: '' });

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
      getSeason();
      setProgress(50);
      await fetchPosts();
      setProgress(100);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const background =
    seasonInfo.season === 'Winter'
      ? winterBg
      : seasonInfo.season === 'Spring'
      ? springBg
      : seasonInfo.season === 'Summer'
      ? summerBg
      : fallBg;

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://api-main.spoekle.com/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

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

  const getSeason = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    let season = '';

    if (currentMonth >= 0 && currentMonth <= 2) {
      season = 'Winter';
    } else if (currentMonth >= 3 && currentMonth <= 5) {
      season = 'Spring';
    } else if (currentMonth >= 6 && currentMonth <= 8) {
      season = 'Summer';
    } else {
      season = 'Fall';
    }

    setSeasonInfo((prevSeasonInfo) => ({
      ...prevSeasonInfo,
      season,
    }));
  };

  const renderContent = () => {
    if (expandedPost === 'new') {
      return <NewPostForm setExpandedPost={setExpandedPost} />;
    } else if (expandedPost) {
      const post = posts.find((p) => p._id === expandedPost);
      return (
        <PostContent
          post={post}
          setExpandedPost={setExpandedPost}
          user={user}
          isLoggedIn={isLoggedIn}
        />
      );
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
                      className="rounded-t-xl"
                      style={{
                        backgroundImage: `url(${post.file})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    ></div>

                    <div className="m-2 w-full flex flex-col transition duration-200">
                      <p className="mb-2 dark:text-neutral-300 text-neutral-700 font-semibold">
                        {post.author}
                      </p>
                      <h2 className="mb-2 dark:text-white text-neutral-950 w-40 text-lg font-bold text-ellipsis h-20 overflow-hidden">
                        {post.title}
                      </h2>
                      <p className="dark:text-white text-neutral-950 w-36 text-sm text-ellipsis overflow-hidden h-24">
                        {post.message}
                      </p>
                    </div>
                    <Link
                      onClick={() => setExpandedPost(post._id)}
                      className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white transition duration-200 py-2 px-4 rounded-b-xl border-2 border-neutral-800 dark:border-white"
                    >
                      <h2 className="text-center">Read More!</h2>
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

  return (
    <div className="min-h-screen w-full top-0 text-white absolute bg-neutral-200 dark:bg-neutral-900">
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
