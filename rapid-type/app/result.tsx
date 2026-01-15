/**
 * Result Screen
 * Shows game results with stats and actions
 */

import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useStore } from "../src/store";
import { Colors } from "../src/constants";
import { formatTime, formatTimeDiff } from "../src/lib";
import type { GameResult } from "../src/types";

// Stats Card Component
const StatsCard = ({
  label,
  value,
  subValue,
  variant = "default",
}: {
  label: string;
  value: string | number;
  subValue?: string;
  variant?: "default" | "highlight" | "primary";
}) => {
  const valueColorClass = {
    default: "text-charcoal",
    highlight: "text-warning",
    primary: "text-primary",
  }[variant];

  const valueSizeClass = variant === "primary" ? "text-3xl" : "text-2xl";

  return (
    <View className="flex-1 bg-white border border-gray-200/50 rounded-ios p-4 items-center justify-center shadow-sm">
      <Text className="text-[10px] font-bold text-charcoal/40 uppercase mb-2">
        {label}
      </Text>
      <Text className={`${valueSizeClass} font-bold ${valueColorClass}`}>
        {value}
      </Text>
      {subValue && (
        <Text className="text-[9px] text-charcoal/30 mt-1">{subValue}</Text>
      )}
    </View>
  );
};

// Consistency Graph (simplified SVG representation)
const ConsistencyGraph = ({ tps }: { tps: number }) => {
  return (
    <View className="bg-white border border-gray-200/50 rounded-ios p-6 shadow-sm">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-sm font-bold text-charcoal">Tap Consistency</Text>
          <Text className="text-[10px] text-charcoal/40">
            Performance stability profile
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-2xl font-extrabold text-teal">{tps}</Text>
          <Text className="text-[10px] font-bold text-charcoal/40 uppercase">
            TPS
          </Text>
        </View>
      </View>

      {/* Simplified graph placeholder */}
      <View className="h-28 w-full bg-gradient-to-r from-teal/10 to-primary/10 rounded-lg items-center justify-center">
        <Text className="text-charcoal/20 text-xs">Performance Graph</Text>
      </View>

      <View className="flex-row justify-between mt-3">
        <Text className="text-[9px] font-bold text-charcoal/20 uppercase tracking-widest">
          Start
        </Text>
        <Text className="text-[9px] font-bold text-charcoal/20 uppercase tracking-widest">
          Finish
        </Text>
      </View>
    </View>
  );
};

export default function ResultScreen() {
  const params = useLocalSearchParams<{ result: string }>();
  const isDarkMode = useStore((state) => state.settings.isDarkMode);
  const incrementGamesPlayed = useStore((state) => state.incrementGamesPlayed);
  const addPlayTime = useStore((state) => state.addPlayTime);
  const updateStreak = useStore((state) => state.updateStreak);

  // Parse result
  let result: GameResult | null = null;
  try {
    result = params.result ? JSON.parse(params.result) : null;
  } catch (e) {
    console.error("Failed to parse result:", e);
  }

  if (!result) {
    return (
      <SafeAreaView className="flex-1 bg-bg-result items-center justify-center">
        <Text className="text-charcoal">No result data</Text>
        <Pressable
          onPress={() => router.replace("/")}
          className="mt-4 bg-primary px-6 py-3 rounded-ios"
        >
          <Text className="text-white font-bold">Go Home</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Update stats on mount
  // useEffect would be better but keeping it simple
  const updateStats = () => {
    incrementGamesPlayed();
    addPlayTime(result!.clearTime);
    updateStreak();
  };

  // Handle retry
  const handleRetry = () => {
    router.replace({
      pathname: "/game/[mode]",
      params: {
        mode: result!.mode,
        difficulty: result!.difficulty,
      },
    });
  };

  // Handle next level
  const handleNextLevel = () => {
    // For now, just go home
    router.replace("/");
  };

  // Rank color
  const rankColor = {
    S: Colors.primary.default,
    A: Colors.semantic.teal,
    B: Colors.semantic.warning,
    C: Colors.neutral.gray,
  }[result.rank];

  return (
    <SafeAreaView className="flex-1 bg-bg-result" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4">
        <Pressable
          onPress={() => router.replace("/")}
          className="w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-100 active:scale-95 shadow-sm"
        >
          <Text className="text-charcoal text-lg">✕</Text>
        </Pressable>
        <Text className="uppercase tracking-widest text-[11px] font-bold text-charcoal/40">
          Stage Cleared
        </Text>
        <View className="w-10" />
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6">
        {/* Clear Banner */}
        <View className="items-center mt-4">
          <Text className="text-6xl font-extrabold tracking-tight text-warning mb-2">
            CLEAR!
          </Text>
          <View className="flex-row items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full">
            <Text className="text-primary text-sm">★</Text>
            <Text className="text-xs font-bold text-primary uppercase tracking-wider">
              {result.rank === "S"
                ? "Excellent Performance"
                : result.rank === "A"
                  ? "Great Job"
                  : result.rank === "B"
                    ? "Good Effort"
                    : "Keep Practicing"}
            </Text>
          </View>
        </View>

        {/* Final Time */}
        <View className="items-center justify-center my-10 py-6">
          <Text className="text-charcoal/40 text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Final Time
          </Text>
          <Text className="text-7xl font-extrabold text-charcoal tabular-nums tracking-tighter">
            {formatTime(result.clearTime)}
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-4 mb-8">
          <StatsCard
            label="Record"
            value={result.isNewRecord ? "New Best!" : "---"}
            subValue={
              result.isNewRecord && result.previousRecord
                ? formatTimeDiff(result.clearTime - result.previousRecord)
                : undefined
            }
            variant={result.isNewRecord ? "highlight" : "default"}
          />
          <StatsCard label="Accuracy" value={`${result.accuracy}%`} />
          <StatsCard label="Rank" value={result.rank} variant="primary" />
        </View>

        {/* Consistency Graph */}
        <ConsistencyGraph tps={result.tapsPerSecond} />
      </View>

      {/* Footer Actions */}
      <View className="px-6 pb-8 gap-4">
        <View className="flex-row gap-4">
          <Pressable
            onPress={handleRetry}
            className="flex-1 bg-panel-silver h-16 rounded-ios items-center justify-center flex-row gap-2 active:scale-95"
          >
            <Text className="text-lg">↻</Text>
            <Text className="font-bold text-charcoal">Retry</Text>
          </Pressable>

          <Pressable
            onPress={handleNextLevel}
            className="flex-[1.8] bg-primary h-16 rounded-ios items-center justify-center flex-row gap-2 active:scale-95 shadow-lg shadow-primary/20"
          >
            <Text className="font-bold text-white">Next Level</Text>
            <Text className="text-white text-lg">→</Text>
          </Pressable>
        </View>

        <Pressable className="w-full py-4 items-center justify-center flex-row gap-2">
          <Text className="text-charcoal/50 text-lg">↗</Text>
          <Text className="text-charcoal/50 font-semibold text-sm">
            Share Results
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
