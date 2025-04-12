import { useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendBaseUrl } from "../utils/constant.js";
import { FaUser, FaBriefcase } from "react-icons/fa"; // Icons for visual appeal

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "customer"  // default role
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Custom handler for role selection using card click
  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if passwords match
    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${backendBaseUrl}/api/auth/register`, formData);
      alert("Registered Successfully");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl relative">
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
        <form onSubmit={handleSubmit} className="space-y-6">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password*</label>
            <input
              type="password"
              name="passwordConfirm"  // Updated name attribute here
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="Confirm your password*"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Enhanced Role Selection */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-3">I am a:</p>
            <div className="flex space-x-4">
              <div
                onClick={() => handleRoleSelect("customer")}
                className={`cursor-pointer flex flex-col items-center justify-center border rounded-lg p-4 w-1/2 transition-all 
                  ${formData.role === "customer" ? "bg-gray-900 border-blue-600 text-white" : "bg-white border-gray-300 text-gray-700"} 
                  hover:shadow-lg`}
              >
                <FaUser size={15} />
                <span className="mt-2 font-semibold">Customer</span>
              </div>
              <div
                onClick={() => handleRoleSelect("freelancer")}
                className={`cursor-pointer flex flex-col items-center justify-center border rounded-lg p-4 w-1/2 transition-all 
                  ${formData.role === "freelancer" ? "bg-gray-900 border-blue-600 text-white" : "bg-white border-gray-300 text-gray-700"} 
                  hover:shadow-lg`}
              >
                <FaBriefcase size={15} />
                <span className="mt-2 font-semibold">Freelancer</span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-700 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
