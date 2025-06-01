
// 'use client';


// import { Calendar, Clock, Film, Globe, Play, Plus, Tag, Upload, Users, X } from 'lucide-react';
// import { FormEvent, useEffect, useState } from 'react';

// interface Category { _id: string; name: string; }
// interface Type { _id: string; name: string; }
// interface Language { _id: string; name: string; }
// interface Cast { _id: string; name: string; }
// interface Banner {
//   _id: string;
//   title: string;
//   description: string;
//   duration: string;
//   releaseDate: string;
//   category: Category[];
//   type: Type;
//   language: Language;
//   cast: Cast[];
//   bannerUrl: string;
//   uploadedBy: { email: string };
// }

// const UpcomingBannerPage = () => {
//   const [banners, setBanners] = useState<Banner[]>([]);
//   const [showForm, setShowForm] = useState(false);

//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [duration, setDuration] = useState('');
//   const [releaseDate, setReleaseDate] = useState('');
//   const [category, setCategory] = useState<string[]>([]);
//   const [type, setType] = useState('');
//   const [language, setLanguage] = useState('');
//   const [cast, setCast] = useState<string[]>([]);
//   const [banner, setBanner] = useState<File | null>(null);
//   const [trailer, setTrailer] = useState<File | null>(null);

//   const [categoriesList, setCategoriesList] = useState<Category[]>([]);
//   const [typesList, setTypesList] = useState<Type[]>([]);
//   const [languagesList, setLanguagesList] = useState<Language[]>([]);
//   const [castList, setCastList] = useState<Cast[]>([]);

//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//   const fetchOptions = async () => {
//     try {
//       const headers = token ? { Authorization: `Bearer ${token}` } : {};

//       const [categoriesRes, typesRes, languagesRes, castsRes] = await Promise.all([
//         fetch('https://shreejighutargo21.onrender.com/api/admin/get_categories', { headers }),
//         fetch('https://shreejighutargo21.onrender.com/api/admin/get_types', { headers }),
//         fetch('https://shreejighutargo21.onrender.com/api/admin/get_languages', { headers }),
//         fetch('https://shreejighutargo21.onrender.com/api/vendors/get-casts', { headers }),
//       ]);

//       setCategoriesList(await categoriesRes.json().then(res => res.data || []));
//       setTypesList(await typesRes.json().then(res => res.data || []));
//       setLanguagesList(await languagesRes.json().then(res => res.data || []));
//       setCastList(await castsRes.json().then(res => res.data || []));
//     } catch (err) {
//       console.error("Failed to fetch options:", err);
//     }
//   };

//   const fetchBanners = async () => {
//     try {
//       const res = await fetch('http://localhost:9000/api/vendors/upcoming-banners');
//       const data = await res.json();
//       setBanners(data.data);
//     } catch (err) {
//       console.error("Failed to fetch banners:", err);
//     }
//   };

//   useEffect(() => {
//     fetchOptions();
//     fetchBanners();
//   }, []);

//   const resetForm = () => {
//     setTitle('');
//     setDescription('');
//     setDuration('');
//     setReleaseDate('');
//     setCategory([]);
//     setType('');
//     setLanguage('');
//     setCast([]);
//     setBanner(null);
//     setTrailer(null);
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('duration', duration);
//     formData.append('releaseDate', releaseDate);
//     formData.append('category', category.join(','));
//     formData.append('type', type);
//     formData.append('language', language);
//     formData.append('cast', cast.join(','));
//     if (banner) formData.append('banner', banner);
//     if (trailer) formData.append('trailer', trailer);

//     try {
//       const res = await fetch('http://localhost:9000/api/vendors/upcoming-banners', {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token || ''}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (res.ok) {
//         alert('Upload successful!');
//         fetchBanners();
//         resetForm();
//         setShowForm(false);
//       } else {
//         alert(`Error: ${data.message}`);
//       }
//     } catch (err) {
//       console.error("Upload failed:", err);
//     }
//   };

// return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//               Upcoming Banners
//             </h1>
//             <p className="mt-2 text-gray-600 dark:text-gray-400">
//               Manage and preview upcoming movie releases
//             </p>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setShowForm(true)}
//               className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//             >
//               <Plus className="w-5 h-5" />
//               <span className="hidden sm:inline">Upload New Banner</span>
//               <span className="sm:hidden">Upload</span>
//             </button>
//           </div>
//         </div>

//         {/* Form Modal */}
//         {showForm && (
//             <>
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>

//           <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 pt-30">
//             <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-white dark:bg-gray-800">
//               <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   Upload New Banner
//                 </h2>
//                 <button
//                   onClick={() => setShowForm(false)}
//                   className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="p-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   {/* Left Column */}
//                   <div className="space-y-6">
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
//                         <Film className="w-4 h-4 inline mr-2" />
//                         Movie Title
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="Enter movie title"
//                         value={title}
//                         onChange={e => setTitle(e.target.value)}
//                         className="w-full px-4 py-3 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
//                         Description
//                       </label>
//                       <textarea
//                         placeholder="Enter movie description"
//                         value={description}
//                         onChange={e => setDescription(e.target.value)}
//                         rows={4}
//                         className="w-full px-4 py-3 rounded-lg border transition-colors resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
//                         required
//                       />
//                     </div>

//                     {/* Duration and Release Date inputs */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
//                           <Clock className="w-4 h-4 inline mr-2" />
//                           Duration (minutes)
//                         </label>
//                         <input
//                           type="text"
//                           placeholder="120"
//                           value={duration}
//                           onChange={e => setDuration(e.target.value)}
//                           className="w-full px-4 py-3 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
//                           <Calendar className="w-4 h-4 inline mr-2" />
//                           Release Date
//                         </label>
//                         <input
//                           type="date"
//                           value={releaseDate}
//                           onChange={e => setReleaseDate(e.target.value)}
//                           className="w-full px-4 py-3 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
//                           required
//                         />
//                       </div>
//                     </div>

//                     {/* Categories */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
//                         <Tag className="w-4 h-4 inline mr-2" />
//                         Categories
//                       </label>
//                       <select
//                         multiple
//                         value={category}
//                         onChange={e => setCategory(Array.from(e.target.selectedOptions, opt => opt.value))}
//                         className="w-full px-4 py-3 rounded-lg border transition-colors h-32 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
//                       >
//                         {categoriesList.map(cat => (
//                           <option key={cat._id} value={cat._id} className="py-1">
//                             {cat.name}
//                           </option>
//                         ))}
//                       </select>
//                       <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
//                         Hold Ctrl/Cmd to select multiple categories
//                       </p>
//                     </div>
//                   </div>

//                   {/* Right Column */}
//                   <div className="space-y-6">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
//                           Type
//                         </label>
//                         <select
//                           value={type}
//                           onChange={e => setType(e.target.value)}
//                           className="w-full px-4 py-3 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
//                         >
//                           <option value="">Select Type</option>
//                           {typesList.map(t => (
//                             <option key={t._id} value={t._id}>{t.name}</option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
//                           <Globe className="w-4 h-4 inline mr-2" />
//                           Language
//                         </label>
//                         <select
//                           value={language}
//                           onChange={e => setLanguage(e.target.value)}
//                           className="w-full px-4 py-3 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
//                         >
//                           <option value="">Select Language</option>
//                           {languagesList.map(l => (
//                             <option key={l._id} value={l._id}>{l.name}</option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     {/* Cast */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
//                         <Users className="w-4 h-4 inline mr-2" />
//                         Cast
//                       </label>
//                       <select
//                         multiple
//                         value={cast}
//                         onChange={e => setCast(Array.from(e.target.selectedOptions, opt => opt.value))}
//                         className="w-full px-4 py-3 rounded-lg border transition-colors h-32 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
//                       >
//                         {castList.map(c => (
//                           <option key={c._id} value={c._id} className="py-1">
//                             {c.name}
//                           </option>
//                         ))}
//                       </select>
//                       <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
//                         Hold Ctrl/Cmd to select multiple cast members
//                       </p>
//                     </div>

//                     {/* File inputs */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
//                         <Upload className="w-4 h-4 inline mr-2" />
//                         Banner Image
//                       </label>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={e => setBanner(e.target.files?.[0] || null)}
//                         className="w-full px-4 py-3 rounded-lg border transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-200 hover:file:bg-blue-100 dark:hover:file:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
//                         <Play className="w-4 h-4 inline mr-2" />
//                         Trailer Video
//                       </label>
//                       <input
//                         type="file"
//                         accept="video/*"
//                         onChange={e => setTrailer(e.target.files?.[0] || null)}
//                         className="w-full px-4 py-3 rounded-lg border transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 file:bg-purple-50 dark:file:bg-purple-900 file:text-purple-700 dark:file:text-purple-200 hover:file:bg-purple-100 dark:hover:file:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//                   <button
//                     type="button"
//                     onClick={() => setShowForm(false)}
//                     className="px-6 py-3 rounded-lg font-medium transition-colors bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     onClick={handleSubmit}
//                     className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
//                   >
//                     Upload Banner
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           </>
//         )}

//         {/* Banner Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {banners.map(banner => (
//             <div key={banner._id} className="group rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
//               <div className="relative overflow-hidden">
//                 <img 
//                   src={banner.bannerUrl.startsWith('http') ? banner.bannerUrl : `http://localhost:9000${banner.bannerUrl}`} 
//                   alt={banner.title} 
//                   className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-110" 
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//               </div>
              
//               <div className="p-4 sm:p-5">
//                 <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white">
//                   {banner.title}
//                 </h3>
                
//                 <p className="text-sm mb-4 line-clamp-3 text-gray-600 dark:text-gray-400">
//                   {banner.description}
//                 </p>
                
//                 <div className="space-y-2 text-xs">
//                   <div className="flex items-center gap-2">
//                     <Tag className="w-3 h-3 text-blue-500" />
//                     <span className="text-gray-600 dark:text-gray-400">
//                       {banner.category.map(c => c.name).join(', ') || 'N/A'}
//                     </span>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     <Film className="w-3 h-3 text-green-500" />
//                     <span className="text-gray-600 dark:text-gray-400">
//                       {banner.type?.name || 'N/A'}
//                     </span>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     <Globe className="w-3 h-3 text-purple-500" />
//                     <span className="text-gray-600 dark:text-gray-400">
//                       {banner.language?.name || 'N/A'}
//                     </span>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     <Users className="w-3 h-3 text-orange-500" />
//                     <span className="text-gray-600 dark:text-gray-400 line-clamp-1">
//                       {banner.cast.map(c => c.name).join(', ') || 'N/A'}
//                     </span>
//                   </div>
                  
//                   <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-3 h-3 text-red-500" />
//                       <span className="text-gray-600 dark:text-gray-400">
//                         {banner.duration} mins
//                       </span>
//                     </div>
                    
//                     <div className="flex items-center gap-1">
//                       <Calendar className="w-3 h-3 text-indigo-500" />
//                       <span className="text-gray-600 dark:text-gray-400">
//                         {new Date(banner.releaseDate).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
                  
//                   <div className="text-xs text-gray-500 dark:text-gray-400 pt-1">
//                     Uploaded by: {banner.uploadedBy?.email || 'Unknown'}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {banners.length === 0 && (
//           <div className="text-center py-16 text-gray-500 dark:text-gray-400">
//             <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
//             <h3 className="text-lg font-medium mb-2">No banners yet</h3>
//             <p>Upload your first banner to get started</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );

// };

// export default UpcomingBannerPage;
'use client';

import { Calendar, Clock, Film, Globe, Play, Plus, Tag, Upload, Users, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

interface Category { _id: string; name: string; }
interface Type { _id: string; name: string; }
interface Language { _id: string; name: string; }
interface Cast { _id: string; name: string; }
interface Banner {
  _id: string;
  title: string;
  description: string;
  duration: string;
  releaseDate: string;
  category: Category[];
  type: Type;
  language: Language;
  cast: Cast[];
  bannerUrl: string;
  uploadedBy: { email: string };
}

const UpcomingBannerPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [category, setCategory] = useState<string[]>([]);
  const [type, setType] = useState('');
  const [language, setLanguage] = useState('');
  const [cast, setCast] = useState<string[]>([]);
  const [banner, setBanner] = useState<File | null>(null);
  const [trailer, setTrailer] = useState<File | null>(null);

  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [typesList, setTypesList] = useState<Type[]>([]);
  const [languagesList, setLanguagesList] = useState<Language[]>([]);
  const [castList, setCastList] = useState<Cast[]>([]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchOptions = async () => {
    try {
      // Fix: Create proper RequestInit object
      const requestInit: RequestInit = token 
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const [categoriesRes, typesRes, languagesRes, castsRes] = await Promise.all([
        fetch('https://shreejighutargo21.onrender.com/api/admin/get_categories', requestInit),
        fetch('https://shreejighutargo21.onrender.com/api/admin/get_types', requestInit),
        fetch('https://shreejighutargo21.onrender.com/api/admin/get_languages', requestInit),
        fetch('https://shreejighutargo21.onrender.com/api/vendors/get-casts', requestInit),
      ]);

      setCategoriesList(await categoriesRes.json().then(res => res.data || []));
      setTypesList(await typesRes.json().then(res => res.data || []));
      setLanguagesList(await languagesRes.json().then(res => res.data || []));
      setCastList(await castsRes.json().then(res => res.data || []));
    } catch (err) {
      console.error("Failed to fetch options:", err);
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await fetch('http://localhost:9000/api/vendors/upcoming-banners');
      const data = await res.json();
      setBanners(data.data);
    } catch (err) {
      console.error("Failed to fetch banners:", err);
    }
  };

  useEffect(() => {
    fetchOptions();
    fetchBanners();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDuration('');
    setReleaseDate('');
    setCategory([]);
    setType('');
    setLanguage('');
    setCast([]);
    setBanner(null);
    setTrailer(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('duration', duration);
    formData.append('releaseDate', releaseDate);
    formData.append('category', category.join(','));
    formData.append('type', type);
    formData.append('language', language);
    formData.append('cast', cast.join(','));
    if (banner) formData.append('banner', banner);
    if (trailer) formData.append('trailer', trailer);

    try {
      // Fix: Create proper RequestInit object
      const requestInit: RequestInit = {
        method: 'POST',
        body: formData,
      };

      if (token) {
        requestInit.headers = { Authorization: `Bearer ${token}` };
      }

      const res = await fetch('http://localhost:9000/api/vendors/upcoming-banners', requestInit);

      const data = await res.json();
      if (res.ok) {
        alert('Upload successful!');
        fetchBanners();
        resetForm();
        setShowForm(false);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Upcoming Banners
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage and preview upcoming movie releases
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Upload New Banner</span>
              <span className="sm:hidden">Upload</span>
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
            <>
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>

          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 pt-30">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-white dark:bg-gray-800">
              <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Upload New Banner
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                        <Film className="w-4 h-4 inline mr-2" />
                        Movie Title
                      </label>
                      <input
                        type="text"
                        placeholder="Enter movie title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                        Description
                      </label>
                      <textarea
                        placeholder="Enter movie description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border transition-colors resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                        required
                      />
                    </div>

                    {/* Duration and Release Date inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                          <Clock className="w-4 h-4 inline mr-2" />
                          Duration (minutes)
                        </label>
                        <input
                          type="text"
                          placeholder="120"
                          value={duration}
                          onChange={e => setDuration(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Release Date
                        </label>
                        <input
                          type="date"
                          value={releaseDate}
                          onChange={e => setReleaseDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                          required
                        />
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                        <Tag className="w-4 h-4 inline mr-2" />
                        Categories
                      </label>
                      <select
                        multiple
                        value={category}
                        onChange={e => setCategory(Array.from(e.target.selectedOptions, opt => opt.value))}
                        className="w-full px-4 py-3 rounded-lg border transition-colors h-32 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                      >
                        {categoriesList.map(cat => (
                          <option key={cat._id} value={cat._id} className="py-1">
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                        Hold Ctrl/Cmd to select multiple categories
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                          Type
                        </label>
                        <select
                          value={type}
                          onChange={e => setType(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                        >
                          <option value="">Select Type</option>
                          {typesList.map(t => (
                            <option key={t._id} value={t._id}>{t.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                          <Globe className="w-4 h-4 inline mr-2" />
                          Language
                        </label>
                        <select
                          value={language}
                          onChange={e => setLanguage(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                        >
                          <option value="">Select Language</option>
                          {languagesList.map(l => (
                            <option key={l._id} value={l._id}>{l.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Cast */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                        <Users className="w-4 h-4 inline mr-2" />
                        Cast
                      </label>
                      <select
                        multiple
                        value={cast}
                        onChange={e => setCast(Array.from(e.target.selectedOptions, opt => opt.value))}
                        className="w-full px-4 py-3 rounded-lg border transition-colors h-32 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                      >
                        {castList.map(c => (
                          <option key={c._id} value={c._id} className="py-1">
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                        Hold Ctrl/Cmd to select multiple cast members
                      </p>
                    </div>

                    {/* File inputs */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                        <Upload className="w-4 h-4 inline mr-2" />
                        Banner Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setBanner(e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 rounded-lg border transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-200 hover:file:bg-blue-100 dark:hover:file:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                        <Play className="w-4 h-4 inline mr-2" />
                        Trailer Video
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={e => setTrailer(e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 rounded-lg border transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 file:bg-purple-50 dark:file:bg-purple-900 file:text-purple-700 dark:file:text-purple-200 hover:file:bg-purple-100 dark:hover:file:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 rounded-lg font-medium transition-colors bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Upload Banner
                  </button>
                </div>
              </div>
            </div>
          </div>
          </>
        )}

        {/* Banner Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {banners.map(banner => (
            <div key={banner._id} className="group rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="relative overflow-hidden">
                <img 
                  src={banner.bannerUrl.startsWith('http') ? banner.bannerUrl : `http://localhost:9000${banner.bannerUrl}`} 
                  alt={banner.title} 
                  className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-4 sm:p-5">
                <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white">
                  {banner.title}
                </h3>
                
                <p className="text-sm mb-4 line-clamp-3 text-gray-600 dark:text-gray-400">
                  {banner.description}
                </p>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {banner.category.map(c => c.name).join(', ') || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Film className="w-3 h-3 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {banner.type?.name || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-purple-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {banner.language?.name || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-orange-500" />
                    <span className="text-gray-600 dark:text-gray-400 line-clamp-1">
                      {banner.cast.map(c => c.name).join(', ') || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-red-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {banner.duration} mins
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {new Date(banner.releaseDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                    Uploaded by: {banner.uploadedBy?.email || 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {banners.length === 0 && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No banners yet</h3>
            <p>Upload your first banner to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default UpcomingBannerPage;