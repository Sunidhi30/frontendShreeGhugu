// import React from 'react'

// const rejected-videos = () => {
//   return (
//     <div>
//       <h1>hello</h1>
//     </div>
//   )
// }

// export default rejected-videos
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Rejected from "@/components/tables/rejected";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Ghutargoo",
  description:
    "Ghutargoo",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Videos" />
      <div className="space-y-6">
        <ComponentCard title="Videos">
          {/* <BasicTableOne /> */}
          {/* <ApprovedVideos/> */}
          < Rejected />
        </ComponentCard>
        {/* <ViewMore /> */}
       
        </div>
    </div>
    
  );
}
