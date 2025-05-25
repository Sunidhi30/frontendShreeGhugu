import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import ViewMore from "@/components/tables/viewMore";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gutargoo",
  description: "Gutargoo",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Videos" />
      <div className="space-y-6">
      <ComponentCard title="Videos">
  <BasicTableOne />
</ComponentCard>

        <ViewMore />
        {/* <Pagination/> */}
      </div>
    </div>
  );
}
