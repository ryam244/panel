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
import { useGameLogic, useStopwatch, useHaptics, useSounds } from "../../src/hooks";
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
    <View style={{ gap }}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={{ gap }}>
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
  // Sentence mode - show sentence with progress
  if (mode === "SENTENCE" && sentence) {
    const chars = sentence.split("");
    return (
      <View
       
        style={{
          backgroundColor: Colors.background.stone + "66",
          borderWidth: 2,
          borderColor: Colors.border.accent,
        }}
      >
        <View
         
          style={{
            backgroundColor: Colors.background.paper,
            borderWidth: 1,
            borderColor: Colors.border.accent,
          }}
        >
          <Text
           
            style={{ color: Colors.text.muted }}
          >
            {t("game.currentSentence")}
          </Text>
        </View>
        <Text
         
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

  // Find Number mode - large prominent target display
  if (mode === "FIND_NUMBER") {
    return (
      <View>
        <Text
         
          style={{ color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted }}
        >
          {t("game.findThis")}
        </Text>
        <View
         
          style={{
            backgroundColor: Colors.primary.default,
            shadowColor: Colors.primary.default,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Text>{currentTarget}</Text>
        </View>
        <Text
         
          style={{ color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted }}
        >
          🔍 {t("game.searchGrid")}
        </Text>
      </View>
    );
  }

  // Default mode (Numbers, Alphabet) - compact target display
  return (
    <View
     
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
      <View>
        <Text
         
          style={{ color: Colors.text.muted }}
        >
          {t("game.next")}
        </Text>
        <Text
         
          style={{ color: Colors.text.muted + "80" }}
        >
          Target
        </Text>
      </View>
      <View
       
        style={{
          backgroundColor: Colors.semantic.success,
          shadowColor: Colors.semantic.success,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text>{currentTarget}</Text>
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
  const sounds = useSounds();
  const [currentCount, setCurrentCount] = useState(count);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (currentCount <= 0) {
      onComplete();
      return;
    }

    countdownTick();
    sounds.playCountdown();
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
     
      style={{ backgroundColor: Colors.overlay.backdrop }}
    >
      <Animated.Text
       
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
  const { tapWrong, tapCorrect } = useHaptics();
  const sounds = useSounds();

  // Enhanced tile press handler with animations
  const handleTilePress = useCallback(
    (tile: Tile, event?: any) => {
      const isCorrect = tile.orderIndex === session.currentTargetIndex;

      if (isCorrect) {
        // Correct tap
        setCorrectTileId(tile.id);
        tapCorrect();
        sounds.playCorrect();
        setTimeout(() => setCorrectTileId(null), 300);
      } else {
        // Error tap - trigger all feedback
        setErrorTileId(tile.id);
        setShowVignette(true);
        setTimerHasError(true);
        setPenaltyTotal((prev) => prev + PENALTY_TIME);
        tapWrong();
        sounds.playMiss();

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
    [session.currentTargetIndex, originalHandleTilePress, tapCorrect, tapWrong, sounds]
  );

  // Handle countdown complete
  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    startGame();
    start();
    sounds.playGameStart();
  }, [startGame, start, sounds]);

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
        sounds.playNewRecord();
      } else {
        sounds.playGameClear();
      }

      router.replace({
        pathname: "/result",
        params: { result: JSON.stringify(result) },
      });
    }
  }, [session.status, timeMs, penaltyTotal, mode, difficulty, session, getHighScore, setHighScore, stop, sounds]);

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
    // ライトモードでは文章モードと同じ明るい背景を使用
    return Colors.background.gameSentence;
  };

  // Total time with penalty
  const displayTime = timeMs + (penaltyTotal * 1000);

  return (
    <SafeAreaView
     
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
      <View>
        <Pressable
          onPress={handlePause}
         
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
          isDarkMode={isDarkMode}
        />

        <Pressable
          onPress={() => router.back()}
         
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
      <View>
        {/* Target Display */}
        <View>
          <TargetDisplay
            mode={mode}
            currentTarget={currentTarget?.value || ""}
            sentence={session.targetSentence}
            currentIndex={session.currentTargetIndex}
            isDarkMode={isDarkMode}
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
          isDarkMode={isDarkMode}
        />

        {/* Stats Panel */}
        <View>
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
            <Text
             
              style={{ color: Colors.text.muted }}
            >
              {t("game.progress")}
            </Text>
            <View
             
              style={{ backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : Colors.text.muted + "20" }}
            >
              <View
               
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: Colors.semantic.success,
                }}
              />
            </View>
            <Text
             
              style={{
                color: isDarkMode ? Colors.text.darkSecondary : Colors.text.secondary,
              }}
            >
              {progress} / {total}
            </Text>
          </View>

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
            <Text
             
              style={{ color: Colors.text.muted }}
            >
              {t("game.accuracy")}
            </Text>
            <Text
             
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
      <View>
        <View>
          <View
           
            style={{ backgroundColor: Colors.semantic.success }}
          />
          <View
           
            style={{ backgroundColor: Colors.text.muted + "30" }}
          />
          <View
           
            style={{ backgroundColor: Colors.text.muted + "30" }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
