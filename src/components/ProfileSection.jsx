import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { defaultImage, backendBaseUrl } from "../utils/constant.js";
import { getCurrentLocation, getCoordinatesFromAddress } from "../utils/getLocation";

const EditableProfileSection = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        name: "",
        bio: "",
        skillInput: "",
        skills: [],
        locations: [], // now an array to hold multiple locations
        image: null,
    });

    // Temp state for manual location input
    const [tempLocation, setTempLocation] = useState("");

    const [showCamera, setShowCamera] = useState(false);
    const [showImageOptions, setShowImageOptions] = useState(false);
    const webcamRef = useRef(null);

    // Load user data from localStorage and initialize form
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("Hustleuser"));
        const freelancerProfile = user?.freelancerProfile || {};
        setProfile(freelancerProfile);
        setForm({
            name: freelancerProfile.name || "",
            bio: freelancerProfile.bio || "",
            skills: freelancerProfile.skills || [],
            skillInput: "",
            locations: freelancerProfile.locations || [], // use array for multiple locations
            image: freelancerProfile.image || null,
        });
    }, []);

    // Handlers for form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
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

    const handleRemoveImage = () => {
        setForm((prev) => ({ ...prev, image: null }));
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

    const handleDetectLocation = async () => {
        try {
            const location = await getCurrentLocation();
            // Expected to return an object: { address, coordinates }
            setForm((prev) => ({
                ...prev,
                locations: [...prev.locations, location],
            }));
        } catch (error) {
            alert(error);
        }
    };

    const handleAddManualLocation = async () => {
        if (!tempLocation.trim()) return;

        try {
            const newLocation = await getCoordinatesFromAddress(tempLocation.trim());
            console.log(newLocation, "<-------");
            const alreadyExists = form.locations.some(
                (loc) => loc.address.toLowerCase() === newLocation.address.toLowerCase()
            );

            if (!alreadyExists) {
                setForm((prev) => ({
                    ...prev,
                    locations: [...prev.locations, newLocation],
                }));
            }

            setTempLocation("");
        } catch (error) {
            console.error("Failed to add manual location", error);
        }
    };


    // Save profile changes
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            const payload = {
                name: form.name,
                bio: form.bio,
                locations: form.locations, // sending as array
                skills: form.skills,
            };

            if (form.image && form.image.length > 0) {
                payload.image = form.image;
            }

            console.log("Sending Payload:", payload);
            await axios.post(`${backendBaseUrl}/api/freelancers`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setIsEditing(false);
            setProfile({
                ...form,
                skills: form.skills,
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Something went wrong while updating the profile.");
        }
    };

    const imagePreview = form.image
        ? typeof form.image === "string"
            ? form.image
            : URL.createObjectURL(form.image)
        : defaultImage;

    return (
        <section className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            {/* Header with Edit button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-900">
                    {isEditing ? "Edit Profile" : "Freelancer Profile"}
                </h2>
                {!isEditing && (
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
                    <div className="flex flex-col items-center gap-3 mb-6">
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
                                <span className="text-white text-sm font-medium">
                                    Change
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Full Name
                        </label>
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Bio
                        </label>
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Skills
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                name="skillInput"
                                value={form.skillInput}
                                onChange={handleChange}
                                placeholder="Enter a skill"
                                onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    (e.preventDefault(), handleSkillAdd())
                                }
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

                    {/* Location Section */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Locations
                        </label>
                        {/* Manual Location Input */}
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={tempLocation}
                                onChange={(e) => setTempLocation(e.target.value)}
                                placeholder="Enter your location"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button
                                onClick={handleAddManualLocation}
                                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all"
                            >
                                Add
                            </button>
                        </div>
                        {/* Detect My Location Button */}
                        <button
                            onClick={handleDetectLocation}
                            className="mt-2 text-sm text-blue-600 hover:underline"
                        >
                            Detect My Location
                        </button>
                        {/* List of Added Locations */}
                        <div className="mt-3 space-y-2">
                            {form.locations && form.locations.length > 0 && form.locations.map((loc, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center border px-4 py-2 rounded shadow-sm"
                                >
                                    <span className="text-sm">{loc.address}</span>
                                    <button
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                locations: prev.locations.filter((_, i) => i !== index),
                                            }))
                                        }
                                        className="text-red-600 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
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
                            onClick={() => setShowImageOptions(false)}
                        >
                            <div
                                className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md text-center flex flex-col gap-4 border border-gray-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Select Image Option
                                </h3>
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

                    {/* Submit and Cancel Buttons */}
                    <div className="flex gap-4 justify-end">
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-all"
                        >
                            Save Profile
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-600 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                // View Mode Display
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Picture and Basic Info */}
                    <div className="md:col-span-1 flex flex-col items-center justify-start">
                        <img
                            src={profile?.image || defaultImage}
                            alt="Profile"
                            className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-md mb-4"
                        />
                        <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                            {profile?.name || "Profile"}
                        </h2>
                        <p className="text-lg text-gray-500">{profile?.title || ""}</p>
                    </div>
                    {/* Detailed Profile Information */}
                    <div className="md:col-span-2 space-y-6">
                        {profile?.bio && (
                            <div>
                                <h3 className="text-lg font-bold text-blue-900 mb-2">
                                    About Me
                                </h3>
                                <p className="text-gray-700 leading-relaxed text-justify">
                                    {profile.bio}
                                </p>
                            </div>
                        )}
                        {profile?.locations && profile.locations.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-blue-900 mb-2">
                                    Location
                                </h3>
                                <p className="text-gray-700">
                                    {profile.locations.map((loc) => loc.address).join(", ")}
                                </p>
                            </div>
                        )}
                        {profile?.skills && profile.skills.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-blue-900 mb-2">
                                    Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-100 text-gray-900 text-sm font-medium px-3 py-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {profile?.website && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Website
                                </h3>
                                <a
                                    href={profile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {profile.website}
                                </a>
                            </div>
                        )}
                        {profile?.email && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Email
                                </h3>
                                <p className="text-gray-700">{profile.email}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default EditableProfileSection;
