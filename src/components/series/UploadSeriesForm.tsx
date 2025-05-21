// 'use client';

// import axios from 'axios';
// import { useState } from 'react';

// export default function UploadSeriesForm() {
//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     category_id: '',
//     releaseYear: '',
//     tags: '',
//   });

//   const [thumbnail, setThumbnail] = useState<File | null>(null);
//   const [landscape, setLandscape] = useState<File | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, files } = e.target;
//     if (files && files.length > 0) {
//       if (name === 'thumbnail') setThumbnail(files[0]);
//       else if (name === 'landscape') setLandscape(files[0]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('User is not authenticated!');
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append('title', form.title);
//     formData.append('description', form.description);
//     formData.append('category_id', form.category_id);
//     formData.append('releaseYear', form.releaseYear);
//     formData.append('tags', form.tags);
  
//     if (thumbnail) formData.append('thumbnail', thumbnail);
//     if (landscape) formData.append('landscape', landscape);
  
//     try {
//       const response = await axios.post(
//         'http://localhost:9000/api/vendors/series',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
  
//       alert('Series created successfully!');
//       console.log(response.data);
  
//       // Save seriesId to localStorage (adjust the path to your actual response structure)
//       // For example, if response.data contains { series: { _id: 'abc123', ... } }
//       const newSeriesId = response.data.series?._id || response.data._id; 
//       if (newSeriesId) {
//         localStorage.setItem('seriesId', newSeriesId);
//       } else {
//         console.warn('No seriesId found in response to save.');
//       }
  
//     } catch (error) {
//       console.error(error);
//       alert('Failed to create series.');
//     }
//   };
  
// return (
//   <form onSubmit={handleSubmit} className="space-y-4 max-w-xl dark:bg-gray-900">
//     <input 
//       name="title" 
//       placeholder="Title" 
//       onChange={handleChange} 
//       className="border p-2 w-full dark:bg-gray-800 dark:border-gray-800 dark:text-white dark:placeholder-gray-400" 
//     />
    
//     <textarea 
//       name="description" 
//       placeholder="Description" 
//       onChange={handleChange} 
//       className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
//     />
    
//     <input 
//       name="category_id" 
//       placeholder="Category ID" 
//       onChange={handleChange} 
//       className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
//     />
    
//     <input 
//       name="releaseYear" 
//       placeholder="Release Year" 
//       onChange={handleChange} 
//       className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
//     />
    
//     <input 
//       name="tags" 
//       placeholder="Tags (comma separated)" 
//       onChange={handleChange} 
//       className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
//     />

//     <div>
//       <label className="dark:text-white">Thumbnail:</label>
//       <input 
//         type="file" 
//         name="thumbnail" 
//         accept="image/*" 
//         onChange={handleFileChange} 
//         className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
//       />
//     </div>
    
//     <div>
//       <label className="dark:text-white">Landscape:</label>
//       <input 
//         type="file" 
//         name="landscape" 
//         accept="image/*" 
//         onChange={handleFileChange} 
//         className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
//       />
//     </div>

//     <button 
//       type="submit" 
//       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//     >
//       Submit
//     </button>
//   </form>
// );
// }

'use client';

import axios from 'axios';
import { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

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
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [landscapePreview, setLandscapePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      if (name === 'thumbnail') {
        setThumbnail(file);
        setThumbnailPreview(URL.createObjectURL(file));
      } else if (name === 'landscape') {
        setLandscape(file);
        setLandscapePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('User is not authenticated!');
      setLoading(false);
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
      const newSeriesId = response.data.series?._id || response.data._id;
      if (newSeriesId) {
        localStorage.setItem('seriesId', newSeriesId);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create series.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Create New Series
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Series Title
              </label>
              <input
                name="title"
                placeholder="Enter the series title"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-150"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Enter detailed description"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-150"
                required
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category ID
                </label>
                <input
                  name="category_id"
                  placeholder="Enter category ID"
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-150"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Release Year
                </label>
                <input
                  name="releaseYear"
                  type="number"
                  placeholder="YYYY"
                  min="1900"
                  max={new Date().getFullYear()}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-150"
                  required
                />
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <input
                name="tags"
                placeholder="Enter tags separated by commas (e.g., action, drama, comedy)"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-150"
              />
            </div>

            {/* File Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-500 transition duration-150">
                  <div className="space-y-2 text-center">
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Thumbnail preview" className="mx-auto h-32 w-auto" />
                    ) : (
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          name="thumbnail"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Landscape Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Landscape Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-500 transition duration-150">
                  <div className="space-y-2 text-center">
                    {landscapePreview ? (
                      <img src={landscapePreview} alt="Landscape preview" className="mx-auto h-32 w-auto" />
                    ) : (
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          name="landscape"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Series...
                  </>
                ) : (
                  'Create Series'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
