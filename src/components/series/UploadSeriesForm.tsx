

'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import Image from 'next/image';
export default function UploadSeriesForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    releaseYear: '',
    tags: '',
  });

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [landscape, setLandscape] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [landscapePreview, setLandscapePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://shreejighutargo21.onrender.com/api/admin/get_categories");
        setCategories(response.data.data); // ✅ Only set the actual array
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, files } = e.target;
  //   if (files && files.length > 0) {
  //     const file = files[0];
  //     if (name === 'thumbnail') {
  //       setThumbnail(file);
  //       setThumbnailPreview(URL.createObjectURL(file));
  //     } else if (name === 'landscape') {
  //       setLandscape(file);
  //       setLandscapePreview(URL.createObjectURL(file));
  //     }
  //   }
  // };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
  
      // If HEIC or HEIF, do not set blob preview
      if (ext === 'heic' || ext === 'heif') {
        alert("Preview for .heic images is not supported, but it will be uploaded and converted to .jpeg.");
        if (name === 'thumbnail') setThumbnail(file);
        if (name === 'landscape') setLandscape(file);
        return;
      }
  
      // For normal previewable files
      const previewUrl = URL.createObjectURL(file);
      if (name === 'thumbnail') {
        setThumbnail(file);
        setThumbnailPreview(previewUrl);
      } else if (name === 'landscape') {
        setLandscape(file);
        setLandscapePreview(previewUrl);
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
      const response = await axios.post('https://shreejighutargo21.onrender.com/api/vendors/series', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Series Title
              </label>
              <input
                name="title"
                onChange={handleChange}
                placeholder="Enter the series title"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                onChange={handleChange}
                placeholder="Enter detailed description"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category_id"
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Release Year
                </label>
                <input
                  name="releaseYear"
                  type="number"
                  onChange={handleChange}
                  placeholder="YYYY"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <input
                name="tags"
                onChange={handleChange}
                placeholder="e.g., action, drama"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* File Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail Image
                </label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {thumbnailPreview ? (
                    <Image src={thumbnailPreview} alt="Thumbnail" className="mx-auto h-32" />
                  ) : (
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <input type="file" name="thumbnail" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Landscape Image
                </label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {landscapePreview ? (
                    <Image src={landscapePreview} alt="Landscape" className="mx-auto h-32" />
                  ) : (
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <input type="file" name="landscape" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating Series...' : 'Create Series'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
