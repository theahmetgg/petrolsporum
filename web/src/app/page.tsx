import Image from "next/image";
import Link from "next/link";
import { NewsCard, PhoneFrame } from "~/components/cards";
import { NextMatchCard, ResultChip, StandingsTable } from "~/components/match";
import { Container, SectionTitle } from "~/components/site";
import { rankStandings } from "@/lib/standings";
import { CLUB } from "@/mocks/club";
import { MATCHES } from "@/mocks/matches";
import { NEWS } from "@/mocks/news";
import { STANDINGS } from "@/mocks/standings";

/** Uygulama tanıtımındaki öne çıkan özellikler */
const APP_FEATURES = [
  { title: "Canlı maç merkezi", text: "Skor, dakika dakika anlatım ve gol gelince anında değişen puan durumu." },
  { title: "Skor tahmini ve liderlik", text: "Her hafta tahmin, puan ve ödüllü sıralama." },
  { title: "Anıt Duvarı", text: "Taraftarın adı dijital duvarda; kulübe doğrudan destek." },
  { title: "Taraftar kartı", text: "QR kodlu dijital kart, hatıra bileti koleksiyonu." },
];

/**
 * Ana sayfa. Sıra: maç fotoğraflı açılış + sıradaki maç, son maçlar, haberler, puan durumu, uygulama tanıtımı.
 * Veriler mobil uygulamayla aynı kaynaktan gelir (`npm run sync`).
 */
export default function HomePage() {
  const nextMatch = MATCHES.find((m) => m.status === "scheduled");
  const lastResults = MATCHES.filter((m) => m.status === "finished").slice(-5).reverse();
  const ranked = rankStandings(STANDINGS);
  const [headline, ...rest] = NEWS;

  return (
    <>
      {/* Açılış: tam genişlik maç fotoğrafı, üstünde slogan ve sıradaki maç */}
      {/* data-theme="dark": fotoğraflı açılış her temada koyudur; yazılar fotoğraf üstünde beyaz kalır */}
      <section data-theme="dark" className="relative isolate overflow-hidden bg-surface-bg text-ink">
        <Image src="/club/news-manisa.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-top" />
        <div className="scrim-bottom absolute inset-0 -z-10" />
        <Container className="grid items-end gap-10 pb-12 pt-24 md:grid-cols-[1.15fr_1fr] md:pb-16 md:pt-40">
          <div>
            <p className="heading text-lg text-brand-strong">
              {CLUB.name} · {CLUB.founded}
            </p>
            <h1 className="heading mt-3 text-6xl md:text-8xl">Petrolspor ruhu tribünde başlar</h1>
            <p className="mt-4 max-w-xl text-base text-ink-secondary">Maçlar, puan durumu, kadro ve haberler tek yerde. Taraftar uygulamasıyla tribün cebinde.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/maclar" className="rounded-full bg-mono-solid px-6 py-3 text-sm font-semibold text-mono-onSolid hover:opacity-90">
                Fikstür ve puan durumu
              </Link>
              <Link href="/uygulama" className="rounded-full bg-mono-fillStrong px-6 py-3 text-sm font-semibold text-ink hover:bg-surface-sunken">
                Taraftar uygulaması
              </Link>
            </div>
          </div>
          {nextMatch ? (
            <div>
              <p className="heading mb-3 text-xl">Sıradaki maç</p>
              <NextMatchCard match={nextMatch} />
            </div>
          ) : null}
        </Container>
      </section>

      <Container className="mt-12">
        <SectionTitle title="Son maçlar" href="/maclar" linkLabel="Tüm fikstür" />
        <ul className="flex flex-wrap gap-3">
          {lastResults.map((match) => (
            <ResultChip key={match.id} match={match} />
          ))}
        </ul>
      </Container>

      <Container className="mt-16">
        <SectionTitle title="Haberler" href="/haberler" />
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
          <NewsCard item={headline} large />
          <div className="grid gap-4">
            {rest.slice(0, 2).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </Container>

      <Container className="mt-16 grid gap-10 md:grid-cols-[1fr_1.1fr]">
        <div className="min-w-0">
          <SectionTitle title="Puan durumu" href="/maclar#puan-durumu" linkLabel="Tam tablo" />
          <StandingsTable rows={ranked} limit={8} />
          <p className="mt-3 text-xs text-ink-muted">Trendyol 1. Lig · 2026-27 · 14. hafta sonu</p>
        </div>
        <div className="bg-signature flex flex-col justify-between gap-8 rounded-hero p-7 md:p-9">
          <div>
            <p className="text-xs font-medium text-white/80">Sezon özeti · 14 maç</p>
            <p className="heading mt-2 text-6xl text-white md:text-7xl">5. sıra</p>
            <p className="mt-2 text-sm text-white/85">1. Lig&apos;deki ilk sezonumuzda play-off hattındayız.</p>
          </div>
          <dl className="grid grid-cols-4 gap-2 text-center">
            {[
              ["7", "Galibiyet"],
              ["3", "Beraberlik"],
              ["4", "Mağlubiyet"],
              ["24", "Puan"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-white/20 py-3">
                <dd className="heading tabular text-3xl text-white">{value}</dd>
                <dt className="text-[11px] font-medium text-white/80">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Container>

      {/* Uygulama tanıtımı */}
      <Container className="mt-20">
        <div className="grid items-center gap-10 rounded-hero bg-mono-fill p-7 md:grid-cols-[1.1fr_1fr] md:p-12">
          <div>
            <p className="heading text-lg text-brand-strong">Taraftar uygulaması</p>
            <h2 className="heading mt-2 text-5xl md:text-6xl">Tribün artık cebinde</h2>
            <ul className="mt-6 space-y-4">
              {APP_FEATURES.map((feature) => (
                <li key={feature.title} className="flex gap-3">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand" />
                  <div>
                    <p className="text-sm font-semibold">{feature.title}</p>
                    <p className="text-sm text-ink-secondary">{feature.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/uygulama" className="mt-8 inline-block rounded-full bg-mono-solid px-6 py-3 text-sm font-semibold text-mono-onSolid hover:opacity-90">
              Uygulamayı incele
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <PhoneFrame src="/app/home.jpg" alt="Uygulama ana sayfası: sıradaki maç ve geri sayım" />
            <div className="mt-10">
              <PhoneFrame src="/app/match.jpg" alt="Uygulamada canlı maç merkezi" />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
