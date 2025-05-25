

'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
type Series = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  releaseYear: number;
  totalSeasons: number;
  status: string; // e.g. "ongoing"
  approvalStatus: string; // e.g. "pending"
  category_id: {
    name: string;
  } | null;
};

async function fetchSeriesByApproval(status: string): Promise<Series[]> {
  const res = await fetch(`https://shreejighutargo21.onrender.com/api/vendors/tvshows-by-approval?status=${status}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch approved series data');
  }
  const data = await res.json();

  // Map your API response to fit frontend types
  return data.series.map((series: any) => ({
    ...series,
    category_id: series.category_id || null,
  }));
}

export default function TVShowsListPage() {
  const router = useRouter();
  const [series, setSeries] = useState<Series[]>([]);
//   const [status, setStatus] = useState<'approved' | 'pending' | 'rejected'>('approved');
const [status, setStatus] = useState<'approved' | 'pending' | 'rejected'>('pending');
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

  const handleViewDetails = (showid: string) => {
    console.log('Series ID from list:', showid);
    // Update this path to match your TV shows route structure
    router.push(`/tvshowsid/${showid}`);
  };

  // useEffect(() => {
  //   loadSeries();
  // }, [status]);
  useEffect(() => {
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
  
    loadSeries();
  }, [status]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header and filter */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 dark:text-gray-100">TV Shows</h1>
  
        <div className="flex items-center space-x-3 sm:space-x-4">
          <label
            htmlFor="statusFilter"
            className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap"
          >
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'approved' | 'pending' | 'rejected')}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
  
      {loading && (
        <div className="text-center text-gray-600 dark:text-gray-300">
          Loading TV shows...
        </div>
      )}
  
      {error && (
        <div className="text-center text-red-600 font-semibold">
          Error: {error}
        </div>
      )}
  
      {!loading && !error && series.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No shows found for <strong>{status}</strong> status.
        </div>
      )}
  
      {!loading && !error && series.length > 0 && (
        <>
          {/* Desktop Table - hidden on small screens */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  {/* <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th> */}
                  <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Release Year
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Seasons
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Approval Status
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {series.map((seriesItem) => (
                  <tr key={seriesItem._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={seriesItem.thumbnail}
                          alt={seriesItem.title}
                          className="w-12 h-16 rounded object-cover"
                        />
                        <div>
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {seriesItem.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {seriesItem.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* <td className="py-4 px-6 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {seriesItem.category_id?.name || 'Action'}
                    </td> */}
                    <td className="py-4 px-6 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {seriesItem.releaseYear}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {seriesItem.totalSeasons}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`capitalize inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          seriesItem.status === 'ongoing'
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                        }`}
                      >
                        {seriesItem.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`capitalize inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          seriesItem.approvalStatus === 'approved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : seriesItem.approvalStatus === 'rejected'
                            ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        }`}
                      >
                        {seriesItem.approvalStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(seriesItem._id)}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Mobile card list - show on small screens */}
          <div className="sm:hidden space-y-6">
            {series.map((seriesItem) => (
              <div
                key={seriesItem._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-4"
              >
                <div className="flex space-x-4">
                  <Image
                    src={seriesItem.thumbnail}
                    alt={seriesItem.title}
                    className="w-20 h-28 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {seriesItem.title}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {seriesItem.description}
                      </p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-semibold">Category:</span> {seriesItem.category_id?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-semibold">Year:</span> {seriesItem.releaseYear}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-semibold">Seasons:</span> {seriesItem.totalSeasons}
                      </p>
                      <p className="text-sm">
                        <span
                          className={`capitalize inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            seriesItem.status === 'ongoing'
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                          }`}
                        >
                          {seriesItem.status}
                        </span>
                        <span
                          className={`capitalize inline-flex px-2 py-1 ml-2 text-xs font-semibold rounded-full ${
                            seriesItem.approvalStatus === 'approved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                              : seriesItem.approvalStatus === 'rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                          }`}
                        >
                          {seriesItem.approvalStatus}
                        </span>
                      </p>
                    </div>
  
                    <button
                      onClick={() => handleViewDetails(seriesItem._id)}
                      className="mt-3 w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}  