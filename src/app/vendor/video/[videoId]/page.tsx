
// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";


// interface VideoDetail {
//     _id: string;
//     type_id: string;
//     video_type: string;
//     vendor_id: string;
//     channel_id: string;
//     producer_id: string;
//     category_id: string;
//     language_id: string;
//     cast_id: string;
//     name: string;
//     thumbnail: string;
//     landscape: string;
//     description: string;
//     video_upload_type: string;
//     video_320: string;
//     video_480: string;
//     video_720: string;
//     video_1080: string;
//     video_extension: string;
//     video_duration: number;
//     trailer_type: string;
//     trailer_url: string;
//     subtitle_type: string;
//     subtitle_lang_1: string;
//     subtitle_lang_2: string;
//     subtitle_lang_3: string;
//     release_date: string;
//     is_premium: number;
//     is_title: number;
//     is_download: number;
//     is_like: number;
//     is_comment: number;
//     total_like: number;
//     total_view: number;
//     finalPackage_id: string;
//     price: number;
//     rentDuration: string | null;
//     viewCount: number;
//     adViews: number;
//     is_rent: number;
//     rent_day: number;
//     isApproved: boolean;
//     status: string;
//     isTop10: boolean;
//     totalEarnings: number;
//     total_comment: number;
//     averageRating: number;
//     ratingCount: number;
//     ratings: any[];
//     createdAt: string;
//     updatedAt: string;
//   }
  
// export default function ViewMore() {
//   const params = useParams();
//   const videoId = params?.videoId;
//   console.log("This is video ID: " + videoId);

//   const [video, setVideo] = useState<VideoDetail | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!videoId) return;

//     const fetchVideoDetail = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`http://localhost:9000/api/vendors/videos/${videoId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await res.json();
//         console.log(data);

//         if (res.ok) {
//           setVideo(data.data); // Assuming your API response structure has "data"
//         } else {
//           setError(data.message || "Failed to fetch video details.");
//         }
//       } catch (error) {
//         console.error("Error fetching video detail:", error);
//         setError("Error fetching video details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideoDetail();
//   }, [videoId]);

//   if (loading) {
//     return <p>Loading video details...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
  
//     <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3">
//   <h2 className="text-2xl font-bold">{video.name}</h2>
//   <img src={video.thumbnail} alt="Thumbnail" className="w-full max-w-md rounded" />
//   <img src={video.landscape} alt="Landscape" className="w-full max-w-md rounded" />
  
//   <p><strong>Description:</strong> {video.description}</p>
//   <p><strong>Type:</strong> {video.video_type}</p>
//   <p><strong>Status:</strong> {video.status}</p>
//   <p><strong>Release Date:</strong> {new Date(video.release_date).toLocaleDateString()}</p>
//   <p><strong>Upload Type:</strong> {video.video_upload_type}</p>
//   <p><strong>Extension:</strong> {video.video_extension}</p>
//   <p><strong>Duration:</strong> {video.video_duration} mins</p>
//   <p><strong>Price:</strong> ${video.price}</p>
//   <p><strong>Total Likes:</strong> {video.total_like}</p>
//   <p><strong>Total Views:</strong> {video.total_view}</p>
//   <p><strong>Comments:</strong> {video.total_comment}</p>
//   <p><strong>Average Rating:</strong> {video.averageRating}</p>
//   <p><strong>Is Premium:</strong> {video.is_premium ? "Yes" : "No"}</p>
//   <p><strong>Is Downloadable:</strong> {video.is_download ? "Yes" : "No"}</p>
//   <p><strong>Allow Likes:</strong> {video.is_like ? "Yes" : "No"}</p>
//   <p><strong>Allow Comments:</strong> {video.is_comment ? "Yes" : "No"}</p>
//   <p><strong>Is Approved:</strong> {video.isApproved ? "Yes" : "No"}</p>
//   <p><strong>Is Top 10:</strong> {video.isTop10 ? "Yes" : "No"}</p>
//   <p><strong>View Count:</strong> {video.viewCount}</p>
//   <p><strong>Ad Views:</strong> {video.adViews}</p>
//   <p><strong>Created At:</strong> {new Date(video.createdAt).toLocaleString()}</p>
//   <p><strong>Updated At:</strong> {new Date(video.updatedAt).toLocaleString()}</p>

//   {video.video_320 && (
//     <div>
//       <p><strong>Video 320p Preview:</strong></p>
//       <video controls className="w-full max-w-md rounded">
//         <source src={video.video_320} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//     </div>
//   )}
// </div>

//   );
// }
"use client";
import Image from 'next/image';
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
        } else {
          setError(data.message || "Failed to fetch video details.");
        }
      } 
       finally {
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
      <Image src={video?.thumbnail} alt="Thumbnail" className="rounded-lg shadow-md w-full"/>
      <Image src={video?.thumbnail} alt="Landscape" className="rounded-lg shadow-md w-full"/>
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
