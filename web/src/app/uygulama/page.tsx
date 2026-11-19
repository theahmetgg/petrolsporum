import type { Metadata } from "next";
import { PhoneFrame } from "~/components/cards";
import { Container } from "~/components/site";

export const metadata: Metadata = { title: "Taraftar Uygulaması", description: "Batman Petrolspor taraftar uygulaması: canlı maç merkezi, skor tahmini, anıt duvarı, taraftar kartı ve daha fazlası." };

/** Özellikler: her biri uygulamadan gerçek bir ekran görüntüsüyle (Android emülatör, 18 Kasım 2026) */
const FEATURES = [
  {
    image: "match",
    title: "Canlı maç merkezi",
    text: "Canlı skor, dakika dakika anlatım, kadro ve istatistik. Gol geldiği an puan durumu da değişir: takımın kaçıncı sıraya çıktığını anında görürsün.",
  },
  {
    image: "prediction",
    title: "Skor tahmini ve liderlik",
    text: "Maç başlayana kadar skoru ve ilk golü atanı tahmin et. Tam skor 100, maç sonucu 35, ilk gol 25 puan. Haftalık, aylık ve sezonluk sıralamada ödüller var. Katılım ücretsiz.",
  },
  {
    image: "lineup",
    title: "İlk 11'ini kur",
    text: "Dizilişi seç, oyuncuları sürükleyip bırak, kaptanını belirle. Tek dokunuşla kulüp logolu paylaşım görselin hazır.",
  },
  {
    image: "monument",
    title: "Anıt Duvarı",
    text: "Adını stadyumun dijital duvarına yazdır. Tuğlanı duvarda bul, resmi dijital sertifikanı paylaş. Üretim ve kargo maliyeti olmadan kulübe doğrudan destek.",
  },
  {
    image: "lockscreen",
    title: "Duvar kağıtları ve kilit ekranı önizleme",
    text: "Maç günü afişleri, minimalist tasarımlar, efsane kadrolar. İndirmeden önce telefonunun gerçek saatiyle kilit ekranında nasıl duracağını gör.",
  },
  {
    image: "tribune",
    title: "Tribün Modu",
    text: "Tezahürat yükseldikçe petrol kulesi dolar, zirvede alev alır. Tribünün gücü 0-100 arası puanla ölçülür.",
  },
  {
    image: "profile",
    title: "Dijital taraftar kartı",
    text: "QR kodlu ücretsiz kart, PetrolPuan, sezon sıran ve gittiğin maçların hatıra biletleri tek yerde.",
  },
  {
    image: "cockpit",
    title: "Yönetim için: Başkan Kokpiti",
    text: "Aktif taraftar sayısı, şehir dağılımı, mağaza ve anıt duvarı geliri tek ekranda. SMS yerine tek tuşla, ücretsiz bildirim.",
  },
] as const;

/** Taraftar uygulaması tanıtım sayfası. */
export default function AppPage() {
  return (
    <>
      <section className="bg-signature rounded-b-block">
        <Container className="grid items-center gap-10 pb-0 pt-14 md:grid-cols-[1.2fr_1fr] md:pt-20">
          <div className="pb-12 md:pb-20">
            <p className="heading text-lg text-white/85">Batman Petrolspor taraftar uygulaması</p>
            <h1 className="heading mt-3 text-6xl text-white md:text-8xl">Tribün artık cebinde</h1>
            <p className="mt-5 max-w-xl text-base text-white/85">Maç günü heyecanı, skor tahmini, anıt duvarı ve taraftar kartı tek uygulamada. Batman&apos;da da olsan, gurbette de.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/20 px-5 py-3 text-sm font-semibold text-white">Yakında App Store&apos;da</span>
              <span className="rounded-full bg-white/20 px-5 py-3 text-sm font-semibold text-white">Yakında Google Play&apos;de</span>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[280px] translate-y-10 md:translate-y-16">
            <PhoneFrame src="/app/home.jpg" alt="Uygulama ana sayfası: sıradaki maç, geri sayım ve manşet" eager />
          </div>
        </Container>
      </section>

      <Container className="reveal mt-28 space-y-20 md:mt-36">
        {FEATURES.map((feature, i) => (
          <section key={feature.title} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
            <div className={i % 2 ? "md:order-2" : ""}>
              <PhoneFrame src={`/app/${feature.image}.jpg`} alt={`Uygulama ekranı: ${feature.title}`} />
            </div>
            <div>
              <p className="heading tabular text-2xl text-brand-strong">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="heading mt-2 text-4xl md:text-5xl">{feature.title}</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-secondary">{feature.text}</p>
            </div>
          </section>
        ))}
      </Container>

      <Container className="reveal mt-24">
        <p className="rounded-box bg-mono-fill p-6 text-center text-sm text-ink-secondary">
          Ekran görüntüleri çalışan prototipten alınmıştır. Canlı maç, liderlik ve gelir rakamları demo veridir.
        </p>
      </Container>
    </>
  );
}
