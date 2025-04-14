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
                    <div className="flex justify-center items-center space-x-3 text-blue-900 font-semibold mt-10">
                    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
                    </svg>
                    {/* <span>Loading services near you...</span> */}
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
