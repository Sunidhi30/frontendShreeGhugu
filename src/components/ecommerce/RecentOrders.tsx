

'use client';

import axios from 'axios';
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
  approved: 'text-green-600 bg-green-50 dark:text-green-500 dark:bg-green-400/10',
  pending: 'text-blue-600 bg-blue-50 dark:text-blue-500 dark:bg-blue-400/10',
  rejected: 'text-red-600 bg-red-50 dark:text-red-500 dark:bg-red-400/10',
};

const RecentOrders: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoCount, setVideoCount] = useState<number>(0); // Ensure it's a number, default to 0
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Capture errors

  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem('token'); // Get the token from localStorage

      if (!token) {
        setError('Vendor token is missing. Please log in.');
        setLoading(false);
        return;
      }

      try {
        // Fetch videos and video count in parallel
        const [videosResponse, countResponse] = await Promise.all([
          axios.get('http://localhost:9000/api/vendors/videos', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('http://localhost:9000/api/vendors/vendor/video-count', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        // Set video data and video count
        setVideos(videosResponse.data.videos);
        // Ensure videoCount is a number and fallback to 0 if it's undefined or null
        setVideoCount(Number(countResponse.data.videoCount) || 0);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError('Error fetching videos or video count. Please try again.');
      } finally {
        setLoading(false); // Set loading to false when done
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

  if (loading) {
    return (
      <div className="text-center text-gray-600 dark:text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-between mb-4">
      <h2 className="text-xl font-semibold text-black dark:text-gray-300">
  Videos ({videoCount ? videoCount.toLocaleString() : '0'})
</h2>
      </div>
      <table className="min-w-[640px] w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">

      
         <thead className="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
          Movie
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
          Category
        </th>
      
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
          Status
        </th>
      </tr>
    </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {videos.map((video) => {
            const status = getStatus(video);
            return (
              <tr key={video._id}>
                <td className="px-4 py-4 whitespace-nowrap flex items-center space-x-3">
                  <Image
                    src={video.thumbnail || '/images/placeholder.jpg'}
                    alt={video.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{video.name}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {video.category_id?.name || 'N/A'}
                </td>
                {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {video.finalPackage_id.price || 'No Package'}
                </td> */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
