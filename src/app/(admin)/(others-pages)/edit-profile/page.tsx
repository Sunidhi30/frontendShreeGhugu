
'use client';
import { PencilIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
export default function EditProfilePage() {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    status: '',
    image: '',  
    totalUsers: 0,
    totalVideos: 0,
    totalViews: 0,
    wallet: 0,
    lockedBalance: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const defaultImage = 'https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-875.jpg?semt=ais_hybrid&w=740';
  useEffect(() => {
    async function fetchVendorProfile() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:9000/api/vendors/get-profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        });

        if (res.status === 401) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.success && data.vendor) {
          setFormData(prev => ({
            ...prev,
            ...data.vendor,
          }));
        } else {
          console.error('Failed to load vendor data');
        }
      } catch (err) {
        console.error('Error fetching vendor profile:', err);
      }
    }
    fetchVendorProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFormData(prev  => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();

      form.append('username', formData.username);
      form.append('email', formData.email);
      form.append('fullName', formData.fullName);
      if (formData.password) form.append('password', formData.password);
      if (imageFile) form.append('image', imageFile);

      const res = await fetch('http://localhost:9000/api/vendors/update-profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const result = await res.json();
      if (res.ok && result.success) {
        alert('Profile updated successfully!');
        setEditMode(false);
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 space-y-8">
      <h2 className="text-2xl font-semibold dark:text-white">Vendor Profile</h2>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src={formData.image || defaultImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          <div>
            <h3 className="text-xl font-semibold dark:text-white">{formData.username}</h3>
            <p className="text-sm dark:text-white">{formData.fullName}</p>
            <p className="text-sm dark:text-white">Status: {formData.status}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setEditMode(prev => !prev)}
          className="text-blue-500 hover:underline flex items-center space-x-1"
        >
          <PencilIcon className="h-4 w-4" />
          <span className="dark:text-white">{editMode ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <h4 className="text-md font-medium dark:text-white">Account Info</h4>
        <div className="grid grid-cols-2 gap-4 text-sm dark:text-white">
          <div><strong>Full Name:</strong> {formData.fullName}</div>
          <div><strong>Email:</strong> {formData.email}</div>
          <div><strong>Status:</strong> {formData.status}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <h4 className="text-md font-medium dark:text-white">Account Stats</h4>
        <div className="grid grid-cols-2 gap-4 text-sm dark:text-white">
          <div><strong>Total Users:</strong> {formData.totalUsers}</div>
          <div><strong>Total Videos:</strong> {formData.totalVideos}</div>
          <div><strong>Total Views:</strong> {formData.totalViews}</div>
          <div><strong>Wallet Balance:</strong> ${formData.wallet}</div>
          <div><strong>Locked Balance:</strong> ${formData.lockedBalance}</div>
        </div>
      </div>

      {editMode && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <h4 className="text-md font-medium dark:text-white">Edit Profile</h4>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="password"
              type="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 rounded col-span-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <h4 className="text-md font-medium dark:text-white">Account Settings</h4>
        <ul className="space-y-2 text-sm dark:text-white">
          <li className="flex justify-between items-center">
            <span>Notification Preferences</span>
            <button className="text-blue-500 hover:underline">Manage</button>
          </li>
          <li className="flex justify-between items-center">
            <span>Change Password</span>
            <button className="text-blue-500 hover:underline">Update</button>
          </li>
          <li className="flex justify-between items-center">
            <span>Two-Factor Authentication</span>
            <button className="text-blue-500 hover:underline">Enable</button>
          </li>
          <li className="flex justify-between items-center">
            <span>Delete Account</span>
            <button className="text-red-500 hover:underline">Delete</button>
          </li>
        </ul>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <h4 className="text-md font-medium dark:text-white">Support</h4>
        <p className="text-sm dark:text-white">
          If you're facing issues or have any questions, feel free to contact our support team.
        </p>
        <ul className="space-y-2 text-sm dark:text-white">
          <li>
            📧 Email:{' '}
            <a href="mailto:support@example.com" className="text-blue-500 hover:underline">
              support@infyle.com
            </a>
          </li>
          <li>
            📞 Phone: <span className="text-gray-800 dark:text-white">+91 77078 32741</span>
          </li>
          <li>
            🕐 Support Hours: Mon - Sat, 10:00 AM to 6:00 PM
          </li>
        </ul>
      </div>
    </div>
  );
}
