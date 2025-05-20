


"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';

const AddVideoForm = () => {
  const [formData, setFormData] = useState({
    type_id: '',
    video_type: '',
    finalPackage_id:'',
    vendor_id: '',
    channel_id: '',
    producer_id: '',
    category_id: '',
    language_id: '',
    cast_id: '',
    name: '',
    description: '',
    video_upload_type: '',
    video_extension: '',
    video_duration: '',
    trailer_type: '',
    trailer_url: '',
    subtitle_type: '',
    subtitle_lang_1: '',
    subtitle_lang_2: '',
    subtitle_lang_3: '',
    release_date: '',
    is_premium: 0,
    is_title: 0,
    is_download: 0,
    is_like: 0,
    is_comment: 0,
    total_like: 0,
    total_view: 0,
    is_rent: 0,
    price: 0,
    rent_day: 0,
    status: 1,
    monetizationType: '',
    package_id: ''
  });

  const [fileInputs, setFileInputs] = useState({
    thumbnail: null,
    landscape: null,
    video_320: null,
    video_480: null,
    video_720: null,
    video_1080: null,
    trailer: null,
    subtitle_1: null,
    subtitle_2: null,
    subtitle_3: null,
  }); 
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [casts, setCasts] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [channels, setChannels] = useState([]);
  const [producers, setProducers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [currentVendorId, setCurrentVendorId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const [
          typesRes,
          categoriesRes,
          castsRes,
          languagesRes,
          vendorsRes,
          channelsRes,
          producersRes,
        ] = await Promise.all([
          axios.get('http://localhost:9000/api/admin/get_types'),
          axios.get('http://localhost:9000/api/admin/get_categories'),
          axios.get('http://localhost:9000/api/admin/get-casts'),
          axios.get('http://localhost:9000/api/admin/get_languages'),
          axios.get('http://localhost:9000/api/admin/get-vendors'),
          axios.get('http://localhost:9000/api/admin/get-channels'),
          axios.get('http://localhost:9000/api/admin/get-producers'),
        ]);
        
        setTypes(typesRes.data.data);
        setCategories(categoriesRes.data.data);
        setCasts(castsRes.data.casts);
        setLanguages(languagesRes.data.data);
        setVendors(vendorsRes.data.vendors);
        setChannels(channelsRes.data.channels);
        setProducers(producersRes.data.producers);
        
        // Fetch general packages
      const fetchPackages = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            "http://localhost:9000/api/vendors/get-packages",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setPackages(response.data || []);
        } catch (error) {
          console.error("Error fetching packages:", error);
        }
      };

      await fetchPackages();

      if (token) {
        const tokenData = parseJwt(token);
        if (tokenData && tokenData.vendor_id) {
          const vendorId = tokenData.vendor_id;
          setCurrentVendorId(vendorId);
          setFormData(prev => ({ ...prev, vendor_id: vendorId }));
          // await fetchVendorPackagesById(vendorId, token);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  fetchData();
}, []);
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')));
  } catch (e) {
    console.error("Failed to parse JWT:", e);
    return null;
  }
};

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    });
  };

  const handleFileChange = (e) => {
    setFileInputs({
      ...fileInputs,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    
    // Add all form data fields to FormData
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    // Add all file inputs to FormData
    for (const key in fileInputs) {
      if (fileInputs[key]) {
        form.append(key, fileInputs[key]);
      }
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:9000/api/vendors/create-video', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setLoading(false);
      alert("Video created successfully!");
      console.log("API Response:", res.data);
      
      // Reset form after successful submission
      setFormData({
        type_id: '',
        video_type: '',
        finalPackage_id:'',
        vendor_id: currentVendorId,
        channel_id: '',
        producer_id: '',
        category_id: '',
        language_id: '',
        cast_id: '',
        name: '',
        description: '',
        video_upload_type: '',
        video_extension: '',
        video_duration: '',
        trailer_type: '',
        trailer_url: '',
        subtitle_type: '',
        subtitle_lang_1: '',
        subtitle_lang_2: '',
        subtitle_lang_3: '',
        release_date: '',
        is_premium: 0,
        is_title: 0,
        is_download: 0,
        is_like: 0,
        is_comment: 0,
        total_like: 0,
        total_view: 0,
        is_rent: 0,
        price: 0,
        rent_day: 0,
        status: 1,
        monetizationType: '',
        package_id: ''
      });
      
      setFileInputs({
        thumbnail: null,
        landscape: null,
        video_320: null,
        video_480: null,
        video_720: null,
        video_1080: null,
        trailer: null,
        subtitle_1: null,
        subtitle_2: null,
        subtitle_3: null,
      });
      
    } catch (err) {
      setLoading(false);
      console.error("Error creating video:", err);
      alert("Video creation failed: " + (err.response?.data?.message || err.message));
    }
  }; 

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Add New Video</h2>
      
      {loading && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
          Loading data, please wait...
        </div>
      )}

      {/* Text Inputs */}
      <label className="block mb-1 font-medium">Video Name</label>
      <input 
        type="text" 
        name="name" 
        value={formData.name}
        onChange={handleInputChange} 
        required 
        className="w-full border p-2 mb-4" 
      />

      <label className="block mb-1 font-medium">Description</label>
      <textarea 
        name="description" 
        value={formData.description}
        onChange={handleInputChange} 
        required 
        className="w-full border p-2 mb-4" 
      />

      <label className="block mb-1 font-medium">Video Type</label>
      <input 
        type="text" 
        name="video_type" 
        value={formData.video_type}
        onChange={handleInputChange} 
        className="w-full border p-2 mb-4" 
      />

      <label className="block mb-1 font-medium">Video Upload Type</label>
      <input 
        type="text" 
        name="video_upload_type" 
        value={formData.video_upload_type}
        onChange={handleInputChange} 
        className="w-full border p-2 mb-4" 
      />

      <label className="block mb-1 font-medium">Video Extension</label>
      <input 
        type="text" 
        name="video_extension" 
        value={formData.video_extension}
        onChange={handleInputChange} 
        className="w-full border p-2 mb-4" 
      />

      <label className="block mb-1 font-medium">Video Duration (seconds)</label>
      <input 
        type="number" 
        name="video_duration" 
        value={formData.video_duration}
        onChange={handleInputChange} 
        className="w-full border p-2 mb-4" 
      />

      {/* Dropdowns */}
      <label className="block mb-1 font-medium">Type</label>
      <select 
        name="type_id" 
        value={formData.type_id}
        onChange={handleInputChange} 
        required 
        className="w-full border p-2 mb-4"
      >
        <option value="">Select Type</option>
        {types.map((type) => (
          <option key={type._id} value={type._id}>{type.name}</option>
        ))}
      </select>

      <label className="block mb-1 font-medium">Category</label>
      <select 
        name="category_id" 
        value={formData.category_id}
        onChange={handleInputChange} 
        required 
        className="w-full border p-2 mb-4"
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>{category.name}</option>
        ))}
      </select>

      <label className="block mb-1 font-medium">Vendor</label>
      <select 
        name="vendor_id" 
        value={formData.vendor_id || currentVendorId}
        onChange={handleInputChange} 
        required 
        className="w-full border p-2 mb-4"
        disabled={currentVendorId ? true : false}
      >
        <option value="">Select Vendor</option>
        {vendors.map((vendor) => (
          <option key={vendor._id} value={vendor._id}>{vendor.fullName}</option>
        ))}
      </select>

      <div className="mb-4 p-3 bg-white-50 border border-gray-100 rounded-md">
        <h3 className="font-medium text-yellow-800 mb-2">Package Selection</h3>
        <div className="grid grid-cols-1 gap-4">
          {/* Show all packages */}
          <div>
            <label className="block mb-1 font-medium">Global Package</label>
            {/* <select 
              name="package_id" 
              value={formData.package_id}
              onChange={handleInputChange} 
              className="w-full border p-2"
            >
              <option value="">Select Global Package</option>
              {packages.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>{pkg.name}</option>
              ))}
            </select> */}
            <select 
  name="finalPackage_id" 
  value={formData.finalPackage_id}
  onChange={handleInputChange} 
  className="w-full border p-2"
>
  <option value="">Select Global Package</option>
  {packages.map((pkg) => (
    <option key={pkg._id} value={pkg._id}>{pkg.name}</option>
  ))}
</select>

          </div>
          
          {/* Show vendor-specific packages */}
         
              
        </div>
      </div>

      <label className="block mb-1 font-medium">Cast</label>
      <select 
        name="cast_id" 
        value={formData.cast_id}
        onChange={handleInputChange} 
        required 
        className="w-full border p-2 mb-4"
      >
        <option value="">Select Cast</option>
        {casts.map((cast) => (
          <option key={cast._id} value={cast._id}>{cast.name}</option>
        ))}
      </select>

      <label className="block mb-1 font-medium">Language</label>
      <select 
        name="language_id" 
        value={formData.language_id}
        onChange={handleInputChange} 
        required 
        className="w-full border p-2 mb-4"
      >
        <option value="">Select Language</option>
        {languages.map((language) => (
          <option key={language._id} value={language._id}>{language.name}</option>
        ))}
      </select>

      <label className="block mb-1 font-medium">Producer</label>
      <select 
        name="producer_id" 
        value={formData.producer_id}
        onChange={handleInputChange} 
        required 
        className="w-full border p-2 mb-4"
      >
        <option value="">Select Producer</option>
        {producers.map((producer) => (
          <option key={producer._id} value={producer._id}>{producer.user_name}</option>
        ))}
      </select>

      <label className="block mb-1 font-medium">Channel</label>
      <select 
        name="channel_id" 
        value={formData.channel_id}
        onChange={handleInputChange} 
        required 
        className="w-full border p-2 mb-4"
      >
        <option value="">Select Channel</option>
        {channels.map((channel) => (
          <option key={channel._id} value={channel._id}>{channel.name}</option>
        ))}
      </select>

      <label className="block mb-1 font-medium">Release Date</label>
      <input 
        type="date" 
        name="release_date" 
        value={formData.release_date}
        onChange={handleInputChange} 
        className="w-full border p-2 mb-4" 
      />

      {/* Checkbox options */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="is_premium" 
            name="is_premium" 
            checked={formData.is_premium === 1}
            onChange={handleInputChange} 
            className="mr-2" 
          />
          <label htmlFor="is_premium">Premium Content</label>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="is_download" 
            name="is_download" 
            checked={formData.is_download === 1}
            onChange={handleInputChange} 
            className="mr-2" 
          />
          <label htmlFor="is_download">Allow Download</label>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="is_like" 
            name="is_like" 
            checked={formData.is_like === 1}
            onChange={handleInputChange} 
            className="mr-2" 
          />
          <label htmlFor="is_like">Allow Likes</label>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="is_comment" 
            name="is_comment" 
            checked={formData.is_comment === 1}
            onChange={handleInputChange} 
            className="mr-2" 
          />
          <label htmlFor="is_comment">Allow Comments</label>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="is_rent" 
            name="is_rent" 
            checked={formData.is_rent === 1}
            onChange={handleInputChange} 
            className="mr-2" 
          />
          <label htmlFor="is_rent">Available for Rent</label>
        </div>
      </div>

      {/* Conditional fields based on rent option */}
      {formData.is_rent === 1 && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-medium">Price ($)</label>
            <input 
              type="number" 
              name="price" 
              value={formData.price}
              onChange={handleInputChange} 
              min="0" 
              step="0.01" 
              className="w-full border p-2" 
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Rental Period (days)</label>
            <input 
              type="number" 
              name="rent_day" 
              value={formData.rent_day}
              onChange={handleInputChange} 
              min="1" 
              className="w-full border p-2" 
            />
          </div>
        </div>
      )}

      {/* File Inputs for Video Upload */}
      <h3 className="text-xl font-bold mt-6 mb-4">Upload Files</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Thumbnail</label>
          <input 
            type="file" 
            name="thumbnail" 
            onChange={handleFileChange} 
            className="w-full border p-2" 
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Landscape</label>
          <input 
            type="file" 
            name="landscape" 
            onChange={handleFileChange} 
            className="w-full border p-2" 
          />
        </div>
      </div>

      <h4 className="font-medium mt-4 mb-2">Video Files</h4>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Video 320p</label>
          <input 
            type="file" 
            name="video_320" 
            onChange={handleFileChange} 
            className="w-full border p-2" 
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Video 480p</label>
          <input 
            type="file" 
            name="video_480" 
            onChange={handleFileChange} 
            className="w-full border p-2" 
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Video 720p</label>
          <input 
            type="file" 
            name="video_720" 
            onChange={handleFileChange} 
            className="w-full border p-2" 
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Video 1080p</label>
          <input 
            type="file" 
            name="video_1080" 
            onChange={handleFileChange} 
            className="w-full border p-2" 
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Trailer</label>
        <input 
          type="file" 
          name="trailer" 
          onChange={handleFileChange} 
          className="w-full border p-2" 
        />
      </div>

      <h4 className="font-medium mt-4 mb-2">Subtitles</h4>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Subtitle 1</label>
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text" 
              name="subtitle_lang_1" 
              value={formData.subtitle_lang_1}
              onChange={handleInputChange} 
              placeholder="Language (e.g. English)" 
              className="border p-2" 
            />
            <input 
              type="file" 
              name="subtitle_1" 
              onChange={handleFileChange} 
              className="border p-2" 
            />
          </div>
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Subtitle 2</label>
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text" 
              name="subtitle_lang_2" 
              value={formData.subtitle_lang_2}
              onChange={handleInputChange} 
              placeholder="Language (e.g. Spanish)" 
              className="border p-2" 
            />
            <input 
              type="file" 
              name="subtitle_2" 
              onChange={handleFileChange} 
              className="border p-2" 
            />
          </div>
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Subtitle 3</label>
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text" 
              name="subtitle_lang_3" 
              value={formData.subtitle_lang_3}
              onChange={handleInputChange} 
              placeholder="Language (e.g. French)" 
              className="border p-2" 
            />
            <input 
              type="file" 
              name="subtitle_3" 
              onChange={handleFileChange} 
              className="border p-2" 
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Video'}
      </button>
    </form>
 
  );
};

export default AddVideoForm;
