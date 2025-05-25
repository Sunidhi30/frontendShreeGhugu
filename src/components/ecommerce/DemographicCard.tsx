"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import CountryMap from "./CountryMap";

interface Marker {
  latLng: [number, number];
  name: string;
  r?: number;
  style?: {
    fill: string;
    borderWidth: number;
    borderColor: string;
    stroke?: string;
    strokeOpacity?: number;
  };
}

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);

  // Set explicit type for locations state to Marker[]
  const [locations, setLocations] = useState<Marker[]>([]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    const fetchUserLocations = async () => {
      try {
        const res = await fetch(
          "https://shreejighutargo21.onrender.com/api/users/user-locations"
        ); // Replace with your actual endpoint
        const data = await res.json();

        const locationPromises = data.users.map(async (user: any) => {
          const address = user.lastLogin?.location;
          if (address) {
            const geocode = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                address
              )}`
            );
            const geoData = await geocode.json();
            if (geoData && geoData.length > 0) {
              const { lat, lon } = geoData[0];
              return {
                latLng: [parseFloat(lat), parseFloat(lon)] as [number, number],
                name: user.email,
                r: 4, // optional radius
              };
            }
          }
          return null;
        });

        const markers = (await Promise.all(locationPromises)).filter(
          (marker): marker is Marker => marker !== null
        );
        setLocations(markers);
      } catch (error) {
        console.error("Failed to fetch locations", error);
      }
    };

    fetchUserLocations();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Customers Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Number of customer based on country
          </p>
        </div>
        <div className="relative inline-block">{/* Dropdown code commented out */}</div>
      </div>

      <div className="px-4 py-6 my-6 overflow-hidden border border-gray-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          <CountryMap markers={locations} />
        </div>
      </div>

      {/* Dummy content preserved below */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="items-center w-full rounded-full max-w-8">
              <Image
                width={48}
                height={48}
                src="/images/country/country-01.svg"
                alt="usa"
                className="w-full"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                India
              </p>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                2 Users
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
              <div className="absolute left-0 top-0 flex h-full w-[79%] items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"></div>
            </div>
            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
              80%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
