import React from 'react';
import background from '../media/background.jpg';

function PrivacyStatement() {

    return (
        <div className="absolute top-0 min-h-screen w-full bg-neutral-200 dark:bg-neutral-900 text-neutral-900 dark:text-white">
            <div className="flex h-96 justify-center items-center text-white" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="flex bg-black/20 backdrop-blur-lg justify-center items-center w-full h-full">
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="text-4xl font-bold mb-4 text-center">Privacy</h1>
                        <h1 className="text-2xl mb-4 text-center">Your privacy matters to me (sorta)</h1>
                    </div>
                </div>
            </div>
            <div className="text-neutral-900 dark:text-white p-4 pt-8 bg-neutral-200 dark:bg-neutral-900 transition duration-200 justify-center items-center text-center">
                <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
                <p className="mb-4">Effective Date: 30 October, 2024</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
                <p className="mb-4">
                    Welcome to Spoekle.com Your privacy is important to me. This Privacy Policy explains how I collect, use, and protect your personal information when you use my website.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. Information I Collect</h2>
                <p className="mb-4">
                    I collect the following types of information:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>IP Address: I collect your IP address to ensure the integrity of the voting system and prevent multiple votes from the same user.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">3. How I Use Your Information</h2>
                <p className="mb-4">
                    I use the information that is being collected in the following ways:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Voting Integrity: To prevent multiple votes from the same IP address and ensure fair voting.</li>
                    <li>Service Improvement: To understand how this service is used and to improve its functionality and performance.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">4. How We Protect Your Information</h2>
                <p className="mb-4">
                    I implemented a variety of security measures to maintain the safety of your personal information when you use this site. This includes:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Secure servers and databases.</li>
                    <li>Encryption of local data so even authorized personnel can't read your data.</li>
                    <li>Access controls to limit access to your information to authorized personnel only.</li>
                </ul>
                <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Retention</h2>
                <p className="mb-4">
                    I will retain your IP address for as long as it is necessary to ensure voting integrity and comply with our legal obligations.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">6. Third-Party Disclosure</h2>
                <p className="mb-4">
                    I do not sell, trade, or otherwise transfer your IP address to outside parties in any way. All data is and will only be used and stored on the Spoekle.com servers.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">7. Your Rights</h2>
                <p className="mb-4">
                    Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Access: The right to access the personal information we hold about you.</li>
                    <li>Correction: The right to correct any inaccurate personal information we have about you.</li>
                    <li>Deletion: The right to request the deletion of your personal information.</li>
                </ul>
                <p className="mb-4">
                    To exercise these rights, please contact me via <a href='https://discord.com/channels/@me/435825557087977492/' className='underline text-blue-500' target='_blank'>Discord</a>.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
                <p className="mb-4">
                    I may update this Privacy Policy from time to time. The site will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date at the top.
                </p>
            </div>
        </div>

    );
}

export default PrivacyStatement;