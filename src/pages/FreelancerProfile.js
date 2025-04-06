import React, { useState, useRef } from "react";
import axios from "axios";
import { defaultImage } from "../utils/constant.js";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import getCurrentLocation from "../utils/getLocation"; // adjust path if needed


const FreelancerProfile = ({ userId }) => {
    const [form, setForm] = useState({
        name: "",
        bio: "",
        skillInput: "",
        skills: [],
        location: "",
        image: null,
    });
    const navigate = useNavigate();
    const [showCamera, setShowCamera] = useState(false);
    const webcamRef = useRef(null);
    const [showImageOptions, setShowImageOptions] = useState(false);

    const imagePreview = form.image
        ? typeof form.image === "string"
            ? form.image
            : URL.createObjectURL(form.image)
        : defaultImage;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRemoveImage = () => {
        setForm((prev) => ({ ...prev, image: null }));
    };

    const handleSkillAdd = () => {
        let skill = form.skillInput.trim();
        if (skill) {
            skill = skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
        }

        if (skill && !form.skills.includes(skill)) {
            setForm((prev) => ({
                ...prev,
                skills: [...prev.skills, skill],
                skillInput: "",
            }));
        }
    };

    const handleSkillRemove = (skillToRemove) => {
        setForm((prev) => ({
            ...prev,
            skills: prev.skills.filter((skill) => skill !== skillToRemove),
        }));
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
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "captured.jpg", { type: "image/jpeg" });
                setForm((prev) => ({ ...prev, image: file }));
                setShowCamera(false);
                setShowImageOptions(false);
            });
    };

    const handleDetectLocation = async () => {
        try {
            const location = await getCurrentLocation();
            setForm((prev) => ({ ...prev, location }));
        } catch (error) {
            alert(error);
        }
    };


    const handleSubmit = async () => {
        try {
            const data = new FormData();
            data.append("name", form.name);
            data.append("bio", form.bio);
            data.append("location", form.location);
            data.append("userId", userId);

            form.skills.forEach((skill, index) => {
                data.append(`skills[${index}]`, skill);
            });

            if (form.image) {
                data.append("image", form.image);
            }

            await axios.post("/api/freelancers", data);
            alert("Profile updated!");
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="py-12 flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-3xl border border-gray-200 relative">
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full text-gray-600 hover:text-red-600 flex items-center justify-center text-xl"
                    aria-label="Close"
                >
                    &times;
                </button>

                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 tracking-tight">
                    Freelancer Profile
                </h2>

                {/* Image Preview */}
                <div className="flex flex-col items-center gap-3 mb-6">
                    <div className="relative group">
                        <img
                            src={imagePreview}
                            alt="Profile"
                            className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white ring-2 ring-gray-400 cursor-pointer"
                            onClick={() => setShowImageOptions(true)}
                        />
                        {/* Camera icon on hover */}
                        <div
                            className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => setShowImageOptions(true)}
                        >
                            <span className="text-white text-sm font-medium">Change</span>
                        </div>
                    </div>
                </div>


                {/* Name */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Bio */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                    <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Skills */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Skills</label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            name="skillInput"
                            value={form.skillInput}
                            onChange={handleChange}
                            placeholder="Enter a skill"
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSkillAdd())}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleSkillAdd}
                            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {form.skills.map((skill, i) => (
                            <span
                                key={i}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-sm"
                            >
                                {skill}
                                <button
                                    className="ml-2 text-blue-600 hover:text-red-600 font-bold"
                                    onClick={() => handleSkillRemove(skill)}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Enter your location"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                    onClick={handleDetectLocation}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                >
                    Detect My Location
                </button>
                </div>
                

                {/* Hidden File Input */}
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />

                {/* Image Options Modal */}
                {showImageOptions && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                        onClick={() => setShowImageOptions(false)} // Close on backdrop click
                    >
                        <div
                            className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md text-center flex flex-col gap-4 border border-gray-200"
                            onClick={(e) => e.stopPropagation()} // Prevent closing on modal content click
                        >
                            <h3 className="text-xl font-semibold text-gray-900">Select Image Option</h3>

                            <button
                                onClick={() => document.getElementById("image-upload").click()}
                                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all"
                            >
                                Upload from Device
                            </button>

                            <button
                                onClick={() => {
                                    setShowCamera(true);
                                    setShowImageOptions(false);
                                }}
                                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all"
                            >
                                Capture via Camera
                            </button>

                            <button
                                onClick={() => {
                                    handleRemoveImage();
                                    setShowImageOptions(false);
                                }}
                                className="w-full bg-white text-red-700 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-700 hover:text-white transition-all"
                            >
                                Remove Current Image
                            </button>

                            <button
                                onClick={() => setShowImageOptions(false)}
                                className="text-sm text-gray-800 hover:text-gray-700 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}


                {/* Webcam Camera Modal */}
                {showCamera && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                        onClick={() => setShowCamera(false)} // Close on backdrop click
                    >
                        <div
                            className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md text-center flex flex-col gap-4 border border-gray-200 relative"
                            onClick={(e) => e.stopPropagation()} // Prevent closing on modal content click
                        >
                            <button
                                onClick={() => setShowCamera(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-xl font-semibold"
                                aria-label="Close camera"
                            >
                                ×
                            </button>

                            <h3 className="text-xl font-semibold text-gray-900">Capture Photo</h3>

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


                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-all font-semibold text-lg"
                >
                    Save Profile
                </button>
            </div>
        </div>
    );
};

export default FreelancerProfile;
