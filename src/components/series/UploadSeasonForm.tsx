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

    if (!token) {
      alert('User is not authenticated!');
      return;
    }

    if (!seriesId) {
      alert('No series ID found. Please upload a series first.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:9000/api/vendors/series/${seriesId}/seasons`,
        {
          seasonNumber: form.seasonNumber,
          title: form.title,
          description: form.description,
          releaseDate: form.releaseDate,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <input
        name="seasonNumber"
        placeholder="Season Number"
        onChange={handleChange}
        className="border p-2 w-full"
        type="number"
      />
      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="releaseDate"
        placeholder="Release Date (YYYY-MM-DD)"
        onChange={handleChange}
        className="border p-2 w-full"
        type="date"
      />

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Submit Season
      </button>
    </form>
  );
}
