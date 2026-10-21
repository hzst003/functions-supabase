import { getSettings } from "@/lib/pb";

export async function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const settings = await getSettings();

  return (
    <section className="border-b border-slate-200 bg-navy-50 text-navy-950">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-700">
          {settings.companyName}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
