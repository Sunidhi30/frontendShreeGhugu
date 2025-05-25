import Calendar from "@/components/addMovies/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gutargoo",
  description:
    "Gutargoo",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add Movies" />
      <Calendar />
    </div>
  );
}
