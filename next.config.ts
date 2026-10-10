import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  // Fail the build on type errors in route params, links, etc.
  typedRoutes: true,
};

export default nextConfig;
