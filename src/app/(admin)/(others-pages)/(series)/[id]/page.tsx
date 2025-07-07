
'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
type Episode = {
  _id: string;
  episode_number: number;
  season_number: number;
  name: string;
  thumbnail: string;
  description: string;
  video_duration: number;
  release_date: string;
  is_premium: number;
  is_title: number;
  is_download: number;
  status: string;
  total_view: number;
  price?: number | null;
  isApproved: boolean;

  // Added video URLs
  video_320?: string;
  video_480?: string;
  video_720?: string;
  video_1080?: string;
};

type Season = {
  _id: string;
  seasonNumber: number;
  title: string;
  description: string;
  releaseDate: string;
  totalEpisodes: number;
  episodes: Episode[];
};

type Series = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  landscape: string;
  releaseYear: number;
  totalSeasons: number;
  status: string;
  rating: number;
  tags: string[];
  adminNotes: string;
  approvalStatus: string;
  seasons: Season[];
};

export default function SeriesDetailsPage() {
  const { id } = useParams();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSeries() {
      try {
        const res = await fetch(`https://shreejighutargo21.onrender.com/api/vendors/${id}/details`);
        if (!res.ok) throw new Error('Failed to load series');
        const data = await res.json();
        setSeries(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchSeries();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  if (!series) return <div className="p-6 text-center">No series found.</div>;

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        {series.title}
      </h1>
  
      <Image
        src={series.landscape || series.thumbnail}
        alt={series.title}
        width={128} // Add specific width
        height={128} // Add specific height
        className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4"
      />
  
      <p className="mb-2 text-gray-800 dark:text-white leading-relaxed">
        {series.description}
      </p>
  
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
        <p>
          <strong>Released:</strong> {series.releaseYear}
        </p>
        <p>
          <strong>Status:</strong> {series.status}
        </p>
        <p>
          <strong>Rating:</strong> {series.rating.toFixed(1)}
        </p>
        <p>
          <strong>Tags:</strong> {series.tags.join(", ")}
        </p>
        <p>
          <strong>Approval Status:</strong>{" "}
          <span
            className={`font-semibold capitalize ${
              series.approvalStatus === "approved"
                ? "text-green-700 dark:text-green-400"
                : series.approvalStatus === "rejected"
                ? "text-red-700 dark:text-red-400"
                : "text-yellow-700 dark:text-yellow-400"
            }`}
          >
            {series.approvalStatus}
          </span>
          
        </p>
      </div>
  
      <p className="mb-6 text-sm italic text-gray-500 dark:text-gray-400">
        Admin Notes: {series.adminNotes || "None"}
      </p>
  
      {series.seasons.map((season) => (
        <section key={season._id} className="mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
            Season {season.seasonNumber}: {season.title}
          </h2>
          <p className="mb-2 text-gray-700 dark:text-gray-300 leading-relaxed">
            {season.description}
          </p>
          <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
            Released on: {new Date(season.releaseDate).toLocaleDateString()}
          </p>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Total Episodes: {season.totalEpisodes}
          </p>
  
          <ul className="space-y-6">
            {season.episodes.map((ep) => {
              const videoSrc =
                ep.video_1080 || ep.video_720 || ep.video_480 || ep.video_320 || null;
  
              return (
                <li
                  key={ep._id}
                  className="p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 flex flex-col gap-4"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                    <Image
                      src={ep.thumbnail}
                      alt={ep.name}
                      width={100}
                      height={100}
                      className="w-full sm:w-28 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Episode {ep.episode_number}: {ep.name}
                        {ep.is_premium && (
                          <span className="ml-2 text-xs sm:text-sm text-yellow-500 dark:text-yellow-400 font-bold">
                            Premium
                          </span>
                        )}
                        {ep.is_title && (
                          <span className="ml-2 text-xs sm:text-sm text-green-500 dark:text-green-400 font-bold">
                            Title Ep
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                        {ep.description}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Duration: {ep.video_duration} min | Released:{" "}
                        {new Date(ep.release_date).toLocaleDateString()} | Status: {ep.status}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Views: {ep.total_view} | Approved: {ep.isApproved ? "Yes" : "No"}
                      </p>
                      {ep.price && (
                       <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                       Price: ₹{ep.price.toFixed(2)}
                     </p>
                     
                      )}
                    </div>
                  </div>
  
                  {videoSrc ? (
                    <video
                      src={videoSrc}
                      controls
                      preload="metadata"
                      className="w-full rounded-md"
                    >
                      Sorry, your browser Does&apos;t  support embedded videos.
                    </video>
                  ) : (
                    <p className="text-xs italic text-gray-500 dark:text-gray-400">
                      No video available
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}  