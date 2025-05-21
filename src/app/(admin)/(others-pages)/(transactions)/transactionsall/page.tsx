// src/app/(admin)/(others-pages)/(transactions)/page.tsx
'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EarningsData {
  success: boolean;
  vendorId: string;
  totalViews: number;
  pricePerView: number;
  totalEarnings: number;
  availableBalance: number;
  lockedBalance: number;
  totalBalance: number;
}

export default function TransactionsPage() {
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:9000/api/vendors/testing-vendor-earnings', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setEarningsData(response.data);
        } else {
          toast.error(response.data.message || 'Failed to fetch earnings data');
        }
      } catch (error) {
        console.error('Error fetching earnings:', error);
        toast.error('Failed to fetch earnings data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!earningsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-600 dark:text-gray-400">
          No earnings data available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Earnings & Balance Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Available Balance
              </h2>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                ${earningsData.availableBalance.toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Locked Balance
              </h2>
              <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                ${earningsData.lockedBalance.toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Total Balance
              </h2>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                ${earningsData.totalBalance.toLocaleString()}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Total Views
              </h2>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {earningsData.totalViews.toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Price Per View
              </h2>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                ${earningsData.pricePerView.toFixed(3)}
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:col-span-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Total Earnings
              </h2>
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                ${earningsData.totalEarnings.toLocaleString()}
              </p>
            </motion.div>
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Important Notice
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Earnings are subject to a 90-day lock period before they become available for withdrawal.
              Current locked balance: ${earningsData.lockedBalance.toLocaleString()}
            </p>
          </div>
        </motion.div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
