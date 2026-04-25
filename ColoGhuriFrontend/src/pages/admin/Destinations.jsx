import React, { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaUpload,
  FaTimes,
  FaStar,
} from "react-icons/fa";
import { DESTINATION_TYPES } from "../../utils/constants";
import toast from "react-hot-toast";
import axios from "../../api/axios";

const AdminDestinations = () => {
  const { get, del, loading } = useApi();
  const [destinations, setDestinations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [destinationImages, setDestinationImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    destination_type: "beach",
    entry_fee: "",
    best_time_to_visit: "",
    opening_hours: "",
    is_popular: false,
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const data = await get("/destinations/", {}, false);
      const destinationsData = data.results || data || [];
      setDestinations(destinationsData);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      toast.error("Failed to load destinations");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    return `http://127.0.0.1:8000${imagePath}`;
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("destination_type", formData.destination_type);
    formDataToSend.append("entry_fee", formData.entry_fee);
    formDataToSend.append("best_time_to_visit", formData.best_time_to_visit);
    formDataToSend.append("opening_hours", formData.opening_hours);
    formDataToSend.append("is_popular", formData.is_popular);

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const token = localStorage.getItem("accessToken");
      let result;

      if (editing) {
        result = await axios.put(
          `/destinations/${editing.destination_id}/update/`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        result = await axios.post("/destinations/create/", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (result.data) {
        toast.success(editing ? "Destination updated" : "Destination created");
        setShowModal(false);
        setEditing(null);
        setPreviewUrl(null);
        fetchDestinations();
      }
    } catch (error) {
      console.error("Save error:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to save destination";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (dest) => {
    setEditing(dest);
    setFormData({
      name: dest.name,
      description: dest.description,
      location: dest.location,
      destination_type: dest.destination_type,
      entry_fee: dest.entry_fee,
      best_time_to_visit: dest.best_time_to_visit || "",
      opening_hours: dest.opening_hours || "",
      is_popular: dest.is_popular || false,
      image: null,
    });
    setPreviewUrl(getImageUrl(dest.primary_image));
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this destination?")) {
      try {
        const token = localStorage.getItem("accessToken");
        await axios.delete(`/destinations/${id}/delete/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Destination deleted");
        fetchDestinations();
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete destination");
      }
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      beach: "bg-blue-100 text-blue-800",
      mountain: "bg-green-100 text-green-800",
      historical: "bg-yellow-100 text-yellow-800",
      natural: "bg-emerald-100 text-emerald-800",
      religious: "bg-purple-100 text-purple-800",
      adventure: "bg-orange-100 text-orange-800",
      cultural: "bg-pink-100 text-pink-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Destinations</h1>
          <p className="text-gray-600">
            Add, edit, or remove tourist destinations
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormData({
              name: "",
              description: "",
              location: "",
              destination_type: "beach",
              entry_fee: "",
              best_time_to_visit: "",
              opening_hours: "",
              is_popular: false,
              image: null,
            });
            setPreviewUrl(null);
            setShowModal(true);
          }}
          icon={FaPlus}
        >
          Add Destination
        </Button>
      </div>

      {/* Destinations Grid */}
      {destinations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No destinations found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.destination_id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative h-48 bg-gray-200">
                <img
                  src={
                    getImageUrl(dest.primary_image) ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={dest.name}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/400x300?text=No+Image")
                  }
                />
                <span
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(dest.destination_type)}`}
                >
                  {dest.destination_type}
                </span>
                {dest.is_popular && (
                  <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{dest.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{dest.location}</p>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {dest.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary-600">
                    ৳{dest.entry_fee}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(dest)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(dest.destination_id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
          setPreviewUrl(null);
        }}
        title={editing ? "Edit Destination" : "Add Destination"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows="3"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Type</label>
              <select
                name="destination_type"
                value={formData.destination_type}
                onChange={handleChange}
                className="input-field"
              >
                {DESTINATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Entry Fee (BDT)"
              name="entry_fee"
              type="number"
              value={formData.entry_fee}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Best Time to Visit"
              name="best_time_to_visit"
              value={formData.best_time_to_visit}
              onChange={handleChange}
            />
            <Input
              label="Opening Hours"
              name="opening_hours"
              value={formData.opening_hours}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="input-field"
            />
            {previewUrl && (
              <div className="mt-2 relative w-32 h-32">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setFormData({ ...formData, image: null });
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            )}
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_popular"
              checked={formData.is_popular}
              onChange={handleChange}
            />
            Mark as Popular Destination
          </label>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditing(null);
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              fullWidth
            >
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDestinations;
