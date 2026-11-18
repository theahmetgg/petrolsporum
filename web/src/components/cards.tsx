import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/types";
import { formatLongDate } from "@/utils/format";

/** Haber kartı: fotoğraf, kategori · tarih, başlık ve (büyük kartta) özet */
export function NewsCard({ item, large = false }: { item: NewsItem; large?: boolean }) {
  return (
    <Link href={`/haberler/${item.id}`} className="group flex h-full flex-col overflow-hidden rounded-box bg-mono-fill">
      <div className={`relative overflow-hidden ${large ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        <Image
          src={`/club/${item.image}.jpg`}
          alt=""
          fill
          sizes={large ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-medium text-brand-strong">
          {item.category} · {formatLongDate(item.published_at)}
        </p>
        <h3 className={`heading ${large ? "text-3xl" : "text-2xl"}`}>{item.title}</h3>
        {large ? <p className="line-clamp-3 text-sm text-ink-secondary">{item.summary}</p> : null}
      </div>
    </Link>
  );
}

/** Telefon çerçevesi içinde uygulama ekran görüntüsü */
export function PhoneFrame({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative mx-auto aspect-[9/19.5] w-full max-w-[260px] overflow-hidden rounded-[2.2rem] border-[6px] border-surface-muted bg-black shadow-2xl">
      <Image src={src} alt={alt} fill sizes="260px" className="object-cover object-top" priority={priority} />
    </div>
  );
}

/** Sayfa üstü: imza gradyan şerit içinde sayfa başlığı ve kısa açıklama */
export function PageHero({ title, text }: { title: string; text?: string }) {
  return (
    <div className="bg-signature rounded-b-block">
      <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-12 md:pb-14 md:pt-16">
        <h1 className="heading text-5xl text-white md:text-7xl">{title}</h1>
        {text ? <p className="mt-3 max-w-2xl text-sm text-white/85 md:text-base">{text}</p> : null}
      </div>
    </div>
  );
}
