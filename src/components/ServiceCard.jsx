import React from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

const ServiceCard = ({ service }) => {
    const distanceText =
        service.distance !== undefined
            ? `${Number(service.distance).toFixed(2)} km away`
            : "Distance not available";
    const rating = service.rating;

    const ratingDisplay = rating
        ? Array.from({ length: rating }).map((_, i) => (
            <FaStar key={i} className="text-yellow-500 inline-block" />
        ))
        : <span className="text-sm text-gray-500">No Rating Yet</span>;

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-102 hover:shadow-lg">
            {/* Placeholder for Image (Solid Color Block) */}
            <div className="bg-gray-100 h-32 flex items-center justify-center rounded-t-2xl">
                {service.status && (
                    <div className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full bg-opacity-90 
            transition-colors duration-200
            {service.status === 'online' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}">
                        {service.status.toUpperCase()}
                    </div>
                )}
                <span className="text-gray-400 text-lg font-medium">Service</span>
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Title and category */}
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-600 capitalize mb-3">{service.category}</p>

                {/* Description */}
                {service.description && (
                    // <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-4">{service.description}</p>
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-4 min-h-[60px]">{service.description}</p>

                )}

                {/* Distance Info */}
                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <FaMapMarkerAlt className="mr-2 text-red-800" />
                    <span>{distanceText}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                    {ratingDisplay}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                        View Profile
                    </button>
                    <button className="flex-1 bg-green-900 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;