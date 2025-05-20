'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

interface Channel {
  _id: string;
  name: string;
}

const UploadTVShowPage = () => {
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
  const [loading, setLoading] = useState(false);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    
    if (storedToken) {
      fetchChannels(storedToken);
    } else {
      setMessage('❌ No authentication token found. Please login.');
      setChannelsLoading(false);
    }
  }, []);

  const fetchChannels = async (token: string) => {
    setChannelsLoading(true);
    try {
      const response = await axios.get('http://localhost:9000/api/vendors/get-channels', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.channels) {
        setChannels(response.data.channels);
        setMessage(response.data.channels.length === 0 ? '❌ No channels available' : '');
      } else {
        setMessage('❌ Invalid channel data received');
      }
    } catch (error: any) {
      console.error('Channel fetch error:', error);
      setMessage(
        error.response?.status === 401 
          ? '❌ Authentication failed. Please login again.'
          : '❌ Failed to load channels. Please try again.'
      );
    } finally {
      setChannelsLoading(false);
    }
  };

  const handleChange = (
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

  const validateForm = () => {
    if (!formData.title.trim()) {
      setMessage('❌ Title is required');
      return false;
    }
    if (!formData.channel_id) {
      setMessage('❌ Please select a channel');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setMessage('❌ Authentication token not found. Please login again.');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    const formPayload = new FormData();
    
    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formPayload.append(key, value);
    });

    // Append files
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
        // Store the TV show ID for later use (e.g., adding seasons)
        localStorage.setItem('currentTVShowId', response.data.tvShow._id);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category_id: '',
          releaseYear: '',
          totalSeasons: '',
          status: 'ongoing',
          tags: '',
          channel_id: ''
        });
        setThumbnail(null);
        setLandscape(null);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setMessage(
        error.response?.data?.error || 
        '❌ Failed to upload TV Show. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Upload New TV Show</h1>

      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('❌') 
            ? 'bg-red-50 text-red-600' 
            : 'bg-green-50 text-green-600'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Channel Selection */}
        <div>
          <label className="block mb-1 font-medium">Select Channel *</label>
          <select
            name="channel_id"
            value={formData.channel_id}
            onChange={handleChange}
            required
            disabled={channelsLoading}
            className="w-full p-2 border rounded"
          >
            <option value="">
              {channelsLoading ? 'Loading channels...' : 'Select a channel'}
            </option>
            {channels.map(channel => (
              <option key={channel._id} value={channel._id}>
                {channel.name}
              </option>
            ))}
          </select>
        </div>

        <input
          name="title"
          placeholder="Title *"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="category_id"
          placeholder="Category ID"
          value={formData.category_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="releaseYear"
          placeholder="Release Year"
          value={formData.releaseYear}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="totalSeasons"
          placeholder="Total Seasons"
          value={formData.totalSeasons}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>

        <input
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <div>
          <label className="block mb-1 font-medium">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'thumbnail')}
            className="w-full p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Landscape Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'landscape')}
            className="w-full p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !token || !formData.channel_id}
        >
          {loading ? 'Uploading...' : 'Upload TV Show'}
        </button>
      </form>
    </div>
  )
}

export default UploadTVShowPage
