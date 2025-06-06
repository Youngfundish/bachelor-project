import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_SECRET: "ZCdygiU3cl5dpPn7Jjmii6lk2uiVbenJQ922aW0nP0A=",
    NEXT_PUBLIC_NEST_SERVICE: "https://backend-wecx.onrender.com",
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
