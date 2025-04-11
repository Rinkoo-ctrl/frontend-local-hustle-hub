import React from "react";

const ServiceCard = ({ service }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition duration-300">
            <img
                src={service.image || "/default-avatar.png"}
                alt={service.name}
                className="h-40 w-full object-cover rounded-xl mb-4"
            />
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <span className={`text-sm px-2 py-1 rounded-full ${service.status === "online" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {service.status}
                </span>
            </div>
            <p className="text-gray-500 text-sm capitalize mt-1">{service.category}</p>
            <p className="text-sm mt-1">📍 {typeof service.distance === 'number'
                ? `${service.distance.toFixed(2)} km away`
                : 'Distance not available'} km away</p>
            <div className="flex items-center gap-2 mt-3 text-yellow-500">
                {"⭐".repeat(service.rating || 4)}
            </div>
            <div className="flex gap-2 mt-4">
                <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                    View Profile
                </button>
                <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
