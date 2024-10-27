import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import LoadingBar from 'react-top-loading-bar';
import Pagination from '@mui/material/Pagination';

import winterBg from '../media/winter.webp';
import springBg from '../media/spring.jpg';
import summerBg from '../media/summer.jpg';
import fallBg from '../media/fall.jpg';

import PostModal from './components/clipViewer/PostModal';

function Posts() {
  const token = localStorage.getItem('token');
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [seasonInfo, setSeasonInfo] = useState({ season: '' });
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      await fetchUser();
      setProgress(10);
      await checkLoginStatus();
      setProgress(20);
      getSeason();
      setProgress(50);
      await fetchPosts();
      setProgress(100);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const background = seasonInfo.season === 'Winter' ? winterBg : seasonInfo.season === 'Spring' ? springBg : seasonInfo.season === 'Summer' ? summerBg : fallBg;

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

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const postResponse = await axios.get('https://api-main.spoekle.com/api/posts');
      sortPosts(postResponse.data);
    } catch (error) {
      console.error('Error fetching posts and ratings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkLoginStatus = () => {
    setIsLoggedIn(!!token);
  };

  const sortPosts = (postsToSort = posts) => {
    let sortedPosts = [...postsToSort];
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
    setPosts(sortedPosts);
  };

  const handleError = (error, action) => {
    if (error.response) {
      console.error(`Error ${action} post:`, error.response.data);
      alert(`${error.response.data}`);
    } else {
      console.error(`Error ${action} post:`, error.message);
      alert(`${error.message}`);
    }
  };

  const upvotePost = async (id) => {
    try {
      const response = await axios.post(`https://api-main.spoekle.com/api/posts/${id}/upvote`);
      if (response.status === 200) {
        fetchPosts();
      } else {
        console.error('Error upvoting post:', response.data);
        alert(response.data);
      }
    } catch (error) {
      handleError(error, 'upvoting');
    }
  };

  const downvotePost = async (id) => {
    try {
      const response = await axios.post(`https://api-main.spoekle.com/api/posts/${id}/downvote`);
      if (response.status === 200) {
        fetchPosts();
      } else {
        console.error('Error downvoting post:', response.data);
        alert(response.data);
      }
    } catch (error) {
      handleError(error, 'downvoting');
    }
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

    setSeasonInfo(prevSeasonInfo => ({
      ...prevSeasonInfo,
      season
    }));
  };

  // Pagination and sorting
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen w-full absolute top-0 text-white flex flex-col items-center bg-neutral-200 dark:bg-neutral-900 transition duration-200">
      <div className='w-full'>
        <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />
      </div>
      <div className="flex w-full h-96 justify-center items-center drop-shadow-xl animate-fade" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="flex bg-black/20 backdrop-blur-lg justify-center items-center w-full h-full">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-4 text-center">Posts</h1>
            <h1 className="text-3xl mb-4 text-center">These are some projects that I have worked on!</h1>
          </div>
        </div>
      </div>

      <div className="container justify-self-center text-white p-4 pt-8 bg-neutral-200 dark:bg-neutral-900 transition duration-200 justify-center items-center animate-fade">
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
            {currentPosts.length === 0 ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="grid grid-cols-2 shadow-2xl relative drop-shadow-md bg-white dark:bg-neutral-800 rounded-xl overflow-hidden">
                  <div className='rounded-t-lg bg-white dark:bg-neutral-800 transition duration-200'>
                    <img src={winterBg} alt="Logo" className="rounded-lg border-white" />
                  </div>
                  <div className="w-full flex transition duration-200 bg-neutral-700">
                    <h2 className='m-2'>
                      Testing texxt why does this look funky yupiieeee
                    </h2>
                  </div>
                  <div className="col-span-2 w-full flex justify-start px-4 pt-2 pb-4">
                    <button
                      className="text-white flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:text-white hover:bg-green-500 dark:hover:bg-green-800 transition duration-300 py-2 px-6 rounded-l-md"
                    >
                      <FaThumbsUp className="mr-1" /> 420
                    </button>
                    <button
                      className="text-white flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:text-white hover:bg-red-500 dark:hover:bg-red-800 transition duration-300 py-2 px-6 rounded-r-md"
                    >
                      <FaThumbsDown className="mr-1" /> 69
                    </button>
                  </div>
                </div>
              ))
            ) : (
              currentPosts.length > 0 ? (
                currentPosts
                  .map(post => (
                    <div key={post._id} className="grid grid-cols-2 max-h-72 h-72 shadow-2xl relative drop-shadow-md overflow-clip bg-white dark:bg-neutral-800 rounded-xl hover:cursor-pointer hover:scale-105 transition duration-200"
                    >
                      <div className='rounded-t-xl' style={{ backgroundImage: `url(${post.file})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      </div>
                      
                      <div className="m-2 w-full flex flex-col transition duration-200">
                        <p className='mb-2 text-neutral-300 font-semibold'>
                          {post.author}
                        </p>
                        <h2 className='mb-2 text-white w-40 text-lg font-bold text-ellipsis h-20 overflow-hidden'>
                          {post.title}
                        </h2>
                        <p className="text-white w-36 text-sm text-ellipsis overflow-hidden h-24">{post.message}</p>
                      </div>
                      <button className='bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white transition duration-200 py-2 px-4 rounded-b-xl border-2 border-neutral-800 dark:border-white'
                        onClick={() => setExpandedPost(post._id)}
                        >
                        <h2>Read More!</h2>
                      </button>
                    </div>
                  ))
              ) : (
                <div className="my-2 mx-4 text-center bg-black/30 p-4 rounded-md font-semibold text-xl text-white col-span-full">No posts available.</div>
              )
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="items-center bg-white justify-center rounded-md py-2 px-4">
            <Pagination
              showFirstButton showLastButton
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => paginate(page)}
            />
          </div>
        </div>
      </div>
      <PostModal
        expandedPost={expandedPost}
        posts={posts}
        setExpandedPost={setExpandedPost}
        isLoggedIn={isLoggedIn}
        token={token}
        user={user}
        fetchPosts={fetchPosts}
      />
    </div>
  );
}

export default Posts;
