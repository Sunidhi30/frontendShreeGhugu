// 'use client';

// import axios from 'axios';
// import { useEffect, useState } from 'react';

// interface TVShow {
//   _id: string;
//   title: string;
//   description: string;
//   channel_id: {
//     _id: string;
//     name: string;
//   };
// }

// interface Season {
//   name: string;
//   description: string;
// }

// export default function UploadSeasonForm() {
//   // State for TV shows list and pagination
//   const [tvShows, setTvShows] = useState<TVShow[]>([]);
//   const [selectedShowId, setSelectedShowId] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // State for seasons form
//   const [seasons, setSeasons] = useState<Season[]>([{
//     name: '',
//     description: ''
//   }]);

//   // Fetch TV shows on component mount and when page changes
//   useEffect(() => {
//     fetchTVShows();
//   }, [page]);

//   const fetchTVShows = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('No authentication token found!');
//       return;
//     }

    
//     try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:9000/api/vendors/tvshows`, {
//           params: {
//             page: currentPage,
//             limit: 10
//           },
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
  
//         if (response.data.success) {
//           setTvShows(response.data.data.tvShows);
//           setTotalPages(response.data.data.pagination.totalPages);
//         }
//       } catch (error: any) {
//         setError(error.response?.data?.error || 'Failed to fetch TV shows');
//       } finally {
//         setLoading(false);
//       }
//     };
  
//   const handleShowSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedShowId(e.target.value);
//   };

//   const handleSeasonChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const updatedSeasons = [...seasons];
//     updatedSeasons[index] = {
//       ...updatedSeasons[index],
//       [e.target.name]: e.target.value
//     };
//     setSeasons(updatedSeasons);
//   };

//   const addSeason = () => {
//     setSeasons([...seasons, { name: '', description: '' }]);
//   };

//   const removeSeason = (index: number) => {
//     const updatedSeasons = seasons.filter((_, i) => i !== index);
//     setSeasons(updatedSeasons);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const token = localStorage.getItem('token');

//     if (!token) {
//       alert('User is not authenticated!');
//       return;
//     }

//     if (!selectedShowId) {
//       alert('Please select a TV show first.');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `http://localhost:9000/api/tvshows/${selectedShowId}/seasons`,
//         {
//           seasons: seasons
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         alert('Seasons added successfully!');
//         // Reset form
//         setSeasons([{ name: '', description: '' }]);
//       }
//     } catch (error) {
//       console.error('Failed to add seasons:', error);
//       alert('Failed to add seasons.');
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-semibold mb-6">Add Seasons to TV Show</h1>

//       {/* TV Show Selection */}
//       <div className="mb-6">
//         <label className="block mb-2 font-medium">Select TV Show</label>
//         <select
//           value={selectedShowId}
//           onChange={handleShowSelect}
//           className="w-full p-2 border rounded mb-4"
//           disabled={loading}
//         >
//           <option value="">Select a TV Show</option>
//           {tvShows.map(show => (
//             <option key={show._id} value={show._id}>
//               {show.title} ({show.channel_id?.name || 'No channel'})
//             </option>
//           ))}
//         </select>

//         {/* Pagination */}
//         <div className="flex justify-between items-center">
//           <button
//             onClick={() => setPage(p => Math.max(1, p - 1))}
//             disabled={page === 1 || loading}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span>Page {page} of {totalPages}</span>
//           <button
//             onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//             disabled={page === totalPages || loading}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Seasons Form */}
//       {selectedShowId && (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {seasons.map((season, index) => (
//             <div key={index} className="space-y-2 p-4 border rounded">
//               <div className="flex justify-between items-center">
//                 <h3 className="font-bold">Season {index + 1}</h3>
//                 {seasons.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeSeason(index)}
//                     className="text-red-500"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>

//               <input
//                 name="name"
//                 placeholder="Season Name"
//                 value={season.name}
//                 onChange={(e) => handleSeasonChange(index, e)}
//                 className="border p-2 w-full"
//                 required
//               />
              
//               <textarea
//                 name="description"
//                 placeholder="Description"
//                 value={season.description}
//                 onChange={(e) => handleSeasonChange(index, e)}
//                 className="border p-2 w-full"
//               />
//             </div>
//           ))}

//           <div className="flex gap-2">
//             <button
//               type="button"
//               onClick={addSeason}
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Add Another Season
//             </button>

//             <button
//               type="submit"
//               className="bg-green-600 text-white px-4 py-2 rounded"
//             >
//               Submit All Seasons
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }
'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

interface TVShow {
  _id: string;
  title: string;
  description: string;
  channel_id: {
    _id: string;
    name: string;
  };
}

interface Season {
  name: string;
  description: string;
}

interface PaginationData {
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export default function UploadSeasonForm() {
  // State for TV shows list and pagination
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [selectedShowId, setSelectedShowId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });

  // State for seasons form
  const [seasons, setSeasons] = useState<Season[]>([{
    name: '',
    description: ''
  }]);

  // Fetch TV shows on component mount and when page changes
  useEffect(() => {
    fetchTVShows();
  }, [pagination.page]);

  const fetchTVShows = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found!');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:9000/api/vendors/tvshows', {
        params: {
          page: pagination.page,
          limit: pagination.limit
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setTvShows(response.data.data.tvShows);
        setPagination(prev => ({
          ...prev,
          ...response.data.data.pagination
        }));
      }
    } catch (error: any) {
      console.error('Failed to fetch TV shows:', error);
      setError(error.response?.data?.error || 'Failed to fetch TV shows');
    } finally {
      setLoading(false);
    }
  };

  const handleShowSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedShowId(e.target.value);
  };

  const handleSeasonChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[index] = {
      ...updatedSeasons[index],
      [e.target.name]: e.target.value
    };
    setSeasons(updatedSeasons);
  };

  const addSeason = () => {
    setSeasons([...seasons, { name: '', description: '' }]);
  };

  const removeSeason = (index: number) => {
    const updatedSeasons = seasons.filter((_, i) => i !== index);
    setSeasons(updatedSeasons);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('User is not authenticated!');
      return;
    }

    if (!selectedShowId) {
      setError('Please select a TV show first.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:9000/api/vendors/tvshows/${selectedShowId}/seasons`,
        { seasons },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setError('✅ Seasons added successfully!');
        // Reset form
        setSeasons([{ name: '', description: '' }]);
        setSelectedShowId('');
      }
    } catch (error: any) {
      console.error('Failed to add seasons:', error);
      setError(error.response?.data?.error || 'Failed to add seasons');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Add Seasons to TV Show</h1>

      {error && (
        <div className={`mb-4 p-3 rounded ${
          error.includes('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {error}
        </div>
      )}

      {/* TV Show Selection */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select TV Show</label>
        <select
          value={selectedShowId}
          onChange={handleShowSelect}
          className="w-full p-2 border rounded mb-4"
          disabled={loading}
        >
          <option value="">Select a TV Show</option>
          {tvShows.map(show => (
            <option key={show._id} value={show._id}>
              {show.title} ({show.channel_id?.name || 'No channel'})
            </option>
          ))}
        </select>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={!pagination.hasPrevPage || loading}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {pagination.page} of {pagination.totalPages}</span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
            disabled={!pagination.hasNextPage || loading}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Seasons Form */}
      {selectedShowId && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {seasons.map((season, index) => (
            <div key={index} className="space-y-2 p-4 border rounded">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Season {index + 1}</h3>
                {seasons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSeason(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                name="name"
                placeholder="Season Name"
                value={season.name}
                onChange={(e) => handleSeasonChange(index, e)}
                className="border p-2 w-full"
                required
              />
              
              <textarea
                name="description"
                placeholder="Description"
                value={season.description}
                onChange={(e) => handleSeasonChange(index, e)}
                className="border p-2 w-full"
              />
            </div>
          ))}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={addSeason}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Another Season
            </button>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit All Seasons
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
