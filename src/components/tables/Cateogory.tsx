
"use client";

import Image from 'next/image';
import { useEffect, useState } from "react";
interface VideoDetail {
  _id: string;
  name: string;
  thumbnail: string;
  category_id: string;
  isApproved: boolean;
}

export default function VideosByCategory() {
  const [videos, setVideos] = useState<VideoDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedCategoryId, setSavedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const categoryId = localStorage.getItem("category_id");
    setSavedCategoryId(categoryId);
    console.log("categroy id "+categoryId)
  }, []);

  useEffect(() => {
    if (!savedCategoryId) return;

    console.log("📡 Sending request to fetch videos by category:", savedCategoryId);

    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:9000/api/vendors/videos/category/${savedCategoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setVideos(data.data);
        } else {
          setError(data.message || "Failed to fetch videos.");
        }
      }  finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [savedCategoryId]);

  if (loading) return <p className="text-center">Loading videos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((video) => (
        <div key={video._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <Image src={video.thumbnail} alt={video.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{video.name}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}
