/**
 * Result Screen
 * Shows game results with stats and actions
 */

import { useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useStore, ACHIEVEMENT_IDS } from "../src/store";
import { Colors } from "../src/constants";
import { formatTime, formatTimeDiff } from "../src/lib";
import { t } from "../src/i18n";
import type { GameResult } from "../src/types";

// Stats Card Component
const StatsCard = ({
  label,
  value,
  subValue,
  variant = "default",
  isDarkMode,
}: {
  label: string;
  value: string | number;
  subValue?: string;
  variant?: "default" | "highlight" | "primary";
  isDarkMode: boolean;
}) => {
  const valueColor = {
    default: isDarkMode ? "#fff" : Colors.text.primary,
    highlight: Colors.semantic.warning,
    primary: Colors.primary.default,
  }[variant];

  return (
    <View style={[styles.statsCard, isDarkMode && styles.statsCardDark]}>
      <Text style={[styles.statsCardLabel, isDarkMode && styles.statsCardLabelDark]}>
        {label}
      </Text>
      <Text style={[styles.statsCardValue, { color: valueColor }]}>
        {value}
      </Text>
      {subValue && (
        <Text style={styles.statsCardSubValue}>{subValue}</Text>
      )}
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
      <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, isDarkMode && styles.errorTextDark]}>
            No result data
          </Text>
          <Pressable
            onPress={() => router.replace("/")}
            style={styles.homeButton}
          >
            <Text style={styles.homeButtonText}>{t("result.home")}</Text>
          </Pressable>
        </View>
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

  // Handle home
  const handleHome = () => {
    router.replace("/");
  };

  // Rank color
  const rankColor = {
    S: Colors.rank.S,
    A: Colors.semantic.teal,
    B: Colors.semantic.warning,
    C: Colors.neutral.gray,
  }[result.rank];

  // Get rank message
  const getRankMessage = () => {
    switch (result.rank) {
      case "S": return t("result.excellent");
      case "A": return t("result.great");
      case "B": return t("result.good");
      default: return t("result.tryAgain");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.containerDark]}
      edges={["top", "bottom"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={handleHome}
          style={[styles.closeButton, isDarkMode && styles.closeButtonDark]}
        >
          <Text style={[styles.closeButtonText, isDarkMode && styles.closeButtonTextDark]}>
            ✕
          </Text>
        </Pressable>
        <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>
          {t("result.clear")}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Clear Banner */}
        <View style={styles.clearBanner}>
          <Text style={[styles.clearText, { color: rankColor }]}>
            {t("result.clear")}
          </Text>
          <View style={[styles.rankBadge, isDarkMode && styles.rankBadgeDark]}>
            <Text style={[styles.rankText, { color: rankColor }]}>
              {result.rank}
            </Text>
          </View>
          <Text style={[styles.rankMessage, isDarkMode && styles.rankMessageDark]}>
            {getRankMessage()}
          </Text>
        </View>

        {/* Final Time */}
        <View style={[styles.timeCard, isDarkMode && styles.timeCardDark]}>
          <Text style={[styles.timeLabel, isDarkMode && styles.timeLabelDark]}>
            {t("result.finalTime")}
          </Text>
          <Text style={[styles.timeValue, isDarkMode && styles.timeValueDark]}>
            {formatTime(result.clearTime)}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatsCard
            label={t("result.record")}
            value={result.isNewRecord ? t("result.newBest") : "---"}
            subValue={
              result.isNewRecord && result.previousRecord
                ? formatTimeDiff(result.clearTime - result.previousRecord)
                : undefined
            }
            variant={result.isNewRecord ? "highlight" : "default"}
            isDarkMode={isDarkMode}
          />
          <StatsCard
            label={t("game.accuracy")}
            value={`${result.accuracy}%`}
            isDarkMode={isDarkMode}
          />
          <StatsCard
            label={t("result.tps")}
            value={result.tapsPerSecond.toFixed(1)}
            isDarkMode={isDarkMode}
          />
        </View>
      </View>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <View style={styles.actionButtons}>
          <Pressable
            onPress={handleRetry}
            style={[styles.retryButton, isDarkMode && styles.retryButtonDark]}
          >
            <Text style={[styles.retryButtonText, isDarkMode && styles.retryButtonTextDark]}>
              {t("result.retry")}
            </Text>
          </Pressable>

          <Pressable onPress={handleHome} style={styles.homeActionButton}>
            <Text style={styles.homeActionButtonText}>
              {t("result.home")}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  containerDark: {
    backgroundColor: Colors.background.dark,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  closeButtonDark: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  closeButtonText: {
    fontSize: 18,
    color: Colors.text.primary,
  },
  closeButtonTextDark: {
    color: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text.primary,
  },
  headerTitleDark: {
    color: "#fff",
  },
  headerSpacer: {
    width: 40,
  },
  // Content
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  // Clear Banner
  clearBanner: {
    alignItems: "center",
    marginBottom: 32,
  },
  clearText: {
    fontSize: 48,
    fontWeight: "900",
    marginBottom: 16,
  },
  rankBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.background.paper,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  rankBadgeDark: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  rankText: {
    fontSize: 48,
    fontWeight: "900",
  },
  rankMessage: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  rankMessageDark: {
    color: Colors.text.darkSecondary,
  },
  // Time Card
  timeCard: {
    width: "100%",
    backgroundColor: Colors.background.paper,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  timeCardDark: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  timeLabelDark: {
    color: Colors.text.darkSecondary,
  },
  timeValue: {
    fontSize: 48,
    fontWeight: "900",
    color: Colors.text.primary,
    fontVariant: ["tabular-nums"],
  },
  timeValueDark: {
    color: "#fff",
  },
  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  statsCard: {
    flex: 1,
    backgroundColor: Colors.background.paper,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsCardDark: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  statsCardLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  statsCardLabelDark: {
    color: Colors.text.darkSecondary,
  },
  statsCardValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statsCardSubValue: {
    fontSize: 12,
    color: Colors.semantic.success,
    marginTop: 4,
  },
  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  retryButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.background.panel,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border.ui,
  },
  retryButtonDark: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.2)",
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text.primary,
  },
  retryButtonTextDark: {
    color: "#fff",
  },
  homeActionButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary.default,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary.default,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  homeActionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  // Error state
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.muted,
    marginBottom: 16,
  },
  errorTextDark: {
    color: Colors.text.darkSecondary,
  },
  homeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary.default,
    borderRadius: 12,
  },
  homeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
