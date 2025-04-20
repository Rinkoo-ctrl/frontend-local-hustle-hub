import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendBaseUrl, defaultImage } from "../utils/constant.js";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faTag,
    faMapMarkerAlt,
    faStar,
} from "@fortawesome/free-solid-svg-icons";

const modalVariants = {
    open: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    closed: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const ServiceDetailModal = ({ serviceId, onClose }) => {
    const [serviceDetails, setServiceDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `${backendBaseUrl}/api/services/service-by-id/${serviceId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setServiceDetails(res.data);
            } catch (err) {
                setError("Failed to load service details");
                toast.error("Failed to load service details");
            } finally {
                setLoading(false);
            }
        };


        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `${backendBaseUrl}/api/reviews/${serviceId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setReviews(res.data.reviews);
            } catch (err) {
                toast.error("Failed to load reviews");
            }
        };

        fetchServiceDetails();
        fetchReviews();
    }, [serviceId]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid mx-auto" />
                    <p className="mt-4 text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 text-center">
                    <p className="text-red-500 font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    if (!serviceDetails || !serviceDetails.freelancerId) return null;
    console.log(serviceDetails, "$$$$$$$$$$$$");
    const {
        title,
        description,
        price,
        category,
        freelancerId: { name, bio, skills, locations, image } = {},
    } = serviceDetails;



    const freelancerImage = image ? `${backendBaseUrl}/${image}` : defaultImage;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
            variants={modalVariants}
            initial="closed"
            animate="open"
            exit="closed"
        >
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 flex flex-col space-y-6 overflow-y-auto max-h-[90vh]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-black shadow-md transition duration-200"
                    aria-label="Close"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Title & Description */}
                <div className="text-left">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
                    <p className="text-gray-700 leading-relaxed">{description}</p>
                </div>

                {/* Freelancer Info with Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="flex gap-4 items-center">
                        <img
                            src={freelancerImage}
                            alt="Freelancer"
                            className="w-24 h-24 rounded-full border object-cover shadow"
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
                                {name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-1">
                                <strong>Bio:</strong> {bio}
                            </p>
                            {skills?.length > 0 && (
                                <p className="text-gray-600 text-sm">
                                    <strong>Skills:</strong> {skills.join(", ")}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Service Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            <FontAwesomeIcon icon={faTag} className="mr-2 text-green-500" />
                            Service Details
                        </h3>
                        <p className="text-gray-600 mb-1">
                            <strong>Category:</strong> {category}
                        </p>
                        <p className="text-lg text-blue-700 font-semibold">
                            Price: ₹{price}
                        </p>
                    </div>

                    {locations?.map((loc, i) => (
                        <div key={i} className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                <FontAwesomeIcon
                                    icon={faMapMarkerAlt}
                                    className="mr-2 text-red-500"
                                />
                                Location
                            </h3>
                            <p className="text-gray-600 mb-1">{loc.address}</p>
                        </div>
                    ))}
                </div>

                {/* Reviews */}
                <div className="mt-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        <FontAwesomeIcon icon={faStar} className="mr-2 text-yellow-500" />
                        Customer Reviews
                    </h3>
                    {reviews.length > 0 ? (
                        <ul className="mt-2 space-y-3">
                            {reviews.map((review, idx) => (
                                <li
                                    key={idx}
                                    className="bg-gray-100 p-4 rounded-md border border-gray-200"
                                >
                                    <p className="text-sm text-gray-800">
                                        <strong>{review.userName}:</strong> {review.comment}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Rating: {review.rating}/5
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mt-2">No reviews yet for this service.</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ServiceDetailModal;
