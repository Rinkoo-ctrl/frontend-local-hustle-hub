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
            (err) => alert("Location access denied"),
            { enableHighAccuracy: true }
        );
    };

    return (
        <div>
            <button onClick={getLocation} className="bg-blue-700 text-white hover:bg-blue-900 px-3 py-2 rounded">
                Use Current Location
            </button>
        </div>
    );
};

export default LocationInput;
