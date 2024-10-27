import React from 'react';
import { Link } from 'react-router-dom';
import { FiMenu } from "react-icons/fi";

function Footer() {
    const toggleFooter = () => {
        const footer = document.getElementById('footer');
        footer.classList.toggle('hidden');
    }
    return (
        <footer className="fixed bottom-2 right-2 p-3 rounded-md bg-white/20 backdrop-blur-xl text-neutral-950 dark:text-white text-center">
            <div className="flex justify-center items-center">
                <button className="hover:scale-110 transition duration-300" onClick={toggleFooter}>
                    <FiMenu size={20}/>
                </button>

                <p id="footer" className="ml-2 text-sm w-full h-full hidden">
                    © {new Date().getFullYear()} Spoekle. All rights reserved.
                    <Link to="/privacystatement" className='ml-2 underline'>
                        Privacy Statement
                    </Link>
                </p>
            </div>
            
        </footer>
    );
}

export default Footer;