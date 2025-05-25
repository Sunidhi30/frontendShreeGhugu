
'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiFilm,
  FiLayers,
  FiPlus,
  FiSave,
  FiSearch,
  FiTrash2,
  FiTv,
  FiX
} from 'react-icons/fi';

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
  status?: string;
  releaseYear?: string;
  totalSeasons?: string;
  tags?: string;
}

interface Channel {
  _id: string;
  name: string;
}

interface Season {
  name: string;
  description: string;
}

interface ExistingSeason {
  _id: string;
  name: string;
  description: string;
  show_id: string;
}

// interface PaginationData {
//   total: number;
//   page: number;
//   totalPages: number;
//   hasNextPage: boolean;
//   hasPrevPage: boolean;
//   limit: number;
// }

export default function UploadSeasonForm() {
  // State for TV shows and channels
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [selectedShowId, setSelectedShowId] = useState('');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [existingSeasons, setExistingSeasons] = useState<ExistingSeason[]>([]);
  const [loadingSeasons, setLoadingSeasons] = useState(false);
  const [expandedSeasonId, setExpandedSeasonId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Pagination
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });

  // State for seasons form
  const [seasons, setSeasons] = useState<Season[]>([{
    name: '',
    description: ''
  }]);

  // Fetch TV shows on component mount and when page changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchChannels(token);
      fetchTVShows();
    }
  }, [pagination.page, selectedChannel]);

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
        if (response.data.channels.length > 0 && !selectedChannel) {
          setSelectedChannel(response.data.channels[0]._id);
        }
      }
    } catch (error: any) {
      setError('Failed to fetch channels');
      console.error('Channel fetch error:', error);
    }
  };

  const fetchTVShows = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found!');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const params: any = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (selectedChannel) {
        params.channel_id = selectedChannel;
      }
      
      const response = await axios.get('https://shreejighutargo21.onrender.com/api/vendors/tvshows', {
        params,
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

  const fetchExistingSeasons = async (showId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoadingSeasons(true);
      const response = await axios.get(
        `https://shreejighutargo21.onrender.com/api/vendors/tvshows/${showId}/seasons`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setExistingSeasons(response.data.seasons);
      }
    } catch (error: any) {
      console.error('Failed to fetch existing seasons:', error);
      setError(error.response?.data?.error || 'Failed to fetch seasons');
    } finally {
      setLoadingSeasons(false);
    }
  };

  const handleShowSelect = (showId: string) => {
    setSelectedShowId(showId);
    if (showId) {
      fetchExistingSeasons(showId);
    } else {
      setExistingSeasons([]);
    }
  };

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
    setSelectedShowId('');
    setExistingSeasons([]);
  };

  const handleSeasonChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[index] = {
      ...updatedSeasons[index],
      [e.target.name]: e.target.value
    };
    setSeasons(updatedSeasons);
  };

  const toggleSeasonExpansion = (seasonId: string) => {
    setExpandedSeasonId(expandedSeasonId === seasonId ? null : seasonId);
  };

  const addSeason = () => {
    setSeasons([...seasons, { name: '', description: '' }]);
  };

  const removeSeason = (index: number) => {
    const updatedSeasons = seasons.filter((_, i) => i !== index);
    setSeasons(updatedSeasons);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('User is not authenticated!');
      return;
    }

    if (!selectedShowId) {
      setError('Please select a TV show first.');
      return;
    }

    try {
      const response = await axios.post(
        `https://shreejighutargo21.onrender.com/api/vendors/tvshows/${selectedShowId}/seasons`,
        { seasons },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setError('✅ Seasons added successfully!');
        // Reset form
        setSeasons([{ name: '', description: '' }]);
        // Refresh existing seasons
        fetchExistingSeasons(selectedShowId);
        // Hide the form after successful submission
        setShowAddForm(false);
      }
    } catch (error: any) {
      console.error('Failed to add seasons:', error);
      setError(error.response?.data?.error || 'Failed to add seasons');
    }
  };

  // Filtered TV shows based on search term
  const filteredTVShows = tvShows.filter(show => 
    show.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered channels based on search term
  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with TV Shows and Add Season Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            TV Shows
          </h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`
              flex items-center justify-center px-6 py-3 rounded-lg 
              transition-all transform hover:scale-105 
              ${showAddForm 
                ? 'bg-gray-500 hover:bg-gray-600' 
                : 'bg-blue-500 hover:bg-blue-600'} 
              text-white shadow-lg
              ${!selectedShowId ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={!selectedShowId}
          >
            {showAddForm ? (
              <>
                <FiX className="mr-2" /> Cancel
              </>
            ) : (
              <>
                <FiPlus className="mr-2" /> Add New Season
              </>
            )}
          </button>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            error.includes('✅') 
              ? 'bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-200'
              : 'bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-200'
          }`}>
            {error.includes('✅') ? <FiCheckCircle className="mr-2" /> : <FiAlertCircle className="mr-2" />}
            {error}
          </div>
        )}

        {/* Search and Channel Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search TV shows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Channel Selection */}
          <div className="mb-6">
            {/* <label className="block text-lg font-semibold mb-3 dark:text-white">
              Select Channel
            </label> */}
            <div className="flex flex-wrap gap-3">
              {filteredChannels.map(channel => (
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
              {filteredChannels.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 p-2">
                  No channels found matching "{searchTerm}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* TV Shows Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {filteredTVShows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredTVShows.map(show => (
                  <div 
                    key={show._id} 
                    className={`
                      bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
                      transition-all transform hover:scale-105 cursor-pointer
                      ${selectedShowId === show._id ? 'ring-2 ring-blue-500' : ''}
                    `}
                    onClick={() => handleShowSelect(show._id)}
                  >
                    {/* Show Thumbnail */}
                    <div className="relative h-48">
                      {show.thumbnail ? (
                        <img 
                          src={show.thumbnail} 
                          alt={show.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                          <FiTv size={48} className="text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    {/* Show Details */}
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium">Seasons:</span> {existingSeasons.length > 0 && selectedShowId === show._id ? existingSeasons.length : show.totalSeasons || '0'}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Status:</span> {show.status || 'N/A'}
                          </p>
                          {show.status && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              show.status === 'ongoing' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {show.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              selectedChannel && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8">
                  <div className="text-6xl mb-4">📺</div>
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                    No TV Shows Found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    There are no TV shows available for this channel yet.
                  </p>
                </div>
              )
            )}
          </>
        )}

        {/* Pagination */}
        {/* {filteredTVShows.length > 0 && (
          <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={!pagination.hasPrevPage || loading}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow 
                hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                text-gray-700 dark:text-gray-200 flex items-center"
            >
              <FiChevronLeft className="mr-2" /> Previous
            </button>
            
            <span className="font-medium dark:text-white">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
              disabled={!pagination.hasNextPage || loading}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow 
                hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                text-gray-700 dark:text-gray-200 flex items-center"
            >
              Next <FiChevronRight className="ml-2" />
            </button>
          </div>
        )} */}

        {/* Existing Seasons Display */}
        {selectedShowId && existingSeasons.length > 0 && !showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 dark:text-white flex items-center">
              <FiLayers className="mr-2" /> 
              Seasons for {tvShows.find(show => show._id === selectedShowId)?.title}
            </h2>
              
            {loadingSeasons ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {existingSeasons.map((season) => (
                  <div 
                    key={season._id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <button
                      onClick={() => toggleSeasonExpansion(season._id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <h3 className="text-lg font-medium dark:text-white">
                        {season.name}
                      </h3>
                      {expandedSeasonId === season._id ? (
                        <FiChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FiChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {expandedSeasonId === season._id && (
                      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300">
                          {season.description || 'No description available'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Season Form */}
        {selectedShowId && showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white flex items-center">
              <FiPlus className="mr-2" /> 
              Add Seasons to {tvShows.find(show => show._id === selectedShowId)?.title}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {seasons.map((season, index) => (
                <div key={index} 
                  className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl
                    bg-gray-50 dark:bg-gray-700/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold dark:text-white flex items-center">
                      <FiFilm className="mr-2" /> Season {index + 1}
                    </h3>
                    {seasons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSeason(index)}
                        className="text-red-500 hover:text-red-600 dark:text-red-400
                          flex items-center transition-colors"
                      >
                        <FiTrash2 className="mr-1" /> Remove
                      </button>
                    )}
                  </div>

                  <input
                    name="name"
                    placeholder="Season Name"
                    value={season.name}
                    onChange={(e) => handleSeasonChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    required
                  />
                  
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={season.description}
                    onChange={(e) => handleSeasonChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      dark:bg-gray-600 dark:border-gray-500 dark:text-white
                      min-h-[100px]"
                  />
                </div>
              ))}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={addSeason}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200
                    px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600
                    transition-colors flex items-center justify-center"
                >
                  <FiPlus className="mr-2" /> Add Another Season
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg
                    hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <FiSave className="mr-2" /> Save All Seasons
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}