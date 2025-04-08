import { useEffect, useState } from "react";
import axios from "axios";
import { backendBaseUrl } from "../utils/constant";
import LoadingIndicator from "./LoadingIndicator.jsx";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [editingService, setEditingService] = useState(null);
  const [deleteService, setDeleteService] = useState(null);

  // Edit form state (controlled inputs)
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${backendBaseUrl}/api/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Open edit modal and pre-populate fields
  const openEditModal = (service) => {
    setEditingService(service);
    setEditTitle(service.title);
    setEditPrice(service.price);
    setEditDescription(service.description);
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        title: editTitle,
        price: editPrice,
        description: editDescription,
      };
      const res = await axios.put(
        `${backendBaseUrl}/api/services/${editingService._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServices(
        services.map((s) =>
          s._id === editingService._id ? { ...s, ...res.data } : s
        )
      );
      closeEditModal();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingService(null);
  };

  // Open delete confirmation modal
  const openDeleteModal = (service) => {
    setDeleteService(service);
  };

  // Confirm and execute delete action
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendBaseUrl}/api/services/${deleteService._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(services.filter((service) => service._id !== deleteService._id));
      closeDeleteModal();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteService(null);
  };

  return (
    <section className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">Your Services</h2>
      </div>

      {loading ? (
        <LoadingIndicator />
      ) : services.length === 0 ? (
        <p className="text-gray-600 text-center">No services found</p>
      ) : (
        <ul className="space-y-6">
          {services.map((service) => (
            <li
              key={service._id}
              className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-3 border-b pb-2">
                <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                <p className="text-xl font-semibold text-green-600">₹{service.price}</p>
              </div>
              <p className="text-gray-700 mb-4">{service.description}</p>
              {service.category && (
                <p className="text-sm text-gray-500">
                  Category:{" "}
                  <span className="font-medium text-red-600">
                    {service.category}
                  </span>
                </p>
              )}
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => openEditModal(service)}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-900 text-white font-medium rounded transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(service)}
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-medium rounded transition duration-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl w-11/12 md:w-1/2 p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Edit Service</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Price</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl w-11/12 md:w-1/3 p-8 shadow-2xl text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the service <span className="font-semibold">{deleteService.title}</span>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiceList;
