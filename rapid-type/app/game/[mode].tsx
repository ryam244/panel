/**
 * Game Play Screen - Mojic
 * Dynamic route for all game modes
 * Features: Shake animation, vignette effect, penalty popup, timer flash
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { useStore } from "../../src/store";
import { useGameLogic, useStopwatch, useHaptics } from "../../src/hooks";
import { Colors, ModeInfo } from "../../src/constants";
import { formatTime, createGameResult } from "../../src/lib";
import { t } from "../../src/i18n";
import {
  VignetteOverlay,
  PenaltyPopup,
  AnimatedTimer,
  ShakeTile,
} from "../../src/components/feedback";
import type { GameMode, Difficulty, Tile } from "../../src/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Constants
const PENALTY_TIME = 1.0; // seconds

// Animated Pressable
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Grid Board Component with ShakeTile
const GridBoard = ({
  tiles,
  gridConfig,
  currentTargetIndex,
  onTilePress,
  disabled,
  mode,
  errorTileId,
  correctTileId,
  isDarkMode,
}: {
  tiles: Tile[];
  gridConfig: { rows: number; cols: number };
  currentTargetIndex: number;
  onTilePress: (tile: Tile) => void;
  disabled?: boolean;
  mode: GameMode;
  errorTileId: string | null;
  correctTileId: string | null;
  isDarkMode: boolean;
}) => {
  const isSentence = mode === "SENTENCE";
  const tileSize = isSentence ? 80 : 70;
  const gap = isSentence ? 16 : 14;

  const sortedTiles = [...tiles].sort((a, b) => a.position - b.position);

  const rows: Tile[][] = [];
  for (let i = 0; i < gridConfig.rows; i++) {
    rows.push(sortedTiles.slice(i * gridConfig.cols, (i + 1) * gridConfig.cols));
  }

  return (
    <View className="items-center" style={{ gap }}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row" style={{ gap }}>
          {row.map((tile) => (
            <ShakeTile
              key={tile.id}
              tile={tile}
              isTarget={tile.orderIndex === currentTargetIndex && !tile.isCleared}
              onPress={onTilePress}
              size={tileSize}
              disabled={disabled}
              hasError={tile.id === errorTileId}
              isCorrect={tile.id === correctTileId}
              isDarkMode={isDarkMode}
              mode={isSentence ? "sentence" : "numbers"}
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
  isDarkMode,
}: {
  mode: GameMode;
  currentTarget: string;
  sentence?: string;
  currentIndex: number;
  isDarkMode: boolean;
}) => {
  if (mode === "SENTENCE" && sentence) {
    const chars = sentence.split("");
    return (
      <View
        className="rounded-2xl p-6 min-h-[120px] items-center justify-center"
        style={{
          backgroundColor: Colors.background.stone + "66",
          borderWidth: 2,
          borderColor: Colors.border.accent,
        }}
      >
        <View
          className="absolute -top-3 left-6 px-3 py-0.5 rounded-full"
          style={{
            backgroundColor: Colors.background.paper,
            borderWidth: 1,
            borderColor: Colors.border.accent,
          }}
        >
          <Text
            className="text-[10px] font-black uppercase tracking-tighter"
            style={{ color: Colors.text.muted }}
          >
            {t("game.currentSentence")}
          </Text>
        </View>
        <Text
          className="text-4xl font-black tracking-[0.15em] leading-relaxed text-center"
          style={{ color: Colors.text.primary }}
        >
          {chars.map((char, i) => (
            <Text
              key={i}
              style={{
                color: i < currentIndex
                  ? Colors.text.primary
                  : Colors.text.muted + "40",
              }}
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
      className="p-4 pr-6 rounded-[2rem] flex-row items-center gap-5"
      style={{
        backgroundColor: isDarkMode
          ? "rgba(255, 255, 255, 0.05)"
          : Colors.background.panel,
        borderWidth: 1,
        borderColor: isDarkMode
          ? "rgba(255, 255, 255, 0.1)"
          : Colors.border.ui,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <View className="items-end">
        <Text
          className="text-[10px] font-black uppercase tracking-widest"
          style={{ color: Colors.text.muted }}
        >
          {t("game.next")}
        </Text>
        <Text
          className="text-[10px] font-bold"
          style={{ color: Colors.text.muted + "80" }}
        >
          Target
        </Text>
      </View>
      <View
        className="w-16 h-16 rounded-2xl items-center justify-center"
        style={{
          backgroundColor: Colors.semantic.success,
          shadowColor: Colors.semantic.success,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
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
  const scale = useSharedValue(1);

  useEffect(() => {
    if (currentCount <= 0) {
      onComplete();
      return;
    }

    countdownTick();
    scale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );

    const timer = setTimeout(() => {
      setCurrentCount((prev) => prev - 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [currentCount, onComplete, countdownTick]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (currentCount <= 0) return null;

  return (
    <View
      className="absolute inset-0 items-center justify-center z-50"
      style={{ backgroundColor: Colors.overlay.backdrop }}
    >
      <Animated.Text
        className="text-white text-[120px] font-black"
        style={animatedStyle}
      >
        {currentCount === 0 ? t("countdown.go") : currentCount}
      </Animated.Text>
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
  const [errorTileId, setErrorTileId] = useState<string | null>(null);
  const [correctTileId, setCorrectTileId] = useState<string | null>(null);
  const [showVignette, setShowVignette] = useState(false);
  const [penaltyPosition, setPenaltyPosition] = useState({ x: 0, y: 0 });
  const [showPenalty, setShowPenalty] = useState(false);
  const [timerHasError, setTimerHasError] = useState(false);
  const [penaltyTotal, setPenaltyTotal] = useState(0);

  const {
    session,
    currentTarget,
    handleTilePress: originalHandleTilePress,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
  } = useGameLogic(mode, difficulty);

  const { timeMs, isRunning, start, stop, reset } = useStopwatch();
  const { errorFeedback, correctFeedback } = useHaptics();

  // Enhanced tile press handler with animations
  const handleTilePress = useCallback(
    (tile: Tile, event?: any) => {
      const isCorrect = tile.orderIndex === session.currentTargetIndex;

      if (isCorrect) {
        // Correct tap
        setCorrectTileId(tile.id);
        correctFeedback();
        setTimeout(() => setCorrectTileId(null), 300);
      } else {
        // Error tap - trigger all feedback
        setErrorTileId(tile.id);
        setShowVignette(true);
        setTimerHasError(true);
        setPenaltyTotal((prev) => prev + PENALTY_TIME);
        errorFeedback();

        // Get tap position for penalty popup
        // Since we can't get exact position, use center of screen
        setPenaltyPosition({
          x: SCREEN_WIDTH / 2,
          y: 300,
        });
        setShowPenalty(true);

        // Reset after animation
        setTimeout(() => {
          setErrorTileId(null);
          setShowVignette(false);
          setTimerHasError(false);
        }, 500);
      }

      originalHandleTilePress(tile);
    },
    [session.currentTargetIndex, originalHandleTilePress, correctFeedback, errorFeedback]
  );

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

      const totalTimeWithPenalty = timeMs + (penaltyTotal * 1000);
      const previousRecord = getHighScore(mode, difficulty);
      const result = createGameResult(
        session.sessionId,
        mode,
        difficulty,
        totalTimeWithPenalty,
        session.mistakeCount,
        session.tapTimestamps,
        previousRecord
      );

      if (result.isNewRecord) {
        setHighScore(mode, difficulty, totalTimeWithPenalty);
      }

      router.replace({
        pathname: "/result",
        params: { result: JSON.stringify(result) },
      });
    }
  }, [session.status, timeMs, penaltyTotal, mode, difficulty, session, getHighScore, setHighScore, stop]);

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

  // Background color based on mode
  const getBackgroundColor = () => {
    if (mode === "SENTENCE") return Colors.background.gameSentence;
    if (isDarkMode) return Colors.background.dark;
    return Colors.background.game;
  };

  // Total time with penalty
  const displayTime = timeMs + (penaltyTotal * 1000);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: getBackgroundColor() }}
      edges={["top", "bottom"]}
    >
      {/* Vignette Overlay */}
      <VignetteOverlay isVisible={showVignette} />

      {/* Penalty Popup */}
      <PenaltyPopup
        penaltyTime={PENALTY_TIME}
        position={penaltyPosition}
        isVisible={showPenalty}
        onComplete={() => setShowPenalty(false)}
      />

      {/* Countdown Overlay */}
      {showCountdown && (
        <CountdownOverlay count={3} onComplete={handleCountdownComplete} />
      )}

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4">
        <Pressable
          onPress={handlePause}
          className="w-11 h-11 items-center justify-center rounded-full active:scale-95"
          style={{
            backgroundColor: isDarkMode
              ? "rgba(255, 255, 255, 0.08)"
              : Colors.background.panel,
            borderWidth: 1,
            borderColor: isDarkMode
              ? "rgba(255, 255, 255, 0.1)"
              : Colors.border.ui,
          }}
        >
          <Text
            style={{
              color: isDarkMode ? Colors.text.dark : Colors.text.primary,
              fontSize: 18,
            }}
          >
            {isRunning ? "⏸" : "▶"}
          </Text>
        </Pressable>

        <AnimatedTimer
          timeMs={displayTime}
          isRunning={isRunning}
          hasError={timerHasError}
          isDarkMode={mode === "SENTENCE" ? false : isDarkMode}
        />

        <Pressable
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center rounded-full"
          style={{
            backgroundColor: isDarkMode
              ? "rgba(255, 255, 255, 0.08)"
              : Colors.background.panel,
            borderWidth: 1,
            borderColor: isDarkMode
              ? "rgba(255, 255, 255, 0.1)"
              : Colors.border.ui,
          }}
        >
          <Text
            style={{
              color: isDarkMode ? Colors.text.dark : Colors.text.primary,
              fontSize: 18,
            }}
          >
            ✕
          </Text>
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
            isDarkMode={mode === "SENTENCE" ? false : isDarkMode}
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
          errorTileId={errorTileId}
          correctTileId={correctTileId}
          isDarkMode={mode === "SENTENCE" ? false : isDarkMode}
        />

        {/* Stats Panel */}
        <View className="mt-10 flex-row gap-4">
          <View
            className="flex-1 rounded-xl p-5 items-center"
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
              className="text-[10px] font-black uppercase tracking-widest mb-2"
              style={{ color: Colors.text.muted }}
            >
              {t("game.progress")}
            </Text>
            <View
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : Colors.text.muted + "20" }}
            >
              <View
                className="h-full rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: Colors.semantic.success,
                }}
              />
            </View>
            <Text
              className="text-xs font-bold mt-2.5"
              style={{
                color: isDarkMode ? Colors.text.darkSecondary : Colors.text.secondary,
              }}
            >
              {progress} / {total}
            </Text>
          </View>

          <View
            className="flex-1 rounded-xl p-5 items-center"
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
              className="text-[10px] font-black uppercase tracking-widest mb-1"
              style={{ color: Colors.text.muted }}
            >
              {t("game.accuracy")}
            </Text>
            <Text
              className="text-2xl font-black tracking-tight"
              style={{
                color: isDarkMode ? Colors.text.dark : Colors.text.primary,
              }}
            >
              {accuracy}%
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="p-10">
        <View className="flex-row items-center justify-center gap-2">
          <View
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: Colors.semantic.success }}
          />
          <View
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: Colors.text.muted + "30" }}
          />
          <View
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: Colors.text.muted + "30" }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
