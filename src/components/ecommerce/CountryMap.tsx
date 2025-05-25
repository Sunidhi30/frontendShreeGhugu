"use client";

import { worldMill } from "@react-jvectormap/world";
import dynamic from "next/dynamic";
import React from "react";

const VectorMap = dynamic(
  () => import("@react-jvectormap/core").then((mod) => mod.VectorMap),
  { ssr: false }
);

interface Marker {
  latLng: [number, number];
  name: string;
  r?: number; // Radius per marker
  style?: {
    fill: string;
    borderWidth: number;
    borderColor: string;
    stroke?: string;
    strokeOpacity?: number;
  };
}

interface CountryMapProps {
  mapColor?: string;
  markers?: Marker[];
}

const CountryMap: React.FC<CountryMapProps> = ({ mapColor, markers = [] }) => {
  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"
      markerStyle={{
        initial: {
          fill: "#465FFF",
          // no `r` here, it's invalid CSS property
        },
      }}
      markers={markers.map((m) => ({
        ...m,
        r: m.r ?? 4, // default radius 4 for each marker
        style: {
          fill: "#465FFF",
          borderWidth: 1,
          borderColor: "white",
          ...m.style,
        },
      }))}
      zoomOnScroll={false}
      zoomMax={12}
      zoomMin={1}
      zoomAnimate={true}
      zoomStep={1.5}
      regionStyle={{
        initial: {
          fill: mapColor || "#D0D5DD",
          fillOpacity: 1,
          stroke: "none",
        },
        hover: {
          fillOpacity: 0.7,
          cursor: "pointer",
          fill: "#465FFF",
        },
        selected: {
          fill: "#465FFF",
        },
      }}
      regionLabelStyle={{
        initial: {
          fill: "#35373e",
          fontWeight: 500,
          fontSize: "13px",
        },
      }}
    />
  );
};

export default CountryMap;
