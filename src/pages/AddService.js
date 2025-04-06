import React, { useState } from 'react';
import axios from 'axios';

const AddService = ({ freelancerId }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        category: ''
    });

    const handleSubmit = async () => {
        try {
            await axios.post('/api/services', {
                ...form,
                price: parseFloat(form.price),
                freelancerId,
            });
            alert('Service added!');
        } catch (err) {
            console.error(err);
            alert('Something went wrong!');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Add New Service</h2>
            <input
                className="block border p-2 mb-2 w-full"
                placeholder="Title"
                onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <textarea
                className="block border p-2 mb-2 w-full"
                placeholder="Description"
                onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <input
                className="block border p-2 mb-2 w-full"
                placeholder="Price"
                type="number"
                onChange={e => setForm({ ...form, price: e.target.value })}
            />
            <input
                className="block border p-2 mb-2 w-full"
                placeholder="Category"
                onChange={e => setForm({ ...form, category: e.target.value })}
            />
            <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    );
};

export default AddService;
