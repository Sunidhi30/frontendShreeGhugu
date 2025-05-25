
"use client";
import { ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";

export const EcommerceMetrics = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const [videoCount, setVideoCount] = useState<number>(0);
  const [targetUsers, setTargetUsers] = useState<number>(0);
  const [targetVideos, setTargetVideos] = useState<number>(0);

  useEffect(() => {
    const fetchCountsAndTarget = async () => {
      try {
        const token = localStorage.getItem("token");

        // Helper function to fetch and parse JSON only if response is OK
        const fetchJson = async (url: string, options?: RequestInit) => {
          const res = await fetch(url, options);
          if (!res.ok) {
            // throw error with status text for better debugging
            throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
          }
          return res.json();
        };

        const [userData, targetVideoData, videoData, targetData] = await Promise.all([
          fetchJson("https://shreejighutargo21.onrender.com/api/admin/users-count"),
          fetchJson("https://shreejighutargo21.onrender.com/api/vendors/get-target-videos", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetchJson("https://shreejighutargo21.onrender.com/api/vendors/vendor/video-count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetchJson("https://shreejighutargo21.onrender.com/api/vendors/get-target-users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        
        

        setUserCount(userData.totalUsers || 0);
        setVideoCount(videoData.videoCount || 0);
        setTargetUsers(targetData.monthly_target_users || 0);
        setTargetVideos(targetVideoData.monthlyTargetVideo || 0);
      } catch (error) {
        console.error("Error fetching counts or target:", error);
      }
    };

    fetchCountsAndTarget();
  }, []);

  // Calculate user progress %
  const userProgressPercent =
    targetUsers > 0 ? (userCount / targetUsers) * 100 : 0;
    const videoProgressPercent =
  targetVideos > 0 ? (videoCount / targetVideos) * 100 : 0;


  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Users */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Users</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {userCount.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {userProgressPercent.toFixed(2)}%
          </Badge>
        </div>
      </div>

      {/* Videos */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Videos</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {videoCount.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
  <ArrowUpIcon />
  {videoProgressPercent.toFixed(2)}%
</Badge>

        </div>
      </div>
    </div>
  );
};
