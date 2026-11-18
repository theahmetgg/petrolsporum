import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, ScrollView } from "react-native";
import { useTheme } from "@/theme";
import { reportClientError } from "@/lib/errorReporting";
import { AppText, ErrorState } from "@/components/ui";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
  /** Hata kaydında gösterilecek bölüm adı */
  screen?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onRetry: () => void;
}

/** Hata ekranı (tasarım sistemi §4.6): ortak `ErrorState` (ikonsuz başlık + açıklama + "Tekrar dene"); geliştirmede altında hata ayrıntısı gri kutuda. */
function ErrorFallback({ title, message, error, errorInfo, onRetry }: ErrorFallbackProps) {
  const { colors, isDark } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: isDark ? colors.surface.bg : colors.surface.DEFAULT }}>
      <ErrorState
        title={title || "Bir hata oluştu"}
        description={message || "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin veya uygulamayı yeniden başlatın."}
        onRetry={onRetry}
      />

      {/* Hata ayrıntısı (yalnız geliştirmede) */}
      {__DEV__ && error && (
        <ScrollView
          style={{ maxHeight: 160, marginHorizontal: 24, borderRadius: 24, backgroundColor: colors.mono.fill }}
          contentContainerStyle={{ padding: 12 }}
          showsVerticalScrollIndicator={false}
        >
          <AppText variant="caption" tone="danger" selectable>
            {error.toString()}
          </AppText>
          {errorInfo && (
            <AppText variant="caption" tone="muted" selectable style={{ marginTop: 8 }}>
              {errorInfo.componentStack}
            </AppText>
          )}
        </ScrollView>
      )}
    </View>
  );
}

/**
 * Global Error Boundary — React render hatalarini yakalar ve kullaniciya
 * anlasilir bir hata ekrani gosterir. Production'da app'in tamamen
 * cokmesini engeller.
 *
 * Kullanim:
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    if (__DEV__) {
      console.error("[ErrorBoundary] Render hatasi yakalandi:", error.message);
      console.error("[ErrorBoundary] Error stack:", error.stack);
      console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
    }
    // Production'da hata backend loguna gider (kişisel veri yok); Sentry kullanılmıyor
    reportClientError(error, { screen: this.props.screen, componentStack: errorInfo.componentStack });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  handleReload = () => {
    // En basit yol: state'i sifirla ve children'i tekrar dene
    this.handleReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          title={this.props.fallbackTitle}
          message={this.props.fallbackMessage}
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}
