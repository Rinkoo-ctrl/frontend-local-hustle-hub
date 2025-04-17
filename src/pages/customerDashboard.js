import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryFilter from '../components/CategoryFilter.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import LocationInput from '../components/LocationInput.jsx';
import Sidebar from '../components/customer/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import ProfileSection from '../components/ProfileSection.jsx';
import { backendBaseUrl, defaultImage } from '../utils/constant.js';

const CustomerDashboard = () => {
    const [activeTab, setActiveTab] = useState('services');

    // Dummy customer data
    const dummyCustomer = {
        _id: '60d5f483f8d2c72a34a9c5a1',
        name: 'Anjali Sharma',
        email: 'anjali.sharma@example.com',
        image: 'https://randomuser.me/api/portraits/women/65.jpg',
        role: 'customer'
    };

    // Dummy services
    const dummyServices = [
        {
            _id: '70e7ab12a3f4d91b8c2e1f00',
            name: 'Leaky Faucet Repair',
            description: 'Fix any kind of running or dripping tap quickly & neatly.',
            category: 'plumbing',
            price: 499,
            distance: 2.3,
            freelancerId: {
                _id: '50f8c7d2b9a1e83d4c2f0e77',
                name: 'Rahul Verma',
                image: 'https://randomuser.me/api/portraits/men/42.jpg',
                locations: [
                    { address: 'Green Park, New Delhi', latitude: 28.5770, longitude: 77.1900 }
                ]
            }
        },
        {
            _id: '70e7ab12a3f4d91b8c2e1f01',
            name: 'Home Tutoring (Maths)',
            description: 'Experienced tutor for classes 6–10, individual & group sessions.',
            category: 'tutoring',
            price: 600,
            distance: 5.1,
            freelancerId: {
                _id: '50f8c7d2b9a1e83d4c2f0e88',
                name: 'Priya Singh',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                locations: [
                    { address: 'Lajpat Nagar, New Delhi', latitude: 28.5692, longitude: 77.2420 }
                ]
            }
        },
        {
            _id: '70e7ab12a3f4d91b8c2e1f01',
            name: 'Home Tutoring (Maths)',
            description: 'Experienced tutor for classes 6–10, individual & group sessions.',
            category: 'tutoring',
            price: 600,
            distance: 5.1,
            freelancerId: {
                _id: '50f8c7d2b9a1e83d4c2f0e88',
                name: 'Priya Singh',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                locations: [
                    { address: 'Lajpat Nagar, New Delhi', latitude: 28.5692, longitude: 77.2420 }
                ]
            }
        }, {
            _id: '70e7ab12a3f4d91b8c2e1f01',
            name: 'Home Tutoring (Maths)',
            description: 'Experienced tutor for classes 6–10, individual & group sessions.',
            category: 'tutoring',
            price: 600,
            distance: 5.1,
            freelancerId: {
                _id: '50f8c7d2b9a1e83d4c2f0e88',
                name: 'Priya Singh',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                locations: [
                    { address: 'Lajpat Nagar, New Delhi', latitude: 28.5692, longitude: 77.2420 }
                ]
            }
        }, {
            _id: '70e7ab12a3f4d91b8c2e1f01',
            name: 'Home Tutoring (Maths)',
            description: 'Experienced tutor for classes 6–10, individual & group sessions.',
            category: 'tutoring',
            price: 600,
            distance: 5.1,
            freelancerId: {
                _id: '50f8c7d2b9a1e83d4c2f0e88',
                name: 'Priya Singh',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                locations: [
                    { address: 'Lajpat Nagar, New Delhi', latitude: 28.5692, longitude: 77.2420 }
                ]
            }
        }, {
            _id: '70e7ab12a3f4d91b8c2e1f01',
            name: 'Home Tutoring (Maths)',
            description: 'Experienced tutor for classes 6–10, individual & group sessions.',
            category: 'tutoring',
            price: 600,
            distance: 5.1,
            freelancerId: {
                _id: '50f8c7d2b9a1e83d4c2f0e88',
                name: 'Priya Singh',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                locations: [
                    { address: 'Lajpat Nagar, New Delhi', latitude: 28.5692, longitude: 77.2420 }
                ]
            }
        }, {
            _id: '70e7ab12a3f4d91b8c2e1f01',
            name: 'Home Tutoring (Maths)',
            description: 'Experienced tutor for classes 6–10, individual & group sessions.',
            category: 'tutoring',
            price: 600,
            distance: 5.1,
            freelancerId: {
                _id: '50f8c7d2b9a1e83d4c2f0e88',
                name: 'Priya Singh',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                locations: [
                    { address: 'Lajpat Nagar, New Delhi', latitude: 28.5692, longitude: 77.2420 }
                ]
            }
        }, {
            _id: '70e7ab12a3f4d91b8c2e1f01',
            name: 'Home Tutoring (Maths)',
            description: 'Experienced tutor for classes 6–10, individual & group sessions.',
            category: 'tutoring',
            price: 600,
            distance: 5.1,
            freelancerId: {
                _id: '50f8c7d2b9a1e83d4c2f0e88',
                name: 'Priya Singh',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                locations: [
                    { address: 'Lajpat Nagar, New Delhi', latitude: 28.5692, longitude: 77.2420 }
                ]
            }
        }, {
            _id: '70e7ab12a3f4d91b8c2e1f01',
            name: 'Home Tutoring (Maths)',
            description: 'Experienced tutor for classes 6–10, individual & group sessions.',
            category: 'tutoring',
            price: 600,
            distance: 5.1,
            freelancerId: {
                _id: '50f8c7d2b9a1e83d4c2f0e88',
                name: 'Priya Singh',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                locations: [
                    { address: 'Lajpat Nagar, New Delhi', latitude: 28.5692, longitude: 77.2420 }
                ]
            }
        }, {
            _id: '70e7ab12a3f4d91b8c2e1f01',
            name: 'Home Tutoring (Maths)',
            description: 'Experienced tutor for classes 6–10, individual & group sessions.',
            category: 'tutoring',
            price: 600,
            distance: 5.1,
            freelancerId: {
                _id: '50f8c7d2b9a1e83d4c2f0e88',
                name: 'Priya Singh',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                locations: [
                    { address: 'Lajpat Nagar, New Delhi', latitude: 28.5692, longitude: 77.2420 }
                ]
            }
        }, {
            _id: '70e7ab12a3f4d91b8c2e1f01',
            name: 'Home Tutoring (Maths)',
            description: 'Experienced tutor for classes 6–10, individual & group sessions.',
            category: 'tutoring',
            price: 600,
            distance: 5.1,
            freelancerId: {
                _id: '50f8c7d2b9a1e83d4c2f0e88',
                name: 'Priya Singh',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                locations: [
                    { address: 'Lajpat Nagar, New Delhi', latitude: 28.5692, longitude: 77.2420 }
                ]
            }
        }, {
            _id: '70e7ab12a3f4d91b8c2e1f01',
            name: 'Home Tutoring (Maths)',
            description: 'Experienced tutor for classes 6–10, individual & group sessions.',
            category: 'tutoring',
            price: 600,
            distance: 5.1,
            freelancerId: {
                _id: '50f8c7d2b9a1e83d4c2f0e88',
                name: 'Priya Singh',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                locations: [
                    { address: 'Lajpat Nagar, New Delhi', latitude: 28.5692, longitude: 77.2420 }
                ]
            }
        }
    ];

    // Dummy bookings
    const dummyBookings = [
        { id: 'b1', serviceName: 'Leaky Faucet Repair', date: '2025-04-10', status: 'completed', paymentStatus: 'paid' },
        { id: 'b2', serviceName: 'AC Installation', date: '2025-04-15', status: 'upcoming', paymentStatus: 'pending' }
    ];

    // Dummy reviews
    const dummyReviews = [
        { id: 'r1', serviceName: 'Leaky Faucet Repair', rating: 4, comment: 'Quick and neat work! Highly recommended.', date: '2025-04-11' },
        { id: 'r2', serviceName: 'Home Tutoring (Maths)', rating: 5, comment: 'Priya explained concepts so clearly—my grades improved!', date: '2025-04-12' }
    ];

    // State for real services (optional real fetch)
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState({ lat: null, lng: null });

    useEffect(() => {
        // If you want to fetch real data, implement here
        // For now we use dummyServices
        setServices(dummyServices);
    }, []);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <Topbar user={dummyCustomer} />

                <main className="p-6 overflow-auto flex-1">
                    {activeTab === 'services' && (
                        <>
                            <header className="mb-6 text-center">
                                <h1 className="text-3xl font-extrabold text-gray-800">Discover Skilled Hustlers</h1>
                                <p className="text-gray-600 mt-2">Book verified local freelancers for any task – quick, easy & nearby.</p>
                            </header>

                            <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
                                <LocationInput onLocationSelect={setLocation} />
                                <CategoryFilter selected={category} onChange={setCategory} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(!loading ? services : []).map(service => (
                                    <ServiceCard key={service._id} service={service} />
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'bookings' && (
                        <>
                            <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
                            {dummyBookings.map(bk => (
                                <div key={bk.id} className="border p-4 rounded-lg shadow-sm mb-4 bg-white">
                                    <p><strong>Service:</strong> {bk.serviceName}</p>
                                    <p><strong>Date:</strong> {bk.date}</p>
                                    <p><strong>Status:</strong> {bk.status}</p>
                                    <p><strong>Payment:</strong> {bk.paymentStatus}</p>
                                </div>
                            ))}
                        </>
                    )}

                    {activeTab === 'reviews' && (
                        <>
                            <h2 className="text-2xl font-bold mb-4">My Reviews</h2>
                            {dummyReviews.map(rv => (
                                <div key={rv.id} className="border p-4 rounded-lg shadow-sm mb-4 bg-white">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span><strong>Service:</strong> {rv.serviceName}</span>
                                        <span>{rv.date}</span>
                                    </div>
                                    <div className="flex items-center mb-1">
                                        {Array.from({ length: rv.rating }).map((_, i) => (
                                            <span key={i} className="text-yellow-500">★</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-700 text-sm">{rv.comment}</p>
                                </div>
                            ))}
                        </>
                    )}

                    {activeTab === 'profile' && (
                        <ProfileSection user={dummyCustomer} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default CustomerDashboard;
