// src/pages/CustomerDashboard.jsx
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
    const [bookings, setBookings] = useState([]);
    const stored = JSON.parse(localStorage.getItem("Hustleuser")) || {};
    const customer = stored.customerProfile || {};

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [location, setLocation] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 1. Get geolocation or fallback
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => setLocation({ lat: 28.6139, lng: 77.2090 }) // Delhi fallback
        );
    }, []);

    // 2. Fetch services on filters/search/page/location
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
                const { data } = await axios.get(`${backendBaseUrl}/api/services`, {
                    params,
                    headers: { Authorization: `Bearer ${token}` },
                });
                setServices(data.services || []);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error("Error fetching services:", err);
                setServices([]);
            }
            setLoading(false);
        };

        fetchServices();
    }, [searchTerm, categories, location, page]);

    useEffect(() => {
        const fetchBookings = async () => {
            if (activeTab !== "bookings") return;
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get(`${backendBaseUrl}/api/bookings/my-bookings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookings(data.bookings || []);
            } catch (err) {
                console.error("Error fetching bookings:", err);
                setBookings([]);
            }
            setLoading(false);
        };

        fetchBookings();
    }, [activeTab]);

    // helper to reset to first page when filters/search change
    const resetAndSetPage = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 flex flex-col">
                <Topbar user={{ name: customer.fullName, image: customer.image }} />

                <main className="p-6 overflow-auto flex-1">
                    {activeTab === "services" && (
                        <>
                            {/* ————— Header ————— */}
                            <header className="mb-6 text-center">
                                <h1 className="text-3xl font-extrabold text-gray-800">
                                    Skilled Help, Just a Click Away!
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Showing services based on your location
                                </p>
                            </header>

                            {/* ————— Filters & Search ————— */}
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    value={searchTerm}
                                    onChange={e => resetAndSetPage(setSearchTerm)(e.target.value)}
                                    className="px-4 py-2 border rounded w-full md:w-1/3 focus:ring"
                                />
                                <CategoryFilter
                                    selected={categories}
                                    onChange={resetAndSetPage(setCategories)}
                                />
                            </div>

                            {/* ————— Service Grid or Loading/Empty ————— */}
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

                                    {/* ————— Pagination Controls ————— */}
                                    <div className="flex justify-center mt-6 gap-2 flex-wrap">
                                        {/* « First */}
                                        <button
                                            onClick={() => setPage(1)}
                                            disabled={page === 1}
                                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-lg"
                                            title="First Page"
                                        >
                                            «
                                        </button>
                                        {/* ‹ Prev */}
                                        <button
                                            onClick={() => setPage(p => Math.max(p - 1, 1))}
                                            disabled={page === 1}
                                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-lg"
                                            title="Previous Page"
                                        >
                                            ‹
                                        </button>
                                        {/* Page X of Y */}
                                        <span className="px-3 py-1 text-gray-700 font-medium">
                                            Page {page} of {totalPages}
                                        </span>
                                        {/* Next › */}
                                        <button
                                            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                            disabled={page === totalPages}
                                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-lg"
                                            title="Next Page"
                                        >
                                            ›
                                        </button>
                                        {/* Last » */}
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
                        <div>
                            <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
                            {loading ? (
                                <div className="text-gray-500">Loading bookings…</div>
                            ) : bookings.length === 0 ? (
                                <div className="text-gray-500">No bookings found.</div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {bookings.map((b) => (
                                        <div
                                            key={b._id}
                                            className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-lg transition"
                                        >
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                {b.serviceId?.title || "Unknown Service"}
                                            </h3>
                                            <p className="text-sm  text-red-500 mb-2">
                                                {(b.paymentId || "------------------").toUpperCase()}
                                            </p>

                                            <p className="text-gray-600 mb-1">
                                                <span className="font-medium">Category:</span> {b.serviceId?.category || "N/A"}
                                            </p>
                                            <p className="text-gray-600 mb-1">
                                                <span className="font-medium">Price:</span> ₹{b.amount}
                                            </p>
                                            <p className="text-gray-600 mb-1">
                                                <span className="font-medium">Date:</span> {new Date(b.date).toLocaleDateString()}
                                            </p>

                                            <div className="flex items-center justify-between mt-4">
                                                <span
                                                    className={`text-sm font-semibold px-3 py-1 rounded-full ${b.status === "confirmed"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {b.status}
                                                </span>
                                                <span
                                                    className={`text-sm font-semibold px-3 py-1 rounded-full ${b.paymentStatus === "paid"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {b.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div className="text-center text-gray-500">My Reviews coming soon.</div>
                    )}

                    {activeTab === "profile" && (
                        // **Pass customer profile into the ProfileSection** so it can load or show the form
                        <ProfileSection user={{ ...customer, id: stored.id }} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default CustomerDashboard;
