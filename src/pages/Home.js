import React, { useEffect, useState } from 'react';
import axios from 'axios';
import background from '../media/background.jpg';
import me from '../media/me.jpg';
import cat from '../media/cat.jpg';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import LoadingBar from 'react-top-loading-bar';
import { Link } from 'react-router-dom';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(1);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      await fetchPosts();
      setProgress(100);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
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

  // Pagination and sorting
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="absolute top-0 min-h-screen bg-neutral-200 dark:bg-neutral-900 text-white">
      <div className='w-full'>
        <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />
      </div>
      <div className="flex min-h-screen justify-center items-center animate-fade" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="relative flex bg-gradient-to-b from-black/20 from-60% dark:to-neutral-900 to-neutral-200 backdrop-blur-lg justify-center items-center w-screen h-screen">
          <div className="container grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col justify-center md:justify-self-start items-center">
              <h1 className="text-4xl md:text-7xl lg:text-9xl font-bold mb-4 text-center animate-fade-right animate-delay-300">Spoekle's Hub</h1>
              <h1 className="text-lg md:text-xl lg:text-2xl mb-4 text-center animate-fade-right animate-delay-[400ms]">Photography, Web Development, Video Editing, Gaming and more...</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex p-4 py-16 bg-neutral-200 dark:bg-neutral-900 transition duration-200 justify-center items-center">
        <div className="container justify-center items-center rounded-xl overflow-hidden shadow-2xl" style={{ backgroundImage: `url(${me})`, backgroundSize: 'cover', backgroundPosition: 'top' }}>
          <div className="grid lg:grid-cols-3 gap-8 p-4 relative justify-center items-center">
            <div className="col-start-1 col-end-1 justify-center items-center p-4 bg-neutral-950/20 backdrop-blur-lg rounded-xl border-r-4 border-red-600 shadow-2xl">
              <p className="text-2xl font-bold m-4 text-center">Who am I?</p>
              <p className="text-lg m-4 text-center">Hey! I'm Thian, a 19 year old student from the Netherlands. I love taking photos outside, coding, playing some games and working with technology.</p>
            </div>
            <div className="col-start-1 col-end-1 justify-center items-center p-4 bg-neutral-950/20 backdrop-blur-lg rounded-xl border-r-4 border-white shadow-2xl">
              <p className="text-2xl font-bold m-4 text-center">Why did I make this site?</p>
              <p className="text-lg m-4 text-center">I created this site to show everything I got to offer, ranging from pictures I took to websites I built.</p>
            </div>
            <div className="col-start-1 col-end-1 justify-center items-center p-4 bg-neutral-950/20 backdrop-blur-lg rounded-xl border-r-4 border-blue-600 shadow-2xl">
              <p className="text-2xl font-bold m-4 text-center">Summary of what I do:</p>
              <p className="text-lg m-4 text-center">I'm currently enrolled at MBO Utrecht, for the study Expert IT System and Devices, where I mostly learn about
                hardware, software, networking and security. <br /> I also have a passion for photography, web development, video editing and gaming.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen justify-center items-center animate-fade" style={{ backgroundImage: `url(${cat})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="relative flex bg-gradient-to-b dark:from-neutral-900 from-neutral-200 to-black/20 to-60% backdrop-blur-lg justify-center items-center w-screen h-screen">
          <div className="container grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="z-30 flex flex-col justify-center md:justify-self-start items-center w-full rounded-xl">
              <div className="w-full min-w-full justify-center">
                {currentPosts.length > 0 ? (
                  currentPosts
                    .map(post => (
                      <div key={post._id} className="grid grid-cols-2 max-h-72 h-72 shadow-2xl relative drop-shadow-md overflow-clip bg-white dark:bg-neutral-800/40 rounded-xl hover:scale-95 transition duration-200"
                      >
                        <div className='rounded-t-xl' style={{ backgroundImage: `url(${post.file})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        </div>

                        <div className="m-1 w-full flex flex-col transition duration-200">
                          <p className='mb-2 text-neutral-800 dark:text-neutral-300 font-semibold'>
                            {post.author}
                          </p>
                          <h2 className='mb-2 text-neutral-900 dark:text-white text-lg font-bold text-ellipsis h-20 overflow-hidden'>
                            {post.title}
                          </h2>
                          <p className="text-neutral-900 dark:text-white text-sm text-ellipsis overflow-hidden h-24">{post.message}</p>
                        </div>
                        <Link to={`/posts/${post._id}`} className='bg-neutral-200/50 dark:bg-neutral-900/50 text-neutral-900 dark:text-white transition duration-200 py-2 px-4 rounded-b-xl hover:bg-neutral-300/50 hover:dark:bg-neutral-950/50'>
                          <h2 className='text-center text-lg font-bold'>Read More!</h2>
                        </Link>
                      </div>
                    ))
                ) : (
                  <div className="my-2 mx-4 text-center bg-black/30 p-4 rounded-md font-semibold text-xl text-white col-span-full">No posts available.</div>
                )
                }
              </div>
            </div>
            <div className="z-20 flex flex-col justify-center md:justify-self-start items-center">
              <h1 className="text-4xl md:text-7xl lg:text-9xl font-bold mb-4 text-left animate-fade-right animate-delay-300">Latest Post</h1>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default HomePage;
