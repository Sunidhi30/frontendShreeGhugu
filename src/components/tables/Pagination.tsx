
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";

interface Video {
  _id: string;
  thumbnail: string;
  name: string;
  status: string;
  uploadedBy?: {
    name: string;
  };
  package_id: string;
  finalPackage_id?: {
    name?: string;
    price?: string | number;
  };
  category_id?: {
    _id: string;
    name: string;
  };
  price?: number | string;
}

interface AdminNote {
  videoId: string;
  title: string;
  status: string;
  isApproved: boolean;
  adminNote: string;
  approvedBy: {
    _id: string;
    email: string;
  };
  approvalDate: string;
}

export default function BasicTableOne() {
  const [videoData, setVideoData] = useState<Video[]>([]);
  const [adminNotes, setAdminNotes] = useState<Record<string, AdminNote>>({});
  const [statusFilter, setStatusFilter] = useState<string>("pending");

  useEffect(() => {
    const fetchVendorVideos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://shreejighutargo21.onrender.com/api/vendors/videos-by-status?status=${statusFilter}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("Fetched videos:", data);
        if (response.ok) {
          setVideoData(data.videos);
          // Fetch admin notes for each video
          fetchAdminNotes(data.videos.map((v: Video) => v._id));
        } else {
          console.error("Failed to fetch videos:", data.message);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    const fetchAdminNotes = async (videoIds: string[]) => {
      const token = localStorage.getItem("token");
      const notes: Record<string, AdminNote> = {};

      await Promise.all(
        videoIds.map(async (id) => {
          try {
            const res = await fetch(
              `https://shreejighutargo21.onrender.com/api/admin/admin-note/${id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (res.ok) {
              const note: AdminNote = await res.json();
              notes[id] = note;
            }
          } catch (err) {
            console.warn(`No admin note found for video ID: ${id}`);
          }
        })
      );

      setAdminNotes(notes);
    };

    fetchVendorVideos();
  }, [statusFilter]);

  const getStatusLabel = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === "approved") return "Approved";
    if (normalized === "rejected") return "Rejected";
    return "Pending";
  };

  const getBadgeColor = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === "approved") return "success";
    if (normalized === "rejected") return "error";
    return "warning";
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="w-full overflow-x-auto">
        <div className="min-w-full p-4">

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap justify-end gap-3 mb-4">
            {["pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-4 py-2 rounded-md text-white 
                  ${
                    status === "pending"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : status === "approved"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  }
                `}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Table for medium+ screens */}
          <table className="hidden md:table w-full border-collapse text-left text-gray-700 dark:text-white">
            <thead className="border-b border-gray-100 dark:border-white/[0.05]">
              <tr>
                {["Thumbnail", "Movie Name", "Price", "Status", "Category", "Action"].map((header) => (
                  <th key={header} className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {videoData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No video data found.
                  </td>
                </tr>
              ) : (
                videoData.map((video) => {
                  const note = adminNotes[video._id];
                  const status = note?.status || video.status;
                  const adminNote = note?.adminNote;
                  const categoryName = video.category_id?.name || "Unknown";

                  return (
                    <tr key={video._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                      <td className="px-5 py-4">
                        {video.thumbnail ? (
                          <Image
                            src={video.thumbnail}
                            alt={video.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">{video.name}</td>
                      <td className="px-4 py-3">₹{video.finalPackage_id?.price ?? video.price ?? "N/A"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <Badge size="sm" color={getBadgeColor(status)}>
                            {getStatusLabel(status)}
                          </Badge>
                          {status.toLowerCase() === "rejected" && adminNote && (
                            <div className="bg-red-50 p-2 rounded-md mt-2">
                              <span className="text-xs text-red-600 font-semibold">
                                Rejected Reason:
                              </span>
                              <p className="text-sm text-red-500">{adminNote}</p>
                            </div>
                          )}
                          {status.toLowerCase() === "approved" && (
                            <div className="bg-green-50 p-2 rounded-md mt-2">
                              <span className="text-xs text-green-600 font-semibold">
                                Approved Note:
                              </span>
                              <p className="text-sm text-green-500">Movie Approved with a note!</p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">{categoryName}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/vendor/video/${video._id}`}
                          className="text-blue-500 hover:underline"
                        >
                          View More
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Card layout for small screens */}
          <div className="md:hidden space-y-4">
            {videoData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No video data found.</div>
            ) : (
              videoData.map((video) => {
                const note = adminNotes[video._id];
                const status = note?.status || video.status;
                const adminNote = note?.adminNote;
                const categoryName = video.category_id?.name || "Unknown";

                return (
                  <div
                    key={video._id}
                    className="border border-gray-200 rounded-xl p-4 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 overflow-hidden rounded">
                        <Image
                          src={video.thumbnail || "/placeholder.png"} // fallback to a placeholder image
                          alt={video.name || "Video Thumbnail"}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {video.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">Price: ₹{video.price || video.finalPackage_id?.price || "N/A"}</p>
                        <p className="text-gray-600 dark:text-gray-300">Category: {categoryName}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Badge size="sm" color={getBadgeColor(status)}>
                        {getStatusLabel(status)}
                      </Badge>

                      {status.toLowerCase() === "rejected" && adminNote && (
                        <div className="bg-red-50 p-2 rounded-md mt-2">
                          <span className="text-xs text-red-600 font-semibold">
                            Rejected Reason:
                          </span>
                          <p className="text-sm text-red-500">{adminNote}</p>
                        </div>
                      )}
                      {status.toLowerCase() === "approved" && (
                        <div className="bg-green-50 p-2 rounded-md mt-2">
                          <span className="text-xs text-green-600 font-semibold">
                            Approved Note:
                          </span>
                          <p className="text-sm text-green-500">Movie Approved with a note!</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <Link
                        href={`/vendor/video/${video._id}`}
                        className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        View More
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
