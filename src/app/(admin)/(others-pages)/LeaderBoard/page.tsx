
// 'use client';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import * as jwt_decode from 'jwt-decode';

// import React, { useEffect, useState } from 'react';
// import { FaCrown, FaEye, FaHeart, FaMedal, FaStar, FaTrophy } from 'react-icons/fa';

// interface Contest {
//   _id: string;
//   title: string;
//   description: string;
//   startDate: string;
//   endDate: string;
//   status: string;
//   type_id: {
//     name: string;
//     type: number;
//   };
//   prizes: Array<{
//     position: number;
//     prizeAmount: number;
//     description: string;
//   }>;
// }

// interface Video {
//   _id: string;
//   name: string;
//   thumbnail: string;
//   total_like: number;
//   total_view: number;
//   averageRating: number;
// }

// interface LeaderboardEntry {
//   rank: number;
//   vendor: { _id: string };
//   video: Video;
//   contestViews: number;
//   adminAdjustedViews: number;
//   totalContestViews: number;
//   initialViews: number;
//   joinedAt: string;
// }

// interface LeaderboardResponse {
//   contest: {
//     id: string;
//     title: string;
//     description: string;
//     status: string;
//     startDate: string;
//     endDate: string;
//   };
//   leaderboard: LeaderboardEntry[];
//   totalParticipants: number;
// }

// interface DecodedToken {
//   id: string;
//   [key: string]: any;
// }

// const ContestDropdown: React.FC = () => {
//   const [contests, setContests] = useState<Contest[]>([]);
//   const [selectedContestId, setSelectedContestId] = useState<string>('');
//   const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Extract vendorId from token (if needed)
//   const getVendorIdFromToken = (): string | null => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return null;

//       const decoded: DecodedToken = jwt_decode(token);
//       return decoded.id || decoded.vendorId || decoded._id || null;
//     } catch (err) {
//       console.error('Invalid token:', err);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const fetchVendorContests = async () => {
//       try {
//         setError(null);
//         const response = await axios.get('https://shreejighutargo21.onrender.com/api/vendors/vendors/contests', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });

//         if (response.data.success) {
//             const contestsData = response.data.data;
//             setContests(contestsData);
//             if (contestsData.length > 0 && !selectedContestId) {
//               setSelectedContestId(contestsData[0]._id); // Set the first contest as default
//             }
//           } else {
//             setError('Failed to fetch contests');
//           }
//       } catch (err) {
//         setError('Error fetching contests. Please check your authentication.');
//         console.error('Failed to fetch contests:', err);
//       }
//     };

//     fetchVendorContests();
//   }, []);

//   useEffect(() => {
//     if (!selectedContestId) {
//       setLeaderboard(null);
//       return;
//     }

//     const fetchLeaderboard = async () => {
//       try {
//         setError(null);
//         const res = await axios.get(
//           `https://shreejighutargo21.onrender.com/api/admin/contests/${selectedContestId}/leaderboard`
//         );
//         setLeaderboard(res.data.data);
//       } catch (err) {
//         setError('Failed to fetch leaderboard');
//         console.error('Failed to fetch leaderboard', err);
//       }
//     };

//     fetchLeaderboard();
//   }, [selectedContestId]);

//   const getRankIcon = (rank: number) => {
//     switch (rank) {
//       case 1:
//         return (
//           <div className="relative">
//             <FaCrown className="text-yellow-400 text-4xl drop-shadow-lg animate-pulse" />
//             <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="relative">
//             <FaMedal className="text-gray-300 text-3xl drop-shadow-lg" />
//             <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
//           </div>
//         );
//       case 3:
//         return (
//           <div className="relative">
//             <FaMedal className="text-amber-600 text-3xl drop-shadow-lg" />
//             <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
//           </div>
//         );
//       default:
//         return (
//           <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
//             {rank}
//           </div>
//         );
//     }
//   };

//   const getRowBgClass = (rank: number) => {
//     switch (rank) {
//       case 1:
//         return "bg-gradient-to-r from-yellow-50 via-yellow-100 to-amber-50 border-l-4 border-yellow-400";
//       case 2:
//         return "bg-gradient-to-r from-gray-50 via-gray-100 to-slate-50 border-l-4 border-gray-400";
//       case 3:
//         return "bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-l-4 border-amber-500";
//       default:
//         return "bg-gradient-to-r from-white via-gray-50 to-blue-50";
//     }
//   };

//   if (error) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 via-red-500 to-red-600"
//       >
//         <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl max-w-md mx-4">
//           <div className="text-center">
//             <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//             </div>
//             <h3 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h3>
//             <p className="text-white/80 mb-8 leading-relaxed">{error}</p>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => window.location.reload()}
//               className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
//             >
//               Try Again
//             </motion.button>
//           </div>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="relative z-10 p-8 max-w-7xl mx-auto"
//       >
//         {/* Header Section */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl"
//         >
//           <div className="text-center mb-8">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//               className="inline-flex items-center gap-3 mb-6"
//             >
//               <FaTrophy className="text-6xl text-yellow-400 drop-shadow-lg" />
//               <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
//                 Contest Arena
//               </h1>
//               <FaTrophy className="text-6xl text-yellow-400 drop-shadow-lg" />
//             </motion.div>
//             <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
//               Witness the ultimate competition unfold. Track rankings, celebrate victories, and experience the thrill of the leaderboard.
//             </p>
//           </div>
          
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
//             <label htmlFor="contestDropdown" className="text-white font-semibold text-lg">
//               Select Your Battle:
//             </label>
//             <motion.select
//               whileFocus={{ scale: 1.02 }}
//               id="contestDropdown"
//               value={selectedContestId}
//               onChange={(e) => setSelectedContestId(e.target.value)}
//               className="bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400/50 transition-all duration-300 min-w-80"
//             >
//               <option value="" className="bg-gray-900 text-white">-- Choose Your Contest --</option>
//               {contests.map((contest) => (
//                 <option key={contest._id} value={contest._id} className="bg-gray-900 text-white">
//                   {contest.title} ({contest.status})
//                 </option>
//               ))}
//             </motion.select>
//           </div>
//         </motion.div>

//         {leaderboard && (
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
//           >
//             {/* Contest Info Header */}
//             <div className="p-10 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-indigo-600/30 border-b border-white/10">
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 <h2 className="text-4xl font-bold text-white mb-4 text-center">
//                   {leaderboard.contest.title}
//                 </h2>
//                 <p className="text-white/80 text-lg text-center mb-6 leading-relaxed max-w-3xl mx-auto">
//                   {leaderboard.contest.description}
//                 </p>
//                 <div className="flex flex-wrap justify-center gap-4">
//                   <span className="px-6 py-3 bg-green-500/20 backdrop-blur-sm text-green-300 rounded-2xl text-sm font-semibold border border-green-400/30 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                     {leaderboard.contest.status === 'active' ? 'LIVE CONTEST' : leaderboard.contest.status.toUpperCase()}
//                   </span>
//                   <span className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white/80 rounded-2xl text-sm font-medium border border-white/20">
//                     {new Date(leaderboard.contest.startDate).toLocaleDateString()} - {new Date(leaderboard.contest.endDate).toLocaleDateString()}
//                   </span>
//                   <span className="px-6 py-3 bg-purple-500/20 backdrop-blur-sm text-purple-300 rounded-2xl text-sm font-semibold border border-purple-400/30">
//                     {leaderboard.totalParticipants} Participants
//                   </span>
//                 </div>
//               </motion.div>
//             </div>

//             {/* Leaderboard Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-b border-white/10">
//                     <th className="px-8 py-6 text-left text-white/80 font-semibold text-lg">Rank</th>
//                     <th className="px-8 py-6 text-left text-white/80 font-semibold text-lg">Competitor</th>
//                     <th className="px-8 py-6 text-center text-white/80 font-semibold text-lg">Performance</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {leaderboard.leaderboard.map((entry, index) => (
//                     <motion.tr
//                       key={entry.video._id}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.1 * index }}
//                       whileHover={{ 
//                         scale: 1.02, 
//                         backgroundColor: 'rgba(255, 255, 255, 0.05)',
//                         transition: { duration: 0.2 }
//                       }}
//                       className={`border-b border-white/5 hover:shadow-2xl transition-all duration-500 ${getRowBgClass(entry.rank)}`}
//                     >
//                       <td className="px-8 py-8">
//                         <motion.div 
//                           className="flex items-center justify-center"
//                           whileHover={{ scale: 1.1 }}
//                           transition={{ type: "spring", stiffness: 300 }}
//                         >
//                           {getRankIcon(entry.rank)}
//                         </motion.div>
//                       </td>
                      
//                       <td className="px-8 py-8">
//                         <div className="flex items-center gap-6">
//                           <motion.div
//                             whileHover={{ scale: 1.05, rotate: 2 }}
//                             className="relative"
//                           >
//                             <img
//                               src={entry.video.thumbnail}
//                               alt={entry.video.name}
//                               className="h-28 w-48 object-cover rounded-2xl shadow-xl ring-2 ring-white/20"
//                               onError={(e) => {
//                                 (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
//                               }}
//                             />
//                             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
//                           </motion.div>
//                           <div>
//                             <h3 className="text-xl font-bold text-white mb-2 leading-tight">
//                               {entry.video.name}
//                             </h3>
//                             <p className="text-white/60 text-sm flex items-center gap-2">
//                               <FaStar className="text-yellow-400" />
//                               Joined: {new Date(entry.joinedAt).toLocaleDateString()}
//                             </p>
//                           </div>
//                         </div>
//                       </td>
                      
//                       <td className="px-8 py-8">
//                         <div className="flex justify-center gap-8">
//                           <motion.div 
//                             className="flex flex-col items-center gap-2 bg-red-500/20 backdrop-blur-sm rounded-2xl p-4 border border-red-400/30"
//                             whileHover={{ scale: 1.1, y: -2 }}
//                           >
//                             <FaHeart className="text-red-400 text-xl" />
//                             <span className="font-bold text-white text-lg">{entry.video.total_like}</span>
//                             <span className="text-red-300 text-xs uppercase tracking-wide">Likes</span>
//                           </motion.div>
                          
//                           <motion.div 
//                             className="flex flex-col items-center gap-2 bg-blue-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/30"
//                             whileHover={{ scale: 1.1, y: -2 }}
//                           >
//                             <FaEye className="text-blue-400 text-xl" />
//                             <span className="font-bold text-white text-lg">{entry.video.total_view}</span>
//                             <span className="text-blue-300 text-xs uppercase tracking-wide">Views</span>
//                           </motion.div>
                          
//                           <motion.div 
//                             className="flex flex-col items-center gap-2 bg-yellow-500/20 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30"
//                             whileHover={{ scale: 1.1, y: -2 }}
//                           >
//                             <FaTrophy className="text-yellow-400 text-xl" />
//                             <span className="font-bold text-white text-lg">{entry.video.averageRating}</span>
//                             <span className="text-yellow-300 text-xs uppercase tracking-wide">Rating</span>
//                           </motion.div>
//                         </div>
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Footer Stats */}
//             <div className="p-8 bg-gradient-to-r from-gray-800/30 to-gray-900/30 border-t border-white/10 text-center">
//               <motion.p 
//                 className="text-white/60 text-lg"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.8 }}
//               >
//                 🏆 Showcasing the top performers • Updated in real-time • May the best creator win! 🏆
//               </motion.p>
//             </div>
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default ContestDropdown;
'use client';
import axios from 'axios';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';

import React, { useEffect, useState } from 'react';
import { FaCrown, FaEye, FaHeart, FaMedal, FaStar, FaTrophy } from 'react-icons/fa';

interface Contest {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  type_id: {
    name: string;
    type: number;
  };
  prizes: Array<{
    position: number;
    prizeAmount: number;
    description: string;
  }>;
}

interface Video {
  _id: string;
  name: string;
  thumbnail: string;
  total_like: number;
  total_view: number;
  averageRating: number;
}

interface LeaderboardEntry {
  rank: number;
  vendor: { _id: string };
  video: Video;
  contestViews: number;
  adminAdjustedViews: number;
  totalContestViews: number;
  initialViews: number;
  joinedAt: string;
}

interface LeaderboardResponse {
  contest: {
    id: string;
    title: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  leaderboard: LeaderboardEntry[];
  totalParticipants: number;
}

interface DecodedToken {
  id?: string;
  vendorId?: string;
  _id?: string;
  [key: string]: any;
}

const ContestDropdown: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContestId, setSelectedContestId] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Extract vendorId from token (if needed)
  const getVendorIdFromToken = (): string | null => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.id || decoded.vendorId || decoded._id || null;
    } catch (err) {
      console.error('Invalid token:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchVendorContests = async () => {
      try {
        setError(null);
        const response = await axios.get('https://shreejighutargo21.onrender.com/api/vendors/vendors/contests', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          const contestsData = response.data.data;
          setContests(contestsData);
          if (contestsData.length > 0 && !selectedContestId) {
            setSelectedContestId(contestsData[0]._id); // Set the first contest as default
          }
        } else {
          setError('Failed to fetch contests');
        }
      } catch (err) {
        setError('Error fetching contests. Please check your authentication.');
        console.error('Failed to fetch contests:', err);
      }
    };

    fetchVendorContests();
  }, [selectedContestId]);

  useEffect(() => {
    if (!selectedContestId) {
      setLeaderboard(null);
      return;
    }

    const fetchLeaderboard = async () => {
      try {
        setError(null);
        const res = await axios.get(
          `https://shreejighutargo21.onrender.com/api/admin/contests/${selectedContestId}/leaderboard`
        );
        setLeaderboard(res.data.data);
      } catch (err) {
        setError('Failed to fetch leaderboard');
        console.error('Failed to fetch leaderboard', err);
      }
    };

    fetchLeaderboard();
  }, [selectedContestId]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="relative">
            <FaCrown className="text-yellow-400 text-4xl drop-shadow-lg animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
          </div>
        );
      case 2:
        return (
          <div className="relative">
            <FaMedal className="text-gray-300 text-3xl drop-shadow-lg" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          </div>
        );
      case 3:
        return (
          <div className="relative">
            <FaMedal className="text-amber-600 text-3xl drop-shadow-lg" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {rank}
          </div>
        );
    }
  };

  const getRowBgClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 via-yellow-100 to-amber-50 border-l-4 border-yellow-400";
      case 2:
        return "bg-gradient-to-r from-gray-50 via-gray-100 to-slate-50 border-l-4 border-gray-400";
      case 3:
        return "bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-l-4 border-amber-500";
      default:
        return "bg-gradient-to-r from-white via-gray-50 to-blue-50";
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder-image.jpg';
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 via-red-500 to-red-600"
      >
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl max-w-md mx-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h3>
            <p className="text-white/80 mb-8 leading-relaxed">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              Try Again
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-8 max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <FaTrophy className="text-6xl text-yellow-400 drop-shadow-lg" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Contest Arena
              </h1>
              <FaTrophy className="text-6xl text-yellow-400 drop-shadow-lg" />
            </motion.div>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Witness the ultimate competition unfold. Track rankings, celebrate victories, and experience the thrill of the leaderboard.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <label htmlFor="contestDropdown" className="text-white font-semibold text-lg">
              Select Your Battle:
            </label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              id="contestDropdown"
              value={selectedContestId}
              onChange={(e) => setSelectedContestId(e.target.value)}
              className="bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400/50 transition-all duration-300 min-w-80"
            >
              <option value="" className="bg-gray-900 text-white">-- Choose Your Contest --</option>
              {contests.map((contest) => (
                <option key={contest._id} value={contest._id} className="bg-gray-900 text-white">
                  {contest.title} ({contest.status})
                </option>
              ))}
            </motion.select>
          </div>
        </motion.div>

        {leaderboard && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Contest Info Header */}
            <div className="p-10 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-indigo-600/30 border-b border-white/10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-4xl font-bold text-white mb-4 text-center">
                  {leaderboard.contest.title}
                </h2>
                <p className="text-white/80 text-lg text-center mb-6 leading-relaxed max-w-3xl mx-auto">
                  {leaderboard.contest.description}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <span className="px-6 py-3 bg-green-500/20 backdrop-blur-sm text-green-300 rounded-2xl text-sm font-semibold border border-green-400/30 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    {leaderboard.contest.status === 'active' ? 'LIVE CONTEST' : leaderboard.contest.status.toUpperCase()}
                  </span>
                  <span className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white/80 rounded-2xl text-sm font-medium border border-white/20">
                    {new Date(leaderboard.contest.startDate).toLocaleDateString()} - {new Date(leaderboard.contest.endDate).toLocaleDateString()}
                  </span>
                  <span className="px-6 py-3 bg-purple-500/20 backdrop-blur-sm text-purple-300 rounded-2xl text-sm font-semibold border border-purple-400/30">
                    {leaderboard.totalParticipants} Participants
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Leaderboard Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-b border-white/10">
                    <th className="px-8 py-6 text-left text-white/80 font-semibold text-lg">Rank</th>
                    <th className="px-8 py-6 text-left text-white/80 font-semibold text-lg">Competitor</th>
                    <th className="px-8 py-6 text-center text-white/80 font-semibold text-lg">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.leaderboard.map((entry, index) => (
                    <motion.tr
                      key={entry.video._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ 
                        scale: 1.02, 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        transition: { duration: 0.2 }
                      }}
                      className={`border-b border-white/5 hover:shadow-2xl transition-all duration-500 ${getRowBgClass(entry.rank)}`}
                    >
                      <td className="px-8 py-8">
                        <motion.div 
                          className="flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {getRankIcon(entry.rank)}
                        </motion.div>
                      </td>
                      
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-6">
                          <motion.div
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            className="relative"
                          >
                            <img
                              src={entry.video.thumbnail}
                              alt={entry.video.name}
                              className="h-28 w-48 object-cover rounded-2xl shadow-xl ring-2 ring-white/20"
                              onError={handleImageError}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                              {entry.video.name}
                            </h3>
                            <p className="text-white/60 text-sm flex items-center gap-2">
                              <FaStar className="text-yellow-400" />
                              Joined: {new Date(entry.joinedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-8 py-8">
                        <div className="flex justify-center gap-8">
                          <motion.div 
                            className="flex flex-col items-center gap-2 bg-red-500/20 backdrop-blur-sm rounded-2xl p-4 border border-red-400/30"
                            whileHover={{ scale: 1.1, y: -2 }}
                          >
                            <FaHeart className="text-red-400 text-xl" />
                            <span className="font-bold text-white text-lg">{entry.video.total_like}</span>
                            <span className="text-red-300 text-xs uppercase tracking-wide">Likes</span>
                          </motion.div>
                          
                          <motion.div 
                            className="flex flex-col items-center gap-2 bg-blue-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/30"
                            whileHover={{ scale: 1.1, y: -2 }}
                          >
                            <FaEye className="text-blue-400 text-xl" />
                            <span className="font-bold text-white text-lg">{entry.video.total_view}</span>
                            <span className="text-blue-300 text-xs uppercase tracking-wide">Views</span>
                          </motion.div>
                          
                          <motion.div 
                            className="flex flex-col items-center gap-2 bg-yellow-500/20 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30"
                            whileHover={{ scale: 1.1, y: -2 }}
                          >
                            <FaTrophy className="text-yellow-400 text-xl" />
                            <span className="font-bold text-white text-lg">{entry.video.averageRating}</span>
                            <span className="text-yellow-300 text-xs uppercase tracking-wide">Rating</span>
                          </motion.div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Stats */}
            <div className="p-8 bg-gradient-to-r from-gray-800/30 to-gray-900/30 border-t border-white/10 text-center">
              <motion.p 
                className="text-white/60 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                🏆 Showcasing the top performers • Updated in real-time • May the best creator win! 🏆
              </motion.p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ContestDropdown;