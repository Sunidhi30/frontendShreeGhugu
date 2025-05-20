
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

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
    name: string;
    price?: string;
  };
  video_type?: string;
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
  const [statusFilter, setStatusFilter] = useState<string>("rejected"); // default status is 'rejected'

  useEffect(() => {
    const fetchVendorVideos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:9000/api/vendors/videos-by-status?status=${statusFilter}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

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
              `http://localhost:9000/api/admin/admin-note/${id}`,
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
        <div className="min-w-[1102px]">
          {/* Status Filter Buttons */}
          <div className="flex justify-end space-x-4 p-4">
            <button
              onClick={() => handleStatusChange("pending")}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusChange("approved")}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Approved
            </button>
            <button
              onClick={() => handleStatusChange("rejected")}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Rejected
            </button>
          </div>

          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Thumbnail
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Movie Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Price
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Type
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {videoData.map((video) => {
                const note = adminNotes[video._id];
                const status = note?.status || video.status;
                const adminNote = note?.adminNote;

                return (
                  <TableRow key={video._id}>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="w-12 h-12 overflow-hidden rounded">
                        <Image
                          src={video.thumbnail}
                          alt={video.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-700 dark:text-white">
                      {video.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-700 dark:text-white">
                      {video.finalPackage_id?.price || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
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
                            <p className="text-sm text-green-500">Movie Approved with a cute little note!</p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-700 dark:text-white">
                      {video.video_type || "Unknown"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Link
                        href={`/vendor/video/${video._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        View More
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
