
'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiPlus, FiTv, FiUpload, FiX } from 'react-icons/fi';

interface Channel {
  _id: string;
  name: string;
}

interface TVShow {
  _id: string;
  title: string;
  description: string;
  channel_id: {
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

const TVShowsList = () => {
  // List view state
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Upload form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    releaseYear: '',
    totalSeasons: '',
    status: 'ongoing',
    tags: '',
    channel_id: ''
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [landscape, setLandscape] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    
    if (storedToken) {
      fetchChannels(storedToken);
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
      }
    } catch (error: any) {
      setError('Failed to fetch channels');
      console.error('Channel fetch error:', error);
    }
  };

  const fetchTVShows = async (channelId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:9000/api/vendors/tvshows`, {
        params: {
          channel_id: channelId
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.data) {
        setTvShows(response.data.data.tvShows);
        setError('');
      }
    } catch (error: any) {
      setError('Failed to fetch TV shows');
      console.error('TV Shows fetch error:', error);
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
    type: 'thumbnail' | 'landscape'
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'thumbnail') setThumbnail(e.target.files[0]);
      else setLandscape(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setMessage('❌ Authentication token not found');
      return;
    }

    if (!formData.title.trim() || !selectedChannel) {
      setMessage('❌ Title and channel are required');
      return;
    }

    setUploadLoading(true);
    const formPayload = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formPayload.append(key, value);
    });

    if (thumbnail) formPayload.append('thumbnail', thumbnail);
    if (landscape) formPayload.append('landscape', landscape);

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
          category_id: '',
          releaseYear: '',
          totalSeasons: '',
          status: 'ongoing',
          tags: '',
          channel_id: selectedChannel
        });
        setThumbnail(null);
        setLandscape(null);
      }
    } catch (error: any) {
      setMessage('❌ Failed to upload TV Show');
      console.error('Upload error:', error);
    } finally {
      setUploadLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            TV Shows Management
          </h1>
          
          {/* Channel Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Select Channel
            </h2>
            <div className="flex flex-wrap gap-3">
              {channels.map(channel => (
                <button
                  key={channel._id}
                  onClick={() => handleChannelSelect(channel._id)}
                  className={`
                    px-4 py-2 rounded-lg transition-all transform hover:scale-105
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
            </div>
          </div>
        </div>

        {/* Add New Show Button */}
        {selectedChannel && (
          <div className="mb-8">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className={`
                flex items-center justify-center px-6 py-3 rounded-lg transition-all transform hover:scale-105
                ${showUploadForm
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
                } text-white shadow-lg
              `}
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
        )}

        {/* Upload Form */}
        {showUploadForm && selectedChannel && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all animate-fadeIn">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form fields with improved styling */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    Title *
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Additional form fields */}
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    Release Year
                  </label>
                  <input
                    name="releaseYear"
                    type="number"
                    value={formData.releaseYear}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    Total Seasons
                  </label>
                  <input
                    name="totalSeasons"
                    type="number"
                    value={formData.totalSeasons}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* File uploads with preview */}
                <div className="col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Thumbnail Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'thumbnail')}
                        className="flex-1 p-2 border border-gray-300 rounded-lg dark:text-white dark:border-gray-600"
                      />
                      {thumbnail && (
                        <img
                          src={URL.createObjectURL(thumbnail)}
                          alt="Thumbnail preview"
                          className="h-16 w-16 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Landscape Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'landscape')}
                        className="flex-1 p-2 border border-gray-300 rounded-lg dark:text-white dark:border-gray-600"
                      />
                      {landscape && (
                        <img
                          src={URL.createObjectURL(landscape)}
                          alt="Landscape preview"
                          className="h-16 w-24 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all transform hover:scale-105 font-medium text-lg flex items-center justify-center"
                disabled={uploadLoading || !token || !selectedChannel}
              >
                {uploadLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  <>
                    <FiUpload className="mr-2" /> Upload TV Show
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TV Shows Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                <FiX className="mr-2" /> {error}
              </div>
            )}

            {tvShows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tvShows.map(show => (
                  <div 
                    key={show._id} 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all transform hover:scale-105"
                  >
                    {show.thumbnail && (
                      <div className="relative h-48">
                        <img 
                          src={show.thumbnail} 
                          alt={show.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 dark:text-white">
                        {show.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {show.description}
                      </p>
                      <div className="space-y-2">
                        {show.releaseYear && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Year:</span> {show.releaseYear}
                          </p>
                        )}
                        {show.totalSeasons && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Seasons:</span> {show.totalSeasons}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Status:</span> {show.status}
                          </p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            show.status === 'ongoing' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {show.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              selectedChannel && (
                <div className="text-center py-12 text-gray-600 dark:text-gray-300">
                  No TV shows found for this channel.
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TVShowsList;
