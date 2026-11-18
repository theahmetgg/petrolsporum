import type { Metadata } from "next";
import { NewsCard, PageHero } from "~/components/cards";
import { Container } from "~/components/site";
import { NEWS } from "@/mocks/news";

export const metadata: Metadata = { title: "Haberler", description: "Batman Petrolspor kulüp haberleri ve maç sonuçları." };

/** Haberler: en yeni haber büyük kartta, diğerleri ızgarada. */
export default function NewsPage() {
  const [first, ...rest] = NEWS;
  return (
    <>
      <PageHero title="Haberler" text="Kulüpten son gelişmeler ve maç sonuçları." />
      <Container className="mt-10 space-y-4">
        <NewsCard item={first} large />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </Container>
    </>
  );
}
