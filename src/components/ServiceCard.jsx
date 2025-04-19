import React, { useState } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ServiceDetailModal from "./ServiceDetailModal.jsx";

const ServiceCard = ({ service, reviewsData }) => {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);

    const distanceText =
        service.distance !== undefined
            ? `${Number(service.distance).toFixed(2)} km away`
            : "Distance not available";

    const averageRating = reviewsData?.averageRating;
    const totalReviews = reviewsData?.totalReviews;
    
    const ratingDisplay = averageRating ? (
        <div className="flex items-center space-x-1 text-sm text-gray-700">
            <FaStar className="text-yellow-500" />
            <span>{averageRating.toFixed(1)} ({totalReviews} reviews)</span>
        </div>
    ) : (
        <span className="text-xs text-gray-400 italic">Be the first to review!</span>
    )

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-100">


            {/* Content Section */}
            <div className="p-5">
                {/* Category Badge */}
                <div className="mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full truncate max-w-[140px]">
                        {service.category}
                    </span>

                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.name}</h3>

                {service.description && (
                    <p className="text-gray-600 text-sm leading-snug line-clamp-3 mb-4 min-h-[60px]">
                        {service.description}
                    </p>
                )}

                <div className="flex items-center text-gray-500 text-sm mb-3">
                    <FaMapMarkerAlt className="mr-2 text-red-800" />
                    <span>{distanceText}</span>
                </div>

                <div className="mb-4">
                    {ratingDisplay}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex-1 bg-blue-800 text-white py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-semibold"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => navigate(`/book/${service._id}`)}
                        className="flex-1 bg-green-700 text-white py-2.5 rounded-lg hover:bg-green-600 transition duration-200 text-sm font-semibold"
                    >
                        Book Now
                    </button>
                </div>
            </div>

            {openModal && (
                <ServiceDetailModal
                    serviceId={service._id}
                    onClose={() => setOpenModal(false)}
                />
            )}
        </div>
    );
};

export default ServiceCard;
