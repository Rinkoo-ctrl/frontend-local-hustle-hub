import { useState } from "react";
import axios from "axios";
import { backendBaseUrl } from "../utils/constant";

const ServiceForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${backendBaseUrl}/api/services`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Service added!");
        } catch (error) {
            console.error(error);
            alert("Error adding service");
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow bg-white">
            <h2 className="text-xl font-semibold mb-2">Add New Service</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="w-full border p-2 rounded" />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full border p-2 rounded" />
                <input name="price" placeholder="Price" value={formData.price} onChange={handleChange} required className="w-full border p-2 rounded" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Service</button>
            </form>
        </div>
    );
};

export default ServiceForm;
