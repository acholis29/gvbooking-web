import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  // Ijin Image Akses Image Dari Domain Luar Untuk Component Image
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "bo.govacation.biz",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bo.govacation.biz",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "bo.govacation-thailand.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bo.govacation-thailand.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "gvvbo.smarttouristicsystem.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gvvbo.smarttouristicsystem.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "gvcbo.smarttouristicsystem.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gvcbo.smarttouristicsystem.com",
        pathname: "/**",
      },
    ],
  },
};

export default withFlowbiteReact(nextConfig);