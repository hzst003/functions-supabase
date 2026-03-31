import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许开发模式下从其他 Origin 访问 dev-only 资源（例如 /_next/webpack-hmr）
  // 文档示例：['local-origin.dev', '*.local-origin.dev']
  // 这里尝试放开所有来源；若你的 Next 版本不接受 '*'，请改为显式列出域名/IP（或用 next start 提供对外访问）。
  allowedDevOrigins: ["*"],
};

export default nextConfig;
