'use client';

import axios from 'axios';
import { useState } from 'react';

export default function UploadSeriesForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    releaseYear: '',
    tags: '',
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [landscape, setLandscape] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === 'thumbnail') setThumbnail(files[0]);
      else if (name === 'landscape') setLandscape(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('User is not authenticated!');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category_id', form.category_id);
    formData.append('releaseYear', form.releaseYear);
    formData.append('tags', form.tags);
  
    if (thumbnail) formData.append('thumbnail', thumbnail);
    if (landscape) formData.append('landscape', landscape);
  
    try {
      const response = await axios.post(
        'http://localhost:9000/api/vendors/series',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      alert('Series created successfully!');
      console.log(response.data);
  
      // Save seriesId to localStorage (adjust the path to your actual response structure)
      // For example, if response.data contains { series: { _id: 'abc123', ... } }
      const newSeriesId = response.data.series?._id || response.data._id; 
      if (newSeriesId) {
        localStorage.setItem('seriesId', newSeriesId);
      } else {
        console.warn('No seriesId found in response to save.');
      }
  
    } catch (error) {
      console.error(error);
      alert('Failed to create series.');
    }
  };
  

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
//       <input name="title" placeholder="Title" onChange={handleChange} className="border p-2 w-full" />
//       <textarea name="description" placeholder="Description" onChange={handleChange} className="border p-2 w-full" />
//       <input name="category_id" placeholder="Category ID" onChange={handleChange} className="border p-2 w-full" />
//       <input name="releaseYear" placeholder="Release Year" onChange={handleChange} className="border p-2 w-full" />
//       <input name="tags" placeholder="Tags (comma separated)" onChange={handleChange} className="border p-2 w-full" />

//       <div>
//         <label>Thumbnail:</label>
//         <input type="file" name="thumbnail" accept="image/*" onChange={handleFileChange} className="border p-2 w-full" />
//       </div>
//       <div>
//         <label>Landscape:</label>
//         <input type="file" name="landscape" accept="image/*" onChange={handleFileChange} className="border p-2 w-full" />
//       </div>

//       <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
//     </form>
//   );
// }
return (
  <form onSubmit={handleSubmit} className="space-y-4 max-w-xl dark:bg-gray-900">
    <input 
      name="title" 
      placeholder="Title" 
      onChange={handleChange} 
      className="border p-2 w-full dark:bg-gray-800 dark:border-gray-800 dark:text-white dark:placeholder-gray-400" 
    />
    
    <textarea 
      name="description" 
      placeholder="Description" 
      onChange={handleChange} 
      className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
    />
    
    <input 
      name="category_id" 
      placeholder="Category ID" 
      onChange={handleChange} 
      className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
    />
    
    <input 
      name="releaseYear" 
      placeholder="Release Year" 
      onChange={handleChange} 
      className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
    />
    
    <input 
      name="tags" 
      placeholder="Tags (comma separated)" 
      onChange={handleChange} 
      className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
    />

    <div>
      <label className="dark:text-white">Thumbnail:</label>
      <input 
        type="file" 
        name="thumbnail" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
      />
    </div>
    
    <div>
      <label className="dark:text-white">Landscape:</label>
      <input 
        type="file" 
        name="landscape" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
      />
    </div>

    <button 
      type="submit" 
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
    >
      Submit
    </button>
  </form>
);
}