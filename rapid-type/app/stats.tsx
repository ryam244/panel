/**
 * Statistics Screen - Mojic
 * Shows game history, best times, and performance graphs
 */

import { View, Text, Pressable, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useStore, GameHistoryEntry } from "../src/store";
import { Colors } from "../src/constants";
import { formatTime } from "../src/lib";
import { t } from "../src/i18n";
import type { GameMode, Difficulty } from "../src/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Simple bar chart component
const SimpleBarChart = ({
  data,
  maxValue,
  isDarkMode,
}: {
  data: { label: string; value: number; color?: string }[];
  maxValue: number;
  isDarkMode: boolean;
}) => {
  return (
    <View style={{ height: 100 }}>
      {data.map((item, index) => {
        const height = maxValue > 0 ? (item.value / maxValue) * 80 : 0;
        return (
          <View key={index} style={{ flex: 1 }}>
            <View
              style={{
                width: 24,
                height: Math.max(4, height),
                backgroundColor: item.color || Colors.primary.default,
                borderRadius: 4,
              }}
            />
            <Text
             
              style={{ color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted }}
            >
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

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
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        marginBottom: 8,
        borderRadius: 12,
        backgroundColor: isDarkMode
          ? "rgba(255, 255, 255, 0.05)"
          : Colors.background.panel,
        borderWidth: 1,
        borderColor: isDarkMode
          ? "rgba(255, 255, 255, 0.1)"
          : Colors.border.ui,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
            backgroundColor: getRankColor(entry.rank) + "20",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: getRankColor(entry.rank),
            }}
          >
            {entry.rank}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 2,
              color: isDarkMode ? Colors.text.dark : Colors.text.primary,
            }}
          >
            {getModeLabel(entry.mode)}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted,
            }}
          >
            {getDifficultyLabel(entry.difficulty)} · {dateStr}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 2,
            color: isDarkMode ? Colors.text.dark : Colors.text.primary,
          }}
        >
          {formatTime(entry.clearTime)}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted,
          }}
        >
          {entry.accuracy.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
};

// Stat card component
const StatCard = ({
  label,
  value,
  subValue,
  isDarkMode,
}: {
  label: string;
  value: string;
  subValue?: string;
  isDarkMode: boolean;
}) => {
  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        marginHorizontal: 4,
        borderRadius: 12,
        backgroundColor: isDarkMode
          ? "rgba(255, 255, 255, 0.05)"
          : Colors.background.panel,
        borderWidth: 1,
        borderColor: isDarkMode
          ? "rgba(255, 255, 255, 0.1)"
          : Colors.border.ui,
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 8,
          color: Colors.text.muted,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: isDarkMode ? Colors.text.dark : Colors.text.primary,
        }}
      >
        {value}
      </Text>
      {subValue && (
        <Text
          style={{
            fontSize: 12,
            marginTop: 4,
            color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted,
          }}
        >
          {subValue}
        </Text>
      )}
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
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        marginBottom: 8,
        borderRadius: 12,
        backgroundColor: isDarkMode
          ? "rgba(255, 255, 255, 0.05)"
          : Colors.background.panel,
        borderWidth: 1,
        borderColor: isDarkMode
          ? "rgba(255, 255, 255, 0.1)"
          : Colors.border.ui,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 4,
            color: isDarkMode ? Colors.text.dark : Colors.text.primary,
          }}
        >
          {getModeLabel(mode)}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted,
          }}
        >
          {getDifficultyLabel(difficulty)}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: Colors.primary.default,
        }}
      >
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
  const modeStats = useStore((state) => state.modeStats);

  // Format play time
  const formatPlayTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    if (hours > 0) {
      return `${hours}${t("time.hours")} ${minutes}${t("time.minutes")}`;
    }
    return `${minutes}${t("time.minutes")}`;
  };

  // Prepare chart data from recent history
  const recentGames = gameHistory.slice(0, 7);
  const chartData = recentGames.reverse().map((game, i) => ({
    label: `#${i + 1}`,
    value: game.clearTime / 1000,
    color: getRankColor(game.rank),
  }));
  const maxTime = Math.max(...chartData.map((d) => d.value), 1);

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
     
      style={{
        backgroundColor: isDarkMode
          ? Colors.background.dark
          : Colors.background.light,
      }}
      edges={["top"]}
    >
      {/* Header */}
      <View>
        <Pressable
          onPress={() => router.back()}
         
          style={{
            backgroundColor: isDarkMode
              ? "rgba(255, 255, 255, 0.08)"
              : Colors.background.panel,
          }}
        >
          <ChevronLeft
            size={24}
            color={isDarkMode ? Colors.text.dark : Colors.text.primary}
          />
        </Pressable>
        <Text
         
          style={{ color: isDarkMode ? Colors.text.dark : Colors.text.primary }}
        >
          {t("stats.title")}
        </Text>
      </View>

      <ScrollView
       
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Stats */}
        <Text
         
          style={{ color: Colors.text.muted }}
        >
          {t("stats.overview")}
        </Text>
        <View>
          <StatCard
            label={t("stats.totalGames")}
            value={stats.totalGamesPlayed.toString()}
            isDarkMode={isDarkMode}
          />
          <StatCard
            label={t("settings.totalPlayTime")}
            value={formatPlayTime(stats.totalPlayTime)}
            isDarkMode={isDarkMode}
          />
        </View>

        <View>
          <StatCard
            label={t("stats.avgTime")}
            value={avgTime > 0 ? formatTime(avgTime) : "-"}
            isDarkMode={isDarkMode}
          />
          <StatCard
            label={t("stats.avgAccuracy")}
            value={avgAccuracy > 0 ? `${avgAccuracy.toFixed(1)}%` : "-"}
            isDarkMode={isDarkMode}
          />
        </View>

        {/* Performance Chart */}
        {chartData.length > 0 && (
          <>
            <Text
             
              style={{ color: Colors.text.muted }}
            >
              {t("stats.history")} (s)
            </Text>
            <View
             
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.05)"
                  : Colors.background.panel,
                borderWidth: 1,
                borderColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : Colors.border.ui,
              }}
            >
              <SimpleBarChart
                data={chartData}
                maxValue={maxTime}
                isDarkMode={isDarkMode}
              />
            </View>
          </>
        )}

        {/* Best Times */}
        <Text
         
          style={{ color: Colors.text.muted }}
        >
          {t("stats.bestTimes")}
        </Text>
        {highScoreEntries.length > 0 ? (
          <View>
            {highScoreEntries.map((entry) => (
              <BestTimeCard
                key={`${entry.mode}_${entry.difficulty}`}
                mode={entry.mode}
                difficulty={entry.difficulty}
                time={entry.time}
                isDarkMode={isDarkMode}
              />
            ))}
          </View>
        ) : (
          <View
           
            style={{
              backgroundColor: isDarkMode
                ? "rgba(255, 255, 255, 0.05)"
                : Colors.background.panel,
              borderWidth: 1,
              borderColor: isDarkMode
                ? "rgba(255, 255, 255, 0.1)"
                : Colors.border.ui,
            }}
          >
            <Text>🎮</Text>
            <Text
             
              style={{ color: isDarkMode ? Colors.text.dark : Colors.text.primary }}
            >
              {t("stats.noRecords")}
            </Text>
            <Text
             
              style={{ color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted }}
            >
              {t("stats.playToRecord")}
            </Text>
          </View>
        )}

        {/* Recent History */}
        {gameHistory.length > 0 && (
          <>
            <Text
             
              style={{ color: Colors.text.muted }}
            >
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
