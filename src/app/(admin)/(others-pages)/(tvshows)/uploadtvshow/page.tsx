
'use client';

import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FiPlus, FiSearch, FiTv, FiUpload, FiX } from 'react-icons/fi';

interface Channel {
  _id: string;
  name: string;
}
interface Type {
  _id: string;
  name: string;
  type: number;
  status: number;
}






interface TVShow {
  _id: string;
  title: string;
  description: string;
  channel_id: {
    _id: string;
    name: string;
  };
  category_id?: {
    _id: string;
    name: string;
  };
  video_type: string;
  language_id: {
    _id: string;
    name: string;
  };
  thumbnail?: string;
  landscape?: string;
  status: string;
  releaseYear?: string;
  totalSeasons?: string;
  tags?: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Language {
  _id: string;
  name: string;
}

// Video type options
const VIDEO_TYPES = ['movie', 'series', 'show'] as const;
type VideoType = typeof VIDEO_TYPES[number];

const TVShowsList = () => {
  // List view state
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [types, setTypes] = useState<Type[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  
  // Upload form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    releaseYear: '',
    totalSeasons: '',
    type_id:'',
    status: 'ongoing',
    tags: '',
    channel_id: '',
    video_type: '',
    language_id: ''
  });

  // File upload states
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [landscape, setLandscape] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  
  // Upload status states
  const [uploadLoading, setUploadLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCategories = async (authToken: string) => {
    try {
      console.log('🔄 Fetching categories...');
      const response = await axios.get('http://localhost:9000/api/admin/get_categories', {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 Categories API Response:', response.data);
      
      if (response.data && response.data.data) {
        // Update this line to access the correct data structure
        setCategories(response.data.data);
        console.log('✅ Categories loaded:', response.data.data);
      } else {
        console.warn('⚠️ Unexpected categories response structure:', response.data);
        setError('Categories data structure is unexpected');
      }
    } catch (error: any) {
      console.error('❌ Error fetching categories:', error);
      console.error('❌ Error response:', error.response?.data);
      setError(`Failed to fetch categories: ${error.response?.data?.message || error.message}`);
    }
  };
  

  const fetchTypes = async (authToken: string) => {
    try {
      console.log('🔄 Fetching types...');
      const response = await axios.get('http://localhost:9000/api/admin/get_types', {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 Types API Response:', response.data);
      
      if (response.data && response.data.data) {
        setTypes(response.data.data);
        console.log('✅ Types loaded:', response.data.data);
      } else {
        console.warn('⚠️ Unexpected types response structure:', response.data);
        setError('Types data structure is unexpected');
      }
    } catch (error: any) {
      console.error('❌ Error fetching types:', error);
      console.error('❌ Error response:', error.response?.data);
      setError(`Failed to fetch types: ${error.response?.data?.message || error.message}`);
    }
  };
  
  const fetchLanguages = async (authToken: string) => {
    try {
      console.log('Fetching languages...');
      const response = await axios.get('http://localhost:9000/api/admin/get_languages', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      console.log('Languages response:', response.data);
      
      if (response.data && response.data.data) {
        // Update this line to access the correct data structure
        setLanguages(response.data.data);
        console.log('Languages set:', response.data.data);
      } else {
        console.log('No languages found in response');
        setError('No languages found');
      }
    } catch (error: any) {
      console.error('Error fetching languages:', error);
      setError(`Failed to fetch languages: ${error.response?.data?.message || error.message}`);
    }
  };
  

  // Initial setup effect
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchChannels(storedToken);
      fetchCategories(storedToken);
      fetchTypes(storedToken); // Add this line
      fetchLanguages(storedToken);
    } else {
      setError('No authentication token found. Please log in.');
    }
  }, []);

  useEffect(() => {
    if (selectedChannel && token) {
      fetchTVShows(selectedChannel);
      setFormData(prev => ({ ...prev, channel_id: selectedChannel }));
    }
  }, [selectedChannel, token]);

  const fetchChannels = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:9000/api/vendors/get-channels', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data && response.data.channels) {
        setChannels(response.data.channels);
        // Select first channel by default
        if (response.data.channels.length > 0) {
          setSelectedChannel(response.data.channels[0]._id);
        }
      }
    } catch (error: any) {
      setError('Failed to fetch channels');
      console.error('Channel fetch error:', error);
    }
  };

  const fetchTVShows = async (channelId: string) => {
    setLoading(true);
    try {
      console.log('Fetching TV shows for channel:', channelId);
      const response = await axios.get(`http://localhost:9000/api/vendors/tvshows`, {
        params: {
          channel_id: channelId
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      console.log('TV Shows response:', response.data);
  
      if (response.data && response.data.data) {
        setTvShows(response.data.data.tvShows);
        setError('');
      } else {
        console.log('Unexpected response structure:', response.data);
        setError('Invalid response format');
      }
    } catch (error: any) {
      console.error('Full error:', error);
      setError('Failed to fetch TV shows');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'thumbnail' | 'landscape' | 'video'
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'thumbnail') setThumbnail(e.target.files[0]);
      else if (type === 'landscape') setLandscape(e.target.files[0]);
      else if (type === 'video') setVideo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setMessage('❌ Authentication token not found');
      return;
    }
  
    if (!formData.title || !formData.category_id || !formData.video_type || !formData.language_id) {
      setMessage('❌ Please fill in all required fields');
      return;
    }
  
    setUploadLoading(true);
    setMessage('');
    
    const formPayload = new FormData();
    
    // Append all form data
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formPayload.append(key, value);
    });
  
    // Append files if they exist
    if (thumbnail) formPayload.append('thumbnail', thumbnail);
    if (landscape) formPayload.append('landscape', landscape);
    if (video) formPayload.append('video', video);
  
    try {
      const response = await axios.post(
        'http://localhost:9000/api/vendors/tvshows',
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      if (response.data.success) {
        setMessage('✅ TV Show uploaded successfully');
        setShowUploadForm(false);
        fetchTVShows(selectedChannel);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          type_id: '',
          category_id: '',
          releaseYear: '',
          totalSeasons: '',
          status: 'ongoing',
          tags: '',
          channel_id: selectedChannel,
          video_type: '',
          language_id: ''
        });
        setThumbnail(null);
        setLandscape(null);
        setVideo(null);
      }
    } catch (error: any) {
      setMessage(`❌ Failed to upload TV Show: ${error.response?.data?.error || error.message}`);
      console.error('Upload error:', error);
    } finally {
      setUploadLoading(false);
    }
  };

  // Filter channels based on search
  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Add New TV Show button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            TV Shows
          </h1>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className={`
              flex items-center justify-center px-5 sm:px-6 py-3 rounded-lg transition-all transform hover:scale-105
              bg-blue-600 hover:bg-blue-700 text-white shadow-lg
              focus:outline-none focus:ring-4 focus:ring-blue-400
              ${!selectedChannel ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
            `}
            disabled={!selectedChannel}
          >
            {showUploadForm ? (
              <>
                <FiX className="mr-2" /> Cancel Upload
              </>
            ) : (
              <>
                <FiPlus className="mr-2" /> Add New TV Show
              </>
            )}
          </button>
        </div>

        {/* Debug Information */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Debug Info:</h3>
            <div className="text-sm text-yellow-700">
              <p>Categories loaded: {categories.length}</p>
              <p>Languages loaded: {languages.length}</p>
              <p>Token exists: {token ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}

        {/* Global Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Channel Selection with Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-6 shadow-lg mb-8">
          <div className="mb-5 w-full relative">
            <input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            {filteredChannels.map(channel => (
              <button
                key={channel._id}
                onClick={() => handleChannelSelect(channel._id)}
                className={`
                  px-4 py-2 rounded-lg transition-all transform hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-blue-400
                  ${selectedChannel === channel._id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                <FiTv className="inline-block mr-2" />
                {channel.name}
              </button>
            ))}
            {filteredChannels.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 p-3 w-full">
                No channels found matching "{searchTerm}"
              </p>
            )}
          </div>
        </div>


        {/* Upload Form */}
        {showUploadForm && selectedChannel && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all animate-fadeIn max-w-full overflow-auto">
            <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center">
              <FiUpload className="mr-2" /> Upload New TV Show
            </h2>

            {message && (
              <div className={`mb-6 p-4 rounded-lg flex items-center ${
                message.includes('❌') 
                  ? 'bg-red-50 text-red-600' 
                  : 'bg-green-50 text-green-600'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    Title *
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                    placeholder="Enter TV show title"
                  />
                </div>

            
<div>
  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
    Category * ({categories.length} available)
  </label>
  <select
    name="category_id"
    value={formData.category_id}
    onChange={handleFormChange}
    required
    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
  >
    <option value="">Select Category</option>
    {categories && categories.map(category => (
      <option key={category._id} value={category._id}>
        {category.name}
      </option>
    ))}
  </select>
  {/* Debug information */}
  {process.env.NODE_ENV === 'development' && (
    <div className="mt-1 text-xs text-gray-500">
      <p>Available categories:</p>
      <ul className="list-disc pl-4">
        {categories.map(cat => (
          <li key={cat._id}>{cat.name} (ID: {cat._id})</li>
        ))}
      </ul>
    </div>
  )}
  {categories.length === 0 && (
    <p className="text-red-500 text-sm mt-1">
      No categories loaded. Check your API connection.
    </p>
  )}
</div>


                {/* Video Type Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    Video Type *
                  </label>
                  <select
                    name="video_type"
                    value={formData.video_type}
                    onChange={handleFormChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  >
                    <option value="">Select Video Type</option>
                    {VIDEO_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    Language * ({languages.length} available)
                  </label>
                  <select
                    name="language_id"
                    value={formData.language_id}
                    onChange={handleFormChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  >
                    <option value="">Select Language</option>
                    {languages && languages.map(language => (
                      <option key={language._id} value={language._id}>
                        {language.name}
                      </option>
                    ))}
                  </select>
                  {languages.length === 0 && (
                    <p className="text-red-500 text-sm mt-1">No languages loaded. Check your API connection.</p>
                  )}
                </div>
                        {/* Type Selection */}
<div>
  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
    Type * ({types.length} available)
  </label>
  <select
    name="type_id"
    value={formData.type_id}
    onChange={handleFormChange}
    required
    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
  >
    <option value="">Select Type</option>
    {types && types.map(type => (
      <option key={type._id} value={type._id}>
        {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
      </option>
    ))}
  </select>
  {/* Debug information */}
  {process.env.NODE_ENV === 'development' && (
    <div className="mt-1 text-xs text-gray-500">
      <p>Available types:</p>
      <ul className="list-disc pl-4">
        {types.map(type => (
          <li key={type._id}>{type.name} (ID: {type._id})</li>
        ))}
      </ul>
    </div>
  )}
  {types.length === 0 && (
    <p className="text-red-500 text-sm mt-1">
      No types loaded. Check your API connection.
    </p>
  )}
</div>


                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                    placeholder="Enter TV show description"
                  />
                </div>

                {/* Release Year */}
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    Release Year
                  </label>
                  <input
                    name="releaseYear"
                    type="number"
                    value={formData.releaseYear}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                    placeholder="Enter release year"
                  />
                </div>

                {/* Total Seasons */}
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    Total Seasons
                  </label>
                  <input
                    name="totalSeasons"
                    type="number"
                    value={formData.totalSeasons}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                    placeholder="Enter total seasons"
                  />
                </div>

                {/* Tags */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    Tags
                  </label>
                  <input
                    name="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                    placeholder="Enter tags (comma separated)"
                  />
                </div>

                {/* File uploads */}
                <div className="sm:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Thumbnail Image
                    </label>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'thumbnail')}
                        className="flex-1 p-2 border border-gray-300 rounded-lg dark:text-white dark:border-gray-600"
                      />
                      {thumbnail && (
                        <Image
                          src={URL.createObjectURL(thumbnail)}
                          alt="Thumbnail preview"
                          width={64}
                          height={64}
                          className="h-16 w-16 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Landscape Image
                    </label>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'landscape')}
                        className="flex-1 p-2 border border-gray-300 rounded-lg dark:text-white dark:border-gray-600"
                      />
                      {landscape && (
                        <Image
                          src={URL.createObjectURL(landscape)}
                          alt="Landscape preview"
                          width={112}
                          height={64}
                          className="h-16 w-28 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Video File
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange(e, 'video')}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:text-white dark:border-gray-600"
                    />
                    {video && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Selected: {video.name} ({(video.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={uploadLoading}
                  className={`
                    px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold
                    hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {uploadLoading ? 'Uploading...' : 'Upload TV Show'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TV Shows List Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            {selectedChannel ? `TV Shows for ${channels.find(c => c._id === selectedChannel)?.name}` : 'Select a Channel'}
          </h2>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading TV shows...</span>
            </div>
          )}

          {!loading && !error && tvShows.length === 0 && selectedChannel && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No TV shows found for this channel. Upload your first TV show!
            </div>
          )}

          {!loading && tvShows.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tvShows.map((show) => (
                <div key={show._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  {show.thumbnail && (
                    <div className="mb-3">
                      <Image
                        src={show.thumbnail}
                        alt={show.title}
                        width={300}
                        height={200}
                        className="w-full h-40 object-cover rounded"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">{show.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                    {show.description}
                  </p>
                  <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Status: {show.status}</span>
                      {show.releaseYear && <span>Year: {show.releaseYear}</span>}
                    </div>
                    {show.totalSeasons && (
                      <div>Seasons: {show.totalSeasons}</div>
                    )}
                    {show.category_id && (
                      <div>Category: {show.category_id.name}</div>
                    )}
                    {show.language_id && (
                      <div>Language: {show.language_id.name}</div>
                    )}
                    <div>Type: {show.video_type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TVShowsList;