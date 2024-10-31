import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import axios from 'axios';
import logo from '../../media/spoekle_nobg.webp';
import LoginModal from '../components/LoginModal';
import { IoMenuSharp } from "react-icons/io5";

function Navbar({ setUser, user }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleLoginModal = () => {
        setIsLoginModalOpen(!isLoginModalOpen);
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
                localStorage.removeItem('token');
                console.error('Error fetching user:', error);
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/';
    };

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', closeDropdown);
        return () => {
            document.removeEventListener('mousedown', closeDropdown);
        };
    }, []);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark' ? true : false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <nav className="m-6 z-50 sticky  text-white">
            <div className="container mx-auto p-3 flex items-center justify-between flex-wrap bg-white/10 backdrop-blur-lg rounded-xl border border-white transition duration-200">
                <div className="items-center text-white ml-6 mr-6 inline hover:scale-110 transition duration-200">
                    <NavLink to="/" className={"flex items-center"}>
                        <img src={logo} alt="Logo" className="h-10 mr-2 block rounded-full border-2 border-white" />
                        <h1 className="text-2xl font-bold">Spoekle</h1>
                    </NavLink>
                </div>
                <div className="block lg:hidden">
                    <button
                        onClick={toggleNavbar}
                        className="flex items-center px-3 py-2 hover:border rounded border-white hover: hover:border-white"
                    >
                        <IoMenuSharp height={40} width={40} />
                    </button>
                </div>
                <div
                    className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${isOpen ? 'block' : 'hidden'
                        }`}
                >
                    <div className="text-md items-center lg:flex-grow lg:flex lg:justify-end">
                        <NavLink
                            to="/posts"
                            className={({ isActive }) =>
                                `block mt-4 lg:inline-block lg:mt-0 ${isActive ? 'underline bg-black/20 scale-105 lg:scale-110' : 'bg-transparent hover:bg-black/20 hover:scale-105 lg:hover:scale-110'} rounded-md py-2 px-3 mx-3 transition duration-200`
                            }
                            onClick={toggleNavbar}
                        >
                            Posts
                        </NavLink>
                        <NavLink
                            to="/photography"
                            className={({ isActive }) =>
                                `block mt-4 lg:inline-block lg:mt-0 ${isActive ? 'underline bg-black/20 scale-105 lg:scale-110' : 'bg-transparent hover:bg-black/20 hover:scale-105 lg:hover:scale-110'} rounded-md py-2 px-3 mx-3 transition duration-200`
                            }
                            onClick={toggleNavbar}
                        >
                            Photography
                        </NavLink>
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <>
                                        <NavLink
                                            to="/admin"
                                            className={({ isActive }) =>
                                                `block mt-4 lg:inline-block font-semibold lg:mt-0 ${isActive ? 'underline bg-black/20 scale-105 lg:scale-110' : 'bg-transparent hover:bg-black/20 hover:scale-105 lg:hover:scale-110'} rounded-md py-2 px-3 mx-3 transition duration-200`
                                            }
                                            onClick={toggleNavbar}
                                        >
                                            Admin
                                        </NavLink>
                                    </>
                                )}
                                <div className="relative" ref={dropdownRef}>
                                    <button onClick={toggleDropdown} className="flex items-center mt-4 lg:mt-0 py-2 px-3 mx-3 bg-transparent hover:bg-black/20 hover:scale-105 lg:hover:scale-110 rounded-md transition duration-200">
                                        <img src={user.profilePicture} alt={user.username} className="h-10 w-10 rounded-full mr-2" />
                                        {user.username}
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute lg:right-0 mt-2 w-full bg-white/30 dark:bg-neutral-900/30 rounded-md shadow-lg py-2">
                                            <NavLink
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-neutral-900 dark:text-white hover:bg-black/20 transition duration-200"
                                                onClick={() => {
                                                    toggleDropdown();
                                                    toggleNavbar();
                                                }}
                                            >
                                                Profile
                                            </NavLink>
                                            <NavLink
                                                to="/stats"
                                                className="relative block px-4 py-2 text-sm text-neutral-900 dark:text-white hover:bg-black/20 transition duration-200"
                                                onClick={() => {
                                                    toggleDropdown();
                                                    toggleNavbar();
                                                }}
                                            >
                                                Stats
                                                <span className="absolute top-1 right-0 p-1 mr-2 bg-blue-500 text-white rounded-md">New!</span>
                                            </NavLink>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-neutral-900 dark:text-white hover:bg-black/20 transition duration-200"
                                            >
                                                Logout
                                            </button>
                                        </div>

                                    )}

                                </div>
                            </>
                        ) : (
                            <NavLink
                                onClick={toggleLoginModal}
                                className={
                                    `block mt-4 lg:inline-block font-semibold lg:mt-0 rounded-md py-2 px-3 mx-3 transition duration-200 hover:bg-black/20 hover:scale-105 lg:hover:scale-110`
                                }
                            >
                                Login!
                            </NavLink>
                        )}
                        <NavLink
                            onClick={toggleDarkMode} className="block mt-4 lg:inline-block lg:mt-0 hover:bg-black/20 hover:scale-105 lg:hover:scale-110 rounded-md py-2 px-3 mx-3 transition duration-200"
                        >
                            {isDarkMode ? <FaSun className="transition duration-200" /> : <FaMoon className="transition duration-200" />}
                        </NavLink>
                    </div>
                </div>
            </div>
            {isLoginModalOpen && <LoginModal isLoginModalOpen={isLoginModalOpen} setIsLoginModalOpen={setIsLoginModalOpen} fetchUser={fetchUser} />}
        </nav>
    );
}

export default Navbar;