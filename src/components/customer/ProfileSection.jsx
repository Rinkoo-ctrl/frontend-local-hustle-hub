import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { backendBaseUrl, defaultImage } from '../../utils/constant.js';

const ProfileSection = ({ user }) => {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ fullName: '', phone: '', address: '', image: null });
    const [isEditing, setIsEditing] = useState(false);
    const [showImageOptions, setShowImageOptions] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const webcamRef = useRef(null);

    // Load customer profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${backendBaseUrl}/api/customers/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(res.data);
                setForm({
                    fullName: res.data.fullName,
                    phone: res.data.phone,
                    address: res.data.address || '',
                    image: res.data.image || null
                });
            } catch (err) {
                console.error('Failed to load profile:', err);
            }
        };
        if (user?.id) fetchProfile();
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

    const capturePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        fetch(imageSrc)
            .then((res) => res.blob())
            .then((blob) => {
                const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
                setForm((prev) => ({ ...prev, image: file }));
                setShowCamera(false);
                setShowImageOptions(false);
            });
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            // If image is a File, use multipart/form-data
            if (form.image && typeof form.image !== 'string') {
                const data = new FormData();
                data.append('image', form.image);
                data.append('fullName', form.fullName);
                data.append('phone', form.phone);
                data.append('address', form.address);
                await axios.post(`${backendBaseUrl}/api/customers`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post(
                    `${backendBaseUrl}/api/customers`,
                    {
                        fullName: form.fullName,
                        phone: form.phone,
                        address: form.address
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            setIsEditing(false);
            // Refresh profile
            const res = await axios.get(`${backendBaseUrl}/api/customers/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Something went wrong while saving your profile.');
        }
    };

    const imagePreview = form.image
        ? typeof form.image === 'string'
            ? form.image
            : URL.createObjectURL(form.image)
        : defaultImage;

    return (
        <section className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {isEditing ? 'Edit Profile' : 'My Profile'}
                </h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-5">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                                onClick={() => setShowImageOptions(true)}
                            />
                            <div className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full cursor-pointer" onClick={() => setShowImageOptions(true)}>
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 13V7a1 1 0 011-1h6l3 3v4a1 1 0 01-1 1H5a1 1 0 01-1-1z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1 space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            rows={2}
                            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                        />
                    </div>

                    {/* Image Options Modal */}
                    {showImageOptions && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white p-5 rounded-lg space-y-3 w-80" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => document.getElementById('image-upload').click()}
                                    className="w-full py-2 bg-gray-800 text-white rounded-md"
                                >Upload Image</button>
                                <button
                                    onClick={() => { setShowCamera(true); setShowImageOptions(false); }}
                                    className="w-full py-2 bg-gray-800 text-white rounded-md"
                                >Capture Photo</button>
                                <button
                                    onClick={() => { setForm((f) => ({ ...f, image: null })); setShowImageOptions(false); }}
                                    className="w-full py-2 bg-red-600 text-white rounded-md"
                                >Remove Image</button>
                                <button
                                    onClick={() => setShowImageOptions(false)}
                                    className="w-full py-2 text-gray-700 hover:text-gray-900"
                                >Cancel</button>
                            </div>
                        </div>
                    )}

                    {/* Webcam Modal */}
                    {showCamera && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white p-5 rounded-lg w-80 relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setShowCamera(false)}
                                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                                >&times;</button>
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ facingMode: 'user' }}
                                    className="rounded-lg w-full mb-3"
                                />
                                <button
                                    onClick={capturePhoto}
                                    className="w-full py-2 bg-gray-800 text-white rounded-md mb-2"
                                >Capture</button>
                                <button
                                    onClick={() => setShowCamera(false)}
                                    className="w-full py-2 text-gray-700 rounded-md hover:bg-gray-100"
                                >Cancel</button>
                            </div>
                        </div>
                    )}

                    <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                        >Save</button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-200"
                        >Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-4">
                    <img
                        src={profile?.image || defaultImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                    />
                    <h3 className="text-xl font-semibold text-gray-800">{profile?.fullName}</h3>
                    <p className="text-gray-600">{profile?.phone}</p>
                    {profile?.address && <p className="text-gray-600 text-center">{profile.address}</p>}
                </div>
            )}
        </section>
    );
};

export default ProfileSection;
