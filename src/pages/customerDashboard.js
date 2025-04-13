import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryFilter from "../components/CategoryFilter.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import LocationInput from "../components/LocationInput.jsx";
import { backendBaseUrl } from "../utils/constant.js";

const CustomerDashboard = () => {
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            if (!location.lat || !location.lng) return;
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${backendBaseUrl}/api/services/by-location`, {
                    params: {
                        lat: location.lat,
                        lng: location.lng,
                        category,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(res.data, "+++++++++++++++=>")
                setServices(res.data);
            } catch (err) {
                console.error("Error fetching services:", err);
            }
            setLoading(false);
        };
        fetchServices();
    }, [location, category]);


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                        Discover Skilled Hustlers Near You
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Book verified local freelancers for any task – quick, easy & nearby.
                    </p>
                </header>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
                    <LocationInput onLocationSelect={setLocation} />
                    <CategoryFilter selected={category} onChange={setCategory} />
                </div>

                {loading ? (
                    <div className="text-center text-blue-600 font-semibold mt-10">
                        Loading services near you...
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        No services found for this category/location.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
