import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // for redirect
import { jwtDecode } from "jwt-decode";

import Sidebar from "../components/freelancer/Sidebar.jsx";
import Topbar from "../components/Topbar";
import ProfileSection from "../components/ProfileSection.jsx";
import ServiceForm from "../components/ServiceForm";
import ServiceList from "../components/ServiceList";
import MyOrders from "../components/MyOrders";

const FreelancerDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token"); // or use cookies if needed
        if (!token) {
            navigate("/login"); // no token, go to login

            return;
        }

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000; // in seconds
            if (decoded.exp < currentTime) {
                // Token expired
                localStorage.removeItem("token"); // optional: clear token
                navigate("/login");
            }
        } catch (error) {
            // Invalid token
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [navigate]);

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <ProfileSection />;
            case "addService":
                return <ServiceForm />;
            case "myServices":
                return <ServiceList />;
            case "orders":
                return <MyOrders />;
            default:
                return <ProfileSection />;
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar setActiveTab={setActiveTab} />
            <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6 bg-gray-100 overflow-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default FreelancerDashboard;
