import type { NextConfig } from "next";

function pocketbaseImagePattern() {
  const raw =
    process.env.POCKETBASE_URL ||
    process.env.NEXT_PUBLIC_POCKETBASE_URL ||
    "http://127.0.0.1:8090";
  const url = new URL(raw);
  return {
    protocol: url.protocol.replace(":", "") as "http" | "https",
    hostname: url.hostname,
    ...(url.port ? { port: url.port } : {}),
    pathname: "/api/files/**",
  };
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [pocketbaseImagePattern()],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
