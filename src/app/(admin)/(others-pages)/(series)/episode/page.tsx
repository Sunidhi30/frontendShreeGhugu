// 'use client';
// import React, { useEffect, useState } from 'react';
// interface Series {
//   _id: string;
//   title: string;
// }

// interface Season {
//   _id: string;
//   seasonNumber: number;
// }

// export default function EpisodesPage() {
//   const [seriesList, setSeriesList] = useState<Series[]>([]);
//   const [selectedSeries, setSelectedSeries] = useState<string>('');
//   const [seasonsList, setSeasonsList] = useState<Season[]>([]);
//   const [selectedSeason, setSelectedSeason] = useState<string>('');

//   const [episodeData, setEpisodeData] = useState({
//     name: '',
//     description: '',
//     release_date: '',
//     video_duration: '',
//     episode_number: '',
//     video_type: '',
//     // ...add other fields as needed
//   });

//   const [files, setFiles] = useState({
//     thumbnail: null as File | null,
//     video_320: null as File | null,
//     video_480: null as File | null,
//     video_720: null as File | null,
//     video_1080: null as File | null,
//     trailer: null as File | null,
//   });

//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//   // Fetch series list on component mount
//   useEffect(() => {
//     if (!token) return alert('You must be logged in.');

//     fetch('https://shreejighutargo21.onrender.com/api/vendors/series', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) setSeriesList(data.series);
//         else alert('Failed to load series');
//       })
//       .catch(err => {
//         alert('Error fetching series');
//         console.error(err);
//       });
//   }, [token]);

//   // Fetch seasons when series selected
//   useEffect(() => {
//     if (!selectedSeries || !token) {
//       setSeasonsList([]);
//       return;
//     }

//     fetch(`https://shreejighutargo21.onrender.com/api/vendors/seasons/${selectedSeries}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) setSeasonsList(data.seasons);
//         else setSeasonsList([]);
//       })
//       .catch(err => {
//         console.error(err);
//         setSeasonsList([]);
//       });
//   }, [selectedSeries, token]);

//   // Handle input change
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setEpisodeData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

  
//   // Handle file change
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files?.[0]) return;
//     setFiles(prev => ({ ...prev, [e.target.name]: e.target.files![0] }));
//   };

//   // Handle episode form submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedSeries) return alert('Select a series');
//     if (!selectedSeason) return alert('Select a season');

//     const formData = new FormData();

//     formData.append('series_title', seriesList.find(s => s._id === selectedSeries)?.title || '');
//     formData.append('season_number', seasonsList.find(s => s._id === selectedSeason)?.seasonNumber.toString() || '');

//     for (const key in episodeData) {
//       formData.append(key, (episodeData as any)[key]);
//     }

//     // Append files
//     for (const key in files) {
//       const file = (files as any)[key];
//       if (file) formData.append(key, file);
//     }

//     try {
//       const res = await fetch('https://shreejighutargo21.onrender.com/api/vendors/episodes', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert('Episode uploaded successfully!');
//         setEpisodeData({
//           name: '',
//           description: '',
//           release_date: '',
//           video_duration: '',
//           episode_number: '',
//           video_type: '',
//         });
//         setFiles({
//           thumbnail: null,
//           video_320: null,
//           video_480: null,
//           video_720: null,
//           video_1080: null,
//           trailer: null,
//         });
//       } else {
//         alert('Failed to upload episode: ' + data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       alert('Error uploading episode');
//     }
//   };
//   // return (
// //     <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
// //         <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Upload Episode</h1>

// //         <div className="space-y-6">
// //           {/* Series Selection */}
// //           <div className="form-group">
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Select Series
// //             </label>
// //             <select
// //               value={selectedSeries}
// //               onChange={(e) => setSelectedSeries(e.target.value)}
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             >
// //               <option value="">-- Select Series --</option>
// //               {seriesList.map((s) => (
// //                 <option key={s._id} value={s._id}>
// //                   {s.title}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* Season Selection */}
// //           {seasonsList.length > 0 && (
// //             <div className="form-group">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Select Season
// //               </label>
// //               <select
// //                 value={selectedSeason}
// //                 onChange={(e) => setSelectedSeason(e.target.value)}
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               >
// //                 <option value="">-- Select Season --</option>
// //                 {seasonsList.map((s) => (
// //                   <option key={s._id} value={s._id}>
// //                     Season {s.seasonNumber}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           )}

// //           {/* Episode Form */}
// //           {selectedSeason && (
// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               {/* Episode Details */}
// //               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Episode Name
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="name"
// //                     value={episodeData.name}
// //                     onChange={handleChange}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Episode Number
// //                   </label>
// //                   <input
// //                     type="number"
// //                     name="episode_number"
// //                     value={episodeData.episode_number}
// //                     onChange={handleChange}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     required
// //                   />
// //                 </div>

// //                 <div className="sm:col-span-2">
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Description
// //                   </label>
// //                   <textarea
// //                     name="description"
// //                     value={episodeData.description}
// //                     onChange={handleChange}
// //                     rows={4}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Release Date
// //                   </label>
// //                   <input
// //                     type="date"
// //                     name="release_date"
// //                     value={episodeData.release_date}
// //                     onChange={handleChange}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Video Duration (seconds)
// //                   </label>
// //                   <input
// //                     type="number"
// //                     name="video_duration"
// //                     value={episodeData.video_duration}
// //                     onChange={handleChange}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Video Type
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="video_type"
// //                     value={episodeData.video_type}
// //                     onChange={handleChange}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               {/* File Uploads */}
// //               <div className="space-y-4">
// //                 <h3 className="text-lg font-medium text-gray-900">Media Files</h3>
// //                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// //                   {Object.keys(files).map((key) => (
// //                     <div key={key} className="file-input-group">
// //                       <label className="block text-sm font-medium text-gray-700 mb-2">
// //                         {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
// //                       </label>
// //                       <input
// //                         type="file"
// //                         name={key}
// //                         onChange={handleFileChange}
// //                         accept={key === 'thumbnail' ? 'image/*' : 'video/*'}
// //                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         required={key === 'thumbnail'}
// //                       />
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               <div className="flex justify-center">
// //                 <button
// //                   type="submit"
// //                   className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
// //                 >
// //                   Upload Episode
// //                 </button>
// //               </div>
// //             </form>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// return (
//   <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
//     <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
//       <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Upload Episode</h1>

//       <div className="space-y-6">
//         {/* Series Selection */}
//         <div className="form-group">
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//             Select Series
//           </label>
//           <select
//             value={selectedSeries}
//             onChange={(e) => setSelectedSeries(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">-- Select Series --</option>
//             {seriesList.map((s) => (
//               <option key={s._id} value={s._id}>
//                 {s.title}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Season Selection */}
//         {seasonsList.length > 0 && (
//           <div className="form-group">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//               Select Season
//             </label>
//             <select
//               value={selectedSeason}
//               onChange={(e) => setSelectedSeason(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">-- Select Season --</option>
//               {seasonsList.map((s) => (
//                 <option key={s._id} value={s._id}>
//                   Season {s.seasonNumber}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Episode Form */}
//         {selectedSeason && (
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Episode Details */}
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//                   Episode Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={episodeData.name}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//                   Episode Number
//                 </label>
//                 <input
//                   type="number"
//                   name="episode_number"
//                   value={episodeData.episode_number}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div className="sm:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={episodeData.description}
//                   onChange={handleChange}
//                   rows={4}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//                   Release Date
//                 </label>
//                 <input
//                   type="date"
//                   name="release_date"
//                   value={episodeData.release_date}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//                   Video Duration (seconds)
//                 </label>
//                 <input
//                   type="number"
//                   name="video_duration"
//                   value={episodeData.video_duration}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//                   Video Type
//                 </label>
//                 <input
//                   type="text"
//                   name="video_type"
//                   value={episodeData.video_type}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </div>

//             {/* File Uploads */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium text-gray-900 dark:text-white">Media Files</h3>
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 {Object.keys(files).map((key) => (
//                   <div key={key} className="file-input-group">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
//                       {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
//                     </label>
//                     <input
//                       type="file"
//                       name={key}
//                       onChange={handleFileChange}
//                       accept={key === 'thumbnail' ? 'image/*' : 'video/*'}
//                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required={key === 'thumbnail'}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="flex justify-center">
//               <button
//                 type="submit"
//                 className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//               >
//                 Upload Episode
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   </div>
// );
// }


'use client';
import React, { useEffect, useState } from 'react';
interface Series {
  _id: string;
  title: string;
}

interface Season {
  _id: string;
  seasonNumber: number;
}

export default function EpisodesPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [seasonsList, setSeasonsList] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [trailerOption, setTrailerOption] = useState<'upload' | 'url'>('upload');
  const [trailerUrl, setTrailerUrl] = useState('');
  
  const [episodeData, setEpisodeData] = useState({
    name: '',
    description: '',
    release_date: '',
    video_duration: '',
    episode_number: '',
    video_type: '',
    video_upload_type: 'direct',
    video_extension: 'mp4',
    is_premium: '0',
    is_download: '0',
    is_like: '0',
    is_comment: '0',
    is_rent: '0',
    rent_day: '0',
  });
  

  const [files, setFiles] = useState({
    thumbnail: null as File | null,
    video_320: null as File | null,
    video_480: null as File | null,
    video_720: null as File | null,
    video_1080: null as File | null,
    trailer: null as File | null,
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch series list on component mount
  useEffect(() => {
    if (!token) return alert('You must be logged in.');

    fetch('https://shreejighutargo21.onrender.com/api/vendors/series', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setSeriesList(data.series);
        else alert('Failed to load series');
      })
      .catch(err => {
        alert('Error fetching series');
        console.error(err);
      });
  }, [token]);

  // Fetch seasons when series selected
  useEffect(() => {
    if (!selectedSeries || !token) {
      setSeasonsList([]);
      return;
    }

    fetch(`http://https://shreejighutargo21.onrender.com/api/vendors/seasons/${selectedSeries}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setSeasonsList(data.seasons);
        else setSeasonsList([]);
      })
      .catch(err => {
        console.error(err);
        setSeasonsList([]);
      });
  }, [selectedSeries, token]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEpisodeData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  
  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setFiles(prev => ({ ...prev, [e.target.name]: e.target.files![0] }));
  };

  // Handle episode form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedSeries) return alert('Select a series');
    if (!selectedSeason) return alert('Select a season');
    if (trailerOption === 'url' && !trailerUrl.trim()) {
      return alert('Please enter a trailer URL');
    }
  
    const formData = new FormData();
  
    // Append basic episode data
    formData.append('name', episodeData.name);
    formData.append('description', episodeData.description);
    formData.append('release_date', episodeData.release_date);
    formData.append('video_duration', episodeData.video_duration);
    formData.append('episode_number', episodeData.episode_number);
    formData.append('season_number', seasonsList.find(s => s._id === selectedSeason)?.seasonNumber.toString() || '');
    formData.append('series_id', selectedSeries);
    formData.append('season_id', selectedSeason);
    formData.append('video_type', episodeData.video_type);
  
    // Default fields
    formData.append('video_upload_type', 'direct');
    formData.append('video_extension', 'mp4');
    formData.append('is_premium', episodeData.is_premium);
    formData.append('is_download', episodeData.is_download);
    formData.append('is_like', episodeData.is_like);
    formData.append('is_comment', episodeData.is_comment);
    formData.append('is_rent', episodeData.is_rent);
    formData.append('rent_day', episodeData.rent_day);
  
// Handle trailer input
if (trailerOption === 'url') {
  // Change this part
  formData.append('trailer_url', trailerUrl); // Just send as trailer_url
} else if (files.trailer) {
  formData.append('trailer', files.trailer);
}

    
  
    // Append other files
    for (const key in files) {
      const file = files[key as keyof typeof files];
      if (file && key !== 'trailer') {
        formData.append(key, file);
      }
    }
  
    try {
      const res = await fetch('http://https://shreejighutargo21.onrender.com/api/vendors/episodes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const data = await res.json();
  
      if (data.success) {
        alert('Episode uploaded successfully!');
  
        // Reset form
        setEpisodeData({
          name: '',
          description: '',
          release_date: '',
          video_duration: '',
          episode_number: '',
          video_type: '',
          video_upload_type: 'direct',
          video_extension: 'mp4',
          is_premium: '0',
          is_download: '0',
          is_like: '0',
          is_comment: '0',
          is_rent: '0',
          rent_day: '0',
        });
  
        setFiles({
          thumbnail: null,
          video_320: null,
          video_480: null,
          video_720: null,
          video_1080: null,
          trailer: null,
        });
  
        setTrailerUrl('');
        setTrailerOption('upload');
      } else {
        alert('Failed to upload episode: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading episode');
    }
  };
  
return (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Upload Episode</h1>

      <div className="space-y-6">
        {/* Series Selection */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Select Series
          </label>
          <select
            value={selectedSeries}
            onChange={(e) => setSelectedSeries(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Series --</option>
            {seriesList.map((s) => (
              <option key={s._id} value={s._id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Season Selection */}
        {seasonsList.length > 0 && (
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Select Season
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Season --</option>
              {seasonsList.map((s) => (
                <option key={s._id} value={s._id}>
                  Season {s.seasonNumber}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Episode Form */}
        {selectedSeason && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Episode Details */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Episode Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={episodeData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Trailer Type</label>
  <select
    value={trailerOption}
    onChange={(e) => setTrailerOption(e.target.value as 'upload' | 'url')}
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
  >
    <option value="upload">Upload</option>
    <option value="url">External URL</option>
  </select>
</div>

{trailerOption === 'upload' ? (
  <div className="file-input-group">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
      Trailer File
    </label>
    <input
      type="file"
      name="trailer"
      onChange={handleFileChange}
      accept="video/*"
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
    />
  </div>
) : (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
      Trailer URL
    </label>
    <input
  type="url"
  name="trailer_url" // name doesn’t matter here since you're using state
  value={trailerUrl}
  onChange={(e) => setTrailerUrl(e.target.value)}
  placeholder="https://example.com/trailer.mp4"
  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
/>
  

  </div>
)}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Episode Number
                </label>
                <input
                  type="number"
                  name="episode_number"
                  value={episodeData.episode_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={episodeData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
    Is Premium
  </label>
  <select
    name="is_premium"
    value={episodeData.is_premium}
    onChange={handleChange}
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
  >
    <option value="0">No</option>
    <option value="1">Yes</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
    Allow Downloads
  </label>
  <select
    name="is_download"
    value={episodeData.is_download}
    onChange={handleChange}
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
  >
    <option value="0">No</option>
    <option value="1">Yes</option>
  </select>
</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Release Date
                </label>
                <input
                  type="date"
                  name="release_date"
                  value={episodeData.release_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Video Duration (seconds)
                </label>
                <input
                  type="number"
                  name="video_duration"
                  value={episodeData.video_duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Video Type
                </label>
                <input
                  type="text"
                  name="video_type"
                  value={episodeData.video_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Media Files</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.keys(files).map((key) => (
                  <div key={key} className="file-input-group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                    </label>
                    <input
                      type="file"
                      name={key}
                      onChange={handleFileChange}
                      accept={key === 'thumbnail' ? 'image/*' : 'video/*'}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={key === 'thumbnail'}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Upload Episode
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  </div>
);
}
