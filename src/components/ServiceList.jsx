import { useEffect, useState } from "react";
import axios from "axios";
import { backendBaseUrl } from "../utils/constant";
import LoadingIndicator from "./LoadingIndicator.jsx"


const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${backendBaseUrl}/api/services`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setServices(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false); // Loading complete
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <section className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-semibold text-gray-900">Your Services</h2>
            </div>

            {loading ? (
                <LoadingIndicator />
            ) : services.length === 0 ? (
                <p className="text-gray-600 text-center">No services found</p>
            ) : (
                <ul className="space-y-6">
                    {services.map((service) => (
                        <li
                            key={service._id}
                            className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="flex justify-between items-center mb-3 border-b pb-2">
                                <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                                <p className="text-xl font-semibold text-gray-800">${service.price}</p>
                            </div>
                            <p className="text-gray-700 mb-4">{service.description}</p>
                            {service.category && (
                                <p className="text-sm text-gray-500">
                                    Category:{" "}
                                    <span className="font-medium text-gray-800">
                                        {service.category}
                                    </span>
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default ServiceList;
