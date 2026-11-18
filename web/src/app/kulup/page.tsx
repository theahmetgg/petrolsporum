import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "~/components/cards";
import { Container, SectionTitle } from "~/components/site";
import { CLUB, HISTORY, HISTORY_PHOTOS } from "@/mocks/club";

export const metadata: Metadata = { title: "Kulüp", description: "Batman Petrolspor: tarihçe, efsane kadrolar, yönetim ve iletişim." };

/** Kulüp: kısa tanıtım, dönüm noktaları, efsane kadro fotoğrafları, yönetim ve iletişim. */
export default function ClubPage() {
  return (
    <>
      <PageHero title="Kulüp" text={`${CLUB.founded}'tan bugüne ${CLUB.name}. Renklerimiz ${CLUB.colors.toLocaleLowerCase("tr-TR")}.`} />

      <Container className="mt-10 grid items-center gap-10 md:grid-cols-[auto_1fr]">
        <Image src="/club/crest.png" alt="Batman Petrolspor arması" width={220} height={220} className="mx-auto" />
        <div>
          <p className="heading text-7xl text-brand-strong md:text-8xl">{CLUB.founded}</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-secondary">
            {CLUB.name}, {CLUB.founded} yılında Batman&apos;da kuruldu. Futbolun yanında başka branşlarda da faaliyet gösterdi; güreşte Türkiye ve dünya şampiyonlukları kazandı. Bugün
            Trendyol 1. Lig&apos;de mücadele ediyor ve iç saha maçlarını {CLUB.stadium}&apos;nda oynuyor.
          </p>
        </div>
      </Container>

      <Container className="mt-16">
        <SectionTitle title="Dönüm noktaları" />
        <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {HISTORY.map((item) => (
            <li key={item.year} className="rounded-box bg-mono-fill p-6">
              <p className="heading text-4xl text-brand-strong">{item.year}</p>
              <p className="mt-3 text-base font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-ink-secondary">{item.text}</p>
            </li>
          ))}
        </ol>
      </Container>

      <Container className="mt-16">
        <SectionTitle title="Efsane kadrolar" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HISTORY_PHOTOS.map((photo) => (
            <li key={photo.image}>
              <figure>
                <div className="relative aspect-[3/2] overflow-hidden rounded-box">
                  <Image src={`/club/${photo.image}.jpg`} alt={`${photo.year} sezonu kadrosu`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="mt-2 text-xs font-medium text-ink-muted">{photo.year}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>

      <Container className="mt-16 grid gap-10 md:grid-cols-2">
        <section>
          <SectionTitle title="Yönetim" />
          <ul className="space-y-2.5">
            {CLUB.board.map((member) => (
              <li key={member.name} className="flex items-center justify-between gap-4 rounded-box bg-mono-fill p-5">
                <span className="text-base font-semibold">{member.name}</span>
                <span className="text-sm text-ink-secondary">{member.role}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <SectionTitle title="İletişim" />
          <div className="rounded-box bg-mono-fill p-6">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-xs text-ink-muted">Adres</dt>
                <dd className="mt-1">{CLUB.address}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Stadyum</dt>
                <dd className="mt-1">{CLUB.stadium}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Mağaza</dt>
                <dd className="mt-1">
                  <Link href="/magaza" className="underline hover:text-brand-strong">
                    Mağazaya git
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </Container>
    </>
  );
}
