import { useEffect, useState } from "react";
import { defaultImage } from "../utils/constant.js";

const ProfileSection = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("Hustleuser"));
        setProfile(user?.freelancerProfile || {});
    }, []);

    return (
        <section className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
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
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">About Me</h3>
                            <p className="text-gray-700 leading-relaxed text-justify">{profile.bio}</p>
                        </div>
                    )}

                    {profile?.location && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
                            <p className="text-gray-700">{profile.location}</p>
                        </div>
                    )}

                    {profile?.skills && profile.skills.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {profile?.website && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Website</h3>
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
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
                            <p className="text-gray-700">{profile.email}</p>
                        </div>
                    )}

                    {/* Add more fields as needed, e.g., experience, education, etc. */}
                </div>
            </div>
        </section>
    );
};

export default ProfileSection;