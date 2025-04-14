// src/pages/BookService.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendBaseUrl } from "../utils/constant.js";

const BookService = () => {
    const { serviceId } = useParams();
    const [date, setDate] = useState("");
    const [service, setService] = useState(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${backendBaseUrl}/api/services/service-by-id/${serviceId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setService(res.data);
            } catch (err) {
                toast.error("Service load failed");
            }
        };
        fetchService();
    }, [serviceId]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleBooking = async () => {
        if (!service || !date) {
            toast.error("Service or date missing");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            // 1. Create booking
            const bookingRes = await axios.post(`${backendBaseUrl}/api/bookings`, {
                serviceId,
                freelancerId: service.freelancerId,
                amount: service.price,
                date,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const bookingId = bookingRes.data._id;
            console.log("Booking ID:", bookingId);

            // 2. Create Razorpay order from backend
            const orderRes = await axios.post(`${backendBaseUrl}/api/bookings/create-razorpay-order`, {
                amount: service.price, // in paise
                currency: "INR",
                bookingId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const order = orderRes.data;

            console.log(orderRes.data, "----->>>>>>>>>", order, "<<<<<<<<<<<<----------")
            // 3. Load Razorpay and open payment window
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                toast.error("Razorpay SDK failed to load");
                return;
            }

            const options = {
                key: "rzp_test_bGDg3JyDHzBvsQ", // Replace with your Razorpay Key ID
                amount: order.amount,
                currency: order.currency,
                name: "Local Hustle Hub",
                description: `Booking for ${service.name}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(`${backendBaseUrl}/api/bookings/verify-payment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingId
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });

                        if (verifyRes.data.success) {
                            toast.success("Payment successful & Booking confirmed!");
                        } else {
                            toast.error("Payment verification failed!");
                        }
                    } catch (error) {
                        toast.error("Verification error!");
                    }
                },
                prefill: {
                    name: "Your Name", // Optional: dynamic from user
                    email: "email@example.com", // Optional: dynamic
                    contact: "9821764926" // Optional: dynamic
                },
                theme: {
                    color: "#38a169"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error(err);
            toast.error("Booking or payment failed");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">Book Service</h2>
            {service && (
                <>
                    <p className="text-lg font-medium">{service.name}</p>
                    <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                </>
            )}

            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <button
                onClick={handleBooking}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
            >
                Pay & Book Now
            </button>
        </div>
    );
};

export default BookService;
