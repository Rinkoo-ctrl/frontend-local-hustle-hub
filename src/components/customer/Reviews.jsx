import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendBaseUrl } from "../../utils/constant.js";
import { FaStar } from "react-icons/fa";

const Reviews = ({ user }) => {
    const [completedOrders, setCompletedOrders] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            try {
                // 1. completed orders
                const ordersRes = await axios.get(
                    `${backendBaseUrl}/api/bookings/my-completed`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setCompletedOrders(ordersRes.data.bookings || []);

                // 2. my reviews
                const reviewsRes = await axios.get(`${backendBaseUrl}/api/reviews/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMyReviews(reviewsRes.data.reviews || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [user?.id, token]);

    const handleAddReview = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const submitReview = async () => {
        if (!rating || !comment || !selectedOrder) return;
        try {
            await axios.post(
                `${backendBaseUrl}/api/reviews`,
                {
                    serviceId: selectedOrder.serviceId._id,
                    freelancerId: selectedOrder.freelancerId._id,
                    rating,
                    comment,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Review submitted!");
            // reset & re-fetch
            setShowModal(false);
            setRating(0);
            setHoverRating(0);
            setComment("");
            setSelectedOrder(null);

            // refetch updated lists
            const [ordersRes, reviewsRes] = await Promise.all([
                axios.get(`${backendBaseUrl}/api/bookings/my-completed`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${backendBaseUrl}/api/reviews/`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);
            setCompletedOrders(ordersRes.data.bookings || []);
            setMyReviews(reviewsRes.data.reviews || []);
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <div>
            {/* Completed Services */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Completed Services
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {completedOrders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-lg transition"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {order.serviceId.title}
                        </h3>
                        <p className="text-gray-600 mb-1">
                            <span className="font-medium">Provider:</span>{" "}
                            {order.freelancerId.name}
                        </p>
                        <p className="text-gray-600 mb-1">
                            <span className="font-medium">Completed:</span>{" "}
                            {new Date(order.updatedAt).toLocaleDateString()}
                        </p>
                        {order.hasReview ? (
                            <div className="mt-3 text-green-600 italic">
                                "{order.review.comment}"
                            </div>
                        ) : (
                            <button
                                className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={() => handleAddReview(order)}
                            >
                                Add Review
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Your Reviews */}
            <h2 className="text-2xl font-bold my-6 text-gray-800">Your Reviews</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myReviews.length === 0 && (
                    <p className="text-gray-500 col-span-full">
                        You haven't given any reviews yet.
                    </p>
                )}
                {myReviews.map((r) => (
                    <div
                        key={r._id}
                        className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-lg transition"
                    >
                        {/* Service Title */}
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {r.serviceId?.title || "—"}
                        </h3>

                        {/* Freelancer Info */}
                        {r.freelancerId ? (
                            <div className="mb-3">
                                <p className="text-gray-600 mb-1">
                                    <span className="font-medium">Freelancer:</span>{" "}
                                    {r.freelancerId.name}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-medium">Email:</span>{" "}
                                    {r.freelancerId.userId.email}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-medium">Skills:</span>{" "}
                                    {r.freelancerId.skills.join(", ")}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500 mb-3">No freelancer assigned</p>
                        )}

                        {/* Rating */}
                        <p className="text-yellow-500 mb-1">
                            {Array.from({ length: 5 }, (_v, i) => (
                                <FaStar
                                    key={i}
                                    className={i < r.rating ? "inline" : "inline opacity-30"}
                                />
                            ))}{" "}
                            ({r.rating}/5)
                        </p>

                        {/* Comment */}
                        <p className="text-gray-600 italic">"{r.comment.trim()}"</p>

                        {/* Date */}
                        <p className="mt-2 text-gray-400 text-sm">
                            Reviewed on {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg animate-fade-in">
                        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                            Leave a Review
                        </h2>
                        <div className="flex justify-center mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    size={30}
                                    className={`cursor-pointer transition-all ${(hoverRating || rating) >= star
                                            ? "text-yellow-400 scale-110"
                                            : "text-gray-300"
                                        }`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                        <textarea
                            placeholder="Write your comment..."
                            className="w-full mb-4 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="flex justify-end space-x-3 mt-2">
                            <button
                                className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
                                onClick={() => {
                                    setShowModal(false);
                                    setRating(0);
                                    setHoverRating(0);
                                    setComment("");
                                    setSelectedOrder(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                onClick={submitReview}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviews;
