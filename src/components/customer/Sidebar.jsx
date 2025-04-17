import React from 'react';
import { Home, Calendar, Star, User } from 'lucide-react';

const Sidebar = ({ setActiveTab, activeTab }) => {
    const items = [
        { key: 'services', label: 'Browse', icon: <Home className="h-5 w-5" /> },
        { key: 'bookings', label: 'Bookings', icon: <Calendar className="h-5 w-5" /> },
        { key: 'reviews', label: 'Reviews', icon: <Star className="h-5 w-5" /> },
        { key: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
    ];

    return (
        <aside className="w-64 bg-gray-900 text-gray-100 h-full p-6 flex flex-col">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold tracking-tight">Customer</h2>
            </div>

            {/* Navigation */}
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {items.map(item => (
                        <li key={item.key}>
                            <button
                                onClick={() => setActiveTab(item.key)}
                                className={`flex items-center w-full p-3 rounded-md transition-colors duration-200 hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-600 ${activeTab === item.key ? 'bg-gray-800' : ''
                                    }`}
                            >
                                <span className="mr-2">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer / Version */}
            <div className="mt-8 text-center text-xs text-gray-500">
                v1.0.0
            </div>
        </aside>
    );
};

export default Sidebar;
