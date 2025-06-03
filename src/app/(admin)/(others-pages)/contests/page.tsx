'use client'
import {
  Award,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Crown,
  Flame,
  Gift,
  Play,
  Scale,
  Scroll,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Video,
  XCircle,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

type NotificationType = {
  type: 'success' | 'error';
  message: string;
} | null;

interface Prize {
  position: number;
  prizeAmount: number;
}

interface Registration {
  vendor_id: string;
}

interface ContestType {
  name: string;
}

interface Contest {
  _id: string;
  title: string;
  description: string;
  registrationStartDate: string;
  registrationEndDate: string;
  startDate: string;
  endDate: string;
  contestStartDate?: string; // Added this for my contests
  contestEndDate?: string;   // Added this for my contests
  type_id?: ContestType;
  prizes?: Prize[];
  registrations?: Registration[];
  rules?: string;
  judgingCriteria?: string;
  status?: string;
}

// interface Video {
//   _id: string;
//   title: string;
// }

interface Video {
  _id: string;
  name: string;  // Change from title to name
}
export default function ContestDashboard() {
  const [activeTab, setActiveTab] = useState<'available' | 'my-contests'>('available');
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationType>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [myContests, setMyContests] = useState<Contest[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [expandedContestId, setExpandedContestId] = useState<string | null>(null);

  useEffect(() => {
    // Get vendor ID from localStorage
    const storedVendorId = localStorage.getItem('vendorId');
    if (storedVendorId) {
      setVendorId(storedVendorId);
    } else {
      // Handle case when vendor ID is not found
      setNotification({
        type: 'error',
        message: 'Please login to access contests'
      });
    }
  }, []);

  const toggleContestDetails = (contestId: string) => {
    setExpandedContestId(expandedContestId === contestId ? null : contestId);
  };
  const fetchVideos = async (type: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://shreejighutargo21.onrender.com/api/common/search-allvideos-bytype?type=${type}`);
      const data = await response.json();
      if (data.success) {
        console.log('API Response:', data); // Debug the full response
        console.log('Videos array:', data.results); // Debug the videos array
        
        // Check each video object
        data.results?.forEach((video, index) => {
          console.log(`Video ${index}:`, video);
          console.log(`Video ${index} title:`, video.title);
          console.log(`Video ${index} title type:`, typeof video.title);
        });
        
        setVideos(data.results || []);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };
  // const fetchVideos = async (type: string) => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch(`https://shreejighutargo21.onrender.com/api/common/search-allvideos-bytype?type=${type}`);
  //     const data = await response.json();
  //     if (data.success) {
  //       setVideos(data.results || []);
  //     } else {
  //       setVideos([]);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching videos:', error);
  //     setVideos([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      // Create date object and adjust for timezone
      const date = new Date(dateString);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };
  

  // Fetch all contests
  const fetchContests = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://shreejighutargo21.onrender.com/api/admin/contests');
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data.success) {
          setContests(data.data);
        }
      } catch (parseError) {
        console.error('Failed to parse JSON:', text);
        console.error('Parse error:', parseError);
      }
    } catch (error) {
      console.error('Error fetching contests:', error);
      setNotification({
        type: 'error',
        message: 'Failed to load contests. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyContests = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setNotification({
          type: 'error',
          message: 'Please login to view your contests'
        });
        return;
      }

      const response = await fetch('https://shreejighutargo21.onrender.com/api/vendors/vendors/contests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contests');
      }

      const data = await response.json();
      
      if (data.success) {
        setMyContests(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch contests');
      }
    } catch (error) {
      console.error('Error fetching my contests:', error);
      setNotification({
        type: 'error',
        message: 'Failed to load your contests. Please try again.'
      });
    }
  };

  useEffect(() => {
    fetchContests();
    fetchMyContests();
  }, []);

  const getTotalPrizeMoney = (prizes: Prize[] | undefined): string => {
    if (!prizes || !Array.isArray(prizes)) return '₹0';
    const total = prizes.reduce((sum, prize) => sum + (prize.prizeAmount || 0), 0);
    return `₹${total.toLocaleString('en-IN')}`;
  };
  
  const getTopPrize = (prizes: Prize[] | undefined): string => {
    if (!prizes || !Array.isArray(prizes) || prizes.length === 0) return '₹0';
    const topPrize = Math.max(...prizes.map(prize => prize.prizeAmount || 0));
    return `₹${topPrize.toLocaleString('en-IN')}`;
  };
  
  const getRegistrationStatus = (contest: Contest): 'upcoming' | 'closed' | 'open' => {
    const now = new Date();
    const regStart = new Date(contest.registrationStartDate);
    const regEnd = new Date(contest.registrationEndDate);
    
    if (now < regStart) return 'upcoming';
    if (now > regEnd) return 'closed';
    return 'open';
  };

  const isRegistered = (contest: Contest): boolean => {
    return contest.registrations?.some(reg => reg.vendor_id === vendorId) || false;
  };

  const getCategory = (contest: Contest): string => {
    return contest.type_id?.name || 'General';
  };

  const getDifficulty = (contest: Contest): 'Beginner' | 'Intermediate' | 'Professional' => {
    const topPrize = contest.prizes?.length ? Math.max(...contest.prizes.map(p => p.prizeAmount || 0)) : 0;
    if (topPrize >= 1000) return 'Professional';
    if (topPrize >= 500) return 'Intermediate';
    return 'Beginner';
  };

  const isFeatured = (contest: Contest): boolean => {
    const topPrize = contest.prizes?.length ? Math.max(...contest.prizes.map(p => p.prizeAmount || 0)) : 0;
    return topPrize >= 1000;
  };

  const registerForContest = async (contestId: string) => {
    if (!selectedVideo) return;
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      setNotification({
        type: 'error',
        message: 'Authentication required. Please login again.'
      });
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`https://shreejighutargo21.onrender.com/api/vendors/contests/${contestId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vendor_id: vendorId,
          video_id: selectedVideo
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Successfully registered for the contest!'
        });
        fetchContests();
        fetchMyContests();
        setSelectedVideo('');
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to register for contest. Please try again.'
      });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Professional': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Contest Arena</h1>
                <p className="text-blue-100 text-lg">Transform your creativity into career-defining moments</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 mt-6">
              <div className="flex items-center gap-2 text-white/90">
                <Flame className="w-5 h-5 text-orange-300" />
                <span className="font-medium">{contests.length} Active Contests</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="font-medium">
                ₹{contests.reduce((total, contest) => {
                    const contestTotal = contest.prizes?.reduce((sum, prize) => sum + (prize.prizeAmount || 0), 0) || 0;
                    return total + contestTotal;
                  }, 0).toLocaleString()} in Prizes
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <TrendingUp className="w-5 h-5 text-green-300" />
                <span className="font-medium">Join {contests.reduce((total, contest) => total + (contest.registrations?.length || 0), 0)}+ Participants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-lg border backdrop-blur-sm ${
            notification.type === 'success'
              ? 'bg-green-50/80 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700'
              : 'bg-red-50/80 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700'
          }`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Enhanced Tabs */}
        <div className="flex space-x-2 mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
          {(['available', 'my-contests'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-gray-700/70 hover:scale-102'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {tab === 'available' ? <Trophy className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                {tab === 'available' ? 'Discover Contests' : 'My Journey'}
              </div>
            </button>
          ))}
        </div>

        {/* Available Contests Tab */}
        {activeTab === 'available' && (
          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 animate-pulse"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg font-medium">Loading amazing contests...</p>
              </div>
            ) : contests.length === 0 ? (
              <div className="text-center py-16 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm">
                <Trophy className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <p className="text-gray-600 dark:text-gray-300 text-xl">No contests available at the moment</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Check back soon for exciting opportunities!</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {contests.map((contest) => {
                  const regStatus = getRegistrationStatus(contest);
                  const registered = isRegistered(contest);
                  const registrationPercentage = contest.registrations?.length ? 
                    Math.min((contest.registrations.length / 100) * 100, 100) : 0;
                  const category = getCategory(contest);
                  const difficulty = getDifficulty(contest);
                  const featured = isFeatured(contest);
                  const topPrize = getTopPrize(contest.prizes);
                  const totalPrize = getTotalPrizeMoney(contest.prizes);

                  return (
                    <div key={contest._id} className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${featured ? 'ring-2 ring-gradient-to-r from-yellow-400 to-orange-500' : ''}`}>
                      {/* Featured Badge */}
                      {featured && (
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          <div className="flex items-center gap-1">
                            <Crown className="w-4 h-4" />
                            FEATURED
                          </div>
                        </div>
                      )}

                      {/* Contest Header */}
                      <div className="mb-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {contest.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(difficulty)}`}>
                                {difficulty}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                {category}
                              </span>
                            </div>
                          </div>
                          
                          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            regStatus === 'open' ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100' :
                            regStatus === 'upcoming' ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100' :
                            'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100'
                          }`}>
                            {regStatus === 'open' ? '🔥 Open Now' :
                            regStatus === 'upcoming' ? '⏰ Soon' : '❌ Closed'}
                          </div>
                        </div>

                        {/* Prize Highlight */}
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 mb-4 border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                              <Gift className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Prize Pool</p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPrize}</p>
                              {contest.prizes && contest.prizes.length > 0 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">Top Prize: {topPrize}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{contest.description}</p>
                      </div>
                      {/* Contest Details */}
                      <div className="space-y-4 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span><strong>Registration:</strong> {formatDate(contest.registrationStartDate)} - {formatDate(contest.registrationEndDate)}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span><strong>Contest:</strong> {formatDate(contest.startDate)} - {formatDate(contest.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span><strong>Participants:</strong> {contest.registrations?.length || 0}</span>
                          </div>
                        </div>

                        {/* Rules and Judging Criteria */}
                        <div className="mb-6">
                          <button
                            onClick={() => toggleContestDetails(contest._id)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 dark:text-white">
                              Contest Rules & Criteria
                            </span>
                            <ChevronDown 
                              className={`w-5 h-5 transition-transform ${
                                expandedContestId === contest._id ? 'transform rotate-180' : ''
                              }`}
                            />
                          </button>
                          
                          {expandedContestId === contest._id && (
                            <div className="mt-4 space-y-4">
                              {/* Rules Section */}
                              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                  <Scroll className="w-4 h-4 text-blue-500" />
                                  Contest Rules
                                </h4>
                                <div className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap">
                                  {contest.rules}
                                </div>
                              </div>

                              {/* Judging Criteria Section */}
                              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                  <Scale className="w-4 h-4 text-purple-500" />
                                  Judging Criteria
                                </h4>
                                <div className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap">
                                  {contest.judgingCriteria}
                                </div>
                              </div>

                              {/* Prize Breakdown */}
                              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                  <Award className="w-4 h-4 text-yellow-500" />
                                  Prize Breakdown
                                </h4>
                                <div className="space-y-2">
                                  {contest.prizes?.map((prize, index) => (
                                    <div 
                                      key={index}
                                      className="flex items-center justify-between text-sm"
                                    >
                                      <span className="text-gray-600 dark:text-gray-300">
                                        Position {prize.position}
                                      </span>
                                      <span className="font-semibold text-gray-900 dark:text-white">
                                        ${prize.prizeAmount?.toLocaleString()}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Registration Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Registration Activity</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{contest.registrations?.length || 0} joined</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {registered ? (
                        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-800">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-semibold text-green-800 dark:text-green-200">You're In!</p>
                            <p className="text-sm text-green-600 dark:text-green-300">Ready to showcase your talent</p>
                          </div>
                        </div>
                      ) : regStatus === 'open' ? (
                        <div className="space-y-4">
                          <button
                            onClick={() => fetchVideos(contest.type_id?.name || '')}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl mb-4"
                          >
                            Load My Videos
                          </button>
                          {/* <select
                            value={selectedVideo}
                            onChange={(e) => setSelectedVideo(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          >
                            <option value="">🎬 Select your best video</option>
                            {Array.isArray(videos) && videos.map((video) => (
                              <option key={video._id} value={video._id}>
                                {video.title}
                              </option>
                            ))}
                          </select> */}
                    <select
  value={selectedVideo}
  onChange={(e) => setSelectedVideo(e.target.value)}
  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
>
  <option value="">🎬 Select your best video</option>
  {Array.isArray(videos) && videos.map((video) => (
    <option key={video._id} value={video._id}>
      {video.name}
    </option>
  ))}
</select>



                          <button
                            onClick={() => registerForContest(contest._id)}
                            disabled={loading || !selectedVideo}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
                          >
                            <div className="flex items-center justify-center gap-2">
                              {loading ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                  Joining Contest...
                                </>
                              ) : (
                                <>
                                  <Zap className="w-5 h-5" />
                                  Join the Challenge
                                </>
                              )}
                            </div>
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 font-semibold py-4 px-6 rounded-xl cursor-not-allowed"
                        >
                          Registration {regStatus === 'upcoming' ? 'Opens Soon' : 'Closed'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {/* My Contests Tab */}
       {/* My Contests Tab */}
{activeTab === 'my-contests' && (
  <div className="space-y-8">
    {myContests.length === 0 ? (
      <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl backdrop-blur-sm">
        <div className="relative mb-8">
          <Video className="w-24 h-24 text-gray-400 mx-auto" />
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2">
            <Star className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Contest Journey Starts Here!</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          Join exciting contests, showcase your creativity, and win amazing prizes. Your next big opportunity is just one click away!
        </p>
        <button
          onClick={() => setActiveTab('available')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Explore Contests
          </div>
        </button>
      </div>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {myContests.map((contest) => (
          <div key={contest._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{contest.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{contest.description}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span><strong>Type:</strong> {contest.type_id?.name || 'General'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>
                  <strong>Duration:</strong> {
                    contest.contestStartDate && contest.contestEndDate
                      ? `${formatDate(contest.contestStartDate)} - ${formatDate(contest.contestEndDate)}`
                      : contest.startDate && contest.endDate
                      ? `${formatDate(contest.startDate)} - ${formatDate(contest.endDate)}`
                      : 'Dates TBD'
                  }
                </span>
              </div>
              {contest.prizes && contest.prizes.length > 0 && (
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <Gift className="w-4 h-4 text-green-500" />
                  <span><strong>Prize Pool:</strong> {getTotalPrizeMoney(contest.prizes)}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 text-purple-500" />
                <span>
                  <strong>Status:</strong> {
                    contest.status || 
                    (new Date() < new Date(contest.registrationStartDate) ? 'Upcoming' :
                     new Date() > new Date(contest.registrationEndDate) ? 'Registration Closed' : 'Active')
                  }
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
                <Play className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-200">Active Participant</p>
                <p className="text-sm text-blue-600 dark:text-blue-300">Show the world your talent!</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
      </div>
    </div>
  );
}
