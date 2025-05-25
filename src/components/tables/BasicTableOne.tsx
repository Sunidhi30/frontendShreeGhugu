
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

interface Category {
  _id: string;
  name: string;
}

interface VideoType {
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
  type_id?: VideoType | null;
}

export default function BasicTableOne() {
  const [videoData, setVideoData] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://shreejighutargo21.onrender.com/api/users/get_categories"
        );
        const data = await response.json();
        if (response.ok) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        const url = new URL("https://shreejighutargo21.onrender.com/api/vendors/filter-videos-by");
        
        // Always set type to 'movie'
        url.searchParams.append("type", "movie");
        
        if (selectedCategory) {
          url.searchParams.append("category", selectedCategory);
        }

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
          setError(data.message || "Failed to fetch videos");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError("Error fetching videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedCategory]);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (

<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
  <div className="p-4">
    {/* Category Filter */}
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-2">
      <label htmlFor="categoryFilter" className="text-gray-600 text-sm mb-2 sm:mb-0">
        Filter by Category:
      </label>
      <select
        id="categoryFilter"
        className="border rounded px-2 py-1 text-sm w-full sm:w-auto"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>

    {loading ? (
      <div className="text-center p-4">Loading...</div>
    ) : (
      <>
        {/* Desktop Table */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Thumbnail
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Movie Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Price
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Category
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {videoData.map((video) => (
                <TableRow key={video._id}>
                 <TableCell className="px-5 py-4">
  <div className="w-12 h-12 overflow-hidden rounded">
    {video.thumbnail ? (
      <Image
        src={video.thumbnail}
        alt={video.name}
        width={48}
        height={48}
        className="object-cover"
      />
    ) : (
      <div className="w-12 h-12 bg-gray-200 text-xs text-center flex items-center justify-center rounded">
        No Image
      </div>
    )}
  </div>
</TableCell>

                  <TableCell className="px-4 py-3 text-gray-700 dark:text-white">
                    {video.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 dark:text-white">
                    ₹{video.finalPackage_id?.price ?? "Free"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 dark:text-white">
                    {video.category_id?.name ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Link
                      href={`/vendor/video/${video._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View More
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card List */}
        <div className="sm:hidden space-y-4">
          {videoData.map((video) => (
            <div
              key={video._id}
              className="border rounded-lg p-4 bg-gray-50 dark:bg-white/[0.05]"
            >
              <div className="flex items-center gap-4">
              <div className="w-16 h-16 overflow-hidden rounded">
  {video.thumbnail ? (
    <Image
      src={video.thumbnail}
      alt={video.name}
      width={64}
      height={64}
      className="object-cover"
    />
  ) : (
    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
      No Image
    </div>
  )}
</div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{video.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Price: ₹{video.finalPackage_id?.price ?? "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Category: {video.category_id?.name ?? "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <Link
                  href={`/vendor/video/${video._id}`}
                  className="text-blue-500 hover:underline text-sm"
                >
                  View More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
</div>

  );
}
