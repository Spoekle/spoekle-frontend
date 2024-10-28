import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import Posts from './pages/Posts';
import Home from './pages/Home';
import AdminDash from './pages/AdminDash';
import PrivacyStatement from './pages/PrivacyStatement';
import ProfilePage from './pages/ProfilePage';
import Stats from './pages/Stats';
import background from './media/background.jpg';
import Photography from './pages/Photography';

function Main() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const extractTokenFromURL = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (token) {
        localStorage.setItem('token', token);
        window.history.replaceState({}, document.title, window.location.pathname);
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

    extractTokenFromURL();
    fetchUser();
  }, []);

  const RequireAuth = ({ children, isAdminRequired = false }) => {
    const [loading, setLoading] = useState(true);
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowLoadingScreen(false); // Hide loading screen after 1 second
      }, 500);
  
      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }, []);
  
    useEffect(() => {
      if (!loading) {
        setLoading(false); // Set loading to false after checking authentication
      }
    }, [loading]);

    if (showLoadingScreen) {
      return (
        <div className="absolute top-0 z-70 w-full h-full bg-neutral-200 dark:bg-neutral-900 ">
          <div className="flex h-96 justify-center items-center" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover',backgroundPosition: 'center' }}>
            <div className="flex bg-black/20 backdrop-blur-lg justify-center items-center w-full h-full">
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold mb-4 text-white text-center animate-pulse animate-duration-[800ms]">Checking Authentication...</h1>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/posts" replace state={{ alert: "You must be logged in to view this page." }} />;
    }

    if (isAdminRequired && user.role !== 'admin') {
      return <Navigate to="/posts" replace state={{ alert: "You must have admin rights to do this!" }} />;
    }

    return children;
  };

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:postId" element={<Posts />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/privacystatement" element={<PrivacyStatement />} />
        <Route path="/admin" element={<RequireAuth isAdminRequired={true}><AdminDash /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage user={user} setUser={setUser} /></RequireAuth>} />
        <Route path="/stats" element={<RequireAuth><Stats user={user} setUser={setUser} /></RequireAuth>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default Main;
