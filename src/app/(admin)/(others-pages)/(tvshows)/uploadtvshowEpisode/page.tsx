'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface TVShow {
  _id: string;
  title: string;
  channel_id: {
    name: string;
  };
}

interface Season {
  _id: string;
  name: string;
  show_id: string;
}

interface PaginationData {
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export default function EpisodesPage() {
  // State for TV shows
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [selectedShowId, setSelectedShowId] = useState('');
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    
    total: 0,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });

  // Episode form data
  const [episodeData, setEpisodeData] = useState({
    title: '',
    description: '',
    episode_number: '',
    video_duration: '',
    video_upload_type: '',
    video_extension: '',
    release_date: '',
    is_premium: '0',
    is_rent: '0',
    price: '0',
    rent_day: '0',
    is_like: '0',
    is_comment: '0',
    tags: ''
  });

  // File states
  const [files, setFiles] = useState({
    thumbnail: null as File | null,
    landscape: null as File | null,
    video_320: null as File | null,
    video_480: null as File | null,
    video_720: null as File | null,
    video_1080: null as File | null,
    trailer: null as File | null,
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch TV shows
  useEffect(() => {
    fetchTVShows();
  }, [pagination.page]);

  const fetchTVShows = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found!');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:9000/api/vendors/tvshows', {
        params: {
          page: pagination.page,
          limit: pagination.limit
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setTvShows(response.data.data.tvShows);
        setPagination(prev => ({
          ...prev,
          ...response.data.data.pagination
        }));
      }
    } catch (error: any) {
      console.error('Failed to fetch TV shows:', error);
      setError(error.response?.data?.error || 'Failed to fetch TV shows');
    } finally {
      setLoading(false);
    }
  };

  // Fetch seasons when TV show is selected
  useEffect(() => {
    if (!selectedShowId || !token) {
      setSeasons([]);
      return;
    }

    axios.get(`http://localhost:9000/api/vendors/tvshows/${selectedShowId}/seasons`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.data.success) {
        setSeasons(response.data.seasons);
      }
    })
    .catch(error => {
      console.error('Error fetching seasons:', error);
      setSeasons([]);
    });
  }, [selectedShowId, token]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEpisodeData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle file changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setFiles(prev => ({ ...prev, [e.target.name]: e.target.files![0] }));
  };

  // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!token) return alert('Authentication required');
//     if (!selectedShowId) return alert('Please select a TV show');
//     if (!selectedSeasonId) return alert('Please select a season');

//     const formData = new FormData();

//     // Append basic data
//     formData.append('show_id', selectedShowId);
//     formData.append('season_id', selectedSeasonId);

//     // Append all episode data
//     Object.entries(episodeData).forEach(([key, value]) => {
//       formData.append(key, value);
//     });

//     // Append files
//     Object.entries(files).forEach(([key, file]) => {
//       if (file) formData.append(key, file);
//     });

//     try {
//       const response = await axios.post(
//         'http://localhost:9000/api/vendors/tv-episodes',
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       if (response.data.success) {
//         alert('Episode uploaded successfully!');
//         // Reset form
//         setEpisodeData({
//           title: '',
//           description: '',
//           episode_number: '',
//           video_duration: '',
//           video_upload_type: '',
//           video_extension: '',
//           release_date: '',
//           is_premium: '0',
//           is_rent: '0',
//           price: '0',
//           rent_day: '0',
//           is_like: '0',
//           is_comment: '0',
//           tags: ''
//         });
//         setFiles({
//           thumbnail: null,
//           landscape: null,
//           video_320: null,
//           video_480: null,
//           video_720: null,
//           video_1080: null,
//           trailer: null,
//         });
//       }
//     } catch (error: any) {
//       console.error('Upload error:', error);
//       alert(error.response?.data?.message || 'Failed to upload episode');
//     }
//   };
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Authentication required');
  
    const formData = new FormData();
  
    // Only append if values exist
    if (selectedShowId) formData.append('show_id', selectedShowId);
    if (selectedSeasonId) formData.append('season_id', selectedSeasonId);
  
    // Append non-empty episode data
    Object.entries(episodeData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
  
    // Append only existing files
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });
  
    try {
      const response = await axios.post(
        'http://localhost:9000/api/vendors/tv-episodes',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      if (response.data.success) {
        alert('Episode uploaded successfully!');
        // Reset form
        setEpisodeData({
          title: '',
          description: '',
          episode_number: '',
          video_duration: '',
          video_upload_type: '',
          video_extension: '',
          release_date: '',
          is_premium: '0',
          is_rent: '0',
          price: '0',
          rent_day: '0',
          is_like: '0',
          is_comment: '0',
          tags: ''
        });
        setFiles({
          thumbnail: null,
          landscape: null,
          video_320: null,
          video_480: null,
          video_720: null,
          video_1080: null,
          trailer: null,
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Failed to upload episode');
    }
  };

return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload Episode</h1>
  
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TV Show and Season Selection */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Select TV Show</label>
              <select
                value={selectedShowId}
                onChange={(e) => setSelectedShowId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Choose a TV Show</option>
                {tvShows.map((show) => (
                  <option key={show._id} value={show._id}>
                    {show.title}
                  </option>
                ))}
              </select>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Select Season</label>
              <select
                value={selectedSeasonId}
                onChange={(e) => setSelectedSeasonId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                disabled={!selectedShowId}
              >
                <option value="">Choose a Season</option>
                {seasons.map((season) => (
                  <option key={season._id} value={season._id}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
  
          {/* Episode Details */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Episode Title</label>
              <input
                type="text"
                name="title"
                value={episodeData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Episode Number</label>
              <input
                type="number"
                name="episode_number"
                value={episodeData.episode_number}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
  
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
              <textarea
                name="description"
                value={episodeData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Release Date</label>
              <input
                type="date"
                name="release_date"
                value={episodeData.release_date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Video Duration (seconds)</label>
              <input
                type="number"
                name="video_duration"
                value={episodeData.video_duration}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
  
          {/* Media Files */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Media Files</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Object.entries(files).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                  </label>
                  <input
                    type="file"
                    name={key}
                    onChange={handleFileChange}
                    accept={key.includes('video') ? 'video/*' : 'image/*'}
                    className="mt-1 block w-full text-gray-700 dark:text-gray-200"
                    required={key === 'thumbnail'}
                  />
                </div>
              ))}
            </div>
          </div>
  
          {/* Additional Settings */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Is Premium</label>
              <select
                name="is_premium"
                value={episodeData.is_premium}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Is Rentable</label>
              <select
                name="is_rent"
                value={episodeData.is_rent}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
  
            {episodeData.is_rent === "1" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={episodeData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Rent Days</label>
                  <input
                    type="number"
                    name="rent_day"
                    value={episodeData.rent_day}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>
  
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upload Episode
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}