import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingBar from 'react-top-loading-bar';
import PhotoModal from './components/photos/PhotoModal';
import NewPhotoForm from './components/photos/NewPhotoForm';

function Photography() {
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [newPhotoForm, setNewPhotoForm] = useState(false);
  const [expandedPhoto, setExpandedPhoto] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [randomPhoto, setRandomPhoto] = useState(null);

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
      setProgress(100);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
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

  const fetchPhotos = async () => {
    try {
      const response = await axios.get('https://api-main.spoekle.com/api/photos');
      setPhotos(response.data);

      if (response.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * response.data.length);
        setRandomPhoto(response.data[randomIndex]);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      fetchUser();
    }
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
          <div className="columns-2 md:columns-4 lg:columns-5 gap-4">
            {photos.length > 0 ? (
              photos.map((photo) => (
                <div key={photo.id} className="mb-4">
                  <img
                    src={photo.thumbnailFile}
                    alt={photo.title}
                    className="rounded-lg w-full h-auto hover:scale-95 transition duration-300"
                    onClick={() => setExpandedPhoto(photo._id)}
                  />
                </div>
              ))
            ) : (
              <h1 className="text-3xl text-center">No photos to display</h1>
            )}
          </div>
          <PhotoModal
            expandedPhoto={expandedPhoto}
            setExpandedPhoto={setExpandedPhoto}
            photos={photos}
          />
        </>
      );
    }
  };

  return (
    <div className="min-h-screen w-full top-0 text-white absolute bg-neutral-200 dark:bg-neutral-900">
      <div className='w-full'>
        <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />
      </div>
      <div className="flex w-full h-96 justify-center items-center drop-shadow-xl animate-fade" style={{ backgroundImage: randomPhoto ? `url(${randomPhoto.file})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="flex backdrop-blur-lg justify-center items-center w-full h-full">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-4 text-center">Photos</h1>
            <h1 className="text-3xl mb-4 text-center">Here you can find some pictures I took</h1>
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
