import React, { useRef, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { ArrowRight, Bell, ChevronLeft, MapPin, Share2, ShieldCheck, Ticket, Trash2, Trophy, Users } from "lucide-react-native";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Screen } from "@/components/layout/Screen";
import {
  AppText,
  Avatar,
  Badge,
  Button,
  Checkbox,
  ColorIcon,
  ColorIconBox,
  EmptyState,
  ErrorState,
  FilterButton,
  FloatingActionBar,
  GlassChip,
  GlassSearch,
  Heading,
  HeroNumber,
  IconButton,
  IconCircle,
  ListRowSkeleton,
  LoadingMore,
  Pill,
  Radio,
  ScreenHeader,
  SearchBar,
  SectionHeader,
  SegmentedControl,
  SelectField,
  SheetHeader,
  SignatureBlock,
  SignatureTopBar,
  StepIndicator,
  Surface,
  TextField,
  Toggle,
} from "@/components/ui";
import { ActionSheet } from "@/components/common/ActionSheet";
import { AnimatedSplash } from "@/components/common/AnimatedSplash";
import { FilterSheet, countActiveFilters, type FilterSection, type FilterValues } from "@/components/common/FilterSheet";
import { COLOR_ICONS, type ColorIconName } from "@/constants/colorIcons.generated";
import { confirm } from "@/stores/confirmStore";
import { showToast } from "@/stores/toastStore";
import { spacing, useTheme } from "@/theme";

const GUTTER = spacing.screen;

/** Örnek haplar: maç türleri */
const MATCH_KINDS = ["Tümü", "Lig", "Kupa", "Hazırlık"];

/** Filtre penceresinin örnek bölümleri (fikstür) */
const FIXTURE_FILTERS: FilterSection[] = [
  {
    type: "sort",
    key: "sort",
    title: "Sırala",
    options: [
      { value: "upcoming", label: "Yaklaşan önce" },
      { value: "past", label: "Oynanan önce" },
    ],
  },
  {
    type: "choice",
    key: "venue",
    title: "Saha",
    options: [
      { value: "home", label: "İç saha" },
      { value: "away", label: "Deplasman" },
    ],
  },
];

const ICON_NAMES = Object.keys(COLOR_ICONS) as ColorIconName[];

/** Bölüm: başlık + içerik (vitrin içinde tekrar eden düzen) */
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: spacing.section }}>
      <SectionHeader title={title} />
      <View style={{ paddingHorizontal: GUTTER, gap: 12 }}>{children}</View>
    </View>
  );
}

/**
 * Geliştirici bileşen vitrini: ortak parçaları (Batman360'tan taşınan iskelet + Petrolspor teması) tek sayfada gösterir.
 * Buradaki metinler bileşen örneğidir; maç, oyuncu ya da skor verisi içermez (o veriler sahte veri klasöründen gelecek).
 * Yeni bileşen önce tasarım duvarında denenir, onaylanınca buraya eklenir.
 * Yalnızca geliştirme sürümünde açılır (petrolspor://dev/ui-kit); canlıda ana sayfaya yönlenir.
 */
export default function UiKitScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const [kind, setKind] = useState("Tümü");
  const [query, setQuery] = useState("");
  const [glassQuery, setGlassQuery] = useState("");
  const [segment, setSegment] = useState<"a" | "b">("a");
  const [toggle, setToggle] = useState(true);
  const [checked, setChecked] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({});
  // Açılış önizlemesi: her basışta yeniden oynar
  const [splashKey, setSplashKey] = useState(1);
  const [splashSlow, setSplashSlow] = useState(1);
  const actionRef = useRef<BottomSheetModal>(null);
  const filterRef = useRef<BottomSheetModal>(null);

  if (!__DEV__) return <Redirect href="/" />;

  const filterCount = countActiveFilters(FIXTURE_FILTERS, filters);
  // İkon ızgarası: 4 sütun
  const iconCell = Math.floor((screenWidth - GUTTER * 2) / 4);
  // Telefon oranında küçük çerçeve (yarım genişlik, ~1:2)
  const splashFrameH = Math.round(((screenWidth - GUTTER * 2 - 10) / 2) * 2);

  return (
    <Screen withTopInset={false} withBottomInset={false}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
        {/* İmza gradyan blok: cam butonlar, başlık, cam arama, cam haplar */}
        <SignatureBlock>
          <SignatureTopBar
            title="Bileşen vitrini"
            left={<IconButton icon={ChevronLeft} label="Geri" variant="frost" size={40} onPress={() => router.back()} />}
            right={<IconButton icon={Bell} label="Bildirimler" variant="frost" size={40} badgeCount={3} />}
          />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: GUTTER, marginTop: 16 }}>
            <GlassSearch value={glassQuery} onChangeText={setGlassQuery} placeholder="Haber veya oyuncu ara" style={{ flex: 1 }} />
            <FilterButton count={filterCount} onPress={() => filterRef.current?.present()} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER, gap: 8, paddingTop: 12 }}>
            {MATCH_KINDS.map((l) => (
              <Pill key={l} label={l} tone="gradient" selected={kind === l} onPress={() => setKind(l)} />
            ))}
          </ScrollView>
        </SignatureBlock>

        <Block title="Skor ve başlık (Heading)">
          {/* Dar büyük harf (Barlow Condensed): yalnız skor ve başlıklarda; gövde metni AppText (Poppins) */}
          <Heading size="label" color={colors.brand.strong}>
            Küçük üst etiket
          </Heading>
          <Heading size="score">1960</Heading>
          <Heading size="display">Ekran başlığı</Heading>
          <Heading size="title">Kart başlığı</Heading>
        </Block>

        <Block title="Yazı ölçeği (AppText)">
          <AppText variant="hero" style={{ letterSpacing: -2 }}>
            56<AppText variant="hero" tone="muted">{" hero"}</AppText>
          </AppText>
          <AppText variant="metric">40 metric</AppText>
          <AppText variant="display">Display 24 · semibold</AppText>
          <AppText variant="title">Title 20 · medium</AppText>
          <AppText variant="headline">Headline 17 · medium</AppText>
          <AppText variant="subhead">Subhead 16 · medium</AppText>
          <AppText variant="body">Body 15 · gövde metni</AppText>
          <AppText variant="small">Small 13 · kutu ve satır başlığı</AppText>
          <AppText variant="caption" tone="muted">
            Caption 12 · gri bilgi satırı
          </AppText>
        </Block>

        <Block title="İkon seti">
          {/* Tek Petrolspor gradyanı; her ikon kendi renginde olmaz. Liste: scripts/sync-color-icons.mjs */}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {ICON_NAMES.map((name) => (
              <View key={name} style={{ width: iconCell, alignItems: "center", gap: 6, paddingVertical: 10 }}>
                <ColorIconBox name={name} size={52} />
                <AppText variant="caption" tone="muted" numberOfLines={1}>
                  {name}
                </AppText>
              </View>
            ))}
          </View>
          {/* Kırmızı gradyan blok üstünde beyaz görünüm */}
          <SignatureBlock underStatusBar={false} style={{ paddingTop: 20, marginHorizontal: -GUTTER }}>
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 20, paddingHorizontal: GUTTER }}>
              {(["football", "prediction", "wallpaper", "monument", "oilrig"] as ColorIconName[]).map((name) => (
                <ColorIcon key={name} name={name} size={32} variant="onBrand" />
              ))}
            </View>
          </SignatureBlock>
        </Block>

        <Block title="İri rakam kalıbı (gradyan ortası)">
          {/* Geri sayım ve skor gibi tek iri rakam + cam haplar. Rakam örnektir. */}
          <SignatureBlock underStatusBar={false} style={{ paddingTop: 20, marginHorizontal: -GUTTER }}>
            <View style={{ alignItems: "center", gap: 12, paddingHorizontal: GUTTER }}>
              <HeroNumber label="Örnek geri sayım" main="12:45" dim=":30" tabular />
              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                <GlassChip icon={Trophy} label="Lig maçı" />
                <GlassChip icon={MapPin} label="İç saha" onPress={() => {}} />
              </View>
            </View>
          </SignatureBlock>
        </Block>

        <Block title="Açılış ekranı">
          {/* Solda telefonun kendi açılış ekranı (düz kırmızı + ikon), sağda animasyonlu geçiş. İkon geçicidir; kulüp arması gelince değişir. */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            {[false, true].map((animated) => (
              <View key={String(animated)} style={{ flex: 1, gap: 6 }}>
                <AppText variant="caption" weight="medium" tone="secondary">
                  {animated ? "Animasyonlu geçiş" : "İlk kare"}
                </AppText>
                <View style={{ height: splashFrameH, borderRadius: 24, overflow: "hidden", backgroundColor: colors.surface.bg, borderWidth: 1, borderColor: colors.mono.line }}>
                  <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <AppText variant="small" weight="medium">
                      Ana sayfa
                    </AppText>
                    <AppText variant="caption" tone="muted">
                      açılış bitti
                    </AppText>
                  </View>
                  {animated ? <AnimatedSplash key={splashKey} scale={0.5} slow={splashSlow} /> : <AnimatedSplash play={false} scale={0.5} />}
                </View>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Button
              title="Tekrar oynat"
              variant="secondary"
              onPress={() => {
                setSplashSlow(1);
                setSplashKey((k) => k + 1);
              }}
            />
            <Button
              title="Yavaş oynat (5×)"
              variant="ghost"
              onPress={() => {
                setSplashSlow(5);
                setSplashKey((k) => k + 1);
              }}
            />
          </View>
        </Block>

        <Block title="Butonlar">
          <Button title="Ana eylem" icon={Ticket} size="lg" fullWidth />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <Button title="İkincil" variant="secondary" />
            <Button title="Metin" variant="ghost" />
            <Button title="Sil" variant="danger" />
            <Button title="Kalıcı sil" variant="destructive" />
            <Button title="Yükleniyor" loading />
            <Button title="Pasif" disabled />
            <Button title="Devam" rightIcon={ArrowRight} size="sm" />
          </View>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <IconButton icon={Share2} label="Paylaş" size={40} />
            <IconButton icon={Bell} label="Bildirimler" variant="ghost" size={40} />
            <IconButton icon={MapPin} label="Yol tarifi" size={50} />
          </View>
          {/* Yüzen alt bar: normalde ekranın altında; burada bir kutunun içinde gösterilir */}
          <View style={{ height: 96 }}>
            <FloatingActionBar
              label="Tahminini kaydet"
              onPress={() => showToast("Yüzen bar basıldı", "success")}
              leading={<IconButton icon={Share2} label="Paylaş" size={50} />}
            />
          </View>
        </Block>

        <Block title="Seçim öğeleri">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {MATCH_KINDS.map((l) => (
              <Pill key={l} label={l} selected={kind === l} onPress={() => setKind(l)} />
            ))}
          </ScrollView>
          <SegmentedControl
            value={segment}
            onChange={setSegment}
            options={[
              { key: "a", label: "Haftalık" },
              { key: "b", label: "Sezonluk" },
            ]}
          />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 24 }}>
            <Toggle value={toggle} onValueChange={setToggle} accessibilityLabel="Anahtar" />
            <Radio checked={checked} />
            <Checkbox checked={checked} />
            <Button title={checked ? "Seçimi kaldır" : "Seç"} variant="ghost" size="sm" onPress={() => setChecked((c) => !c)} />
          </View>
          <StepIndicator steps={["Tuğla", "Ad", "Sertifika"]} current={1} />
        </Block>

        <Block title="Form alanları">
          <TextField label="Duvardaki ad *" placeholder="Örn: Ad Soyad" maxLength={40} showCounter />
          <TextField label="E-posta *" placeholder="ornek@eposta.com" keyboardType="email-address" error="Geçerli bir e-posta yaz." />
          <SelectField label="Diziliş *" placeholder="Diziliş seç" onPress={() => {}} />
          <SearchBar value={query} onChangeText={setQuery} placeholder="Oyuncu ara" />
        </Block>

        <Block title="Kutular ve satırlar">
          <Surface>
            <IconCircle icon={ShieldCheck} />
            <View style={{ flex: 1 }}>
              <AppText variant="small">Bilgi notu kutusu</AppText>
              <AppText variant="caption" tone="muted">
                Gri daire, tek renk çizgi ikon
              </AppText>
            </View>
          </Surface>
          <Surface>
            <IconCircle icon={Users} accent />
            <View style={{ flex: 1 }}>
              <AppText variant="small">Vurgulu ikon</AppText>
              <AppText variant="caption" tone="muted">
                Kırmızı yalnız küçük vurguda
              </AppText>
            </View>
          </Surface>
          <Surface onPress={() => {}} chevron>
            <ColorIconBox name="prediction" size={44} />
            <AppText variant="small" style={{ flex: 1 }}>
              Dokunulabilir kutu, gradyanlı ikon
            </AppText>
          </Surface>
        </Block>

        <Block title="Durum ve geri bildirim">
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <Badge label="Canlı" tone="brand" dot />
            <Badge label="Kazandı" tone="success" />
            <Badge label="Kaybetti" tone="danger" />
            <Badge label="Ertelendi" tone="warning" />
            <Badge label="Bilgi" tone="info" />
            <Badge label="Nötr" />
          </View>
          <Button title="Kısa bildirim göster" variant="secondary" onPress={() => showToast("Tahminin kaydedildi.", "success")} />
          <Button
            title="Onay penceresi aç"
            variant="secondary"
            onPress={async () => {
              const ok = await confirm({ title: "Tahmini sil", message: "Bu maç için girdiğin tahmin silinecek.", confirmText: "Sil", tone: "danger" });
              showToast(ok ? "Onaylandı" : "Vazgeçildi", "info");
            }}
          />
          <Surface row={false}>
            <EmptyState compact title="Henüz tahmin yok" description="İlk tahminini maç başlamadan gir." actionLabel="Tahmin yap" onAction={() => {}} />
          </Surface>
          <Surface row={false} padding={0}>
            <ErrorState onRetry={() => {}} />
          </Surface>
          <ListRowSkeleton count={2} />
          <LoadingMore />
        </Block>

        <Block title="Avatar">
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <Avatar uri={null} name="Batman Petrolspor" size={56} />
            <Avatar uri={null} name="Taraftar" size={44} online />
            <Avatar uri={null} size={32} />
          </View>
        </Block>

        <Block title="Ekran başlığı (düz zemin)">
          <View style={{ marginHorizontal: -GUTTER }}>
            <ScreenHeader title="Bildirimler" onBack={() => showToast("Örnek: geri", "info")} />
            <ScreenHeader title="Liderlik" subtitle="Alt satır örneği" onBack={() => showToast("Örnek: geri", "info")} />
          </View>
        </Block>

        <Block title="Alt pencereler">
          <Surface row={false}>
            <SheetHeader title="Diziliş seç" subtitle="Alt pencere başlığı" onClose={() => {}} />
          </Surface>
          <Button title="Aksiyon penceresini aç" variant="secondary" onPress={() => actionRef.current?.present()} />
          <Button title="Filtre penceresini aç" variant="secondary" onPress={() => filterRef.current?.present()} />
        </Block>
      </ScrollView>

      <FilterSheet ref={filterRef} sections={FIXTURE_FILTERS} values={filters} onApply={setFilters} />

      <ActionSheet
        ref={actionRef}
        items={[
          { key: "share", icon: Share2, label: "Paylaş", description: "Görsel olarak paylaş", onPress: () => showToast("Örnek: paylaş", "info") },
          { key: "ticket", icon: Ticket, label: "Hatıra biletini aç", onPress: () => showToast("Örnek: hatıra bileti", "info") },
          { key: "delete", icon: Trash2, label: "Sil", danger: true, onPress: () => showToast("Örnek: sil", "info") },
        ]}
      />
    </Screen>
  );
}
