/**
 * Game Play Screen
 * Dynamic route for all game modes
 */

import { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useStore } from "../../src/store";
import { useGameLogic, useStopwatch, useHaptics } from "../../src/hooks";
import { Colors, ModeInfo, GridConfigs } from "../../src/constants";
import { formatTime, createGameResult } from "../../src/lib";
import type { GameMode, Difficulty, Tile } from "../../src/types";

// Tile Cell Component
const TileCell = ({
  tile,
  isTarget,
  onPress,
  size,
  disabled,
  mode,
}: {
  tile: Tile;
  isTarget: boolean;
  onPress: (tile: Tile) => void;
  size: number;
  disabled?: boolean;
  mode: GameMode;
}) => {
  const isDarkMode = useStore((state) => state.settings.isDarkMode);

  if (tile.isCleared) {
    return (
      <View
        style={{ width: size, height: size }}
        className="rounded-2xl bg-panel-muted/50 opacity-25"
      />
    );
  }

  const isJapanese = mode === "SENTENCE";

  return (
    <Pressable
      onPress={() => !disabled && onPress(tile)}
      disabled={disabled}
      style={{ width: size, height: size }}
      className={`
        rounded-2xl items-center justify-center
        ${isJapanese
          ? "bg-bg-paper border-2 border-charcoal"
          : isDarkMode
            ? "bg-white/5 border border-white/10"
            : "bg-panel-muted border border-ui-border"
        }
        ${isTarget ? "ring-2 ring-success ring-offset-2" : ""}
        active:scale-90
      `}
      style={[
        { width: size, height: size },
        isJapanese && {
          shadowColor: "#1A1C1E",
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 4,
        },
        !isJapanese && {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 2,
        },
      ]}
    >
      <Text
        className={`font-extrabold ${
          isJapanese ? "text-5xl" : "text-3xl"
        } ${isDarkMode ? "text-white" : "text-navy"}`}
      >
        {tile.value}
      </Text>
    </Pressable>
  );
};

// Grid Board Component
const GridBoard = ({
  tiles,
  gridConfig,
  currentTargetIndex,
  onTilePress,
  disabled,
  mode,
}: {
  tiles: Tile[];
  gridConfig: { rows: number; cols: number };
  currentTargetIndex: number;
  onTilePress: (tile: Tile) => void;
  disabled?: boolean;
  mode: GameMode;
}) => {
  // Calculate tile size based on grid
  const tileSize = mode === "SENTENCE" ? 80 : 70;
  const gap = 14;

  // Sort tiles by position for rendering
  const sortedTiles = [...tiles].sort((a, b) => a.position - b.position);

  // Create grid rows
  const rows: Tile[][] = [];
  for (let i = 0; i < gridConfig.rows; i++) {
    rows.push(sortedTiles.slice(i * gridConfig.cols, (i + 1) * gridConfig.cols));
  }

  return (
    <View className="items-center" style={{ gap }}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row" style={{ gap }}>
          {row.map((tile) => (
            <TileCell
              key={tile.id}
              tile={tile}
              isTarget={tile.orderIndex === currentTargetIndex && !tile.isCleared}
              onPress={onTilePress}
              size={tileSize}
              disabled={disabled}
              mode={mode}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

// Target Display Component
const TargetDisplay = ({
  mode,
  currentTarget,
  sentence,
  currentIndex,
}: {
  mode: GameMode;
  currentTarget: string;
  sentence?: string;
  currentIndex: number;
}) => {
  const isDarkMode = useStore((state) => state.settings.isDarkMode);

  if (mode === "SENTENCE" && sentence) {
    // Show sentence with progress
    const chars = sentence.split("");
    return (
      <View className="bg-panel-stone/40 border-2 border-accent-border rounded-2xl p-6 min-h-[120px] items-center justify-center">
        <View className="absolute -top-3 left-6 bg-bg-paper px-3 py-0.5 border border-accent-border rounded-full">
          <Text className="text-[10px] font-black uppercase tracking-tighter text-ink/50">
            Current Sentence
          </Text>
        </View>
        <Text className="text-4xl font-black tracking-[0.15em] leading-relaxed text-center">
          {chars.map((char, i) => (
            <Text
              key={i}
              className={i < currentIndex ? "text-charcoal" : "text-charcoal/20"}
            >
              {i < currentIndex ? char : "＿"}
            </Text>
          ))}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`p-4 pr-6 rounded-[2rem] flex-row items-center gap-5 ${
        isDarkMode ? "bg-white/5 border border-white/10" : "bg-panel-muted border border-ui-border"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <View className="items-end">
        <Text className="text-[10px] font-black uppercase tracking-widest text-navy/40 dark:text-white/40">
          Next
        </Text>
        <Text className="text-[10px] font-bold text-navy/30 dark:text-white/30">
          Target
        </Text>
      </View>
      <View className="w-16 h-16 rounded-2xl bg-success items-center justify-center shadow-lg">
        <Text className="text-white text-3xl font-black">{currentTarget}</Text>
      </View>
    </View>
  );
};

// Countdown Overlay
const CountdownOverlay = ({
  count,
  onComplete,
}: {
  count: number;
  onComplete: () => void;
}) => {
  const { countdownTick } = useHaptics();
  const [currentCount, setCurrentCount] = useState(count);

  useEffect(() => {
    if (currentCount <= 0) {
      onComplete();
      return;
    }

    countdownTick();

    const timer = setTimeout(() => {
      setCurrentCount((prev) => prev - 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [currentCount, onComplete, countdownTick]);

  if (currentCount <= 0) return null;

  return (
    <View className="absolute inset-0 bg-black/50 items-center justify-center z-50">
      <Text className="text-white text-[120px] font-black">
        {currentCount === 0 ? "GO!" : currentCount}
      </Text>
    </View>
  );
};

export default function GameScreen() {
  const params = useLocalSearchParams<{ mode: string; difficulty: string }>();
  const mode = (params.mode as GameMode) || "NUMBERS";
  const difficulty = (params.difficulty as Difficulty) || "NORMAL";

  const isDarkMode = useStore((state) => state.settings.isDarkMode);
  const getHighScore = useStore((state) => state.getHighScore);
  const setHighScore = useStore((state) => state.setHighScore);

  const [showCountdown, setShowCountdown] = useState(true);

  const {
    session,
    currentTarget,
    handleTilePress,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
  } = useGameLogic(mode, difficulty);

  const { timeMs, isRunning, start, stop, reset } = useStopwatch();

  // Handle countdown complete
  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    startGame();
    start();
  }, [startGame, start]);

  // Handle game finish
  useEffect(() => {
    if (session.status === "FINISHED") {
      stop();

      const previousRecord = getHighScore(mode, difficulty);
      const result = createGameResult(
        session.sessionId,
        mode,
        difficulty,
        timeMs,
        session.mistakeCount,
        session.tapTimestamps,
        previousRecord
      );

      // Save high score
      if (result.isNewRecord) {
        setHighScore(mode, difficulty, timeMs);
      }

      // Navigate to result
      router.replace({
        pathname: "/result",
        params: { result: JSON.stringify(result) },
      });
    }
  }, [session.status, timeMs, mode, difficulty, session, getHighScore, setHighScore, stop]);

  // Handle pause
  const handlePause = () => {
    if (isRunning) {
      pauseGame();
      stop();
    } else {
      resumeGame();
      start();
    }
  };

  // Calculate progress
  const progress = session.tiles.filter((t) => t.isCleared).length;
  const total = session.tiles.length;
  const progressPercent = (progress / total) * 100;

  // Calculate accuracy
  const totalTaps = progress + session.mistakeCount;
  const accuracy = totalTaps > 0 ? ((progress / totalTaps) * 100).toFixed(1) : "100.0";

  const modeInfo = ModeInfo[mode];

  return (
    <SafeAreaView
      className={`flex-1 ${
        mode === "SENTENCE"
          ? "bg-bg-paper"
          : isDarkMode
            ? "bg-bg-dark"
            : "bg-bg-game"
      }`}
      edges={["top", "bottom"]}
    >
      {/* Countdown Overlay */}
      {showCountdown && (
        <CountdownOverlay count={3} onComplete={handleCountdownComplete} />
      )}

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4">
        <Pressable
          onPress={handlePause}
          className="w-11 h-11 items-center justify-center rounded-full bg-panel-muted border border-ui-border active:scale-95"
        >
          <Text className="text-navy/80 text-lg">{isRunning ? "⏸" : "▶"}</Text>
        </Pressable>

        <View className="items-center">
          <Text className="uppercase tracking-[0.2em] text-[10px] font-extrabold text-navy/50 dark:text-white/50 mb-1">
            Time
          </Text>
          <Text className="text-2xl font-extrabold tabular-nums text-navy dark:text-white tracking-tight">
            {formatTime(timeMs)}
          </Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center rounded-full bg-panel-muted border border-ui-border"
        >
          <Text className="text-navy/80 text-lg">✕</Text>
        </Pressable>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6 justify-center">
        {/* Target Display */}
        <View className="mb-10 items-center">
          <TargetDisplay
            mode={mode}
            currentTarget={currentTarget?.value || ""}
            sentence={session.targetSentence}
            currentIndex={session.currentTargetIndex}
          />
        </View>

        {/* Grid Board */}
        <GridBoard
          tiles={session.tiles}
          gridConfig={session.gridConfig}
          currentTargetIndex={session.currentTargetIndex}
          onTilePress={handleTilePress}
          disabled={session.status !== "PLAYING"}
          mode={mode}
        />

        {/* Stats Panel */}
        <View className="mt-10 flex-row gap-4">
          <View className="flex-1 bg-panel-muted rounded-xl p-5 items-center border border-ui-border">
            <Text className="text-[10px] font-black text-navy/50 uppercase tracking-widest mb-2">
              Progress
            </Text>
            <View className="w-full bg-navy/10 h-2 rounded-full overflow-hidden">
              <View
                className="bg-success h-full rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
            <Text className="text-xs font-bold text-navy/70 mt-2.5">
              {progress} / {total}
            </Text>
          </View>

          <View className="flex-1 bg-panel-muted rounded-xl p-5 items-center border border-ui-border">
            <Text className="text-[10px] font-black text-navy/50 uppercase tracking-widest mb-1">
              Accuracy
            </Text>
            <Text className="text-2xl font-black text-navy tracking-tight">
              {accuracy}%
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="p-10">
        <View className="flex-row items-center justify-center gap-2">
          <View className="w-2 h-2 rounded-full bg-success" />
          <View className="w-2 h-2 rounded-full bg-navy/10" />
          <View className="w-2 h-2 rounded-full bg-navy/10" />
        </View>
      </View>
    </SafeAreaView>
  );
}
