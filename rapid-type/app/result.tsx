/**
 * Result Screen
 * Shows game results with stats and actions
 */

import { useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useStore, ACHIEVEMENT_IDS } from "../src/store";
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
    <View>
      <Text>
        {label}
      </Text>
      <Text style={{ fontSize: variant === "primary" ? 30 : 24, fontWeight: "bold", color: variant === "highlight" ? Colors.semantic.warning : variant === "primary" ? Colors.primary.default : Colors.text.primary }}>
        {value}
      </Text>
      {subValue && (
        <Text>{subValue}</Text>
      )}
    </View>
  );
};

// Consistency Graph (simplified SVG representation)
const ConsistencyGraph = ({ tps }: { tps: number }) => {
  return (
    <View>
      <View>
        <View>
          <Text>Tap Consistency</Text>
          <Text>
            Performance stability profile
          </Text>
        </View>
        <View>
          <Text>{tps}</Text>
          <Text>
            TPS
          </Text>
        </View>
      </View>

      {/* Simplified graph placeholder */}
      <View>
        <Text>Performance Graph</Text>
      </View>

      <View>
        <Text>
          Start
        </Text>
        <Text>
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
  const addGameHistory = useStore((state) => state.addGameHistory);
  const unlockAchievement = useStore((state) => state.unlockAchievement);
  const updateAchievementProgress = useStore((state) => state.updateAchievementProgress);
  const stats = useStore((state) => state.stats);
  const achievements = useStore((state) => state.achievements);

  const hasProcessed = useRef(false);

  // Parse result
  let result: GameResult | null = null;
  try {
    result = params.result ? JSON.parse(params.result) : null;
  } catch (e) {
    console.error("Failed to parse result:", e);
  }

  // Process game result and achievements
  useEffect(() => {
    if (!result || hasProcessed.current) return;
    hasProcessed.current = true;

    // Update stats
    incrementGamesPlayed();
    addPlayTime(result.clearTime);
    updateStreak();

    // Save to history
    addGameHistory({
      mode: result.mode,
      difficulty: result.difficulty,
      clearTime: result.clearTime,
      accuracy: result.accuracy,
      rank: result.rank,
      date: result.date,
    });

    // Check achievements
    checkAchievements(result);
  }, [result]);

  // Achievement checking logic
  const checkAchievements = (gameResult: GameResult) => {
    // First Clear - Complete your first game
    unlockAchievement(ACHIEVEMENT_IDS.FIRST_CLEAR);

    // Perfectionist - 100% accuracy
    if (gameResult.accuracy >= 100) {
      unlockAchievement(ACHIEVEMENT_IDS.PERFECTIONIST);
    }

    // Speed Demon - Numbers under 10s
    if (gameResult.mode === "NUMBERS" && gameResult.clearTime < 10000) {
      unlockAchievement(ACHIEVEMENT_IDS.SPEED_DEMON);
    }

    // Number Master - Clear Numbers Hard
    if (gameResult.mode === "NUMBERS" && gameResult.difficulty === "HARD") {
      unlockAchievement(ACHIEVEMENT_IDS.NUMBER_MASTER);
    }

    // Alphabet Master - Clear Alphabet Hard
    if (gameResult.mode === "ALPHABET" && gameResult.difficulty === "HARD") {
      unlockAchievement(ACHIEVEMENT_IDS.ALPHABET_MASTER);
    }

    // Find Master - Clear Find Number Hard
    if (gameResult.mode === "FIND_NUMBER" && gameResult.difficulty === "HARD") {
      unlockAchievement(ACHIEVEMENT_IDS.FIND_MASTER);
    }

    // Marathoner - Play 100 games (progress)
    const gamesPlayed = stats.totalGamesPlayed + 1;
    updateAchievementProgress(ACHIEVEMENT_IDS.MARATHONER, gamesPlayed);

    // Sentence Master - Clear 50 Sentence games (progress)
    if (gameResult.mode === "SENTENCE") {
      const sentenceProgress = (achievements[ACHIEVEMENT_IDS.SENTENCE_MASTER]?.progress || 0) + 1;
      updateAchievementProgress(ACHIEVEMENT_IDS.SENTENCE_MASTER, sentenceProgress);
    }

    // No Mistake - 10 perfect games (progress)
    if (gameResult.accuracy >= 100) {
      const noMistakeProgress = (achievements[ACHIEVEMENT_IDS.NO_MISTAKE]?.progress || 0) + 1;
      updateAchievementProgress(ACHIEVEMENT_IDS.NO_MISTAKE, noMistakeProgress);
    }

    // Week/Month Streak - based on current streak
    const currentStreak = stats.currentStreak;
    updateAchievementProgress(ACHIEVEMENT_IDS.WEEK_STREAK, currentStreak);
    updateAchievementProgress(ACHIEVEMENT_IDS.MONTH_STREAK, currentStreak);

    // Speed King - Get S rank 10 times
    if (gameResult.rank === "S") {
      const speedKingProgress = (achievements[ACHIEVEMENT_IDS.SPEED_KING]?.progress || 0) + 1;
      updateAchievementProgress(ACHIEVEMENT_IDS.SPEED_KING, speedKingProgress);
    }
  };

  if (!result) {
    return (
      <SafeAreaView>
        <Text>No result data</Text>
        <Pressable
          onPress={() => router.replace("/")}
         
        >
          <Text>Go Home</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

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
    <SafeAreaView edges={["top", "bottom"]}>
      {/* Header */}
      <View>
        <Pressable
          onPress={() => router.replace("/")}
         
        >
          <Text>✕</Text>
        </Pressable>
        <Text>
          Stage Cleared
        </Text>
        <View />
      </View>

      {/* Main Content */}
      <View>
        {/* Clear Banner */}
        <View>
          <Text>
            CLEAR!
          </Text>
          <View>
            <Text>★</Text>
            <Text>
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
        <View>
          <Text>
            Final Time
          </Text>
          <Text>
            {formatTime(result.clearTime)}
          </Text>
        </View>

        {/* Stats Grid */}
        <View>
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
      <View>
        <View>
          <Pressable
            onPress={handleRetry}
           
          >
            <Text>↻</Text>
            <Text>Retry</Text>
          </Pressable>

          <Pressable
            onPress={handleNextLevel}
           
          >
            <Text>Next Level</Text>
            <Text>→</Text>
          </Pressable>
        </View>

        <Pressable>
          <Text>↗</Text>
          <Text>
            Share Results
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
