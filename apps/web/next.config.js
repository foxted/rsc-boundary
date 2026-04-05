/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["rsc-boundary"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
