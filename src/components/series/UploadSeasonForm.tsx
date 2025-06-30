
// // 'use client';

// // import axios from 'axios';
// // import { useState } from 'react';

// // export default function UploadSeasonForm() {
// //   const [form, setForm] = useState({
// //     seasonNumber: '',
// //     title: '',
// //     description: '',
// //     releaseDate: '',
// //   });

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     const token = localStorage.getItem('token');
// //     const seriesId = localStorage.getItem('seriesId');

// //     if (!token) return alert('User is not authenticated!');
// //     if (!seriesId) return alert('No series ID found. Please upload a series first.');

// //     try {
// //       const response = await axios.post(
// //         `https://shreejighutargo21.onrender.com/api/vendors/series/${seriesId}/seasons`,
// //         form,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       alert('Season added successfully!');
// //       console.log(response.data);
// //     } catch (error) {
// //       console.error(error);
// //       alert('Failed to add season.');
// //     }
// //   };

// //   return (
// //     <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
// //       <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Season</h2>
// //       <form onSubmit={handleSubmit} className="space-y-5">
// //         <div>
// //           <label className="block mb-1 text-sm font-medium text-gray-700">Season Number</label>
// //           <input
// //             name="seasonNumber"
// //             type="number"
// //             value={form.seasonNumber}
// //             onChange={handleChange}
// //             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
// //             placeholder="e.g. 1"
// //           />
// //         </div>

// //         <div>
// //           <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
// //           <input
// //             name="title"
// //             value={form.title}
// //             onChange={handleChange}
// //             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
// //             placeholder="e.g. Stranger Things"
// //           />
// //         </div>

// //         <div>
// //           <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
// //           <textarea
// //             name="description"
// //             value={form.description}
// //             onChange={handleChange}
// //             rows={4}
// //             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
// //             placeholder="Write a short summary..."
// //           />
// //         </div>

// //         <div>
// //           <label className="block mb-1 text-sm font-medium text-gray-700">Release Date</label>
// //           <input
// //             name="releaseDate"
// //             type="date"
// //             value={form.releaseDate}
// //             onChange={handleChange}
// //             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
// //           />
// //         </div>

// //         <button
// //           type="submit"
// //           className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
// //         >
// //           Submit Season
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }


// 'use client';

// import axios from 'axios';
// import { useState } from 'react';

// export default function UploadSeasonForm() {
//   const [form, setForm] = useState({
//     seasonNumber: '',
//     title: '',
//     description: '',
//     releaseDate: '',
//     trailer_url: '',
//     trailerFile: null,
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const token = localStorage.getItem('token');
//     const seriesId = localStorage.getItem('seriesId');

//     if (!token) return alert('User is not authenticated!');
//     if (!seriesId) return alert('No series ID found. Please upload a series first.');

//     try {
//       const formData = new FormData();
//       formData.append('seasonNumber', form.seasonNumber);
//       formData.append('title', form.title);
//       formData.append('description', form.description);
//       formData.append('releaseDate', form.releaseDate);

//       if (form.trailerFile) {
//         formData.append('trailer_url', form.trailerFile); // file upload
//       } else if (form.trailer_url) {
//         formData.append('trailer_url', form.trailer_url); // external link
//       }

//       const response = await axios.post(
//         `http://localhost:9000/api/vendors/series/${seriesId}/seasons`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       alert('Season added successfully!');
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//       alert('Failed to add season.');
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
//       <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
//         Add New Season
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div>
//           <label className="block mb-1 text-sm font-medium text-gray-700">
//             Season Number
//           </label>
//           <input
//             name="seasonNumber"
//             type="number"
//             value={form.seasonNumber}
//             onChange={handleChange}
//             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//             placeholder="e.g. 1"
//           />
//         </div>

//         <div>
//           <label className="block mb-1 text-sm font-medium text-gray-700">
//             Title
//           </label>
//           <input
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//             placeholder="e.g. Stranger Things"
//           />
//         </div>

//         <div>
//           <label className="block mb-1 text-sm font-medium text-gray-700">
//             Description
//           </label>
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             rows={4}
//             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
//             placeholder="Write a short summary..."
//           />
//         </div>

//         <div>
//           <label className="block mb-1 text-sm font-medium text-gray-700">
//             Release Date
//           </label>
//           <input
//             name="releaseDate"
//             type="date"
//             value={form.releaseDate}
//             onChange={handleChange}
//             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//           />
//         </div>

//         <div>
//           <label className="block mb-1 text-sm font-medium text-gray-700">
//             Trailer Upload or External Link
//           </label>

//           {/* File upload */}
//           <input
//             name="trailerFile"
//             type="file"
//             accept="video/*"
//             onChange={(e) =>
//               setForm({ ...form, trailerFile: e.target.files?.[0] || null })
//             }
//             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//           />

//           <p className="text-sm text-gray-500 mt-1">
//             Or paste an external link below:
//           </p>

//           {/* External trailer URL */}
//           <input
//             name="trailer_url"
//             type="text"
//             value={form.trailer_url}
//             onChange={handleChange}
//             className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition mt-1"
//             placeholder="https://example.com/trailer.mp4"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
//         >
//           Submit Season
//         </button>
//       </form>
//     </div>
//   );
// }
