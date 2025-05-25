

'use client';

import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UploadSeasonForm() {
  const [seasons, setSeasons] = useState([{ title: '', description: '', releaseDate: '' }]);
  const [seriesList, setSeriesList] = useState([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState('');
  const [relatedSeasons, setRelatedSeasons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all series on load
  useEffect(() => {
    const fetchSeries = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('https://shreejighutargo21.onrender.com/api/vendors/series', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSeriesList(response.data.series);
      } catch (error) {
        toast.error('Failed to fetch series');
      }
    };

    fetchSeries();
  }, []);

  // Fetch seasons when a series is selected
 

 // In your useEffect for fetching seasons, add the token:
useEffect(() => {
  const fetchSeasons = async () => {
    const token = localStorage.getItem('token'); // Add this line
    if (!selectedSeriesId) {
      setRelatedSeasons([]);
      return;
    }
    if (!token) return; // Add this check

    try {
      const response = await axios.get(`https://shreejighutargo21.onrender.com/api/vendors/seasons/${selectedSeriesId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched seasons:", response.data);
      setRelatedSeasons(response.data.seasons);
    } catch (error) {
      console.error('Error fetching seasons:', error); // Add error logging
      toast.error('Failed to fetch related seasons');
    }
  };

  fetchSeasons();
}, [selectedSeriesId]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[index] = {
      ...updatedSeasons[index],
      [e.target.name]: e.target.value,
    };
    setSeasons(updatedSeasons);
  };

  const addSeason = () => {
    setSeasons([...seasons, { title: '', description: '', releaseDate: '' }]);
  };

  const removeSeason = (index: number) => {
    setSeasons(seasons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('User is not authenticated!');
      return;
    }
    if (!selectedSeriesId) {
      toast.warning('Please select a TV series.');
      return;
    }

    setIsLoading(true);
    try {
      for (let i = 0; i < seasons.length; i++) {
        const season = seasons[i];
        await axios.post(
          `https://shreejighutargo21.onrender.com/api/vendors/series/${selectedSeriesId}/seasons`,
          {
            seasonNumber: i + 1,
            title: season.title,
            description: season.description,
            releaseDate: season.releaseDate,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      toast.success('Seasons added successfully!');
      setSeasons([{ title: '', description: '', releaseDate: '' }]);
    } catch (error) {
      toast.error('Failed to add seasons.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Upload TV Show Seasons
          </h2>

          {/* Series Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select TV Series
            </label>
            <select
              value={selectedSeriesId}
              onChange={(e) => setSelectedSeriesId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select a series --</option>
              {seriesList.map((series: any) => (
                <option key={series._id} value={series._id}>
                  {series.title}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-h-[60vh] overflow-y-auto">
            <AnimatePresence>
              {seasons.map((season, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md border border-gray-300 dark:border-gray-600"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white">
                      Season {index + 1}
                    </h3>
                    {seasons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSeason(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      name="title"
                      placeholder="Season Title"
                      value={season.title}
                      onChange={(e) => handleChange(index, e)}
                      required
                      className="w-full px-3 py-2 rounded border dark:bg-gray-600 dark:text-white"
                    />

                    <textarea
                      name="description"
                      placeholder="Description"
                      value={season.description}
                      onChange={(e) => handleChange(index, e)}
                      rows={2}
                      className="w-full px-3 py-2 rounded border dark:bg-gray-600 dark:text-white"
                    />

                    <input
                      type="date"
                      name="releaseDate"
                      value={season.releaseDate}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-3 py-2 rounded border dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={addSeason}
                className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Add Season
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit All'}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Right Section: Show series list and seasons */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-y-auto max-h-[80vh]">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Series & Seasons</h3>

          <ul className="space-y-2">
            {seriesList.map((series: any) => (
              <li
                key={series._id}
                onClick={() => setSelectedSeriesId(series._id)}
                className={`cursor-pointer px-4 py-2 rounded ${
                  selectedSeriesId === series._id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                {series.title}
              </li>
            ))}
          </ul>

          {relatedSeasons.length > 0 && (
            <>
              <h4 className="mt-6 text-lg font-semibold text-gray-800 dark:text-white">Seasons</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {relatedSeasons.map((season: any, i) => (
                  <li
                    key={season._id}
                    className="bg-gray-100 dark:bg-gray-600 p-2 rounded text-gray-900 dark:text-white"
                  >
                    S{i + 1}: {season.title} ({new Date(season.releaseDate).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}
