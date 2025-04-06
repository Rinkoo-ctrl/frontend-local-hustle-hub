import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServiceList = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        axios.get('/api/services')
            .then(res => setServices(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">All Services</h2>
            {services.map(service => (
                <div key={service._id} className="border p-3 mb-3 rounded shadow">
                    <h4 className="text-lg font-semibold">{service.title}</h4>
                    <p>{service.description}</p>
                    <p className="text-sm text-gray-600">By: {service.freelancerId?.name || 'Unknown'}</p>
                </div>
            ))}
        </div>
    );
};

export default ServiceList;
