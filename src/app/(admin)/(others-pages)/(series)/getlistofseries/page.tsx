
'use client';

import { useEffect, useState } from 'react';

type Series = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  releaseYear: number;
  totalSeasons: number;
  status: string;
  approvalStatus: string;
  
  category_id: {
    name: string;
  };
};

async function fetchSeriesByApproval(status: string): Promise<Series[]> {
  const res = await fetch(`https://shreejighutargo21.onrender.com/api/vendors/series-by-approval?status=${status}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch approved series data');
  }
  const data = await res.json();
  return data.series;
}

export default function Page() {
  const [series, setSeries] = useState<Series[]>([]);
  const [status, setStatus] = useState<'approved' | 'pending' | 'rejected'>('approved');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadSeries = async () => {
    try {
      setLoading(true);
      const data = await fetchSeriesByApproval(status);
      setSeries(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeries();
  }, [status]);

  return (
   

<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
  {/* Title and filter container */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
    <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 dark:text-gray-100">
      Web Series
    </h1>

    <div className="flex items-center space-x-3 sm:space-x-4">
      <label
        htmlFor="statusFilter"
        className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap text-sm sm:text-base"
      >
        Filter by Status:
      </label>
      <select
        id="statusFilter"
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as "approved" | "pending" | "rejected")
        }
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md px-3 py-2 text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  </div>

  {/* Status messages */}
  {loading && (
    <div className="text-center text-gray-600 dark:text-gray-300 text-base sm:text-lg">
      Loading...
    </div>
  )}
  {error && (
    <div className="text-center text-red-600 font-semibold text-base sm:text-lg">
      Error: {error}
    </div>
  )}
  {!loading && !error && series.length === 0 && (
    <div className="text-center text-gray-500 dark:text-gray-400 text-base sm:text-lg">
      No series found for <strong>{status}</strong> status.
    </div>
  )}

  {/* Responsive Data Display */}
  {!loading && !error && series.length > 0 && (
    <>
      {/* Table for md+ screens */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Thumbnail
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Series Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Total Seasons
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {series.map((s) => (
              <tr
                key={s._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={s.thumbnail}
                    alt={s.title}
                    className="w-16 h-16 rounded-lg object-cover border dark:border-gray-700"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
                  {s.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {s.category_id?.name || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {s.totalSeasons}
                </td>
                <td className="px-6 py-4 text-sm capitalize font-medium text-gray-700 dark:text-gray-300">
                  {s.approvalStatus}
                </td>
                <td className="px-6 py-4 text-sm">
                  <a
                    href={`/${s._id}`}
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    View More
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card/List view for mobile */}
      <div className="md:hidden space-y-6">
        {series.map((s) => (
          <div
            key={s._id}
            className="flex flex-col sm:flex-row items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
          >
            <img
              src={s.thumbnail}
              alt={s.title}
              className="w-full sm:w-28 h-28 rounded-lg object-cover mb-3 sm:mb-0 sm:mr-4 flex-shrink-0"
            />
            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {s.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Category: {s.category_id?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Seasons: {s.totalSeasons}
              </p>
              <p className="capitalize font-medium text-gray-700 dark:text-gray-300">
                Status: {s.approvalStatus}
              </p>
              <a
                href={`/${s._id}`}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                View More
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</main>



  );
}
