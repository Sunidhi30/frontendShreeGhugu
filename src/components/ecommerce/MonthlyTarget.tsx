
'use client';
import { MoreDotIcon } from "@/icons";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Helper to get token from localStorage safely
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Helper fetch that adds auth header automatically
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(url, { ...options, headers });
  return res;
};

export default function MonthlyTarget() {
  const [isOpen, setIsOpen] = useState(false);
  const [target, setTarget] = useState<number>(0);
  const [invested, setInvested] = useState(0);
  const [progress, setProgress] = useState(0);

  // New state for modal visibility and input
  const [showModal, setShowModal] = useState(false);
  const [inputTarget, setInputTarget] = useState("");

  // Fetch Target from backend
  const fetchTarget = async () => {
    try {
      const res = await authFetch("https://shreejighutargo21.onrender.com/api/vendors/get-target", {
        method: "GET",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTarget(data.monthly_target || 0);
      }
    } catch (err) {
      console.error("Error fetching target:", err);
    }
  };

  // Fetch Wallet Data
  const fetchWalletData = async () => {
    try {
      const res = await authFetch("https://shreejighutargo21.onrender.com/api/vendors/wallet-details", {
        method: "GET",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const totalEarnings = data.totalBalance || 0;
        setInvested(totalEarnings);
        if (target > 0) {
          setProgress((totalEarnings / target) * 100);
        }
      }
    } catch (err) {
      console.error("Error fetching wallet data:", err);
    }
  };

  // Replace old handleSetTarget: Open modal instead of prompt
  const handleSetTargetClick = () => {
    setInputTarget(""); // reset input
    setShowModal(true);
  };

  // On modal submit: validate and send API call
  const handleModalSubmit = async () => {
    const newTarget = parseInt(inputTarget);
    if (!newTarget || isNaN(newTarget)) {
      alert("Please enter a valid number");
      return;
    }
    try {
      const res = await authFetch("https://shreejighutargo21.onrender.com/api/vendors/set-target", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ target: newTarget }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTarget(data.monthly_target);
        setShowModal(false);
      } else {
        alert("Failed to update target");
      }
    } catch (err) {
      console.error("Target update failed:", err);
    }
  };

  useEffect(() => {
    fetchTarget();
  }, []);

  useEffect(() => {
    if (target > 0) {
      fetchWalletData();
    }
  }, [target]);

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "80%" },
        track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: () => `${progress.toFixed(2)}%`,
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };

  const series = [progress];
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);
  const remaining = target - invested;

  return (
    <>
      {/* Blurred background and Modal for set target */}
      {showModal && (
        <>
          <div
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md transition-all duration-300"

          />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Set Monthly Target</h2>
              <input
                type="number"
                value={inputTarget}
                onChange={(e) => setInputTarget(e.target.value)}
                placeholder="Enter target amount"
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalSubmit}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Target</h3>
              <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
                Target you’ve set for each month
              </p>
            </div>
            <div className="relative inline-block dark:text-white/100">
              <button onClick={toggleDropdown}>
                <MoreDotIcon className="text-gray-400 hover:text-gray-700  dark:hover:text-gray-300" />
              </button>
              <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2 dark:hover:text-gray-300">
                {/* <DropdownItem tag="a" onItemClick={() => { handleSetTargetClick(); closeDropdown(); }}>
                  Set Target
                </DropdownItem> */}
                <DropdownItem
  tag="a"
  onItemClick={() => {
    handleSetTargetClick();
    closeDropdown();
  }}
  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
>
  Set Target
</DropdownItem>

                {/* <DropdownItem tag="a" onItemClick={closeDropdown}>View More</DropdownItem>
                <DropdownItem tag="a" onItemClick={closeDropdown}>Delete</DropdownItem> */}
              </Dropdown>
            </div>
          </div>

          <div className="relative">
            <div className="max-h-[330px]">
              <ReactApexChart options={options} series={series} type="radialBar" height={330} />
            </div>
            <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
              {progress >= 100 ? "🎉 Completed" : `+${progress.toFixed(2)}%`}
            </span>
          </div>

          <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
            Your monthly target is ${target.toLocaleString()}
          </p>

          <p className="mt-4 text-center text-sm font-medium text-blue-600 dark:text-blue-400">
            {invested >= target
              ? "You're doing amazing! Keep reaching for the stars! 🚀"
              : "You're on the right path! You can do it! 💪"}
          </p>
        </div>

        <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
          <div>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Target</p>
            <p className="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg text-center">
              ${target.toLocaleString()}
            </p>
          </div>
          <div className="w-px bg-gray-200 h-7 dark:bg-gray-800" />
          <div>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Earned</p>
            <p className="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg text-center">
              ${invested.toLocaleString()}
            </p>
          </div>
          <div className="w-px bg-gray-200 h-7 dark:bg-gray-800" />
          <div>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Remaining</p>
            <p className="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg text-center">
              ${remaining > 0 ? remaining.toLocaleString() : "0"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
