"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Type {
  _id: string;
  name: string;
}

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
    price?: number;
  };
  video_type?: string;
  category_id?: {
    name: string;
  };
}

export default function BasicTableOne() {
  const [videoData, setVideoData] = useState<Video[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  // Fetch types for filter dropdown
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/users/get_types");
        const data = await response.json();
        if (response.ok) {
          setTypes(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch types:", error);
      }
    };
    fetchTypes();
  }, []);

  // Fetch videos based on selected type
  useEffect(() => {
    const fetchVendorVideos = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = new URL("http://localhost:9000/api/vendors/filter-videos");
        if (selectedType) {
          url.searchParams.append("type", selectedType);
        }
        console.log("Fetching videos from URL:", url.toString()); // 👈 Logs the final URL

        const response = await fetch(url.toString(), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setVideoData(data.videos);
        } else {
          console.error("Failed to fetch videos:", data.message);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVendorVideos();
  }, [selectedType]);

  return (
    
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1102px]">

          {/* Filter Dropdown */}
          <div className="mb-4 flex items-center gap-2">
            <label htmlFor="typeFilter" className="text-gray-600 text-sm">
              Filter by Type:
            </label>
            <select
              id="typeFilter"
              className="border rounded px-2 py-1 text-sm"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All</option>
              {types.map((type) => (
                <option key={type._id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">Thumbnail</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">Movie Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">Price</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">Category</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">Type</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400"></TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {videoData.map((video) => (
                <TableRow key={video._id}>
                  <TableCell className="px-5 py-4">
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
                  <TableCell className="px-4 py-3 text-gray-700 dark:text-white">
                    {video.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 dark:text-white">
                    ₹{video.finalPackage_id?.price ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 dark:text-white">
                    {video.category_id?.name ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 dark:text-white">
                    {video.video_type ?? "Unknown"}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Link href={`/vendor/video/${video._id}`} className="text-blue-500 hover:underline">
                      View More
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </div>
      </div>
    </div>
  );
}
