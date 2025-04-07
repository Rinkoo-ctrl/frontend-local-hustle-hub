import { useEffect, useState } from "react";
import axios from "axios";
import { backendBaseUrl } from "../utils/constant";

const ServiceList = () => {
    const [services, setServices] = useState([]);

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${backendBaseUrl}/api/services`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <div className="p-4 border rounded-lg shadow bg-white">
            <h2 className="text-xl font-semibold mb-2">Your Services</h2>
            {services.length === 0 ? (
                <p>No services found</p>
            ) : (
                <ul className="space-y-2">
                    {services.map(service => (
                        <li key={service._id} className="p-3 border rounded">
                            <h3 className="font-bold">{service.title}</h3>
                            <p>{service.description}</p>
                            <p className="text-sm text-gray-500">₹{service.price}</p>
                            {/* TODO: Add Edit/Delete buttons */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ServiceList;
