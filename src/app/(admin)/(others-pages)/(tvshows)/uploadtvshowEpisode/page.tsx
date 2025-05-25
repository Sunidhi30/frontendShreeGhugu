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
      
      const response = await axios.get('https://shreejighutargo21.onrender.com/api/vendors/tvshows', {
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

    axios.get(`https://shreejighutargo21.onrender.com/api/vendors/tvshows/${selectedShowId}/seasons`, {
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
        'https://shreejighutargo21.onrender.com/api/vendors/tv-episodes',
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
      {/* <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload Episode</h1> */}
        
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Upload Episode</h1>

      <form onSubmit={handleSubmit}>
        {/* TV Show and Season Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Select TV Show<span className="text-red-500">*</span>
            </label>
            <select
              value={selectedShowId}
              onChange={(e) => setSelectedShowId(e.target.value)}
              required
              className="w-full p-3 border border-blue-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Choose a TV Show</option>
              {tvShows.map((show) => (
                <option key={show._id} value={show._id}>{show.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Select Season<span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSeasonId}
              onChange={(e) => setSelectedSeasonId(e.target.value)}
              required
              disabled={!selectedShowId}
              className="w-full p-3 border border-blue-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:dark:bg-gray-700"
            >
              <option value="">Choose a Season</option>
              {seasons.map((season) => (
                <option key={season._id} value={season._id}>{season.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Episode Details */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Episode Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Episode Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={episodeData.title}
                onChange={handleChange}
                required
                className="w-full p-3 border border-blue-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Episode Number<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="episode_number"
                value={episodeData.episode_number}
                onChange={handleChange}
                required
                className="w-full p-3 border border-blue-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Release Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="release_date"
                value={episodeData.release_date}
                onChange={handleChange}
                required
                className="w-full p-3 border border-blue-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Description<span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={episodeData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full p-3 border border-blue-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Media Files */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Media Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(files).map(([key]) => (
              <div key={key}>
                <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200 capitalize">
                  {key.replace(/_/g, ' ')}{key === 'thumbnail' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  name={key}
                  onChange={handleFileChange}
                  accept={key.includes('video') ? 'video/*' : 'image/*'}
                  required={key === 'thumbnail'}
                  className="w-full p-3 border border-blue-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-600 
                    file:bg-blue-50 dark:file:bg-gray-700 file:text-blue-500 dark:file:text-white file:font-semibold file:border-0 file:mr-4"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
          >
            Upload Episode
          </button>
        </div>
      </form>
    </div>
  </div>


      </div>
  );
}