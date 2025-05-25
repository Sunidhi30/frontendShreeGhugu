
'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiPlus, FiSearch, FiTv, FiUpload, FiX } from 'react-icons/fi';
import Image from 'next/image';
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
  const [searchTerm, setSearchTerm] = useState('');

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
  const [video, setVideo] = useState<File | null>(null); // Added missing video state
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
      const response = await axios.get('https://shreejighutargo21.onrender.com/api/vendors/get-channels', {
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
      const response = await axios.get(`https://shreejighutargo21.onrender.com/api/vendors/tvshows`, {
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
    type: 'thumbnail' | 'landscape' | 'video' // Added 'video' type
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'thumbnail') setThumbnail(e.target.files[0]);
      else if (type === 'landscape') setLandscape(e.target.files[0]);
      else if (type === 'video') setVideo(e.target.files[0]); // Added video handling
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
    if (video) formPayload.append('video', video); // Added video to form data

    try {
      const response = await axios.post(
        'https://shreejighutargo21.onrender.com/api/vendors/tvshows',
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
        setVideo(null); // Reset video state
      }
    } catch (error: any) {
      setMessage('❌ Failed to upload TV Show');
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

                {/* Tags */}
                <div>
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
                      <video
                        src={URL.createObjectURL(video)}
                        controls
                        className="mt-2 max-h-48 rounded"
                      />
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
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
                    <Image
                      src={show.thumbnail}
                      alt={show.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">{show.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                    {show.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>Status: {show.status}</span>
                    {show.releaseYear && <span>Year: {show.releaseYear}</span>}
                  </div>
                  {show.totalSeasons && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Seasons: {show.totalSeasons}
                    </div>
                  )}
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