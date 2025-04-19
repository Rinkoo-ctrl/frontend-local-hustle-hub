import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { backendBaseUrl, defaultImage } from "../../utils/constant.js";
import { FaPlusCircle, FaUserCircle, FaCamera, FaPencilAlt, FaSave, FaTimes, FaUpload, FaTrash } from 'react-icons/fa'; // Using Font Awesome for icons

const ProfileSection = ({ user }) => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name: "",
        phoneNumber: "",
        gender: "",
        address: "",
        image: null,
    });
    const [showImageOptions, setShowImageOptions] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null); // Ref for the file input

    useEffect(() => {
        if (user) {
            const data = user.customerProfile || user;
            setProfile(data);
            setForm({
                name: data.name || "",
                phoneNumber: data.phoneNumber || "",
                gender: data.gender || "",
                address: data.address || "",
                image: data.image || null,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm((prev) => ({ ...prev, image: file }));
            setShowImageOptions(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
        setShowImageOptions(false);
    };

    const capturePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        fetch(imageSrc)
            .then((res) => res.blob())
            .then((blob) => {
                const file = new File([blob], "captured.jpg", { type: "image/jpeg" });
                setForm((prev) => ({ ...prev, image: file }));
                setShowCamera(false);
                setShowImageOptions(false);
            });
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };

            // Prepare the payload for sending in JSON format
            const payload = {
                name: form.name || "",
                phoneNumber: form.phoneNumber || "",
                gender: form.gender || "",
                address: form.address || "",
            };

            // If image is provided as a URL or base64 string, add it to the payload
            if (form.image && typeof form.image === "string") {
                payload.image = form.image;
            }

            // Send the payload in JSON format (no FormData)
            const res = await axios.post(`${backendBaseUrl}/api/customers`, payload, config);

            const savedProfile = res.data;

            // Update state and localStorage
            setProfile(savedProfile);
            setIsEditing(false);

            const storedUser = JSON.parse(localStorage.getItem("Hustleuser")) || {};
            storedUser.customerProfile = savedProfile;
            localStorage.setItem("Hustleuser", JSON.stringify(storedUser));

        } catch (err) {
            console.error("Error saving profile:", err);
            alert("Failed to save profile.");
        }
    };


    const imagePreview =
        form.image && typeof form.image !== "string"
            ? URL.createObjectURL(form.image)
            : form.image || defaultImage;

    return (
        <section className=" py-10">
            <div className="container mx-auto max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {isEditing ? (profile ? "Edit Profile" : "Create Profile") : "My Profile"}
                        </h2>
                        {/* {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md focus:outline-none transition"
                            >
                                <FaPencilAlt className="mr-2" /> {profile ? "Edit" : "Create"}
                            </button>
                        )} */}
                    </div>

                    {!profile && !isEditing && (
                        <div className="text-center py-6">
                            <FaUserCircle className="mx-auto text-gray-400 text-5xl mb-3" />
                            <p className="text-gray-600 mb-2">You haven’t created a profile yet.</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md focus:outline-none transition"
                            >
                                <FaPlusCircle className="mr-2" /> Create Profile
                            </button>
                        </div>
                    )}

                    {isEditing && (
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden mr-6">
                                    <img
                                        src={imagePreview}
                                        alt="profile"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 ease-in-out cursor-pointer" onClick={() => setShowImageOptions(true)}>
                                        <FaCamera className="text-white text-xl" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Your Full Name"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={form.phoneNumber}
                                            onChange={handleChange}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Your Phone Number"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                                        <select
                                            id="gender"
                                            name="gender"
                                            value={form.gender}
                                            onChange={handleChange}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            rows="2"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Your Address"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                >
                                    <FaTimes className="inline-block mr-1" /> Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    <FaSave className="inline-block mr-1" /> Save Profile
                                </button>
                            </div>
                        </div>
                    )}

                    {!isEditing && profile && (
                        <div className="bg-white rounded-lg shadow-xl p-6 transition duration-300 ease-in-out hover:shadow-2xl">
                            <div className="flex items-center space-x-6">
                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                                    <img
                                        src={profile.image || defaultImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                                    <p className="text-gray-600 text-sm">{profile.phoneNumber || 'N/A'}</p>
                                    <div className="text-sm text-gray-700">
                                        <strong className="font-medium mr-1">Gender:</strong> {profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        <strong className="font-medium mr-1">Address:</strong> {profile.address || 'N/A'}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 border-t border-gray-200 pt-4 flex justify-end">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md focus:outline-none transition"
                                >
                                    <FaPencilAlt className="mr-2" /> Edit Profile
                                </button>
                            </div>
                        </div>
                    )}

                    {showImageOptions && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white rounded-md shadow-lg p-6 w-80">
                                <h3 className="text-lg font-semibold mb-3">Change Profile Picture</h3>
                                <button
                                    onClick={triggerFileInput}
                                    className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md mb-2 focus:outline-none"
                                >
                                    <FaUpload className="inline-block mr-2" /> Upload Image
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCamera(true);
                                        setShowImageOptions(false);
                                    }}
                                    className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md mb-2 focus:outline-none"
                                >
                                    <FaCamera className="inline-block mr-2" /> Take Photo
                                </button>
                                {profile?.image && (
                                    <button
                                        onClick={() => setForm((f) => ({ ...f, image: null }))}
                                        className="w-full py-2 bg-red-400 hover:bg-red-500 text-white rounded-md focus:outline-none"
                                    >
                                        <FaTrash className="inline-block mr-2" /> Remove Image
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowImageOptions(false)}
                                    className="w-full py-2 text-gray-600 hover:text-gray-800 focus:outline-none mt-3"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {showCamera && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white rounded-md shadow-lg p-6 w-80 relative">
                                <button
                                    onClick={() => setShowCamera(false)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    <FaTimes />
                                </button>
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ facingMode: "user" }}
                                    className="rounded-md w-full mb-3"
                                />
                                <button
                                    onClick={capturePhoto}
                                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none"
                                >
                                    Capture
                                </button>
                            </div>
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        ref={fileInputRef}
                    />
                </div>
            </div>
        </section>
    );
};

export default ProfileSection;