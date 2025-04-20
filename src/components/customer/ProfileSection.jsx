import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { defaultImage, backendBaseUrl } from "../../utils/constant.js";
import { getCurrentLocation } from "../../utils/getLocation"; // utility to fetch current location
import {
    FaCamera,
    FaTimes,
    FaUpload,
    FaSave,
    FaMapMarkerAlt
} from "react-icons/fa";

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

    const [showCamera, setShowCamera] = useState(false);
    const [showImageOptions, setShowImageOptions] = useState(false);
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);

    // initialize from props
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

    const detectAddress = async () => {
        try {
            const loc = await getCurrentLocation();
            if (loc.address) {
                setForm((prev) => ({ ...prev, address: loc.address }));
            }
        } catch (err) {
            console.error("Error detecting location", err);
            alert("Unable to detect location. Please allow location access.");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm((prev) => ({ ...prev, image: file }));
            setShowImageOptions(false);
        }
    };

    const handleRemoveImage = () => {
        setForm((prev) => ({ ...prev, image: null }));
        setShowImageOptions(false);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
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
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const payload = {
                name: form.name,
                phoneNumber: form.phoneNumber,
                gender: form.gender,
                address: form.address,
            };

            // only include image if it's a URL/string
            if (form.image && typeof form.image === "string") {
                payload.image = form.image;
            }

            const res = await axios.post(
                `${backendBaseUrl}/api/customers`,
                payload,
                { headers }
            );

            const saved = res.data;
            setProfile(saved);
            setIsEditing(false);

            // update localStorage
            const stored = JSON.parse(localStorage.getItem("Hustleuser")) || {};
            stored.customerProfile = saved;
            localStorage.setItem("Hustleuser", JSON.stringify(stored));
        } catch (err) {
            console.error(err);
            alert("Failed to save profile.");
        }
    };

    const imagePreview =
        form.image && typeof form.image !== "string"
            ? URL.createObjectURL(form.image)
            : form.image || defaultImage;

    return (
        <section className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-900">
                    {isEditing ? "Edit Profile" : "My Profile"}
                </h2>
                {!isEditing && profile && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-all"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative group">
                            <img
                                src={imagePreview}
                                alt="Profile"
                                className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white ring-2 ring-gray-400 cursor-pointer"
                                onClick={() => setShowImageOptions(true)}
                            />
                            <div
                                className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={() => setShowImageOptions(true)}
                            >
                                <span className="text-white text-sm font-medium">Change</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Address + Detect */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Address
                            </label>
                            <div className="flex items-center gap-2">
                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    rows="2"
                                    placeholder="Enter your address"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                />
                                <button
                                    type="button"
                                    onClick={detectAddress}
                                    className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
                                    title="Detect my location"
                                >
                                    <FaMapMarkerAlt />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit / Cancel */}
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-all"
                        >
                            <FaSave className="inline-block mr-2" />
                            Save Profile
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-600 transition-all"
                        >
                            <FaTimes className="inline-block mr-2" />
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                /* View Mode */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Picture & Basic */}
                    <div className="md:col-span-1 flex flex-col items-center">
                        <img
                            src={profile?.image || defaultImage}
                            alt="Profile"
                            className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-md mb-4"
                        />
                        <h2 className="text-3xl font-semibold text-gray-900 mb-1">
                            {profile?.name || "N/A"}
                        </h2>
                        <p className="text-lg text-gray-500">
                            {profile?.phoneNumber || "N/A"}
                        </p>
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-blue-900 mb-1">Gender</h3>
                            <p className="text-gray-700">
                                {profile?.gender
                                    ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-900 mb-1">Address</h3>
                            <p className="text-gray-700">{profile?.address || "N/A"}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
            />

            {/* Image Options Modal */}
            {showImageOptions && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                    onClick={() => setShowImageOptions(false)}
                >
                    <div
                        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md text-center flex flex-col gap-4 border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold text-gray-900">
                            Change Profile Picture
                        </h3>
                        <button
                            onClick={triggerFileInput}
                            className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all"
                        >
                            <FaUpload className="inline-block mr-2" />
                            Upload from Device
                        </button>
                        <button
                            onClick={() => {
                                setShowCamera(true);
                                setShowImageOptions(false);
                            }}
                            className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all"
                        >
                            <FaCamera className="inline-block mr-2" />
                            Capture via Camera
                        </button>
                        {profile?.image && (
                            <button
                                onClick={handleRemoveImage}
                                className="w-full bg-white text-red-700 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-700 hover:text-white transition-all"
                            >
                                Remove Current Image
                            </button>
                        )}
                        <button
                            onClick={() => setShowImageOptions(false)}
                            className="text-sm text-gray-800 hover:text-gray-700 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Webcam Modal */}
            {showCamera && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                    onClick={() => setShowCamera(false)}
                >
                    <div
                        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md text-center flex flex-col gap-4 border border-gray-200 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowCamera(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-xl font-semibold"
                            aria-label="Close camera"
                        >
                            ×
                        </button>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Capture Photo
                        </h3>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "user" }}
                            className="rounded-lg w-full aspect-video object-cover"
                        />
                        <button
                            onClick={capturePhoto}
                            className="w-full bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition-all"
                        >
                            Capture Photo
                        </button>
                        <button
                            onClick={() => setShowCamera(false)}
                            className="text-sm text-gray-800 hover:text-gray-700 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProfileSection;
