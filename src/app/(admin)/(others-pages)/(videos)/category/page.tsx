import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Category from "@/components/tables/Cateogory";

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
        <Category />
          {/* <ApprovedVideos/> */}
        </ComponentCard>
       
        {/* <Pagination/> */}
        </div>
    </div>
    
  );
}

