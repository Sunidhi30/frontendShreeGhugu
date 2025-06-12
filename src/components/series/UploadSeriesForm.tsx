

'use client';

import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
export default function UploadSeriesForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    releaseYear: '',
    channel_id: '',
    language_id: '',
    type_id: '', 
    video_type: '', 
    tags: '',
  });
  const VIDEO_TYPES = [
    { id: 'movie', name: 'Movie' },
    { id: 'series', name: 'Series' },
    { id: 'show', name: 'Show' }
  ];
  
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [landscape, setLandscape] = useState<File | null>(null);
  const [types, setTypes] = useState<{ _id: string; name: string }[]>([]);

  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [landscapePreview, setLandscapePreview] = useState<string | null>(null);
  const [languages, setLanguages] = useState<{ _id: string; name: string }[]>([]);
  const [channels, setChannels] = useState<{ _id: string; name: string }[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [categoriesRes, languagesRes, channelsRes, typesRes] = await Promise.all([
          axios.get("http://localhost:9000/api/admin/get_categories"),
          axios.get("http://localhost:9000/api/admin/get_languages"),
          axios.get("http://localhost:9000/api/vendors/get-channels", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get("http://localhost:9000/api/admin/get_types") // Add this new API call
        ]);
        
        setCategories(categoriesRes.data.data);
        setLanguages(languagesRes.data.data);
        setChannels(channelsRes.data.channels || []);
        setTypes(typesRes.data.data || []); // Store the types
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
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
    formData.append('language_id', form.language_id); // Add this line
    formData.append('video_type', form.video_type); // Add this line
    formData.append('type_id', form.type_id); // Changed from video_type to type_id





    if (thumbnail) formData.append('thumbnail', thumbnail);
    if (landscape) formData.append('landscape', landscape);

    try {
      const response = await axios.post('http://localhost:9000/api/vendors/series', formData, {
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
        Content Type
      </label>
      <select
        name="type_id"
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        required
      >
        <option value="">Select a content type</option>
        {types.map((type) => (
          <option key={type._id} value={type._id}>
            {type.name}
          </option>
        ))}
      </select>
    </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Language
    </label>
    <select
      name="language_id"
      onChange={handleChange}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
      required
    >
      <option value="">Select a language</option>
      {languages.map((lang) => (
        <option key={lang._id} value={lang._id}>
          {lang.name}
        </option>
      ))}
    </select>
  </div> 
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Video Type
    </label>
    <select
      name="video_type"
      onChange={handleChange}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
      required
    >
      <option value="">Select a video type</option>
      {VIDEO_TYPES.map((type) => (
        <option key={type.id} value={type.id}>
          {type.name}
        </option>
      ))}
    </select>
  </div>
   <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Channel
    </label>
    <select
      name="channel_id"
      onChange={handleChange}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
      required
    >
      <option value="">Select a channel</option>
      {channels.map((channel) => (
        <option key={channel._id} value={channel._id}>
          {channel.name}
        </option>
      ))}
    </select>
  </div>

 
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
  <Image 
    src={thumbnailPreview} 
    alt="Thumbnail" 
    width={128} // Add specific width
    height={128} // Add specific height
    className="mx-auto h-32 object-contain" 
  />
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
  <Image 
    src={landscapePreview} 
    alt="Landscape" 
    width={128} // Add specific width
    height={128} // Add specific height
    className="mx-auto h-32 object-contain"
  />
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
