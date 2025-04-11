import React from "react";

const LocationInput = ({ onLocationSelect }) => {
    const getLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                onLocationSelect({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (err) => alert("Location access denied")
        );
    };

    return (
        <div>
            <button onClick={getLocation} className="bg-blue-500 text-white px-3 py-2 rounded">
                📍 Use Current Location
            </button>
        </div>
    );
};

export default LocationInput;
