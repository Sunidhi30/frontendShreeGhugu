"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface VideoDetail {
  _id: string;
  name: string;
  thumbnail: string;
  landscape: string;
  description: string;
  video_type: string;
  status: string;
  release_date: string;
  video_upload_type: string;
  video_extension: string;
  video_duration: number;
  price: number;
  total_like: number;
  total_view: number;
  total_comment: number;
  averageRating: number;
  is_premium: number;
  is_download: number;
  is_like: number;
  is_comment: number;
  isApproved: boolean;
  isTop10: boolean;
  viewCount: number;
  adViews: number;
  createdAt: string;
  updatedAt: string;
  video_320: string;
  category_id: string; // Assuming this field exists in the video model

}

export default function ViewMore() {
  const params = useParams();
  const videoId = params?.videoId;
  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) return;

    const fetchVideoDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:9000/api/vendors/videos/${videoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setVideo(data.data);
          const categoryId = data.data?.category_id;
          if (categoryId) {
            localStorage.setItem("category_id", categoryId);
            console.log("✅ category_id saved to localStorage:", categoryId);
          }
        } else {
          setError(data.message || "Failed to fetch video details.");
        }
      } catch (err) {
        setError("Error fetching video details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetail();
  }, [videoId]);

  if (loading) return <p className="text-center text-gray-600 dark:text-gray-300">Loading video details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">{video?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img src={video?.thumbnail} alt="Thumbnail" className="rounded-lg shadow-md w-full" />
        <img src={video?.landscape} alt="Landscape" className="rounded-lg shadow-md w-full" />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 dark:text-gray-300">
        <div>
          <p><span className="font-semibold">Description:</span> {video?.description}</p>
          <p><span className="font-semibold">Type:</span> {video?.video_type}</p>
          <p><span className="font-semibold">Status:</span> {video?.status}</p>
          <p><span className="font-semibold">Release Date:</span> {new Date(video?.release_date).toLocaleDateString()}</p>
          <p><span className="font-semibold">Duration:</span> {video?.video_duration} mins</p>
          <p><span className="font-semibold">Extension:</span> {video?.video_extension}</p>
        </div>

        <div>
          <p><span className="font-semibold">Price:</span> ${video?.price}</p>
          <p><span className="font-semibold">Category:</span> {video?.category_id}</p>
          <p><span className="font-semibold">Total Likes:</span> {video?.total_like}</p>
          <p><span className="font-semibold">Total Views:</span> {video?.total_view}</p>
          <p><span className="font-semibold">Total Comments:</span> {video?.total_comment}</p>
          <p><span className="font-semibold">Average Rating:</span> {video?.averageRating}</p>
          <p><span className="font-semibold">Ad Views:</span> {video?.adViews}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 dark:text-gray-400">
        <p><strong>Premium:</strong> {video?.is_premium ? "Yes" : "No"}</p>
        <p><strong>Downloadable:</strong> {video?.is_download ? "Yes" : "No"}</p>
        <p><strong>Likes Allowed:</strong> {video?.is_like ? "Yes" : "No"}</p>
        <p><strong>Comments Allowed:</strong> {video?.is_comment ? "Yes" : "No"}</p>
        <p><strong>Approved:</strong> {video?.isApproved ? "Yes" : "No"}</p>
        <p><strong>Top 10:</strong> {video?.isTop10 ? "Yes" : "No"}</p>
        <p><strong>Created:</strong> {new Date(video?.createdAt).toLocaleString()}</p>
        <p><strong>Updated:</strong> {new Date(video?.updatedAt).toLocaleString()}</p>
      </div>

      {video?.video_320 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">320p Preview</h3>
          <video controls className="w-full rounded-md shadow-md">
            <source src={video.video_320} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
