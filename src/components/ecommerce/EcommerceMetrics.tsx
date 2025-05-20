"use client";
import { ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";

export const EcommerceMetrics = () => {
  const [userCount, setUserCount] = useState<number>(0); // Initialize to 0 instead of null
  const [videoCount, setVideoCount] = useState<number>(0); // Initialize to 0 instead of null

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("token"); // Get vendor token from localStorage

        const [userRes, videoRes] = await Promise.all([
          fetch("http://localhost:9000/api/admin/users-count"),
          fetch("http://localhost:9000/api/vendors/vendor/video-count", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const userData = await userRes.json();
        const videoData = await videoRes.json();

        setUserCount(userData.totalUsers || 0); // Ensure fallback to 0 if data is missing
        setVideoCount(videoData.videoCount || 0); // Ensure fallback to 0 if data is missing
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Users */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {userCount.toLocaleString()} {/* Directly use the number */}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            .01%
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
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Videos
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {videoCount.toLocaleString()} {/* Directly use the number */}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            0.1%
          </Badge>
        </div>
      </div>
    </div>
  );
};
