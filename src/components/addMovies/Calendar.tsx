
'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';


const AddVideoForm = () => {
  const [formData, setFormData] = useState({
    video_type: '',
    finalPackage_id: '',
    vendor_id: '',
    channel_id: '',
    producer_id: '',
    category_id: '',
    language_id: '',
    cast_ids: [], // Change from cast_id to cast_ids as an array
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
    packageType: 'view' // Default to 'view' (free)
  });

  const [selectedPackageDetails, setSelectedPackageDetails] = useState({
    price: 0,
    rentalDuration: 0
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

  const [categories, setCategories] = useState([]);
  const [casts, setCasts] = useState([]);
  const [languages, setLanguages] = useState([]);
  // const [vendors, setVendors] = useState([]);
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
    
        if (!token) {
          throw new Error("No token found");
        }
    
        const headers = {
          headers: { Authorization: `Bearer ${token}` }
        };
    
        const [
          categoriesRes,
          castsRes,
          languagesRes,
          channelsRes,
          producersRes,
          packagesRes
        ] = await Promise.all([
          axios.get('https://shreejighutargo21.onrender.com/api/admin/get_categories', headers),
          axios.get('https://shreejighutargo21.onrender.com/api/admin/get-casts', headers),
          axios.get('https://shreejighutargo21.onrender.com/api/admin/get_languages', headers),
          axios.get('https://shreejighutargo21.onrender.com/api/admin/get-channels', headers),
          axios.get('https://shreejighutargo21.onrender.com/api/admin/get-producers', headers),
          axios.get('https://shreejighutargo21.onrender.com/api/vendors/get-packages', headers)
        ]);
    
        setCategories(categoriesRes.data.data);
        setCasts(castsRes.data.casts);
        setLanguages(languagesRes.data.data);
        setChannels(channelsRes.data.channels);
        setProducers(producersRes.data.producers);
        setPackages(packagesRes.data || []);
    
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          alert('Unauthorized. Please log in again.');
          localStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    };
    

    fetchData();
  }, []);
  function isTokenValid(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
  
      // Check expiration
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp > currentTime;
    } catch (e) {
      console.error("Invalid token", e);
      return false;
    }
  }
  
  const handlePackageTypeChange = (e) => {
    const packageType = e.target.value;
    setFormData(prev => ({
      ...prev,
      packageType,
      is_rent: packageType === 'rental' ? 1 : 0,
      finalPackage_id: '',
      price: 0,
      rent_day: 0
    }));
    setSelectedPackageDetails({
      price: 0,
      rentalDuration: 0
    });
  };

  const handlePackageSelection = async (e) => {
    const packageId = e.target.value;
    if (!packageId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://shreejighutargo21.onrender.com/api/vendors/get-packages`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const packageDetails = response.data;
      setSelectedPackageDetails({
        price: packageDetails.price,
        rentalDuration: packageDetails.rentalDuration
      });

      setFormData(prev => ({
        ...prev,
        finalPackage_id: packageId,
        price: packageDetails.price,
        rent_day: packageDetails.rentalDuration
      }));
    } catch (error) {
      console.error('Error fetching package details:', error);
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
  const getVendorIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in localStorage");
      return null;
    }
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      
      // Log the decoded token to see its structure
      console.log("Decoded token:", decoded);
      
      // Check all possible vendor ID fields
      const vendorId = decoded.vendor_id || decoded.vendorId || decoded.id;
      
      if (!vendorId) {
        console.error("No vendor ID found in token payload:", decoded);
        return null;
      }
      
      return vendorId;
    } catch (e) {
      console.error("Error parsing token:", e);
      return null;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
     
  // Get vendor ID from token first
  const vendorId = getVendorIdFromToken();
  console.log("Vendor ID:", vendorId); // Debug log
    const form = new FormData();
    
    // Add all form data fields to FormData
    for (const key in formData) {
      if (key === 'cast_ids') {
        // Add cast_ids as a JSON string
        form.append('cast_ids', JSON.stringify(formData.cast_ids));
      } else if (key !== 'vendor_id') { // Skip vendor_id from formData
        form.append(key, formData[key]);
      }
    }
  
    // Add vendor_id to form data
    form.append('vendor_id', vendorId);
  
    // Add all file inputs to FormData
    for (const key in fileInputs) {
      if (fileInputs[key]) {
        form.append(key, fileInputs[key]);
      }
    }
  
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const res = await axios.post(
        'https://shreejighutargo21.onrender.com/api/vendors/create-video', 
        form, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setLoading(false);
      alert("Video created successfully!");
      console.log("API Response:", res.data);
      
      // Reset form after successful submission
      setFormData({
        video_type: '',
        finalPackage_id: '',
        channel_id: '',
        producer_id: '',
        category_id: '',
        language_id: '',
        cast_ids: [], // Using cast_ids instead of cast_id
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
        package_id: '',
        packageType: 'view'
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
      
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        // Optionally redirect to login page or handle session expiry
        // window.location.href = '/login';
      } else {
        alert("Video creation failed: " + (err.response?.data?.message || err.message));
      }
    }
  };
  const handleCastSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedCastIds = selectedOptions.map(option => option.value);
  
    setFormData(prev => ({
      ...prev,
      cast_ids: selectedCastIds
    }));
  };
  
  
  const SelectedCastsDisplay = ({ selectedCasts, casts }) => {
    if (!selectedCasts?.length) return null;
  
    return (
      <div className="mt-2">
        <p className="text-sm font-semibold">Selected Casts:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {selectedCasts.map(castId => {
            const cast = casts.find(c => c._id === castId);
            return cast ? (
              <span
                key={cast._id}
                className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
              >
                {cast.name}
              </span>
            ) : null;
          })}
        </div>
      </div>
    );
  };
  
  return (
    <form
  onSubmit={handleSubmit}
  className="max-w-6xl mx-auto p-8 bg-white dark:bg-gray-900 shadow-md rounded-lg text-gray-900 dark:text-gray-100"
>
  <h2 className="text-3xl font-bold mb-6">Add New Movies</h2>

  {loading && (
    <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded">
      Loading data, please wait...
    </div>
  )}

  {/* First Row */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <div>
      <label className="block mb-1 font-semibold">
        Package Type<span className="text-red-500">*</span>
      </label>
      <select
        name="packageType"
        value={formData.packageType}
        onChange={handlePackageTypeChange}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        <option value="view">Free Video</option>
        <option value="rental">Rental Video</option>
        <option value="ad">Ad-Supported Video</option>
      </select>
    </div>

    <div>
      <label className="block mb-1 font-semibold">
        Video Name<span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        required
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
    </div>

    <div>
      <label className="block mb-1 font-semibold">
        Category<span className="text-red-500">*</span>
      </label>
      <select
        name="category_id"
        value={formData.category_id}
        onChange={handleInputChange}
        required
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Conditional Rental Package Selection */}
  {formData.packageType === 'rental' && (
    <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
      <h3 className="font-semibold mb-3">Rental Package Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <select
            name="finalPackage_id"
            value={formData.finalPackage_id}
            onChange={handlePackageSelection}
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select Rental Package</option>
            {packages.map((pkg) => (
              <option key={pkg._id} value={pkg._id}>
                {pkg.name}
              </option>
            ))}
          </select>
        </div>

        {selectedPackageDetails.price > 0 && (
          <>
            <div>
              <label className="block mb-1 font-semibold">Price</label>
              <input
                type="number"
                value={selectedPackageDetails.price}
                disabled
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Rental Duration (days)</label>
              <input
                type="number"
                value={selectedPackageDetails.rentalDuration}
                disabled
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </>
        )}
        </div>
         </div>
  )}
         {/* Description Field */}
  <div className="mb-6">
    <label className="block mb-1 font-semibold">Description<span className="text-red-500">*</span></label>
    <textarea 
      name="description" 
      value={formData.description}
      onChange={handleInputChange} 
      required 
      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" 
      rows="4"
    />
  </div>

  {/* Second Row */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <div>
      <label className="block mb-1 font-semibold">Video Upload Type<span className="text-red-500">*</span></label>
      <input 
        type="text" 
        name="video_upload_type" 
        value={formData.video_upload_type}
        onChange={handleInputChange} 
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>

    <div>
      <label className="block mb-1 font-semibold">Video Extension<span className="text-red-500">*</span></label>
      <input 
        type="text" 
        name="video_extension" 
        value={formData.video_extension}
        onChange={handleInputChange} 
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>

    <div>
      <label className="block mb-1 font-semibold">Video Duration<span className="text-red-500">*</span></label>
      <input 
        type="number" 
        name="video_duration" 
        value={formData.video_duration}
        onChange={handleInputChange} 
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>
  </div>
  <div className="space-y-4">
  {/* Label Section */}
  <div className="flex items-center justify-between">
    <label className="text-lg font-semibold text-gray-700 dark:text-gray-200">
      Cast<span className="text-red-500 ml-1">*</span>
    </label>
    <span className="text-sm text-gray-500 dark:text-gray-400">
      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
        Ctrl/⌘
      </kbd>
      <span className="mx-1">to select multiple</span>
    </span>
  </div>

 {/* Select Box */}
<div className="relative">
  <select 
    name="cast_ids" 
    multiple
    value={formData.cast_ids || []}
    onChange={handleCastSelection}
    required 
    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg
               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
               min-h-[160px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500
               transition-all duration-200 ease-in-out
               scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100
               dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
  >
    {casts.map((cast) => (
      <option 
        key={cast._id} 
        value={cast._id}
        className="py-2 px-3 hover:bg-blue-50 dark:hover:bg-gray-700"
      >
        {`${cast.name} - ${cast.type}`}
      </option>
    ))}
  </select>
</div>

  {/* Selected Casts Display */}
  <div className="mt-4">
    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
      Selected Cast Members:
    </div>
    <div className="flex flex-wrap gap-2">
      <SelectedCastsDisplay 
        selectedCasts={formData.cast_ids} 
        casts={casts} 
        className="bg-blue-50 dark:bg-gray-700 rounded-full px-3 py-1 text-sm
                   flex items-center gap-2 transition-all duration-200"
      />
    </div>
  </div>

  {/* Error Message (if needed) */}
  {formData.cast_ids?.length === 0 && (
    <p className="text-red-500 text-sm mt-1">
      Please select at least one cast member
    </p>
  )}
</div>

    <div>
      <label className="block mb-1 font-semibold">Language<span className="text-red-500">*</span></label>
      <select 
        name="language_id" 
        value={formData.language_id}
        onChange={handleInputChange} 
        required 
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="">Select Language</option>
        {languages.map((language) => (
          <option key={language._id} value={language._id}>{language.name}</option>
        ))}
      </select>
      </div>
    
 <div className="mb-6">
  <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
    Producer<span className="text-red-500">*</span>
  </label>
  <select
    name="producer_id"
    value={formData.producer_id}
    onChange={handleInputChange}
    required
    className="w-full p-3 border rounded-md bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
  >
    <option value="">Select Producer</option>
    {producers.map((producer) => (
      <option key={producer._id} value={producer._id}>
        {producer.user_name}
      </option>
    ))}
  </select>
</div> 

{/* Upload Files */}
<h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Upload Files</h3>

{/* Thumbnail and Landscape */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  {["thumbnail", "landscape"].map((type) => (
    <div key={type}>
      <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 capitalize">
        {type}
        <span className="text-red-500">*</span>
      </label>
      <input
        type="file"
        name={type}
        onChange={handleFileChange}
        className="w-full p-3 border border-blue-300 rounded-md bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 
          focus:bg-blue-500 focus:border-blue-500 focus:text-white 
          file:bg-white dark:file:bg-gray-700 file:text-blue-500 dark:file:text-white file:font-semibold file:border-0 file:mr-4"
      />
    </div>
  ))}
</div>

{/* Video Files */}
<h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Video Files</h4>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

{[320, 480, 720, 1080].map((resolution) => (
  <div key={resolution}>
    <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
      Video {resolution}p
      {resolution === 320 && (
        <span className="text-red-500">*</span>
      )}
    </label>
    <input
      type="file"
      // Fix this line - remove the boolean comparison
      name={`video_${resolution}`} // Changed from video_${resolution == 320}
      onChange={handleFileChange}
      className="w-full p-3 border border-blue-300 rounded-md bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 
        focus:bg-blue-500 focus:border-blue-500 focus:text-white 
        file:bg-white dark:file:bg-gray-700 file:text-blue-500 dark:file:text-white file:font-semibold file:border-0 file:mr-4"
    />
  </div>
))}

</div>

{/* Trailer */}
<div className="mb-6">
  <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
    Trailer<span className="text-red-500"></span>
  </label>
  <input
    type="file"
    name="trailer"
    onChange={handleFileChange}
    className="w-full p-3 border border-blue-300 rounded-md bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 
      focus:bg-blue-500 focus:border-blue-500 focus:text-white 
      file:bg-white dark:file:bg-gray-700 file:text-blue-500 dark:file:text-white file:font-semibold file:border-0 file:mr-4"
  />
</div>

{/* Subtitles */}
<h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Subtitles</h4>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
  {[1, 2, 3].map((num) => (
    <div key={num}>
      <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
        Subtitle {num}
      </label>
      <div className="space-y-2">
        <input
          type="text"
          name={`subtitle_lang_${num}`}
          value={formData[`subtitle_lang_${num}`]}
          onChange={handleInputChange}
          placeholder="Language (e.g. English)"
          className="w-full p-3 border rounded-md bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <input
          type="file"
          name={`subtitle_${num}`}
          onChange={handleFileChange}
          className="w-full p-3 border border-blue-300 rounded-md bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 
            focus:bg-blue-500 focus:border-blue-500 focus:text-white 
            file:bg-white dark:file:bg-gray-700 file:text-blue-500 dark:file:text-white file:font-semibold file:border-0 file:mr-4"
        />
      </div>
    </div>
  ))}
</div>

{/* Submit Button */}
<div className="text-center">
  <button
    type="submit"
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md disabled:opacity-50"
    disabled={loading}
  >
    {loading ? "Submitting..." : "Submit Video"}
  </button>
</div>

</form>
  );
};

export default AddVideoForm;