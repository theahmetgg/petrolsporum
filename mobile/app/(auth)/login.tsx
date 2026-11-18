import React, { useRef, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { AppText, Button, PressableBox, ScreenHeader, TextField } from "@/components/ui";
import { useSessionStore } from "@/stores/sessionStore";
import { showToast } from "@/stores/toastStore";
import { isValidEmail, nameFromEmail } from "@/utils/text";
import { spacing } from "@/theme";

/** Şifrenin en az uzunluğu (sahte girişte yalnız biçim denetlenir) */
const MIN_PASSWORD = 6;

/**
 * Giriş ekranı (prototip ekran 1). SAHTE: şifre denetlenmez, sunucuya gidilmez; biçimi doğru her e-posta ve
 * en az 6 karakterli her şifre kabul edilir. Görünen ad e-postadan üretilir.
 */
export default function LoginScreen() {
  const signIn = useSessionStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const emailError = !email.trim() ? "E-postanı yaz." : !isValidEmail(email) ? "Geçerli bir e-posta yaz." : null;
  const passwordError = password.length < MIN_PASSWORD ? `Şifre en az ${MIN_PASSWORD} karakter olmalı.` : null;

  const submit = async () => {
    setSubmitted(true);
    if (emailError || passwordError || busy) return;
    setBusy(true);
    await signIn(nameFromEmail(email), email);
    showToast("Hoş geldin!", "success");
    router.replace("/(tabs)");
  };

  return (
    <Screen avoidKeyboard>
      <ScreenHeader title="Giriş yap" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingTop: 8, paddingBottom: 32, gap: 16 }} keyboardShouldPersistTaps="handled">
        <AppText variant="body" tone="secondary">
          Taraftar kartına, tahminlerine ve koleksiyonuna ulaşmak için giriş yap.
        </AppText>

        <TextField
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

        <Button title="Giriş yap" size="lg" fullWidth loading={busy} onPress={submit} style={{ marginTop: 8 }} />

        <PressableBox
          onPress={() => router.replace("/(auth)/register")}
          accessibilityRole="button"
          style={() => ({ alignSelf: "center", minHeight: 44, justifyContent: "center", paddingHorizontal: 12 })}
        >
          <AppText variant="small" tone="secondary">
            Hesabın yok mu? <AppText variant="small" weight="bold">Üye ol</AppText>
          </AppText>
        </PressableBox>

        <View style={{ marginTop: 8 }}>
          <AppText variant="caption" tone="muted" align="center">
            Demo sürüm: giriş bilgileri denetlenmez ve yalnız bu telefonda saklanır.
          </AppText>
        </View>
      </ScrollView>
    </Screen>
  );
}
