import React, { useRef, useState } from "react";
import { ScrollView, TextInput } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { AppText, Button, PressableBox, ScreenHeader, TextField } from "@/components/ui";
import { useSessionStore } from "@/stores/sessionStore";
import { showToast } from "@/stores/toastStore";
import { formatPersonName, isValidEmail } from "@/utils/text";
import { spacing } from "@/theme";

const MIN_PASSWORD = 6;

/**
 * Üyelik ekranı (prototip ekran 1). SAHTE: hesap sunucuda açılmaz; ad ve e-postayla bu telefonda örnek bir
 * taraftar profili oluşur. Ücretsiz üyelik + dijital taraftar kartı ilk basamaktır (Ar-Ge belgesi 9.4).
 */
export default function RegisterScreen() {
  const signIn = useSessionStore((s) => s.signIn);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const nameError = name.trim().split(/\s+/).filter(Boolean).length < 2 ? "Adını ve soyadını yaz." : null;
  const emailError = !email.trim() ? "E-postanı yaz." : !isValidEmail(email) ? "Geçerli bir e-posta yaz." : null;
  const passwordError = password.length < MIN_PASSWORD ? `Şifre en az ${MIN_PASSWORD} karakter olmalı.` : null;

  const submit = async () => {
    setSubmitted(true);
    if (nameError || emailError || passwordError || busy) return;
    setBusy(true);
    await signIn(formatPersonName(name), email);
    showToast("Üyeliğin açıldı. Taraftar kartın hazır.", "success");
    router.replace("/(tabs)");
  };

  return (
    <Screen avoidKeyboard>
      <ScreenHeader title="Üye ol" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingTop: 8, paddingBottom: 32, gap: 16 }} keyboardShouldPersistTaps="handled">
        <AppText variant="body" tone="secondary">
          Üyelik ücretsiz. Üye olunca dijital taraftar kartın hemen oluşur.
        </AppText>

        <TextField
          label="Ad soyad"
          placeholder="Adın ve soyadın"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          error={submitted ? nameError : null}
        />
        <TextField
          ref={emailRef}
          label="E-posta"
          placeholder="ornek@eposta.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          error={submitted ? emailError : null}
        />
        <TextField
          ref={passwordRef}
          label="Şifre"
          placeholder="En az 6 karakter"
          value={password}
          onChangeText={setPassword}
          password
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={submit}
          error={submitted ? passwordError : null}
        />

        <Button title="Üye ol" size="lg" fullWidth loading={busy} onPress={submit} style={{ marginTop: 8 }} />

        <PressableBox
          onPress={() => router.replace("/(auth)/login")}
          accessibilityRole="button"
          style={() => ({ alignSelf: "center", minHeight: 44, justifyContent: "center", paddingHorizontal: 12 })}
        >
          <AppText variant="small" tone="secondary">
            Zaten üye misin? <AppText variant="small" weight="bold">Giriş yap</AppText>
          </AppText>
        </PressableBox>

        <AppText variant="caption" tone="muted" align="center" style={{ marginTop: 8 }}>
          Demo sürüm: bilgilerin yalnız bu telefonda saklanır, hiçbir yere gönderilmez.
        </AppText>
      </ScrollView>
    </Screen>
  );
}
