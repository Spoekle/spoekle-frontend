import React, { useState } from 'react';
import axios from 'axios';
import { FaDiscord } from "react-icons/fa";

const LoginModal = ({ setIsLoginModalOpen, isLoginModalOpen, fetchUser }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isRegister, setIsRegister] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginClickOutside = (event) => {
    if (event.target.className.includes('login-modal-overlay')) {
      const modalContent = document.querySelector('.modal-content');
      const modalOverlay = document.querySelector('.login-modal-overlay');
      modalContent.style.transition = 'transform 600ms';
      modalContent.style.transform = 'scale(0)';
      modalOverlay.style.transition = 'opacity 200ms';
      modalOverlay.style.opacity = '0';

      setTimeout(() => {
        setIsLoginModalOpen(false);
      }, 200);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister ? 'https://api-main.spoekle.com/api/users/register' : 'https://api-main.spoekle.com/api/users/login';
    try {
      const response = await axios.post(url, formData);
      if (isRegister) {
        alert('Registration successful! Please login.');
        setIsRegister(false);
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        setIsLoginModalOpen(false);
        fetchUser();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error during submission:', error);
      if (error.response) {
        if (error.response.status === 403) {
          alert('Account awaiting admin approval.');
        } else if (error.response.status === 400) {
          alert('Invalid username or password.');
        } else {
          alert('Submission failed. Please try again.');
        }
      } else {
        alert('Submission failed. Please try again.');
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleFormToggle = () => {
    setIsRegister(!isRegister);
  };

  const handleDiscordLogin = () => {
    window.location.href = `https://api-main.spoekle.com/api/auth/discord`;
  };

  return (
    <>
      {isLoginModalOpen && (
        <div
          className="login-modal-overlay fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={handleLoginClickOutside}
        >
          <div className="modal-content rounded-lg relative flex">
            <div className="text-white flex items-center justify-center">
              <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl border border-white text-white p-8 shadow-md animate-jump-in duration-150">
                <h2 className="text-3xl font-bold mb-4">{isRegister ? 'Register' : 'Login'}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-200">Username:</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onKeyDown={handleKeyDown}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-neutral-200/30 text-white rounded-md focus:outline-none focus:bg-neutral-300/50 transition duration-300"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-200">Password:</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onKeyDown={handleKeyDown}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-neutral-200/30 text-white rounded-md focus:outline-none focus:bg-neutral-300/50 transition duration-300"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500/50 hover:bg-blue-600/50 text-white py-2 rounded-md focus:outline-none focus:bg-blue-600/50 transition duration-300"
                  >
                    {isRegister ? 'Register' : 'Login'}
                  </button>
                </form>
                {!isRegister && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={handleDiscordLogin}
                      className="flex items-center justify-center w-full bg-blurple/50 hover:bg-blurple-dark/50 text-white py-2 rounded-md focus:outline-none focus:bg-blurple-dark/50 transition duration-300"
                    >
                      <FaDiscord className="mr-1" /> Login with Discord
                    </button>
                  </div>
                )}
                <div className="mt-4 text-center">
                  <button
                    onClick={handleFormToggle}
                    className="text-blue-500 hover:underline"
                  >
                    {isRegister ? 'Already have an account? Login' : 'Don’t have an account? Register'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
