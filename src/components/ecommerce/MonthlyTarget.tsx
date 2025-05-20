
"use client";
import { MoreDotIcon } from "@/icons";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget() {
  const [isOpen, setIsOpen] = useState(false);
  const [target, setTarget] = useState(0);
  const [invested, setInvested] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");


    const fetchData = async () => {
      try {
        const res = await fetch("");
        const data = await res.json();
        console.log("Backend Data:", data);

        setTarget(data.targetAmount || 0);
        setInvested(data.totalInvested || 0);
        setProgress(parseFloat(data.percentageCompleted) || 0);
      } catch (err) {
        console.error("Failed to load monthly target data", err);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: () => `${progress}%`,
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
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Target</h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Target you’ve set for each month
            </p>
          </div>
          <div className="relative inline-block">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem tag="a" onItemClick={closeDropdown}>View More</DropdownItem>
              <DropdownItem tag="a" onItemClick={closeDropdown}>Delete</DropdownItem>
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
  {/* {remaining > 0
    ? `You're $${remaining.toLocaleString()} away from your goal. Keep going!`
    : "You've hit your goal. Great work!"} */}
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
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Invested</p>
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
  );
}
