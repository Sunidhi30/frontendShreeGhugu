// "use client";

// import { useParams } from "next/navigation";
// import { useEffect } from "react";

// export default function CategoryVideos() {
//   const params = useParams();
//   const categoryId = params?.categoryId;

//   useEffect(() => {
//     if (!categoryId) return;
//     console.log("📡 Sending request to fetch videos by category:", categoryId);

//     const fetchVideos = async () => {
//       const token = localStorage.getItem("token");
//       const url = `http://localhost:9000/api/vendors/videos/category/${categoryId}`;
//       try {
//         const res = await fetch(url, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await res.json();
//         console.log("🎥 Video list:", data);
//       } catch (error) {
//         console.error("❌ Error fetching videos:", error);
//       }
//     };

//     fetchVideos();
//   }, [categoryId]);

//   return (
//     <div className="p-8 text-white">
//       <h1 className="text-2xl">Videos by Category</h1>
//     </div>
//   );
// }
