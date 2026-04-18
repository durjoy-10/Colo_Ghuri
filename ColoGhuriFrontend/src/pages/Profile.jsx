import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import axios from '../api/axios';
import { 
  FaUser, FaEnvelope, FaPhone, FaAddressCard, FaCamera, FaUserTag, 
  FaIdCard, FaCheckCircle, FaClock, FaTimes, FaEdit, FaCalendarAlt, 
  FaGlobe, FaMapMarkerAlt, FaTransgender, FaBirthdayCake, FaUserCircle,
  FaMobileAlt, FaIdCardAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser, isGuide, isGuideVerified } = useAuth();
  const { put, loading } = useApi();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    national_id: '',
    gender: '',
    date_of_birth: '',
    preferred_language: 'Bengali, English'
  });
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        national_id: user.national_id || '',
        gender: user.gender || '',
        date_of_birth: user.date_of_birth || '',
        preferred_language: user.preferred_language || 'Bengali, English'
      });
      if (user.profile_picture) {
        const picUrl = user.profile_picture.startsWith('http') 
          ? user.profile_picture 
          : `http://127.0.0.1:8000${user.profile_picture}`;
        setPreviewUrl(picUrl);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email) {
      toast.error('Username and email are required');
      return;
    }
    
    const updateData = {
      username: formData.username,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      address: formData.address,
      national_id: formData.national_id,
      gender: formData.gender,
      date_of_birth: formData.date_of_birth,
      preferred_language: formData.preferred_language
    };
    
    try {
      const result = await put('/users/profile/', updateData);
      if (result) {
        updateUser(result);
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    
    setUploading(true);
    
    try {
      const formDataImage = new FormData();
      formDataImage.append('profile_picture', file);
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.patch('/users/profile/', formDataImage, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (response.data) {
        const updatedUser = { ...user, ...response.data };
        if (response.data.profile_picture) {
          const picUrl = response.data.profile_picture.startsWith('http')
            ? response.data.profile_picture
            : `http://127.0.0.1:8000${response.data.profile_picture}`;
          setPreviewUrl(picUrl);
          updatedUser.profile_picture = picUrl;
        }
        updateUser(updatedUser);
        toast.success('Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      if (user?.profile_picture) {
        const picUrl = user.profile_picture.startsWith('http')
          ? user.profile_picture
          : `http://127.0.0.1:8000${user.profile_picture}`;
        setPreviewUrl(picUrl);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getGenderDisplay = (gender) => {
    if (!gender) return 'Not specified';
    const genderMap = {
      'male': 'Male',
      'female': 'Female',
      'other': 'Other'
    };
    return genderMap[gender] || gender;
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="section-title">My Profile</h1>
          <p className="section-subtitle">Manage your account information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-600 relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative group">
                <button 
                  type="button"
                  className="w-32 h-32 rounded-full overflow-hidden bg-white p-1 cursor-pointer shadow-xl hover:scale-105 transition-transform focus:outline-none"
                  onClick={handleImageClick}
                  disabled={uploading}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <FaUser className="text-4xl text-white" />
                    </div>
                  )}
                </button>
                
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <FaCamera className="text-white text-2xl" />
                </div>
                
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept="image/jpeg,image/png,image/jpg,image/gif,image/webp" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                
                {uploading && (
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-lg">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
                      <span className="text-xs text-gray-600 font-medium">Uploading...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-20 pb-8 px-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-dark-800">{user?.first_name} {user?.last_name}</h2>
              <p className="text-gray-500">@{user?.username}</p>
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <span className={`badge ${user?.role === 'admin' ? 'badge-danger' : user?.role === 'guide' ? 'badge-primary' : 'badge-success'}`}>
                  {user?.role === 'admin' ? 'Administrator' : user?.role === 'guide' ? 'Tour Guide' : 'Traveller'}
                </span>
                {isGuide && (
                  <span className={`badge ${isGuideVerified ? 'badge-success' : 'badge-warning'} flex items-center gap-1`}>
                    {isGuideVerified ? <FaCheckCircle className="text-xs" /> : <FaClock className="text-xs" />}
                    {isGuideVerified ? 'Verified Guide' : 'Pending Verification'}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-3">Click on profile picture to change</p>
            </div>

            <div className="flex justify-center mb-8">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  isEditing 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isEditing ? <><FaTimes /> Cancel Edit</> : <><FaEdit /> Edit Profile</>}
              </button>
            </div>

            {!isEditing ? (
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-primary-600 mb-4 flex items-center gap-2 border-b pb-2">
                    <FaUserCircle /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaUser className="text-xs" /> Full Name</p>
                      <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaUserTag className="text-xs" /> Username</p>
                      <p className="font-medium">@{user?.username}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaEnvelope className="text-xs" /> Email Address</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaMobileAlt className="text-xs" /> Phone Number</p>
                      <p className="font-medium">{user?.phone_number || 'Not provided'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaIdCardAlt className="text-xs" /> National ID</p>
                      <p className="font-medium">{user?.national_id || 'Not provided'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaTransgender className="text-xs" /> Gender</p>
                      <p className="font-medium">{getGenderDisplay(user?.gender)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaBirthdayCake className="text-xs" /> Date of Birth</p>
                      <p className="font-medium">{formatDate(user?.date_of_birth)}</p>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div>
                  <h3 className="text-lg font-semibold text-primary-600 mb-4 flex items-center gap-2 border-b pb-2">
                    <FaMapMarkerAlt /> Address Information
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaAddressCard className="text-xs" /> Complete Address</p>
                    <p className="font-medium">{user?.address || 'Not provided'}</p>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-primary-600 mb-4 flex items-center gap-2 border-b pb-2">
                    <FaGlobe /> Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaCalendarAlt className="text-xs" /> Member Since</p>
                      <p className="font-medium">{formatDate(user?.date_joined)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaGlobe className="text-xs" /> Preferred Languages</p>
                      <p className="font-medium">{user?.preferred_language || 'Bengali, English'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-primary-600 mb-4 flex items-center gap-2">
                    <FaUserCircle /> Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <div className="relative">
                          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="input-field pl-12"
                            placeholder="Enter your first name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <div className="relative">
                          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="input-field pl-12"
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                      <div className="relative">
                        <FaUserTag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="input-field pl-12"
                          placeholder="Choose a username"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input-field pl-12"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                          <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="input-field pl-12"
                            placeholder="+880XXXXXXXXX"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                        <div className="relative">
                          <FaIdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="national_id"
                            value={formData.national_id}
                            onChange={handleChange}
                            className="input-field pl-12"
                            placeholder="National ID number"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <div className="relative">
                          <FaTransgender className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="input-field pl-12 appearance-none"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <div className="relative">
                          <FaBirthdayCake className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            className="input-field pl-12"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div>
                  <h3 className="text-lg font-semibold text-primary-600 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt /> Address Information
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                    <div className="relative">
                      <FaAddressCard className="absolute left-4 top-4 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="input-field pl-12"
                        rows="3"
                        placeholder="House #, Road #, City, Postal Code, Country"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-primary-600 mb-4 flex items-center gap-2">
                    <FaGlobe /> Additional Information
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Languages</label>
                    <div className="relative">
                      <FaGlobe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="preferred_language"
                        value={formData.preferred_language}
                        onChange={handleChange}
                        className="input-field pl-12"
                        placeholder="e.g., Bengali, English, Hindi"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Separate languages with commas</p>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full btn-primary py-3">
                  {loading ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;