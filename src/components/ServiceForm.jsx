import { useState } from "react";
import axios from "axios";
import { backendBaseUrl, categories } from "../utils/constant";
import ServiceList from "./ServiceList";

const ServiceForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: ""
    });

    const [showMyServices, setShowMyServices] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("Hustleuser"));
            await axios.post(
                `${backendBaseUrl}/api/services`,
                { ...formData, freelancerId: user.freelancerProfile._id },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert("Service added!");
            setShowMyServices(true);

        } catch (error) {
            console.error(error);
            alert("Error adding service");
        }
    };

    if (showMyServices) {
        return <ServiceList />;
    }

    return (
        <section className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-left">
                Add New Service
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        name="title"
                        placeholder="Enter service title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        placeholder="Enter service description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Price
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                            name="price"
                            placeholder="Enter service price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            type="number"
                            className="block w-full rounded-md border border-gray-300 pl-7 pr-4 focus:border-gray-900 focus:ring-blue-500 p-2"
                        />
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Add Service
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ServiceForm;
