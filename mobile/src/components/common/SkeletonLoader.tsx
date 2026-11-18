import React, { useEffect, createContext, useContext } from "react";
import { useColors } from "@/theme";
import { View, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  type SharedValue,
} from "react-native-reanimated";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

const SkeletonPulseContext = createContext<SharedValue<number> | null>(null);

/**
 * Wraps multiple skeleton items to synchronize their shimmer animation
 * on a single GPU worklet / SharedValue, eliminating all JS thread load.
 */
export const SkeletonGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.85, {
        duration: 850,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );
  }, []);

  return (
    <SkeletonPulseContext.Provider value={opacity}>
      {children}
    </SkeletonPulseContext.Provider>
  );
};

export const SkeletonLoader = ({
  width = "100%",
  height = 20,
  borderRadius = 8,
  className,
  style,
}: SkeletonLoaderProps) => {
  const colors = useColors();
  const groupOpacity = useContext(SkeletonPulseContext);
  const localOpacity = useSharedValue(0.35);

  useEffect(() => {
    if (!groupOpacity) {
      localOpacity.value = withRepeat(
        withTiming(0.85, {
          duration: 850,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true
      );
    }
  }, [groupOpacity]);

  const activeOpacity = groupOpacity || localOpacity;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: activeOpacity.value,
  }));

  return (
    <Animated.View
      className={className}
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius,
          // Gri kutu (mono.fill) üstünde de görünsün diye çerçeve tonu
          backgroundColor: colors.mono.line,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const MekanCardSkeleton = ({ width }: { width?: number | string }) => (
  <View
    className="bg-mono-fill rounded-2xl mb-5 overflow-hidden"
    style={width ? { width: width as any, marginBottom: 0 } : null}
  >
    <SkeletonLoader width="100%" height={160} borderRadius={16} />
    <View className="p-4">
      <SkeletonLoader width="70%" height={24} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="40%" height={16} style={{ marginBottom: 12 }} />
      <View className="flex-row justify-between">
        <SkeletonLoader width="30%" height={16} />
        <SkeletonLoader width="20%" height={16} />
      </View>
    </View>
  </View>
);


export const ReviewCardSkeleton = () => (
  <View className="p-4 bg-mono-fill rounded-2xl mb-4">
    <View className="flex-row mb-3">
      <SkeletonLoader width={48} height={48} borderRadius={24} />
      <View className="ml-3 flex-1 justify-center">
        <SkeletonLoader width="50%" height={16} style={{ marginBottom: 4 }} />
        <SkeletonLoader width="30%" height={12} />
      </View>
    </View>
    <SkeletonLoader width="100%" height={60} borderRadius={8} />
  </View>
);

export const StoryCardSkeleton = () => (
  <View className="bg-surface mb-4 w-full">
    <View className="flex-row items-center p-4">
      <SkeletonLoader width={40} height={40} borderRadius={20} />
      <View className="ml-3 flex-1">
        <SkeletonLoader width="40%" height={14} style={{ marginBottom: 4 }} />
        <SkeletonLoader width="25%" height={10} />
      </View>
    </View>
    <SkeletonLoader width="100%" height={400} borderRadius={0} />
    <View className="p-4">
      <View className="flex-row mb-3">
        <SkeletonLoader width={24} height={24} borderRadius={12} style={{ marginRight: 16 }} />
        <SkeletonLoader width={24} height={24} borderRadius={12} style={{ marginRight: 16 }} />
        <SkeletonLoader width={24} height={24} borderRadius={12} />
      </View>
      <SkeletonLoader width="80%" height={14} />
    </View>
  </View>
);

export const EventCardSkeleton = ({ width = 270 }: { width?: number | string }) => (
  <View
    className="bg-mono-fill rounded-[24px] overflow-hidden mb-4"
    style={{ width: width as any }}
  >
    <SkeletonLoader width="100%" height={140} borderRadius={16} />
    <View className="p-4">
      <SkeletonLoader width="80%" height={18} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="50%" height={14} style={{ marginBottom: 12 }} />
      <View className="flex-row justify-between items-center">
        <SkeletonLoader width="35%" height={14} />
        <SkeletonLoader width="25%" height={20} borderRadius={6} />
      </View>
    </View>
  </View>
);

export const JobCardSkeleton = ({ width = "100%" }: { width?: number | string }) => (
  <View
    className="bg-mono-fill rounded-2xl overflow-hidden p-4 mb-3"
    style={{ width: width as any }}
  >
    <View className="flex-row items-center mb-3">
      <SkeletonLoader width={44} height={44} borderRadius={22} style={{ marginRight: 12 }} />
      <View className="flex-1">
        <SkeletonLoader width="75%" height={16} style={{ marginBottom: 6 }} />
        <SkeletonLoader width="50%" height={12} />
      </View>
    </View>
    <View className="flex-row gap-1.5 mb-3">
      <SkeletonLoader width={70} height={22} borderRadius={8} />
      <SkeletonLoader width={80} height={22} borderRadius={8} />
    </View>
    <SkeletonLoader width="40%" height={14} />
  </View>
);

export const JobSeekerCardSkeleton = ({ width = "100%" }: { width?: number | string }) => (
  <View
    className="bg-mono-fill rounded-2xl overflow-hidden p-4 mb-3"
    style={{ width: width as any }}
  >
    <View className="flex-row items-center mb-3">
      <SkeletonLoader width={44} height={44} borderRadius={22} style={{ marginRight: 12 }} />
      <View className="flex-1">
        <SkeletonLoader width="70%" height={16} style={{ marginBottom: 6 }} />
        <SkeletonLoader width="45%" height={12} />
      </View>
    </View>
    <View className="flex-row gap-1.5 mb-3">
      <SkeletonLoader width={65} height={20} borderRadius={6} />
      <SkeletonLoader width={75} height={20} borderRadius={6} />
    </View>
    <SkeletonLoader width="50%" height={14} />
  </View>
);

export const NewsCardSkeleton = ({ width = 175, height = 235 }: { width?: number; height?: number }) => (
  <View
    className="bg-mono-fill rounded-3xl overflow-hidden"
    style={{ width, height, marginBottom: 0 }}
  >
    <SkeletonLoader width="100%" height="100%" borderRadius={24} />
  </View>
);

export const ListingCardSkeleton = ({ width = "100%" }: { width?: number | string }) => (
  <View
    className="bg-mono-fill rounded-2xl overflow-hidden mb-3 flex-row p-3"
    style={{ width: width as any }}
  >
    <SkeletonLoader width={100} height={90} borderRadius={12} />
    <View className="ml-3 flex-1 justify-between py-1">
      <View>
        <SkeletonLoader width="85%" height={16} style={{ marginBottom: 6 }} />
        <SkeletonLoader width="50%" height={13} style={{ marginBottom: 4 }} />
      </View>
      <View className="flex-row justify-between items-center">
        <SkeletonLoader width="40%" height={18} />
        <SkeletonLoader width="25%" height={12} />
      </View>
    </View>
  </View>
);

export const DetailScreenSkeleton = () => (
  <SkeletonGroup>
    <View className="flex-1 bg-surface-bg">
      {/* Banner */}
      <SkeletonLoader width="100%" height={240} borderRadius={0} />
      <View className="p-5 -mt-6 bg-surface-bg rounded-t-[32px] flex-1">
        {/* Title and Badge */}
        <View className="flex-row justify-between items-start mb-3">
          <SkeletonLoader width="65%" height={24} borderRadius={8} />
          <SkeletonLoader width={60} height={24} borderRadius={12} />
        </View>
        {/* Subtitle / Location */}
        <SkeletonLoader width="45%" height={15} style={{ marginBottom: 16 }} />
        {/* Action Buttons Row */}
        <View className="flex-row gap-3 mb-6">
          <SkeletonLoader width={100} height={40} borderRadius={20} />
          <SkeletonLoader width={100} height={40} borderRadius={20} />
          <SkeletonLoader width={40} height={40} borderRadius={20} />
        </View>
        {/* Content Lines */}
        <SkeletonLoader width="95%" height={14} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="90%" height={14} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="75%" height={14} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="60%" height={14} style={{ marginBottom: 20 }} />
        {/* Additional card */}
        <SkeletonLoader width="100%" height={100} borderRadius={16} />
      </View>
    </View>
  </SkeletonGroup>
);
