import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ProfileSection from "../components/ProfileSection";
import ServiceForm from "../components/ServiceForm";
import ServiceList from "../components/ServiceList";

const FreelancerDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <ProfileSection />;
            case "addService":
                return <ServiceForm />;
            case "myServices":
                return <ServiceList />;
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
