
'use client';

import axios from 'axios';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface Video {
  _id: string;
  name: string;
  thumbnail: string;
  isApproved: boolean;
  finalPackage_id: {
    _id: string;
    name: string;
    price: number;
  };
  status: number;
  category_id: {
    name: string;
  };
}

const statusColors: Record<string, string> = {
  approved: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900',
  pending: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900',
  rejected: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900',
};

const RecentOrders: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoCount, setVideoCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [targetModalOpen, setTargetModalOpen] = useState<boolean>(false);
  const [targetInput, setTargetInput] = useState<string>('');
  const [targetError, setTargetError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vendor token is missing. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const [videosResponse, countResponse] = await Promise.all([
          axios.get('https://shreejighutargo21.onrender.com/api/vendors/videos', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://shreejighutargo21.onrender.com/api/vendors/vendor/video-count', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setVideos(videosResponse.data.videos || []);
        setVideoCount(Number(countResponse.data.videoCount) || 0);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError('Error fetching videos or video count. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getStatus = (video: Video) => {
    if (video.status === 0) return { label: 'Rejected', className: statusColors.rejected };
    return video.isApproved
      ? { label: 'Approved', className: statusColors.approved }
      : { label: 'Pending', className: statusColors.pending };
  };

  const handleTargetSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!targetInput || isNaN(Number(targetInput))) {
      setTargetError("Please enter a valid number.");
      return;
    }

    try {
      const response = await axios.post(
        "https://shreejighutargo21.onrender.com/api/vendors/set-target-videos",
        { target: Number(targetInput) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccessMessage(`Target set to ${response.data.monthly_target_videos}`);
        setTargetModalOpen(false);
        setTargetInput('');
        setTargetError(null);
      } else {
        setTargetError(response.data.message || "Failed to set target.");
      }
    } catch (error) {
      console.error("Error setting target:", error);
      setTargetError("Error setting target. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {targetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Set Monthly Video Target
            </h3>
            <input
              type="number"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Enter target number"
            />
            {targetError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{targetError}</p>
            )}
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setTargetModalOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleTargetSubmit}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
          {successMessage}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Videos ({videoCount.toLocaleString()})
          </h2>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10">
                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setTargetModalOpen(true);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Set videos Target
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            <p>No videos added yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Movie</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {videos.map((video) => {
                  const status = getStatus(video);
                  return (
                    <tr key={video._id}>
                      <td className="px-4 py-4 flex items-center space-x-3">
                        <Image
                          src={video.thumbnail || '/images/placeholder.jpg'}
                          alt={video.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {video.name}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                        {video.category_id?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                        ₹{video.finalPackage_id?.price?.toLocaleString() || '0'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
