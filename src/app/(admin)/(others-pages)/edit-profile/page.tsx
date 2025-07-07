
'use client';
import { PencilIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditProfilePage() {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [formData, setFormData] = useState({
    _id: '', // Added vendor ID here
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

  const defaultImage = 'https://Image.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-875.jpg?semt=ais_hybrid&w=740';

  useEffect(() => {
    async function fetchVendorProfile() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://shreejighutargo21.onrender.com/api/vendors/get-profile', {
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
      setFormData(prev => ({
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
      if (imageFile) form.append('image', imageFile);

      const res = await fetch('https://shreejighutargo21.onrender.com/api/vendors/update-profile', {
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

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch(`https://shreejighutargo21.onrender.com/api/vendors/update-password/${formData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        alert('Password updated successfully!');
        setShowPasswordModal(false);
        setNewPassword('');
      } else {
        alert(result.message || 'Failed to update password');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      alert('Something went wrong');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://shreejighutargo21.onrender.com/api/vendors/vendors/${formData._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (res.ok && result.success) {
        alert('Your account has been deleted.');
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        alert(result.message || 'Failed to delete account');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Something went wrong while deleting your account.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 space-y-8 sm:p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Vendor Profile</h2>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="flex items-center space-x-4">
          <Image
            src={formData.image || defaultImage}
            alt="Profile"
            width={96}
            height={96}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
          />
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{formData.username}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{formData.fullName}</p>
            {/* <p className="text-sm text-gray-700 dark:text-gray-300">Status: {formData.status}</p> */}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setEditMode(prev => !prev)}
          className="flex items-center space-x-1 text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <PencilIcon className="h-5 w-5" />
          <span className="text-sm dark:text-white">{editMode ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>

      {/* Edit Profile Form */}
      {editMode && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md space-y-5 max-h-[70vh] overflow-y-auto"
        >
          <h4 className="text-md font-medium text-gray-900 dark:text-white">Edit Profile</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md col-span-1 sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      )}

      {/* Account Settings */}
      <section className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md space-y-3">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">Account Settings</h4>
        <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex justify-between items-center">
            <span>Change Password</span>
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setShowPasswordModal(true)}
            >
              Update
            </button>
          </li>
          <li className="flex justify-between items-center">
            <span>Delete Account</span>
            <button
              className="text-red-500 hover:underline"
              onClick={handleDeleteAccount}
            >
              Delete
            </button>
          </li>
        </ul>
      </section>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Update Password</h3>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                disabled={passwordLoading}
                onClick={handlePasswordUpdate}
              >
                {passwordLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
