import React, { useState } from "react";
import axios from "axios";
import ServiceCard from "./ServiceCard";

const SearchPage = () => {
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState({ lat: "", lng: "" });
    const [services, setServices] = useState([]);

    const handleSearch = async () => {
        if (!category || !location.lat || !location.lng) {
            alert("Please enter location and category");
            return;
        }

        try {
            const res = await axios.get("/api/services", {
                params: {
                    lat: location.lat,
                    lng: location.lng,
                    category,
                },
            });
            setServices(res.data);
        } catch (err) {
            console.error("Search failed:", err);
        }
    };

    const handleCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            (err) => alert("Location access denied")
        );
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Find Local Services</h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Latitude"
                        value={location.lat}
                        onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                        className="border px-2 py-1 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Longitude"
                        value={location.lng}
                        onChange={(e) => setLocation({ ...location, lng: e.target.value })}
                        className="border px-2 py-1 rounded"
                    />
                    <button
                        onClick={handleCurrentLocation}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                        📍 Use My Location
                    </button>
                </div>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border px-2 py-1 rounded"
                >
                    <option value="">Select Category</option>
                    <option value="plumber">Plumber</option>
                    <option value="tutor">Tutor</option>
                    <option value="designer">Designer</option>
                    <option value="electrician">Electrician</option>
                </select>

                <button
                    onClick={handleSearch}
                    className="bg-green-600 text-white px-4 py-1 rounded"
                >
                    🔍 Search
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.length === 0 && <p>No services found</p>}
                {services.map((service) => (
                    <ServiceCard key={service._id} service={service} />
                ))}
            </div>
        </div>
    );
};

export default SearchPage;
