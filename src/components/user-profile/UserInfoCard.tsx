
// "use client";

// import { useEffect, useState } from "react";
// import { useModal } from "../../hooks/useModal";
// import Label from "../form/Label";
// import Input from "../form/input/InputField";
// import Button from "../ui/button/Button";
// import { Modal } from "../ui/modal";

// export default function UserInfoCard() {
//   const { isOpen, openModal, closeModal } = useModal();
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [newProfileImage, setNewProfileImage] = useState(null);
//   const [newEmail, setNewEmail] = useState("");

//   useEffect(() => {
//     const fetchEmail = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("Authorization token missing.");
//           setLoading(false);
//         }

//         const response = await fetch("http://localhost:9000/api/admin/profile", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch email data");
//         }

//         const data = await response.json();

//         if (data.email) {
//           setEmail(data.email);
//           setProfileImage(data.profileImage); // save image URL
//         }
//       } catch (err) {
//         console.error("Error fetching email:", err);
//         setError("An error occurred while fetching the data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmail();
//   }, []);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setNewProfileImage(file);
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result); // Set the image preview
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = async () => {
//     const token = localStorage.getItem("token");
//     const formData = new FormData();
//     if (newProfileImage) formData.append("profileImage", newProfileImage);
//     if (newEmail) formData.append("email", newEmail);

//     try {
//       const response = await fetch("http://localhost:9000/api/admin/update-profile", {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update profile");
//       }

//       // If successful, update the UI with new values
//       const data = await response.json();
//       console.log("Updated profile data:", data);
//       setEmail(data.email);
//       setProfileImage(data.profileImage); // Assuming response contains the updated image URL
//       closeModal();
//     } catch (err) {
//       console.error("Error saving changes:", err);
//       setError("Failed to save changes.");
//     }
//   };

//   return (
//     <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
//       <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//         <div className="flex items-center gap-5">
//           {/* Profile Image */}
//           {profileImage && (
//             <img
//               src={profileImage}
//               alt="Profile"
//               className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-700"
//             />
//           )}

//           <div>
//             <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-2">
//               Personal Information
//             </h4>
//             <p className="text-xs leading-normal text-gray-500 dark:text-gray-400">
//               Email address
//             </p>
//             <p className="text-sm font-medium text-gray-800 dark:text-white/90">
//               {loading ? "Loading..." : error ? error : email}
//             </p>
//           </div>
//         </div>

//         <button
//           onClick={openModal}
//           className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
//         >
//           <svg
//             className="fill-current"
//             width="18"
//             height="18"
//             viewBox="0 0 18 18"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               fillRule="evenodd"
//               clipRule="evenodd"
//               d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
//               fill=""
//             />
//           </svg>
//           Edit
//         </button>
//       </div>

//       <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
//         <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
//           <div className="px-2 pr-14">
//             <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
//               Edit Personal Information
//             </h4>
//             <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
//               Update your profile image and email.
//             </p>
//           </div>
//           <form className="flex flex-col">
//             <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
//               <div className="mt-7">
//                 <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
//                   Personal Information
//                 </h5>

//                 <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
//                   <div className="col-span-2">
//                     <Label>Email Address</Label>
//                     <Input
//                       type="email"
//                       defaultValue={email}
//                       onChange={(e) => setNewEmail(e.target.value)}
//                     />
//                   </div>

//                   <div className="col-span-2">
//                     <Label>Profile Image</Label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                     />
//                     {/* Preview the selected image */}
//                     {profileImage && (
//                       <img
//                         src={profileImage}
//                         alt="Profile Preview"
//                         className="mt-3 w-32 h-32 object-cover rounded-full border border-gray-300 dark:border-gray-700"
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
//               <Button size="sm" variant="outline" onClick={closeModal}>
//                 Close
//               </Button>
//               <Button size="sm" onClick={handleSave}>
//                 Save Changes
//               </Button>
//             </div>
//           </form>
//         </div>
//       </Modal>
//     </div>
//   );
// }
