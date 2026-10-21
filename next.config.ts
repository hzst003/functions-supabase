import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // EdgeOne HTTPS pages cannot reliably optimize PocketBase HTTP sources;
    // covers already use PocketBase thumbs via the /media proxy.
    unoptimized: true,
  },
};

export default nextConfig;
