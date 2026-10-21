import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { assetUrl, getSettings } from "@/lib/pb";
import { siteUrl } from "@/lib/site";
import type { Settings } from "@/lib/types";

function organizationJsonLd(settings: Settings) {
  const locality = settings.address.match(/^(.*?(?:省|市|自治区|特别行政区))/)?.[1];

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.companyName,
    description: settings.tagline,
    telephone: settings.phone,
    email: settings.email,
    url: siteUrl(),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      ...(locality ? { addressLocality: locality } : {}),
      addressCountry: "CN",
    },
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const jsonLd = organizationJsonLd(settings);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header
        companyName={settings.companyName}
        logoUrl={assetUrl(settings.collectionId, settings.id, settings.logo)}
      />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
