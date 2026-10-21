import type { Metadata } from "next";
import { getServices, getSettings } from "@/lib/pb";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, services] = await Promise.all([
    getSettings(),
    getServices(),
  ]);
  const names = services.items.map((item) => item.title).join("、");
  const coverage = names
    ? `业务覆盖 ${names}。`
    : "业务覆盖 5G 基站、光纤传输、室分覆盖与弱电智能化。";
  const description = `${settings.companyName}——${settings.tagline}。${coverage}`;

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: settings.companyName,
      template: `%s | ${settings.companyName}`,
    },
    description,
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName: settings.companyName,
      title: settings.companyName,
      description,
      url: siteUrl(),
    },
    twitter: {
      card: "summary",
      title: settings.companyName,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
