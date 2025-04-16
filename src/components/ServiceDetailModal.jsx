// In ServiceDetailModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendBaseUrl, defaultImage } from "../utils/constant.js";
import { motion } from "framer-motion";

const modalVariants = {
  open: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  closed: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const ServiceDetailModal = ({ serviceId, onClose }) => {
  const [serviceDetails, setServiceDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${backendBaseUrl}/api/services/service-by-id/${serviceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServiceDetails(res.data);
      } catch (err) {
        setError("Failed to load service details");
        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${backendBaseUrl}/api/reviews/${serviceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReviews(res.data.reviews);
      } catch (err) {
        toast.error("Failed to load reviews");
      }
    };

    fetchServiceDetails();
    fetchReviews();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 text-center">
          <svg className="animate-spin h-10 w-10 mx-auto text-gray-700" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 5v1m0 10v1m-7-7h1m14 0h1M5 5l1.414 1.414M18.586 18.586L17.172 17.172M6.343 17.657L5 19M19 5l-1.414 1.414M4.414 4.414L6 5m1.586 15.586L5 19m15-15l1.414 1.414M12 2a10 10 0 0 0-7.071 17.071A10 10 0 1 0 19.071 7.071A10 10 0 0 0 12 2zm0 2a8 8 0 0 1 5.657 13.657A8 8 0 1 1 6.343 6.343A8 8 0 0 1 12 4z" />
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-700">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 text-center">
          <svg className="h-10 w-10 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-700">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-lg"
      initial="closed"
      animate="open"
      exit="closed"
      variants={modalVariants}
    >
      <motion.div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-xl max-w-5xl w-full p-10 relative overflow-y-auto max-h-[90vh]" style={{ border: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-4xl font-bold text-gray-700 hover:text-gray-900 focus:outline-none transition-colors duration-200"
        >
          &times;
        </button>
        {serviceDetails && (
          <div className="space-y-8">
            {/* Service Basic Info */}
            <div className="mb-6">
              <h2 className="text-4xl font-extrabold text-indigo-800 mb-3">{serviceDetails.name}</h2>
              <p className="text-lg text-gray-700 mb-2">
                Category: <span className="font-semibold text-blue-900">{serviceDetails.category}</span>
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Price: <span className="font-semibold text-green-900">₹{serviceDetails.price}</span>
              </p>
            </div>

            {/* Freelancer Info Section */}
            {serviceDetails.freelancerId && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-indigo-100 pb-2">Offered by</h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-md border-2 border-white">
                    <img
                      src={serviceDetails.freelancerId.image || defaultImage}
                      alt={serviceDetails.freelancerId.name}
                      className="w-full h-full object-cover"
                    />
                  
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-blue-900">{serviceDetails.freelancerId.name}</p>
                    {serviceDetails.freelancerId.bio && (
                      <p className="text-sm text-gray-600 italic">{`"${serviceDetails.freelancerId.bio.substring(0, 100)}..."`}</p>
                    )}
                    {serviceDetails.freelancerId.skills && serviceDetails.freelancerId.skills.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">Skills:</span>
                        {serviceDetails.freelancerId.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="inline-block bg-blue-100 text-blue-900 text-xs font-semibold rounded-full px-2 py-1">{skill}</span>
                        ))}
                        {serviceDetails.freelancerId.skills.length > 3 && <span className="text-gray-400 text-xs">+ {serviceDetails.freelancerId.skills.length - 3} more</span>}
                      </div>
                    )}
                    {serviceDetails.freelancerId.locations &&
                      serviceDetails.freelancerId.locations.length > 0 && (
                        <p className="text-sm text-gray-600">
                          <svg className="w-4 h-4 inline-block mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.995 1.995 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {serviceDetails.freelancerId.locations[0].address}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Full Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-indigo-100 pb-2">Service Description</h3>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{serviceDetails.description}</p>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-indigo-100 pb-2">Customer Reviews</h3>
              {reviews.length === 0 ? (
                <p className="text-gray-500 italic">No reviews yet for this service.</p>
              ) : (
                <ul className="space-y-4">
                  {reviews.map((review) => (
                    <li key={review._id} className="border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-700">{review.userId.name}</p>
                          <div className="flex items-center">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <span key={i} className="text-yellow-500">⭐</span>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Optional: Add a review submission form here - requires more backend logic */}
            {/* <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-indigo-100 pb-2">Leave a Review</h3>
              <form>
                <div className="mb-4">
                  <label htmlFor="rating" className="block text-gray-700 text-sm font-bold mb-2">Rating:</label>
                  <select id="rating" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option>5 Stars</option>
                    <option>4 Stars</option>
                    <option>3 Stars</option>
                    <option>2 Stars</option>
                    <option>1 Star</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">Comment:</label>
                  <textarea id="comment" rows="4" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                </div>
                <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                  Submit Review
                </button>
              </form>
            </div> */}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ServiceDetailModal;