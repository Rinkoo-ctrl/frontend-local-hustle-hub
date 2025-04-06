import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", formData);
            localStorage.setItem("token", res.data.token);
            alert("Registered Successfully");
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md relative"> {/* Added relative positioning */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full text-gray-600 hover:text-red-600 flex items-center justify-center text-xl"
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Create an Account</h2>
                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-500">
                    Already have an account? <a href="/login" className="text-blue-700 hover:underline">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default Register;