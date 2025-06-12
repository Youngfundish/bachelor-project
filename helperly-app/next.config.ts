import type { NextConfig } from "next";


const isProd = process.env.NODE_ENV === "production"
const backend = isProd
  ? "http://backend-wecx.onrender.com/"
  : "http://localhost:3001"
  
const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_SECRET: "ZCdygiU3cl5dpPn7Jjmii6lk2uiVbenJQ922aW0nP0A=",
    NEXT_PUBLIC_NEST_SERVICE: backend,
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
