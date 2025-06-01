
"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

// Dynamically import ApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Simple 3-dot icon component (inline SVG)
function MoreDotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <circle cx={12} cy={5} r={1.5} />
      <circle cx={12} cy={12} r={1.5} />
      <circle cx={12} cy={19} r={1.5} />
    </svg>
  );
}

// Dropdown wrapper component
function Dropdown({
  isOpen,
  onClose,
  children,
  className = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={`absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 ${className}`}
      style={{ minWidth: 160 }}
    >
      {children}
    </div>
  );
}

// Dropdown item component
function DropdownItem({
  onItemClick,
  children,
  className = "",
}: {
  onItemClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onItemClick}
      className={`w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none ${className}`}
      type="button"
    >
      {children}
    </button>
  );
}

export default function MonthlySalesChart() {
  const [userData, setUserData] = useState(Array(12).fill(0));
  const [target, setTarget] = useState<number>(0);
  const [inputTarget, setInputTarget] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(12);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("https://shreejighutargo21.onrender.com/api/admin/users-monthly-count");
        const userData = await userRes.json();
        setUserData(userData.monthlyData);

        if (token) {
          const targetRes = await fetch("https://shreejighutargo21.onrender.com/api/vendors/get-target-users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const targetData = await targetRes.json();
          if (targetData.success) {
            setTarget(targetData.monthly_target_users);
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleTargetSubmit = async () => {
    const numTarget = parseInt(inputTarget);
    if (isNaN(numTarget)) {
      toast.error("Please enter a valid number");
      return;
    }

    try {
      const res = await fetch("https://shreejighutargo21.onrender.com/api/vendors/set-target-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ target: numTarget }),
      });

      const data = await res.json();
      if (data.success) {
        setTarget(data.monthly_target_users);
        toast.success(data.message);
        setIsModalOpen(false);
        setInputTarget("");
      } else {
        toast.error(data.message || "Failed to update target");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  // Dropdown toggle
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);

  // Open modal on clicking "Set Target"
  const handleSetTargetClick = () => {
    setIsModalOpen(true);
    closeDropdown();
  };

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    annotations: {
      yaxis: [
        {
          y: target,
          borderColor: "#FF4560",
          label: {
            borderColor: "#FF4560",
            style: {
              color: "#fff",
              background: "#FF4560",
            },
            text: `Target: ${target}`,
          },
        },
      ],
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  const series = [{ name: "Users", data: userData }];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly User Signups
        </h3>

        {/* Dropdown button */}
        <div className="relative inline-block dark:text-white/100">
        <button onClick={toggleDropdown} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
  <MoreDotIcon />
</button>

          <Dropdown isOpen={dropdownOpen} onClose={closeDropdown}>
            {/* Dropdown items */}
            <DropdownItem onItemClick={handleSetTargetClick}>
              Set Target
            </DropdownItem>

            {/* You can add more items here if needed */}
            {/* Example:
            <DropdownItem onItemClick={() => { alert('View More'); closeDropdown(); }}>
              View More
            </DropdownItem> */}
          </Dropdown>
        </div>
      </div>

      <ReactApexChart options={options} series={series} type="bar" height={180} />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-80 space-y-4 shadow-lg">
            <h4 className="text-lg font-bold text-gray-800 dark:text-white">
               for Last {selectedRange} Months
            </h4>
            <input
              type="number"
              value={inputTarget}
              onChange={(e) => setInputTarget(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring"
              placeholder="Enter user target"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 text-gray-600 hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleTargetSubmit}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
