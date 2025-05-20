"use client";

// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import ChartTab from "../common/ChartTab";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"], // Define line colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "straight", // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
    },
    xaxis: {
      type: "category", // Category-based x-axis
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Sales",
      data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    },
    {
      name: "Revenue",
      data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
    },
  ];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Target you’ve set for each month
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}


//below one was woorking fine but first i'll add data
// "use client";

// import { ApexOptions } from "apexcharts";
// import axios from "axios";
// import dynamic from "next/dynamic";
// import { useEffect, useState } from "react";
// import ChartTab from "../common/ChartTab";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

// const monthList = [
//   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
// ];

// export default function StatisticsChart() {
//   const [series, setSeries] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchPlanData = async () => {
//       try {
//         const res = await axios.get("/api/plan-summary"); // Adjust your API endpoint
//         const data = res.data; // Should be an array of { month, plan }

//         // Create initial structure
//         const planCounts: { [key: string]: number[] } = {
//           Premium: new Array(12).fill(0),
//           Standard: new Array(12).fill(0),
//           Basic: new Array(12).fill(0),
//         };

//         data.forEach((entry: { month: string; plan: string }) => {
//           const monthIndex = monthList.indexOf(entry.month);
//           if (monthIndex !== -1 && planCounts[entry.plan]) {
//             planCounts[entry.plan][monthIndex]++;
//           }
//         });

//         const formattedSeries = Object.entries(planCounts).map(
//           ([plan, data]) => ({
//             name: plan,
//             data,
//           })
//         );

//         setSeries(formattedSeries);
//       } catch (error) {
//         console.error("Error fetching plan data", error);
//       }
//     };

//     fetchPlanData();
//   }, []);

//   const planColors: { [key: string]: string } = {
//     Premium: "#3B82F6", // Blue
//     Standard: "#EF4444", // Red
//     Basic: "#10B981", // Green
//   };

//   const options: ApexOptions = {
//     chart: {
//       type: "bar",
//       stacked: true,
//       height: 310,
//       toolbar: { show: false },
//       fontFamily: "Outfit, sans-serif",
//     },
//     colors: series.map((s) => planColors[s.name] || "#888"),
//     xaxis: {
//       categories: monthList,
//       title: { text: "Month" },
//       axisBorder: { show: false },
//       axisTicks: { show: false },
//     },
//     yaxis: {
//       title: { text: "Number of Subscriptions" },
//       labels: {
//         style: {
//           fontSize: "12px",
//           colors: ["#6B7280"],
//         },
//       },
//     },
//     legend: {
//       position: "top",
//     },
//     tooltip: {
//       shared: true,
//       intersect: false,
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         borderRadius: 6,
//         columnWidth: "40%",
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//   };

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
//       <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
//         <div className="w-full">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//             Monthly Plan Statistics
//           </h3>
//           <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
//             Which plan users subscribed to in each month
//           </p>
//         </div>
//         <div className="flex items-start w-full gap-3 sm:justify-end">
//           <ChartTab />
//         </div>
//       </div>

//       <div className="max-w-full overflow-x-auto custom-scrollbar">
//         <div className="min-w-[1000px] xl:min-w-full">
//           <ReactApexChart
//             options={options}
//             series={series}
//             type="bar"
//             height={310}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
