import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendBaseUrl } from "../utils/constant.js";
import LoadingIndicator from "./LoadingIndicator";

const getStatusBadgeClass = (status) => {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-800";
        case "active":
            return "bg-indigo-100 text-indigo-800";
        case "accepted":
            return "bg-blue-100 text-blue-800";
        case "rejected":
            return "bg-red-100 text-red-800";
        case "completed":
            return "bg-green-100 text-green-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const OrdersComponent = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(
                `${backendBaseUrl}/api/bookings/freelancer-active`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(data.bookings || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to load bookings.");
        } finally {
            setLoading(false);
        }
    };

    const markAsCompleted = async (bookingId) => {
        try {
            const token = localStorage.getItem("token");
            // Call the correct API endpoint
            await axios.patch(
                `${backendBaseUrl}/api/bookings/mark-complete/${bookingId}`,  // Correct endpoint here
                {},  // Empty body, as it's just marking it completed
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh the list of orders
            fetchOrders();
        } catch (err) {
            console.error("Error marking complete:", err);
            alert("Could not mark as completed.");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <section className="p-8 max-w-4xl mx-auto">
                <h2 className="text-3xl font-semibold mb-4">Active Bookings</h2>
                <LoadingIndicator />
            </section>
        );
    }

    if (error) {
        return (
            <section className="p-8 max-w-4xl mx-auto">
                <h2 className="text-3xl font-semibold mb-4">Active Bookings</h2>
                <p className="text-red-600">{error}</p>
            </section>
        );
    }

    return (
        <section className="p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold">Active Bookings</h2>
                {orders.length > 0 && (
                    <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {orders.length} Open
                    </span>
                )}
            </div>

            {orders.length === 0 ? (
                <p className="text-gray-600 text-center">No active bookings found.</p>
            ) : (
                <ul className="space-y-4">
                    {orders.map((order) => (
                        <li
                            key={order._id}
                            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {order.serviceId?.title || "Untitled Service"}
                                </h3>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                                        order.status
                                    )}`}
                                >
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-4">
                                <div>
                                    <p>
                                        <strong>Customer:</strong>{" "}
                                        <span className="text-indigo-600">
                                            {order.customer?.name || "Unknown"}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Phone:</strong>{" "}
                                        <span>{order.customer?.phoneNumber || "N/A"}</span>
                                    </p>
                                    <p>
                                        <strong>Address:</strong>{" "}
                                        <span>{order.customer?.address || "N/A"}</span>
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        <span>
                                            {new Date(order.date).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Amount:</strong>{" "}
                                        <span className="text-green-600 font-semibold">
                                            ₹{order.amount}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Payment:</strong>{" "}
                                        <span
                                            className={`px-2 py-0.5 rounded text-sm ${order.paymentStatus === "paid"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {order.paymentStatus.toUpperCase()}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {order.status === "active" && (
                                <button
                                    onClick={() => markAsCompleted(order._id)}
                                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                >
                                    Mark as Completed
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default OrdersComponent;
