
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
// Update types to match your API response
type Episode = {
  _id: string;
  title: string;
  video_duration: number;
  episode_number: number;
};

type Season = {
  _id: string;
  name: string;
  episodes: Episode[];
  show_id: string; // Add if your API returns this
};

type TVShowDetails = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  releaseYear: number; // Changed from release_year to match your API
  totalSeasons: number; // Changed from total_seasons to match your API
  status: string;
  approvalStatus: string; // Changed from approval_status to match your API
  category_id: {
    name: string;
  } | null;
  channel_id: {
    name: string;
    description: string;
  } | null;
  seasons: Season[];
};

async function fetchTVShowDetails(id: string): Promise<TVShowDetails> {
  try {
    const res = await fetch(`https://shreejighutargo21.onrender.com/api/vendors/${id}/details-tvshows`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch TV show details');
    }

    const data = await res.json();
    
    // Transform the API response to match your frontend types if necessary
    return {
      ...data,
      releaseYear: data.release_year || data.releaseYear,
      totalSeasons: data.total_seasons || data.totalSeasons,
      approvalStatus: data.approval_status || data.approvalStatus,
      seasons: data.seasons || []
    };
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    throw error;
  }
}

export default function TVShowDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const showId = params.showid as string; // Make sure this matches your route parameter name

  const [tvShow, setTvShow] = useState<TVShowDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!showId) return;
    
    const loadTVShowDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching details for TV Show ID:', showId);
        const data = await fetchTVShowDetails(showId);
        console.log('Received TV Show data:', data);
        setTvShow(data);
      } catch (err) {
        console.error('Error loading TV show details:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadTVShowDetails();
  }, [showId]);

  if (loading) return <main className="text-center p-10">Loading...</main>;
  if (error) return <main className="text-center p-10 text-red-600">Error: {error}</main>;
  if (!tvShow) return <main className="text-center p-10">TV Show not found.</main>;

  return (
//     <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
//       <button onClick={() => router.back()} className="text-blue-600 dark:text-blue-400 hover:underline">
//          Back to Shows list 
//       </button>

//       <div className="flex gap-6">
//         <Image src={tvShow.thumbnail} alt={tvShow.title} className="w-48 h-64 rounded-lg object-cover" />
//         <div>
//           <h1 className="text-4xl font-bold">{tvShow.title}</h1>
//           <p className="mt-2 text-gray-600">{tvShow.description}</p>
//           <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
//             <p><strong>Release Year:</strong> {tvShow.releaseYear}</p>
//             <p><strong>Total Seasons:</strong> {tvShow.totalSeasons}</p>
//             <p><strong>Category:</strong> {tvShow.category_id?.name || 'N/A'}</p>
//             <p><strong>Channel:</strong> {tvShow.channel_id?.name || 'N/A'}</p>
//             <p><strong>Status:</strong> {tvShow.status}</p>
//             <p><strong>Approval:</strong> 
//               <span className={`ml-2 ${
//                 tvShow.approvalStatus === 'approved' ? 'text-green-600' :
//                 tvShow.approvalStatus === 'rejected' ? 'text-red-600' : 'text-yellow-600'
//               }`}>{tvShow.approvalStatus}</span>
//             </p>
//           </div>
//           {tvShow.channel_id?.description && (
//             <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
//               <p><strong>Channel Description:</strong> {tvShow.channel_id.description}</p>
//             </div>
//           )}
//         </div>
//       </div>

//       <section>
//         <h2 className="text-2xl font-semibold mb-4">Seasons & Episodes</h2>
//         {!tvShow.seasons || tvShow.seasons.length === 0 ? (
//           <p>No seasons available.</p>
//         ) : (
//           tvShow.seasons.map((season) => (
//             <div key={season._id} className="mb-6 p-4 border rounded-md">
//               <h3 className="text-xl font-semibold mb-2">{season.name}</h3>
//               {!season.episodes || season.episodes.length === 0 ? (
//                 <p>No episodes in this season.</p>
//               ) : (
//                 <ul className="space-y-2">
//                   {season.episodes.map((ep) => (
//                     <li key={ep._id} className="flex justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
//                       <span>Ep {ep.episode_number}: {ep.title}</span>
//                       <span>{Math.floor(ep.video_duration / 60)}:{(ep.video_duration % 60).toString().padStart(2, '0')} min</span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           ))
//         )}
//       </section>
//     </main>
//   );
// }
  <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
    <button
      onClick={() => router.back()}
      className="text-blue-600 dark:text-white hover:underline text-sm sm:text-base mb-4"
    >
      ← Back to Shows list
    </button>

    <div className="flex flex-col sm:flex-row gap-6">
      <Image
        src={tvShow.thumbnail}
        alt={tvShow.title}
        className="w-full sm:w-48 h-64 rounded-lg object-cover flex-shrink-0"
      />

      <div className="flex flex-col">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{tvShow.title}</h1>

        <p className="mt-2 text-gray-700 dark:text-white leading-relaxed">{tvShow.description}</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm sm:text-base text-gray-700 dark:text-white">
          <p><strong>Release Year:</strong> {tvShow.releaseYear}</p>
          <p><strong>Total Seasons:</strong> {tvShow.totalSeasons}</p>
          <p><strong>Category:</strong> {tvShow.category_id?.name || 'N/A'}</p>
          <p><strong>Channel:</strong> {tvShow.channel_id?.name || 'N/A'}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span className="capitalize">{tvShow.status}</span>
          </p>
          <p>
            <strong>Approval:</strong>{' '}
            <span className={`ml-2 font-semibold capitalize ${
              tvShow.approvalStatus === 'approved'
                ? 'text-green-700 dark:text-white'
                : tvShow.approvalStatus === 'rejected'
                ? 'text-red-700 dark:text-white'
                : 'text-yellow-700 dark:text-white'
            }`}>
              {tvShow.approvalStatus}
            </span>
          </p>
        </div>

        {tvShow.channel_id?.description && (
          <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm dark:text-white leading-relaxed">
            <strong>Channel Description:</strong> {tvShow.channel_id.description}
          </div>
        )}
      </div>
    </div>

    <section>
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Seasons & Episodes</h2>

      {!tvShow.seasons || tvShow.seasons.length === 0 ? (
        <p className="text-gray-600 dark:text-white">No seasons available.</p>
      ) : (
        tvShow.seasons.map((season) => (
          <div
            key={season._id}
            className="mb-6 p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
          >
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{season.name}</h3>

            {!season.episodes || season.episodes.length === 0 ? (
              <p className="text-gray-600 dark:text-white">No episodes in this season.</p>
            ) : (
              <ul className="space-y-2">
                {season.episodes.map((ep) => (
                  <li
                    key={ep._id}
                    className="flex justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded text-gray-700 dark:text-white text-sm sm:text-base"
                  >
                    <span>
                      Ep {ep.episode_number}: {ep.title}
                    </span>
                    <span className="font-mono">
                      {Math.floor(ep.video_duration / 60)}:
                      {(ep.video_duration % 60).toString().padStart(2, '0')} min
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </section>
  </main>
);
}