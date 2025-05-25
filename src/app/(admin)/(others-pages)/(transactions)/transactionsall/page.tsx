// // working for timer functionality
// 'use client';

// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { useEffect, useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// interface EarningsData {
//   success: boolean;
//   vendorId: string;
//   totalViews: number;
//   pricePerView: number;
//   totalEarnings: number;
//   availableBalance: number;
//   lockedBalance: number;
//   totalBalance: number;
// }

// interface WalletData {
//   success: boolean;
//   data: {
//     walletBalance: number;
//     lockedBalance: number;
//     lockDaysRemaining: number;
//     canWithdraw: boolean;
//     lockStartDate: string;
//     lockEndDate: string;
//     totalLockDays: number;
//   };
// }

// export default function TransactionsPage() {
//   const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
//   const [walletData, setWalletData] = useState<WalletData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isTransactionLoading, setIsTransactionLoading] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState<{
//     days: number;
//     hours: number;
//     minutes: number;
//     seconds: number;
//   }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//   const [isTimerExpired, setIsTimerExpired] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error('Authentication token not found');
//         setIsLoading(false);
//         return;
//       }

//       try {
//         // Fetch earnings data
//         const earningsResponse = await axios.get('https://shreejighutargo21.onrender.com/api/vendors/testing-vendor-earnings', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // Fetch wallet data
//         const walletResponse = await axios.get('http://localhost:9000/api/vendors/api/vendor/wallet', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (earningsResponse.data.success) {
//           setEarningsData(earningsResponse.data);
//         } else {
//           toast.error(earningsResponse.data.message || 'Failed to fetch earnings data');
//         }

//         if (walletResponse.data.success) {
//           setWalletData(walletResponse.data);
//         } else {
//           toast.error('Failed to fetch wallet data');
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         toast.error('Failed to fetch data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Timer countdown effect
//   useEffect(() => {
//     if (!walletData?.data.lockEndDate) return;

//     const calculateTimeRemaining = () => {
//       const lockEnd = new Date(walletData.data.lockEndDate);
//       const now = new Date();
//       const utcLockEnd = Date.UTC(
//         lockEnd.getUTCFullYear(),
//         lockEnd.getUTCMonth(),
//         lockEnd.getUTCDate(),
//         lockEnd.getUTCHours(),
//         lockEnd.getUTCMinutes(),
//         lockEnd.getUTCSeconds()
//       );
      
//       const utcNow = Date.UTC(
//         now.getUTCFullYear(),
//         now.getUTCMonth(),
//         now.getUTCDate(),
//         now.getUTCHours(),
//         now.getUTCMinutes(),
//         now.getUTCSeconds()
//       );
      
//       const difference = utcLockEnd - utcNow;
//       // const difference = lockEnd.getTime() - now.getTime();

//       if (difference <= 0) {
//         setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//         setIsTimerExpired(true);
//         return;
//       }

//       const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((difference % (1000 * 60)) / 1000);

//       setTimeRemaining({ days, hours, minutes, seconds });
//       setIsTimerExpired(false);
//     };

//     calculateTimeRemaining();
//     const interval = setInterval(calculateTimeRemaining, 1000);

//     return () => clearInterval(interval);
//   }, [walletData]);

//   const handleMakeTransaction = async () => {
//     if (!isTimerExpired) {
//       toast.warn('Please wait for the lock period to expire before making a transaction');
//       return;
//     }

//     if (!walletData?.data.canWithdraw) {
//       toast.warn('Withdrawal is not available at this time');
//       return;
//     }

//     if (walletData.data.walletBalance <= 0) {
//       toast.warn('No available balance to withdraw');
//       return;
//     }

//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('Authentication token not found');
//       return;
//     }

//     setIsTransactionLoading(true);

//     try {
//       // Example withdrawal request - replace with your actual API endpoint
//       const response = await axios.post(
//         'http://localhost:9000/api/vendors/api/vendor/withdraw',
//         {
//           amount: walletData.data.walletBalance, // Withdraw full available balance
//           // Add other required fields as per your API
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.success) {
//         toast.success('Transaction completed successfully!');
//         // Refresh the data after successful transaction
//         window.location.reload();
//       } else {
//         toast.error(response.data.message || 'Transaction failed');
//       }
//     } catch (error: any) {
//       console.error('Transaction error:', error);
//       if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error('Transaction failed. Please try again.');
//       }
//     } finally {
//       setIsTransactionLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!earningsData || !walletData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <div className="text-center text-gray-600 dark:text-gray-400">
//           No data available
//         </div>
//       </div>
//     );
//   }

//   const showTransactionButton = true; // Always show the button
//   const isButtonDisabled = !isTimerExpired || !walletData.data.canWithdraw || walletData.data.walletBalance <= 0 || isTransactionLoading;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header with Transaction Button */}
//         <div className="flex justify-between items-center mb-8">
//           <motion.h1
//             className="text-3xl font-bold text-gray-900 dark:text-white"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             Earnings & Balance Dashboard
//           </motion.h1>
          
//           {showTransactionButton && (
//             <motion.button
//               onClick={handleMakeTransaction}
//               disabled={isButtonDisabled}
//               className={`font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-200 ${
//                 isButtonDisabled
//                   ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
//                   : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
//               }`}
//               whileHover={!isButtonDisabled ? { scale: 1.05 } : {}}
//               whileTap={!isButtonDisabled ? { scale: 0.95 } : {}}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//             >
//               {isTransactionLoading ? (
//                 <div className="flex items-center space-x-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
//                   <span>Processing...</span>
//                 </div>
//               ) : (
//                 'Make Transaction'
//               )}
//             </motion.button>
//           )}
//         </div>

//         {/* Timer Section */}
//         {walletData.data.lockDaysRemaining > 0 && !isTimerExpired && (
//           <motion.div
//             className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//           >
//             <h2 className="text-2xl font-bold mb-4 text-center">
//               Time Remaining Until Withdrawal Available
//             </h2>
//             <div className="flex justify-center space-x-8">
//               <div className="text-center">
//                 <div className="text-4xl font-bold">{timeRemaining.days}</div>
//                 <div className="text-sm opacity-80">Days</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-4xl font-bold">{timeRemaining.hours}</div>
//                 <div className="text-sm opacity-80">Hours</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-4xl font-bold">{timeRemaining.minutes}</div>
//                 <div className="text-sm opacity-80">Minutes</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-4xl font-bold">{timeRemaining.seconds}</div>
//                 <div className="text-sm opacity-80">Seconds</div>
//               </div>
//             </div>
//           </motion.div>
//         )}

//         {/* Timer Expired Notification */}
//         {isTimerExpired && walletData.data.canWithdraw && walletData.data.walletBalance > 0 && (
//           <motion.div
//             className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 mb-8 text-white"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//           >
//             <h2 className="text-2xl font-bold mb-2 text-center">
//               🎉 Withdrawal Now Available!
//             </h2>
//             <p className="text-center opacity-90">
//               Your lock period has expired. You can now make a transaction.
//             </p>
//           </motion.div>
//         )}

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <motion.div
//               className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
//               whileHover={{ scale: 1.02 }}
//               transition={{ duration: 0.2 }}
//             >
//               <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
//                 Available Balance
//               </h2>
//               <p className="text-4xl font-bold text-green-600 dark:text-green-400">
//                 ${walletData.data.walletBalance.toLocaleString()}
//               </p>
//             </motion.div>

//             <motion.div
//               className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
//               whileHover={{ scale: 1.02 }}
//               transition={{ duration: 0.2 }}
//             >
//               <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
//                 Locked Balance
//               </h2>
//               <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
//                 ${walletData.data.lockedBalance.toLocaleString()}
//               </p>
//             </motion.div>

//             <motion.div
//               className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
//               whileHover={{ scale: 1.02 }}
//               transition={{ duration: 0.2 }}
//             >
//               <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
//                 Total Balance
//               </h2>
//               <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
//                 ${(walletData.data.walletBalance + walletData.data.lockedBalance).toLocaleString()}
//               </p>
//             </motion.div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <motion.div
//               className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
//               whileHover={{ scale: 1.02 }}
//               transition={{ duration: 0.2 }}
//             >
//               <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
//                 Total Views
//               </h2>
//               <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
//                 {earningsData.totalViews.toLocaleString()}
//               </p>
//             </motion.div>

//             <motion.div
//               className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
//               whileHover={{ scale: 1.02 }}
//               transition={{ duration: 0.2 }}
//             >
//               <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
//                 Price Per View
//               </h2>
//               <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
//                 ${earningsData.pricePerView.toFixed(3)}
//               </p>
//             </motion.div>

//             <motion.div
//               className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:col-span-2"
//               whileHover={{ scale: 1.02 }}
//               transition={{ duration: 0.2 }}
//             >
//               <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
//                 Total Earnings
//               </h2>
//               <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
//                 ${earningsData.totalEarnings.toLocaleString()}
//               </p>
//             </motion.div>
//           </div>

//           <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
//               Withdrawal Status
//             </h2>
//             <div className="space-y-2">
//               <p className="text-gray-600 dark:text-gray-300">
//                 <span className="font-semibold">Can Withdraw:</span>{' '}
//                 <span className={walletData.data.canWithdraw && isTimerExpired ? 'text-green-600' : 'text-red-600'}>
//                   {walletData.data.canWithdraw && isTimerExpired ? 'Yes' : 'No'}
//                 </span>
//               </p>
//               <p className="text-gray-600 dark:text-gray-300">
//                 <span className="font-semibold">Days Remaining:</span>{' '}
//                 <span className="text-orange-600">
//                   {isTimerExpired ? 0 : walletData.data.lockDaysRemaining} days
//                 </span>
//               </p>
//               <p className="text-gray-600 dark:text-gray-300">
//                 <span className="font-semibold">Transaction Status:</span>{' '}
//                 <span className={isTimerExpired && walletData.data.canWithdraw ? 'text-green-600' : 'text-orange-600'}>
//                   {isTimerExpired && walletData.data.canWithdraw ? 'Available' : 'Locked'}
//                 </span>
//               </p>
//               <p className="text-gray-600 dark:text-gray-300">
//                 {isTimerExpired 
//                   ? 'Your funds are now available for withdrawal!'
//                   : `Earnings are subject to a lock period before they become available for withdrawal. Current locked balance: $${walletData.data.lockedBalance.toLocaleString()}`
//                 }
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//       <ToastContainer position="bottom-right" />
//     </div>
//   );
// }

// working for timer functionality



'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EarningsData {
  success: boolean;
  data: {
    vendorId: string;
    totalViews: number;
    lockedBalance: string;
    currentPricePerView: number;
    vendorWallet: string;
    totalEarningsFromViews: string;
    earningsHistory: Array<{
      date: string;
      viewsCount: number;
      pricePerView: number;
      vendorEarnings: string;
    }>;
    videoBreakdown: Array<any>;
  };
}


interface WalletData {
  success: boolean;
  data: {
    walletBalance: number;
    lockedBalance: number;
    lockDaysRemaining: number;
    canWithdraw: boolean;
    lockStartDate: string;
    lockEndDate: string;
    totalLockDays: number;
  };
}

interface WithdrawalFormData {
  amount: number;
  upiId: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    holderName: string;
  };
}

export default function TransactionsPage() {
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isTimerExpired, setIsTimerExpired] = useState(false);

  const [formData, setFormData] = useState<WithdrawalFormData>({
    amount: 0,
    upiId: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      holderName: '',
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        setIsLoading(false);
        return;
      }
  
      try {
        // Fetch earnings data
        const earningsResponse = await axios.get('http://localhost:9000/api/vendors/vendor/earnings', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // Fetch wallet data
        const walletResponse = await axios.get('http://localhost:9000/api/vendors/api/vendor/wallet', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (earningsResponse.data.success) {
          setEarningsData(earningsResponse.data);
        } else {
          toast.error(earningsResponse.data.message || 'Failed to fetch earnings data');
        }
  
        if (walletResponse.data.success) {
          setWalletData(walletResponse.data);
        } else {
          toast.error('Failed to fetch wallet data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       toast.error('Authentication token not found');
  //       setIsLoading(false);
  //       return;
  //     }

  //     try {
  //       // Fetch earnings data
  //       const earningsResponse = await axios.get('http://localhost:9000/api/vendors/vendor/earnings', {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       // Fetch wallet data
  //       const walletResponse = await axios.get('http://localhost:9000/api/vendors/api/vendor/wallet', {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       if (earningsResponse.data.success) {
  //         setEarningsData(earningsResponse.data);
  //       } else {
  //         toast.error(earningsResponse.data.message || 'Failed to fetch earnings data');
  //       }

  //       if (walletResponse.data.success) {
  //         setWalletData(walletResponse.data);
  //       } else {
  //         toast.error('Failed to fetch wallet data');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       toast.error('Failed to fetch data');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // Timer countdown effect
  useEffect(() => {
    if (!walletData?.data.lockEndDate) return;

    const calculateTimeRemaining = () => {
      const lockEnd = new Date(walletData.data.lockEndDate);
      const now = new Date();
      const utcLockEnd = Date.UTC(
        lockEnd.getUTCFullYear(),
        lockEnd.getUTCMonth(),
        lockEnd.getUTCDate(),
        lockEnd.getUTCHours(),
        lockEnd.getUTCMinutes(),
        lockEnd.getUTCSeconds()
      );
      
      const utcNow = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      );
      
      const difference = utcLockEnd - utcNow;

      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsTimerExpired(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
      setIsTimerExpired(false);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [walletData]);

  const handleOpenWithdrawalForm = () => {
    if (!isTimerExpired) {
      toast.warn('Please wait for the lock period to expire before making a transaction');
      return;
    }

    if (!walletData?.data.canWithdraw) {
      toast.warn('Withdrawal is not available at this time');
      return;
    }

    if (walletData.data.walletBalance <= 0) {
      toast.warn('No available balance to withdraw');
      return;
    }

    // Set default amount to available balance
    setFormData(prev => ({
      ...prev,
      amount: walletData.data.walletBalance
    }));
    
    setShowWithdrawalForm(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('bankDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'amount' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSubmitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found');
      return;
    }

    // Validate form
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (formData.amount > (walletData?.data.walletBalance || 0)) {
      toast.error('Amount exceeds available balance');
      return;
    }

    if (!formData.bankDetails.accountName || !formData.bankDetails.accountNumber || 
        !formData.bankDetails.bankName || !formData.bankDetails.ifscCode || 
        !formData.bankDetails.holderName) {
      toast.error('All bank details are required');
      return;
    }

    setIsTransactionLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:9000/api/vendors/withdrawal/requests',
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success) {
        toast.success('Withdrawal request submitted successfully!');
        setShowWithdrawalForm(false);
        // Reset form
        setFormData({
          amount: 0,
          upiId: '',
          bankDetails: {
            accountName: '',
            accountNumber: '',
            bankName: '',
            ifscCode: '',
            holderName: '',
          },
        });
        // Refresh the data after successful request
        window.location.reload();
      } else {
        toast.error(response.data.message || 'Withdrawal request failed');
      }
    } catch (error: any) {
      console.error('Withdrawal request error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Withdrawal request failed. Please try again.');
      }
    } finally {
      setIsTransactionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!earningsData || !walletData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-600 dark:text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const showTransactionButton = true;
  const isButtonDisabled = !isTimerExpired || !walletData.data.canWithdraw || walletData.data.walletBalance <= 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Transaction Button */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Earnings & Balance Dashboard
          </motion.h1>
          
          {showTransactionButton && (
            <motion.button
              onClick={handleOpenWithdrawalForm}
              disabled={isButtonDisabled}
              className={`font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-200 ${
                isButtonDisabled
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
              }`}
              whileHover={!isButtonDisabled ? { scale: 1.05 } : {}}
              whileTap={!isButtonDisabled ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Make Transaction
            </motion.button>
          )}
        </div>

        {/* Timer Section */}
        {walletData.data.lockDaysRemaining > 0 && !isTimerExpired && (
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              Time Remaining Until Withdrawal Available
            </h2>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-4xl font-bold">{timeRemaining.days}</div>
                <div className="text-sm opacity-80">Days</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{timeRemaining.hours}</div>
                <div className="text-sm opacity-80">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{timeRemaining.minutes}</div>
                <div className="text-sm opacity-80">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{timeRemaining.seconds}</div>
                <div className="text-sm opacity-80">Seconds</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Timer Expired Notification */}
        {isTimerExpired && walletData.data.canWithdraw && walletData.data.walletBalance > 0 && (
          <motion.div
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 mb-8 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-2 text-center">
              🎉 Withdrawal Now Available!
            </h2>
            <p className="text-center opacity-90">
              Your lock period has expired. You can now make a transaction.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
                ${walletData.data.walletBalance.toLocaleString()}
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
                ${walletData.data.lockedBalance.toLocaleString()}
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
                ${(walletData.data.walletBalance).toLocaleString()}
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
  {earningsData.data.totalViews.toLocaleString()}
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
  ${earningsData.data.currentPricePerView.toFixed(3)}
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
  ${parseFloat(earningsData.data.totalEarningsFromViews).toLocaleString()}
</p>
</motion.div>

          </div>

          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Withdrawal Status
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Can Withdraw:</span>{' '}
                <span className={walletData.data.canWithdraw && isTimerExpired ? 'text-green-600' : 'text-red-600'}>
                  {walletData.data.canWithdraw && isTimerExpired ? 'Yes' : 'No'}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Days Remaining:</span>{' '}
                <span className="text-orange-600">
                  {isTimerExpired ? 0 : walletData.data.lockDaysRemaining} days
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Transaction Status:</span>{' '}
                <span className={isTimerExpired && walletData.data.canWithdraw ? 'text-green-600' : 'text-orange-600'}>
                  {isTimerExpired && walletData.data.canWithdraw ? 'Available' : 'Locked'}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {isTimerExpired 
                  ? 'Your funds are now available for withdrawal!'
                  : `Earnings are subject to a lock period before they become available for withdrawal. Current locked balance: $${walletData.data.lockedBalance.toLocaleString()}`
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Withdrawal Form Modal */}
      {showWithdrawalForm && (
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
                  Withdrawal Request
                </h2>
                <button
                  onClick={() => setShowWithdrawalForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                  disabled={isTransactionLoading}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitWithdrawal} className="space-y-6">
                {/* Amount Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    max={walletData?.data.walletBalance}
                    min="1"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter withdrawal amount"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Available balance: ${walletData?.data.walletBalance.toLocaleString()}
                  </p>
                </div>

                {/* UPI ID Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    UPI ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your UPI ID"
                  />
                </div>

                {/* Bank Details Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Bank Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account Name *
                      </label>
                      <input
                        type="text"
                        name="bankDetails.accountName"
                        value={formData.bankDetails.accountName}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Account holder name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        name="bankDetails.accountNumber"
                        value={formData.bankDetails.accountNumber}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Bank account number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        name="bankDetails.bankName"
                        value={formData.bankDetails.bankName}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Bank name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        name="bankDetails.ifscCode"
                        value={formData.bankDetails.ifscCode}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="IFSC code"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Holder Name *
                      </label>
                      <input
                        type="text"
                        name="bankDetails.holderName"
                        value={formData.bankDetails.holderName}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Account holder name"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawalForm(false)}
                    disabled={isTransactionLoading}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isTransactionLoading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isTransactionLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}