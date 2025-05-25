'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  holderName: string;
}

interface WithdrawalRequest {
  _id: string;
  vendorId: string;
  amount: number;
  upiId: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  lockDaysRemaining: number;
  canWithdraw: boolean;
  requestDate: string;
  createdAt: string;
  updatedAt: string;
  bankDetails: BankDetails;
  adminNotes?: string;
  approvalDate?: string;
  completionDate?: string;
}

interface WithdrawalHistoryResponse {
  success: boolean;
  data: {
    requests: WithdrawalRequest[];
    walletBalance: number;
    lockDaysRemaining: number;
    canWithdraw: boolean;
  };
}

export default function WithdrawalHistoryPage() {
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);

  useEffect(() => {
    const fetchWithdrawalHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:9000/api/vendors/withdrawal/requests', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setWithdrawalData(response.data);
        } else {
          toast.error('Failed to fetch withdrawal history');
        }
      } catch (error: any) {
        console.error('Error fetching withdrawal history:', error);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to fetch withdrawal history');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawalHistory();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    const visibleDigits = 4;
    const maskedPart = '*'.repeat(accountNumber.length - visibleDigits);
    return maskedPart + accountNumber.slice(-visibleDigits);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!withdrawalData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-600 dark:text-gray-400">
          No withdrawal history available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Withdrawal History
          </h1>
          
          {/* Wallet Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Current Balance
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${withdrawalData.data.walletBalance.toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Lock Days Remaining
              </h3>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {withdrawalData.data.lockDaysRemaining}
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Withdrawal Status
              </h3>
              <p className={`text-3xl font-bold ${withdrawalData.data.canWithdraw ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {withdrawalData.data.canWithdraw ? 'Available' : 'Locked'}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Withdrawal Requests Table */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Withdrawal Requests ({withdrawalData.data.requests.length})
            </h2>
          </div>

          {withdrawalData.data.requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg">No withdrawal requests found</p>
              <p className="text-sm mt-2">Your withdrawal history will appear here once you make requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Bank Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {withdrawalData.data.requests.map((request, index) => (
                    <motion.tr
                      key={request._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request._id.slice(-8)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {request.upiId && `UPI: ${request.upiId}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          ${request.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div className="font-medium">{request.bankDetails.bankName}</div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {maskAccountNumber(request.bankDetails.accountNumber)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(request.requestDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Withdrawal Request Details
                </h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Request Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Request ID
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      {selectedRequest._id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount
                    </label>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${selectedRequest.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      UPI ID
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedRequest.upiId || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Bank Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Account Name
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedRequest.bankDetails.accountName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Account Number
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white font-mono">
                        {selectedRequest.bankDetails.accountNumber}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bank Name
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedRequest.bankDetails.bankName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        IFSC Code
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white font-mono">
                        {selectedRequest.bankDetails.ifscCode}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Holder Name
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedRequest.bankDetails.holderName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Timeline
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Request Created</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(selectedRequest.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {selectedRequest.approvalDate && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Request Approved</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(selectedRequest.approvalDate)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {selectedRequest.completionDate && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Request Completed</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(selectedRequest.completionDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedRequest.adminNotes && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Admin Notes
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {selectedRequest.adminNotes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <div className="flex justify-end pt-6 border-t">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}