import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryFilter from "../components/CategoryFilter.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import Sidebar from "../components/customer/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import ProfileSection from "../components/customer/ProfileSection.jsx";
import { backendBaseUrl } from "../utils/constant.js";

const CustomerDashboard = () => {
    const [activeTab, setActiveTab] = useState("services");
    const stored = JSON.parse(localStorage.getItem("Hustleuser")) || {};
    const customer = stored.customerProfile || {};

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [location, setLocation] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Get location on load
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            pos => {
                setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            err => {
                console.warn("Location denied, using fallback");
                setLocation({ lat: 28.6139, lng: 77.2090 }); // Delhi fallback
            }
        );
    }, []);

    // Fetch services when location/search/category/page changes
    useEffect(() => {
        if (!location) return;

        const fetchServices = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");

                const params = {
                    lat: location.lat,
                    lng: location.lng,
                    search: searchTerm || undefined,
                    category: categories.length ? categories.join(",") : undefined,
                    page,
                    limit: 6,
                };

                const res = await axios.get(`${backendBaseUrl}/api/services`, {
                    params,
                    headers: { Authorization: `Bearer ${token}` },
                });

                setServices(res.data.services || []);
                setTotalPages(res.data.totalPages || 1);
            } catch (err) {
                console.error("Error fetching services:", err);
                setServices([]);
            }
            setLoading(false);
        };

        fetchServices();
    }, [searchTerm, categories, location, page]);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 flex flex-col">
                <Topbar user={{ name: customer.fullName, image: customer.image }} />
                <main className="p-6 overflow-auto flex-1">
                    {activeTab === "services" && (
                        <>
                            <header className="mb-6 text-center">
                                <h1 className="text-3xl font-extrabold text-gray-800">
                                    Skilled Help, Just a Click Away!
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Showing services based on your location
                                </p>
                            </header>

                            <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    value={searchTerm}
                                    onChange={e => {
                                        setSearchTerm(e.target.value);
                                        setPage(1); // reset to page 1
                                    }}
                                    className="px-4 py-2 border rounded w-full md:w-1/3 focus:ring"
                                />
                                <CategoryFilter
                                    selected={categories}
                                    onChange={(newCategories) => {
                                        setCategories(newCategories);
                                        setPage(1); // reset to page 1
                                    }}
                                />
                            </div>

                            {loading ? (
                                <div className="flex justify-center mt-10">
                                    <span className="text-gray-600">Loading…</span>
                                </div>
                            ) : services.length === 0 ? (
                                <div className="text-center text-gray-500 mt-10">
                                    No services found.
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {services.map(s => (
                                            <ServiceCard key={s._id} service={s} />
                                        ))}
                                    </div>

                                    {/* Pagination Buttons */}
                                    <div className="flex justify-center mt-6 gap-2 flex-wrap">
                                        {/* First Page Button */}
                                        <button
                                            onClick={() => setPage(1)}
                                            disabled={page === 1}
                                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-lg"
                                            title="First Page"
                                        >
                                            «
                                        </button>

                                        {/* Previous Page */}
                                        <button
                                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                            disabled={page === 1}
                                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-lg"
                                            title="Previous Page"
                                        >
                                            ‹
                                        </button>

                                        {/* Page Indicator */}
                                        <span className="px-3 py-1 text-gray-700 font-medium">
                                            Page {page} of {totalPages}
                                        </span>

                                        {/* Next Page */}
                                        <button
                                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={page === totalPages}
                                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-lg"
                                            title="Next Page"
                                        >
                                            ›
                                        </button>

                                        {/* Last Page Button */}
                                        <button
                                            onClick={() => setPage(totalPages)}
                                            disabled={page === totalPages}
                                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-lg"
                                            title="Last Page"
                                        >
                                            »
                                        </button>
                                    </div>



                                </>
                            )}
                        </>
                    )}

                    {activeTab === "bookings" && (
                        <div className="text-center text-gray-500">My Bookings coming soon.</div>
                    )}
                    {activeTab === "reviews" && (
                        <div className="text-center text-gray-500">My Reviews coming soon.</div>
                    )}
                    {activeTab === "profile" && <ProfileSection />}
                </main>
            </div>
        </div>
    );
};

export default CustomerDashboard;
