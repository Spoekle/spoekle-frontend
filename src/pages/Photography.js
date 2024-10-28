import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingBar from 'react-top-loading-bar';
import ImageGallery from "react-image-gallery";
import NewPhotoForm from './components/photos/NewPhotoForm';

import winterBg from '../media/winter.webp';
import springBg from '../media/spring.jpg';
import summerBg from '../media/summer.jpg';
import fallBg from '../media/fall.jpg';

function Photography() {
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [newPhotoForm, setNewPhotoForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [seasonInfo, setSeasonInfo] = useState({ season: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      await fetchUser();
      setProgress(50);
      checkLoginStatus();
      setProgress(75);
      await fetchPhotos();
      getSeason();
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

  const fetchPhotos = async () => {
    try {
      const response = await axios.get('https://api-main.spoekle.com/api/photos');
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const photoGallery = photos.map(photo => ({
    original: photo.file,
    thumbnail: photo.thumbnailFile,
    description: photo.title,
  }));

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      fetchUser();
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

  const renderContent = () => {
    if (newPhotoForm) {
      return <NewPhotoForm setNewPhotoForm={setNewPhotoForm} />;
    } else {
      return (
        <>
          <div className="text-center py-4 justify-center items-center z-30">
            {isLoggedIn && (user?.role === 'admin' || user?.role === 'uploader') && (
              <div className="flex justify-center items-center mt-4">
                <button
                  className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white transition duration-200 py-2 px-4 rounded-md border-2 border-neutral-800 dark:border-white"
                  onClick={() => setNewPhotoForm(true)}
                >
                  New Post!
                </button>
              </div>
            )}
          </div>
          <div className="container">
            <ImageGallery 
              items={photoGallery}
            />
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen w-full top-0 text-white absolute bg-neutral-200 dark:bg-neutral-900">
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

        {renderContent()}
      </div>
    </div>
  );
}

export default Photography;
