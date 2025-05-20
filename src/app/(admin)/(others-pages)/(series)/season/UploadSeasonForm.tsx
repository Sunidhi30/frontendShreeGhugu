'use client';

import axios from 'axios';
import { useState } from 'react';

export default function UploadSeasonForm() {
  const [seasons, setSeasons] = useState([{
    name: '',
    description: ''
  }]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const showId = localStorage.getItem('showId'); // Make sure you store showId when selecting a TV show

    if (!token) {
      alert('User is not authenticated!');
      return;
    }

    if (!showId) {
      alert('No show ID found. Please select a TV show first.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:9000/api/tvshows/${showId}/seasons`,
        {
          seasons: seasons
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      alert('Seasons added successfully!');
      console.log(response.data);
      // Reset form
      setSeasons([{ name: '', description: '' }]);
    } catch (error) {
      console.error(error);
      alert('Failed to add seasons.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
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
            onChange={(e) => handleChange(index, e)}
            className="border p-2 w-full"
            required
          />
          
          <textarea
            name="description"
            placeholder="Description"
            value={season.description}
            onChange={(e) => handleChange(index, e)}
            className="border p-2 w-full"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addSeason}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Add Another Season
      </button>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit All Seasons
      </button>
    </form>
  );
}
