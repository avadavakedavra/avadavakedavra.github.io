import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: '/school-directory',
};
export default nextConfig;
