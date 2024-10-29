import React from 'react';
import ReactDOM from 'react-dom';

const PhotoModal = ({ expandedPhoto, photos, setExpandedPhoto }) => {
  if (expandedPhoto === null) return null;
  const photo = photos.find((photo) => photo._id === expandedPhoto);

  const handleClickOutside = (event) => {
    if (event.target.className.includes('modal-overlay')) {
      const modalContent = document.querySelector('.modal-content');
      const modalOverlay = document.querySelector('.modal-overlay');
      modalContent.style.transition = 'transform 600ms';
      modalContent.style.transform = 'scale(0)';
      modalOverlay.style.transition = 'opacity 200ms';
      modalOverlay.style.opacity = '0';

      setTimeout(() => {
        setExpandedPhoto(null);
      }, 200);
    }
  };

  const handleCloseButton = () => {
    const modalContent = document.querySelector('.modal-content');
    const modalOverlay = document.querySelector('.modal-overlay');
    modalContent.style.transition = 'transform 600ms';
    modalContent.style.transform = 'scale(0)';
    modalOverlay.style.transition = 'opacity 200ms';
    modalOverlay.style.opacity = '0';
    setTimeout(() => {
      setExpandedPhoto(null);
    }, 200);
  };

  return ReactDOM.createPortal(
    <div
      className="modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 duration-300"
      onClick={handleClickOutside}
    >
      <div className="modal-content bg-neutral-800 p-6 relative rounded-lg animate-fade">
        <button
          className="text-white bg-red-500 hover:bg-red-600 rounded-md transition duration-300 p-2 absolute top-6 right-6"
          onClick={handleCloseButton}
        >
          Close
        </button>
        <img
          src={photo.file}
          alt={photo.title}
          className="w-full h-auto mb-4 rounded-lg"
          style={{ maxHeight: '80vh', objectFit: 'contain' }}
        />
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">{photo.title}</h2>
          <p className="mb-2">{photo.description}</p>
          <p className="text-sm">
            Posted on{' '}
            {new Date(photo.createdAt).toLocaleString(undefined, { dateStyle: 'long' })}{' '}
            at{' '}
            {new Date(photo.createdAt).toLocaleString(undefined, { timeStyle: 'short' })}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PhotoModal;