import { useState, useRef, useEffect } from "react";
import { defaultImage } from "../utils/constant.js";

const Topbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const menuRef = useRef();

    const user = JSON.parse(localStorage.getItem("Hustleuser"));
    const freelancer = user?.freelancerProfile;
    const imageUrl = freelancer?.image ? freelancer.image : defaultImage;

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="bg-gradient-to-r from-blue-900 to-gray-900 text-white flex justify-end items-center px-6 py-3 shadow-md relative z-20">
            <div className="relative" ref={menuRef}>
                <button
                    className="flex items-center space-x-3 focus:outline-none transition-all duration-300 hover:scale-105"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <img
                        src={imageUrl}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-400 shadow-md transition-all duration-300 hover:border-purple-600"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${dropdownOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-lg shadow-xl z-10 border border-gray-200 overflow-hidden">
                        <div className="py-2">
                            <div className="px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 transition-colors duration-200 cursor-pointer flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="font-medium">View Profile</span>
                            </div>
                            <div className="px-4 py-3 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200 cursor-pointer flex items-center" onClick={handleLogout}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v-7a3 3 0 00-3-3H6a3 3 0 00-3 3v7a3 3 0 003 3h4a3 3 0 003-3z" />
                                </svg>
                                <span className="font-medium">Sign Out</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Topbar;