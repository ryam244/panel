/**
 * Statistics Screen - Mojic
 * Shows game history, best times, and performance graphs
 */

import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useStore, GameHistoryEntry } from "../src/store";
import { Colors } from "../src/constants";
import { formatTime } from "../src/lib";
import { t } from "../src/i18n";
import type { GameMode, Difficulty } from "../src/types";

// Mode label helper
const getModeLabel = (mode: GameMode): string => {
  const labels: Record<GameMode, string> = {
    NUMBERS: t("modes.numbers"),
    ALPHABET: t("modes.alphabet"),
    SENTENCE: t("modes.sentence"),
    FIND_NUMBER: t("modes.findNumber"),
    FLASH: t("modes.flash"),
  };
  return labels[mode];
};

// Difficulty label helper
const getDifficultyLabel = (diff: Difficulty): string => {
  const labels: Record<Difficulty, string> = {
    EASY: t("difficulty.easy"),
    NORMAL: t("difficulty.normal"),
    HARD: t("difficulty.hard"),
  };
  return labels[diff];
};

// Rank color
const getRankColor = (rank: string): string => {
  switch (rank) {
    case "S":
      return Colors.primary.default;
    case "A":
      return Colors.semantic.success;
    case "B":
      return "#F5A623";
    default:
      return Colors.text.muted;
  }
};

// Stats Row Component (like settings)
const StatsRow = ({
  label,
  value,
  isDarkMode,
}: {
  label: string;
  value: string;
  isDarkMode: boolean;
}) => {
  return (
    <View style={[styles.statsRow, isDarkMode && styles.statsRowDark]}>
      <Text style={[styles.statsLabel, isDarkMode && styles.statsLabelDark]}>
        {label}
      </Text>
      <Text style={[styles.statsValue, isDarkMode && styles.statsValueDark]}>
        {value}
      </Text>
    </View>
  );
};

// History item component
const HistoryItem = ({
  entry,
  isDarkMode,
}: {
  entry: GameHistoryEntry;
  isDarkMode: boolean;
}) => {
  const date = new Date(entry.date);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

  return (
    <View style={[styles.historyItem, isDarkMode && styles.historyItemDark]}>
      <View style={styles.historyLeft}>
        <View style={[styles.rankBadge, { backgroundColor: getRankColor(entry.rank) + "20" }]}>
          <Text style={[styles.rankText, { color: getRankColor(entry.rank) }]}>
            {entry.rank}
          </Text>
        </View>
        <View>
          <Text style={[styles.historyMode, isDarkMode && styles.historyModeDark]}>
            {getModeLabel(entry.mode)}
          </Text>
          <Text style={[styles.historyMeta, isDarkMode && styles.historyMetaDark]}>
            {getDifficultyLabel(entry.difficulty)} · {dateStr}
          </Text>
        </View>
      </View>
      <View style={styles.historyRight}>
        <Text style={[styles.historyTime, isDarkMode && styles.historyTimeDark]}>
          {formatTime(entry.clearTime)}
        </Text>
        <Text style={[styles.historyAccuracy, isDarkMode && styles.historyAccuracyDark]}>
          {entry.accuracy.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
};

// Best time card
const BestTimeCard = ({
  mode,
  difficulty,
  time,
  isDarkMode,
}: {
  mode: GameMode;
  difficulty: Difficulty;
  time: number;
  isDarkMode: boolean;
}) => {
  return (
    <View style={[styles.bestTimeCard, isDarkMode && styles.bestTimeCardDark]}>
      <View>
        <Text style={[styles.bestTimeMode, isDarkMode && styles.bestTimeModeDark]}>
          {getModeLabel(mode)}
        </Text>
        <Text style={[styles.bestTimeDiff, isDarkMode && styles.bestTimeDiffDark]}>
          {getDifficultyLabel(difficulty)}
        </Text>
      </View>
      <Text style={styles.bestTimeValue}>
        {formatTime(time)}
      </Text>
    </View>
  );
};

export default function StatsScreen() {
  const isDarkMode = useStore((state) => state.settings.isDarkMode);
  const stats = useStore((state) => state.stats);
  const highScores = useStore((state) => state.highScores);
  const gameHistory = useStore((state) => state.gameHistory);

  // Format play time
  const formatPlayTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    if (hours > 0) {
      return `${hours}${t("time.hours")} ${minutes}${t("time.minutes")}`;
    }
    return `${minutes}${t("time.minutes")}`;
  };

  // Get high scores as array
  const highScoreEntries = Object.entries(highScores).map(([key, time]) => {
    const [mode, difficulty] = key.split("_") as [GameMode, Difficulty];
    return { mode, difficulty, time };
  });

  // Calculate averages from history
  const avgTime =
    gameHistory.length > 0
      ? gameHistory.reduce((sum, g) => sum + g.clearTime, 0) / gameHistory.length
      : 0;
  const avgAccuracy =
    gameHistory.length > 0
      ? gameHistory.reduce((sum, g) => sum + g.accuracy, 0) / gameHistory.length
      : 0;

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.containerDark]}
      edges={["top", "bottom"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>
          {t("stats.title")}
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.closeButton, isDarkMode && styles.closeButtonDark]}
        >
          <Text style={[styles.closeButtonText, isDarkMode && styles.closeButtonTextDark]}>
            ✕
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Section */}
        <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>
          {t("stats.overview")}
        </Text>

        <StatsRow
          label={t("stats.totalGames")}
          value={stats.totalGamesPlayed.toString()}
          isDarkMode={isDarkMode}
        />
        <StatsRow
          label={t("settings.totalPlayTime")}
          value={formatPlayTime(stats.totalPlayTime)}
          isDarkMode={isDarkMode}
        />
        <StatsRow
          label={t("stats.avgTime")}
          value={avgTime > 0 ? formatTime(avgTime) : "-"}
          isDarkMode={isDarkMode}
        />
        <StatsRow
          label={t("stats.avgAccuracy")}
          value={avgAccuracy > 0 ? `${avgAccuracy.toFixed(1)}%` : "-"}
          isDarkMode={isDarkMode}
        />

        {/* Best Times Section */}
        <Text style={[styles.sectionTitle, styles.sectionTitleMargin, isDarkMode && styles.sectionTitleDark]}>
          {t("stats.bestTimes")}
        </Text>

        {highScoreEntries.length > 0 ? (
          highScoreEntries.map((entry) => (
            <BestTimeCard
              key={`${entry.mode}_${entry.difficulty}`}
              mode={entry.mode}
              difficulty={entry.difficulty}
              time={entry.time}
              isDarkMode={isDarkMode}
            />
          ))
        ) : (
          <View style={[styles.emptyCard, isDarkMode && styles.emptyCardDark]}>
            <Text style={styles.emptyIcon}>🎮</Text>
            <Text style={[styles.emptyTitle, isDarkMode && styles.emptyTitleDark]}>
              {t("stats.noRecords")}
            </Text>
            <Text style={[styles.emptyText, isDarkMode && styles.emptyTextDark]}>
              {t("stats.playToRecord")}
            </Text>
          </View>
        )}

        {/* Recent History Section */}
        {gameHistory.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, styles.sectionTitleMargin, isDarkMode && styles.sectionTitleDark]}>
              {t("stats.history")}
            </Text>
            {gameHistory.slice(0, 10).map((entry) => (
              <HistoryItem key={entry.id} entry={entry} isDarkMode={isDarkMode} />
            ))}
          </>
        )}
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text.primary,
  },
  headerTitleDark: {
    color: "#fff",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#fff",
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
  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  // Section Title
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    color: Colors.text.muted,
  },
  sectionTitleDark: {
    color: "rgba(255,255,255,0.4)",
  },
  sectionTitleMargin: {
    marginTop: 32,
  },
  // Stats Row
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  statsRowDark: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.muted,
  },
  statsLabelDark: {
    color: "rgba(255,255,255,0.7)",
  },
  statsValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.text.primary,
  },
  statsValueDark: {
    color: "#fff",
  },
  // Best Time Card
  bestTimeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  bestTimeCardDark: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  bestTimeMode: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  bestTimeModeDark: {
    color: "#fff",
  },
  bestTimeDiff: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: 2,
  },
  bestTimeDiffDark: {
    color: "rgba(255,255,255,0.5)",
  },
  bestTimeValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary.default,
  },
  // History Item
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  historyItemDark: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  historyMode: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  historyModeDark: {
    color: "#fff",
  },
  historyMeta: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: 2,
  },
  historyMetaDark: {
    color: "rgba(255,255,255,0.5)",
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyTime: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.text.primary,
  },
  historyTimeDark: {
    color: "#fff",
  },
  historyAccuracy: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: 2,
  },
  historyAccuracyDark: {
    color: "rgba(255,255,255,0.5)",
  },
  // Empty State
  emptyCard: {
    padding: 32,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  emptyCardDark: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyTitleDark: {
    color: "#fff",
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: "center",
  },
  emptyTextDark: {
    color: "rgba(255,255,255,0.5)",
  },
});
