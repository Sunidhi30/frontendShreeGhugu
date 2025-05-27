// page.tsx
'use client';

import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

// Types
interface Cast {
  _id: string;
  name: string;
  image: string;
  type: string;
  personal_info?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

interface CastFormData {
  name: string;
  type: string;
  image: File | null;
}

const CastsPage = () => {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<CastFormData>({
    name: '',
    type: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    fetchCasts();
  }, []);

  const fetchCasts = async () => {
    try {
      const response = await fetch('https://shreejighutargo21.onrender.com/api/vendors/get-casts');
      const data = await response.json();
      setCasts(data.casts);
    } catch (error) {
      console.error('Error fetching casts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token'); // Get the token from local storage
  
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type', formData.type);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
  
      const response = await fetch('https://shreejighutargo21.onrender.com/api/vendors/add-cast', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add cast');
      }
  
      const result = await response.json();
      setCasts(prev => [...prev, result.cast]);
      setIsModalOpen(false);
      resetForm();
      fetchCasts(); // Refresh the list
    } catch (error) {
      console.error('Error adding cast:', error);
      alert('Failed to add cast. Please try again.');
    }
  };
  

  const resetForm = () => {
    setFormData({ name: '', type: '', image: null });
    setPreviewImage('');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    // <div className="container mx-auto px-4 py-8">
    //   {/* Header */}
    //   <div className="flex justify-between items-center mb-8">
    //     <h1 className="text-3xl font-bold">Cast Members</h1>
    //     <button
    //       onClick={() => setIsModalOpen(true)}
    //       className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
    //     >
    //       <span className="text-xl mr-1">+</span> Add Cast
    //     </button>
    //   </div>

    //   {/* Cast List */}
    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {casts.map((cast) => (
    //       <div
    //         key={cast._id}
    //         className="bg-white rounded-lg shadow-md overflow-hidden"
    //       >
    //         <div className="relative h-48 w-full">
    //           <Image
    //             src={cast.image}
    //             alt={cast.name}
    //             fill
    //             className="object-cover"
    //           />
    //         </div>
    //         <div className="p-4">
    //           <h2 className="text-xl font-semibold">{cast.name}</h2>
    //           <p className="text-gray-600 mt-2">Type: {cast.type}</p>
    //           {cast.personal_info && (
    //             <p className="text-gray-500 mt-2">{cast.personal_info}</p>
    //           )}
    //           <p className="text-sm text-gray-400 mt-2">
    //             Added: {new Date(cast.createdAt).toLocaleDateString()}
    //           </p>
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   {/* Add Cast Modal */}
    //   {isModalOpen && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    //       <div className="bg-white rounded-lg p-6 w-full max-w-md">
    //         <div className="flex justify-between items-center mb-4">
    //           <h2 className="text-2xl font-bold">Add New Cast</h2>
    //           <button
    //             onClick={() => {
    //               setIsModalOpen(false);
    //               resetForm();
    //             }}
    //             className="text-gray-500 hover:text-gray-700"
    //           >
    //             ×
    //           </button>
    //         </div>

    //         <form onSubmit={handleSubmit}>
    //           <div className="mb-4">
    //             <label className="block text-gray-700 mb-2">Name</label>
    //             <input
    //               type="text"
    //               name="name"
    //               value={formData.name}
    //               onChange={handleInputChange}
    //               className="w-full border rounded-lg px-3 py-2"
    //               required
    //             />
    //           </div>

    //           <div className="mb-4">
    //             <label className="block text-gray-700 mb-2">Type</label>
    //             <input
    //               type="text"
    //               name="type"
    //               value={formData.type}
    //               onChange={handleInputChange}
    //               className="w-full border rounded-lg px-3 py-2"
    //               required
    //             />
    //           </div>

    //           <div className="mb-4">
    //             <label className="block text-gray-700 mb-2">Image</label>
    //             <input
    //               type="file"
    //               accept="image/*"
    //               onChange={handleImageChange}
    //               className="w-full"
    //               required
    //             />
    //             {previewImage && (
    //               <div className="mt-2 relative h-32 w-full">
    //                 <Image
    //                   src={previewImage}
    //                   alt="Preview"
    //                   fill
    //                   className="object-contain"
    //                 />
    //               </div>
    //             )}
    //           </div>

    //           <div className="flex justify-end gap-2">
    //             <button
    //               type="button"
    //               onClick={() => {
    //                 setIsModalOpen(false);
    //                 resetForm();
    //               }}
    //               className="px-4 py-2 text-gray-600 hover:text-gray-800"
    //             >
    //               Cancel
    //             </button>
    //             <button
    //               type="submit"
    //               className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
    //             >
    //               Add Cast
    //             </button>
    //           </div>
    //         </form>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="container mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
  {/* Header */}
  <div className="flex justify-between items-center mb-8">
    <h1 className="text-3xl font-bold">Cast Members</h1>
    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
    >
      <span className="text-xl mr-1">+</span> Add Cast
    </button>
  </div>

  {/* Cast List */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {casts.map((cast) => (
      <div
        key={cast._id}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <div className="relative h-48 w-full">
          <Image
            src={cast.image}
            alt={cast.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold">{cast.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Type: {cast.type}</p>
          {cast.personal_info && (
            <p className="text-gray-500 dark:text-gray-400 mt-2">{cast.personal_info}</p>
          )}
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Added: {new Date(cast.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    ))}
  </div>

  {/* Add Cast Modal */}
  {isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New Cast</h2>
          <button
            onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
              required
            />
            {previewImage && (
              <div className="mt-2 relative h-32 w-full">
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add Cast
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>

  );
};

export default CastsPage;
