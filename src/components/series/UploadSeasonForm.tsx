// 'use client';

// import axios from 'axios';
// import { useState } from 'react';

// export default function UploadSeasonForm() {
//   const [form, setForm] = useState({
//     seasonNumber: '',
//     title: '',
//     description: '',
//     releaseDate: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const token = localStorage.getItem('token');
//     const seriesId = localStorage.getItem('seriesId');

//     if (!token) {
//       alert('User is not authenticated!');
//       return;
//     }

//     if (!seriesId) {
//       alert('No series ID found. Please upload a series first.');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `http://localhost:9000/api/vendors/series/${seriesId}/seasons`,
//         {
//           seasonNumber: form.seasonNumber,
//           title: form.title,
//           description: form.description,
//           releaseDate: form.releaseDate,
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
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
//     <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
//       <input
//         name="seasonNumber"
//         placeholder="Season Number"
//         onChange={handleChange}
//         className="border p-2 w-full"
//         type="number"
//       />
//       <input
//         name="title"
//         placeholder="Title"
//         onChange={handleChange}
//         className="border p-2 w-full"
//       />
//       <textarea
//         name="description"
//         placeholder="Description"
//         onChange={handleChange}
//         className="border p-2 w-full"
//       />
//       <input
//         name="releaseDate"
//         placeholder="Release Date (YYYY-MM-DD)"
//         onChange={handleChange}
//         className="border p-2 w-full"
//         type="date"
//       />

//       <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
//         Submit Season
//       </button>
//     </form>
//   );
// }
'use client';

import axios from 'axios';
import { useState } from 'react';

export default function UploadSeasonForm() {
  const [form, setForm] = useState({
    seasonNumber: '',
    title: '',
    description: '',
    releaseDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const seriesId = localStorage.getItem('seriesId');

    if (!token) return alert('User is not authenticated!');
    if (!seriesId) return alert('No series ID found. Please upload a series first.');

    try {
      const response = await axios.post(
        `http://localhost:9000/api/vendors/series/${seriesId}/seasons`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Season added successfully!');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to add season.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Season</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Season Number</label>
          <input
            name="seasonNumber"
            type="number"
            value={form.seasonNumber}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            placeholder="e.g. 1"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            placeholder="e.g. Stranger Things"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
            placeholder="Write a short summary..."
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Release Date</label>
          <input
            name="releaseDate"
            type="date"
            value={form.releaseDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
        >
          Submit Season
        </button>
      </form>
    </div>
  );
}
