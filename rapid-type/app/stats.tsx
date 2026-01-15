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
    <View className="flex-row items-end justify-around" style={{ height: 100 }}>
      {data.map((item, index) => {
        const height = maxValue > 0 ? (item.value / maxValue) * 80 : 0;
        return (
          <View key={index} className="items-center" style={{ flex: 1 }}>
            <View
              style={{
                width: 24,
                height: Math.max(4, height),
                backgroundColor: item.color || Colors.primary.default,
                borderRadius: 4,
              }}
            />
            <Text
              className="text-[9px] mt-2 font-bold"
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
      className="flex-row items-center justify-between p-4 rounded-xl mb-3"
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
      <View className="flex-row items-center gap-3">
        <View
          className="w-10 h-10 rounded-lg items-center justify-center"
          style={{ backgroundColor: getRankColor(entry.rank) + "20" }}
        >
          <Text
            className="text-lg font-black"
            style={{ color: getRankColor(entry.rank) }}
          >
            {entry.rank}
          </Text>
        </View>
        <View>
          <Text
            className="font-bold"
            style={{ color: isDarkMode ? Colors.text.dark : Colors.text.primary }}
          >
            {getModeLabel(entry.mode)}
          </Text>
          <Text
            className="text-xs"
            style={{ color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted }}
          >
            {getDifficultyLabel(entry.difficulty)} · {dateStr}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text
          className="font-black text-lg"
          style={{ color: isDarkMode ? Colors.text.dark : Colors.text.primary }}
        >
          {formatTime(entry.clearTime)}
        </Text>
        <Text
          className="text-xs"
          style={{ color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted }}
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
      className="flex-1 p-4 rounded-xl items-center"
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
      <Text
        className="text-[10px] font-black uppercase tracking-wider mb-1"
        style={{ color: Colors.text.muted }}
      >
        {label}
      </Text>
      <Text
        className="text-2xl font-black"
        style={{ color: isDarkMode ? Colors.text.dark : Colors.text.primary }}
      >
        {value}
      </Text>
      {subValue && (
        <Text
          className="text-xs"
          style={{ color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted }}
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
      className="flex-row items-center justify-between p-4 rounded-xl mb-2"
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
      <View>
        <Text
          className="font-bold"
          style={{ color: isDarkMode ? Colors.text.dark : Colors.text.primary }}
        >
          {getModeLabel(mode)}
        </Text>
        <Text
          className="text-xs"
          style={{ color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted }}
        >
          {getDifficultyLabel(difficulty)}
        </Text>
      </View>
      <Text
        className="font-black text-xl"
        style={{ color: Colors.primary.default }}
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
      className="flex-1"
      style={{
        backgroundColor: isDarkMode
          ? Colors.background.dark
          : Colors.background.light,
      }}
      edges={["top"]}
    >
      {/* Header */}
      <View className="flex-row items-center px-6 py-4">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full"
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
          className="text-xl font-black ml-4"
          style={{ color: isDarkMode ? Colors.text.dark : Colors.text.primary }}
        >
          {t("stats.title")}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Stats */}
        <Text
          className="text-[11px] font-black uppercase tracking-widest mb-3"
          style={{ color: Colors.text.muted }}
        >
          {t("stats.overview")}
        </Text>
        <View className="flex-row gap-3 mb-6">
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

        <View className="flex-row gap-3 mb-8">
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
              className="text-[11px] font-black uppercase tracking-widest mb-3"
              style={{ color: Colors.text.muted }}
            >
              {t("stats.history")} (s)
            </Text>
            <View
              className="p-4 rounded-xl mb-8"
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
          className="text-[11px] font-black uppercase tracking-widest mb-3"
          style={{ color: Colors.text.muted }}
        >
          {t("stats.bestTimes")}
        </Text>
        {highScoreEntries.length > 0 ? (
          <View className="mb-8">
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
            className="p-6 rounded-xl items-center mb-8"
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
            <Text className="text-4xl mb-2">🎮</Text>
            <Text
              className="font-bold mb-1"
              style={{ color: isDarkMode ? Colors.text.dark : Colors.text.primary }}
            >
              {t("stats.noRecords")}
            </Text>
            <Text
              className="text-sm text-center"
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
              className="text-[11px] font-black uppercase tracking-widest mb-3"
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
