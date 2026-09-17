import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import {
  formatLayout,
  getBuildingName,
  getRentalById,
} from "@/lib/data";

export default async function RentalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rental = getRentalById(id);
  if (!rental) notFound();

  const buildingName = getBuildingName(rental.buildingId);
  const cover = rental.images[0] ?? "/images/community.jpg";
  const callHref = `tel:${rental.contact.phone}`;
  const callLabel = `联系${rental.contact.name}`;

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader title={rental.title} backHref="/rentals" />
      <main className="mx-auto w-full max-w-md flex-1">
        <article className="bg-white pb-4">
          <div className="relative aspect-[16/10] bg-zinc-100">
            <Image
              src={cover}
              alt={rental.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 448px) 100vw, 448px"
            />
          </div>

          <div className="space-y-5 px-4 py-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">{rental.title}</h2>
              <p className="mt-2 text-2xl font-semibold text-rose-600">
                ¥{rental.price}
                <span className="text-sm font-normal text-zinc-500"> / 月</span>
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                {buildingName} · {rental.unit} · {rental.floor}楼 · {rental.room}
              </p>
            </div>

            <a
              href={callHref}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-rose-600 px-4 text-[15px] font-medium text-white active:bg-rose-500"
            >
              {callLabel}（{rental.contact.phone}）
            </a>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-zinc-50 px-3 py-2.5">
                <p className="text-zinc-500">面积</p>
                <p className="font-medium text-zinc-900">{rental.area}㎡</p>
              </div>
              <div className="rounded-xl bg-zinc-50 px-3 py-2.5">
                <p className="text-zinc-500">户型</p>
                <p className="font-medium text-zinc-900">
                  {formatLayout(rental)}
                </p>
              </div>
              <div className="rounded-xl bg-zinc-50 px-3 py-2.5">
                <p className="text-zinc-500">卫浴</p>
                <p className="font-medium text-zinc-900">
                  {rental.bathrooms}卫
                </p>
              </div>
              <div className="rounded-xl bg-zinc-50 px-3 py-2.5">
                <p className="text-zinc-500">朝向</p>
                <p className="font-medium text-zinc-900">
                  {rental.orientation}向
                </p>
              </div>
            </div>

            <ul className="flex flex-wrap gap-2">
              {rental.features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-800"
                >
                  {feature}
                </li>
              ))}
            </ul>

            <section>
              <h3 className="mb-2 text-sm font-semibold text-zinc-900">
                房屋介绍
              </h3>
              <p className="text-sm leading-6 text-zinc-600">
                {rental.description}
              </p>
            </section>

            {rental.images.length > 1 && (
              <section>
                <h3 className="mb-2 text-sm font-semibold text-zinc-900">
                  更多照片
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {rental.images.slice(1).map((image) => (
                    <div
                      key={image}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100"
                    >
                      <Image
                        src={image}
                        alt={rental.title}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
