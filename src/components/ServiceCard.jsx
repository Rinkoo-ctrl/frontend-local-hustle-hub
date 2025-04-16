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
        <div className="flex items-center space-x-1 cursor-pointer" onClick={() => setOpenModal(true)}>
            {Array.from({ length: Math.floor(averageRating) }).map((_, i) => (
                <FaStar key={i} className="text-yellow-500 inline-block" />
            ))}
            <span className="text-sm text-gray-700">({totalReviews})</span>
        </div>
    ) : (
        <span className="text-sm text-gray-500">No Rating Yet</span>
    );

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-102 hover:shadow-lg">
            {/* Image / Category Placeholder */}
            <div className="relative bg-gray-100 h-32 flex items-center justify-center rounded-t-2xl">
                {service.status && (
                    <div className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full bg-opacity-90 transition-colors duration-200
                        {service.status === 'online' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}">
                        {service.status.toUpperCase()}
                    </div>
                )}
                <span className="text-gray-400 text-lg font-medium">{service.category}</span>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{service.name}</h3>
                {service.description && (
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-4 min-h-[60px]">
                        {service.description}
                    </p>
                )}

                {/* Distance Info */}
                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <FaMapMarkerAlt className="mr-2 text-red-800" />
                    <span>{distanceText}</span>
                </div>

                {/* Rating (clickable to open modal) */}
                <div className="flex items-center mb-4">
                    {ratingDisplay}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex-1 bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => navigate(`/book/${service._id}`)}
                        className="flex-1 bg-green-900 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                    >
                        Book Now
                    </button>
                </div>
            </div>

            {/* Modal for service details and reviews */}
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
