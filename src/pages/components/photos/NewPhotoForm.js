import React, { useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import axios from 'axios';

const NewPhotoForm = ({ setNewPhotoForm }) => {
  const [photos, setPhotos] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      file,
      title: file.name // Use the original file name as the title
    }));
    setPhotos(newPhotos);
  };

  const handleTitleChange = (index, title) => {
    const newPhotos = [...photos];
    newPhotos[index].title = title;
    setPhotos(newPhotos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      for (const photo of photos) {
        const formData = new FormData();
        formData.append('title', photo.title);
        formData.append('file', photo.file);

        await axios.post('https://api-main.spoekle.com/api/photos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setNewPhotoForm(false);
    } catch (error) {
      console.error('Error uploading photos:', error);
    }
  };

  return (
    <>
      <h2 className='text-3xl text-center mb-4'>New Photo Upload!</h2>
      <button 
        onClick={() => setNewPhotoForm(false)}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
      >
        Go Back!
      </button>

      <form onSubmit={handleSubmit} className="p-4 bg-neutral-800 rounded-xl">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 text-md font-bold mb-2" htmlFor="files">
            Files
          </label>
          <input
            type="file"
            id="files"
            multiple
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {photos.map((photo, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 text-md font-bold mb-2" htmlFor={`title-${index}`}>
              Title for Photo {index + 1}
            </label>
            <input
              type="text"
              id={`title-${index}`}
              value={photo.title}
              onChange={(e) => handleTitleChange(index, e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Upload Photos
          </button>
        </div>
      </form>
    </>
  );
};

export default NewPhotoForm;