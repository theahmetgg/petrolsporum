import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard } from "~/components/cards";
import { Container, SectionTitle } from "~/components/site";
import { NEWS } from "@/mocks/news";
import { formatLongDate } from "@/utils/format";

/** Haber sayfaları derleme sırasında üretilir (veri sabit) */
export function generateStaticParams() {
  return NEWS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: PageProps<"/haberler/[id]">): Promise<Metadata> {
  const { id } = await params;
  const item = NEWS.find((n) => n.id === id);
  return item ? { title: item.title, description: item.summary } : {};
}

/** Haber detayı: fotoğraf, başlık, özet ve kulüp sitesindeki haberin bağlantısı. */
export default async function NewsDetailPage({ params }: PageProps<"/haberler/[id]">) {
  const { id } = await params;
  const item = NEWS.find((n) => n.id === id);
  if (!item) notFound();
  const others = NEWS.filter((n) => n.id !== item.id).slice(0, 3);

  return (
    <Container className="mt-8">
      <Link href="/haberler" className="text-sm font-medium text-ink-secondary hover:text-ink">
        ← Haberler
      </Link>
      <article className="mx-auto mt-6 max-w-3xl">
        <p className="text-xs font-medium text-brand-strong">
          {item.category} · <time dateTime={item.published_at}>{formatLongDate(item.published_at)}</time>
        </p>
        <h1 className="heading mt-3 text-5xl md:text-6xl">{item.title}</h1>
        <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-hero">
          <Image src={`/club/${item.image}.jpg`} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
        </div>
        <p className="mt-8 text-lg leading-relaxed text-ink-secondary">{item.summary}</p>
        <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block rounded-full bg-mono-fillStrong px-6 py-3 text-sm font-semibold hover:bg-surface-sunken">
          Haberin tamamı (petrolspor.com) ↗
        </a>
      </article>

      <section className="mt-16">
        <SectionTitle title="Diğer haberler" href="/haberler" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((other) => (
            <NewsCard key={other.id} item={other} />
          ))}
        </div>
      </section>
    </Container>
  );
}
