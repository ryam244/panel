/**
 * Game Play Screen - Mojic
 * Dynamic route for all game modes
 * Features: Shake animation, vignette effect, penalty popup, timer flash
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, Pressable, Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
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
import { ExitConfirmDialog } from "../../src/components/overlays/ExitConfirmDialog";
import type { GameMode, Difficulty, Tile } from "../../src/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Constants
const PENALTY_TIME = 1.0; // seconds

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
  const tileSize = isSentence ? 56 : 64;
  const gap = isSentence ? 8 : 10;

  const sortedTiles = [...tiles].sort((a, b) => a.position - b.position);

  const rows: Tile[][] = [];
  for (let i = 0; i < gridConfig.rows; i++) {
    rows.push(sortedTiles.slice(i * gridConfig.cols, (i + 1) * gridConfig.cols));
  }

  return (
    <View style={[styles.gridContainer, { gap }]}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.gridRow, { gap }]}>
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

// Target Display Component for Sentence Mode
const SentenceTargetDisplay = ({
  sentence,
  currentIndex,
}: {
  sentence: string;
  currentIndex: number;
}) => {
  const chars = sentence.split("");
  return (
    <View style={styles.sentenceContainer}>
      <View style={styles.sentenceLabel}>
        <Text style={styles.sentenceLabelText}>
          {t("game.currentSentence")}
        </Text>
      </View>
      <Text style={styles.sentenceText}>
        {chars.map((char, i) => (
          <Text
            key={i}
            style={{
              color: i < currentIndex ? Colors.text.primary : Colors.text.muted + "60",
              fontWeight: i === currentIndex ? "bold" : "normal",
            }}
          >
            {char}
          </Text>
        ))}
      </Text>
    </View>
  );
};

// Target Display Component for Find Number Mode
const FindTargetDisplay = ({
  currentTarget,
  isDarkMode,
}: {
  currentTarget: string;
  isDarkMode: boolean;
}) => {
  return (
    <View style={styles.findTargetContainer}>
      <Text style={[styles.findLabel, isDarkMode && styles.findLabelDark]}>
        {t("game.findThis")}
      </Text>
      <View style={styles.findTargetBadge}>
        <Text style={styles.findTargetText}>{currentTarget}</Text>
      </View>
    </View>
  );
};

// Target Display Component for Numbers/Alphabet Mode
const DefaultTargetDisplay = ({
  currentTarget,
  isDarkMode,
}: {
  currentTarget: string;
  isDarkMode: boolean;
}) => {
  return (
    <View style={[styles.targetContainer, isDarkMode && styles.targetContainerDark]}>
      <View style={styles.targetLabelContainer}>
        <Text style={styles.targetLabel}>{t("game.next")}</Text>
      </View>
      <View style={styles.targetBadge}>
        <Text style={styles.targetBadgeText}>{currentTarget}</Text>
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

  useEffect(() => {
    if (currentCount <= 0) {
      onComplete();
      return;
    }

    countdownTick();
    sounds.playCountdown();

    const timer = setTimeout(() => {
      setCurrentCount((prev) => prev - 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [currentCount, onComplete, countdownTick]);

  if (currentCount <= 0) return null;

  return (
    <View style={styles.countdownOverlay}>
      <Text style={styles.countdownText}>
        {currentCount}
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
  const [errorTileId, setErrorTileId] = useState<string | null>(null);
  const [correctTileId, setCorrectTileId] = useState<string | null>(null);
  const [showVignette, setShowVignette] = useState(false);
  const [penaltyPosition, setPenaltyPosition] = useState({ x: 0, y: 0 });
  const [showPenalty, setShowPenalty] = useState(false);
  const [timerHasError, setTimerHasError] = useState(false);
  const [penaltyTotal, setPenaltyTotal] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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

  // Handle exit button press
  const handleExitPress = () => {
    if (isRunning) {
      pauseGame();
      stop();
    }
    setShowExitConfirm(true);
  };

  // Handle exit confirm
  const handleExitConfirm = () => {
    setShowExitConfirm(false);
    router.back();
  };

  // Handle exit cancel
  const handleExitCancel = () => {
    setShowExitConfirm(false);
    if (session.status === "PLAYING") {
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
  const isSentenceMode = mode === "SENTENCE";
  const effectiveIsDarkMode = isSentenceMode ? false : isDarkMode;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: getBackgroundColor() }]}
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
      <View style={styles.header}>
        <Pressable
          onPress={handlePause}
          style={[
            styles.headerButton,
            effectiveIsDarkMode && styles.headerButtonDark,
          ]}
        >
          <Text style={[styles.headerButtonText, effectiveIsDarkMode && styles.headerButtonTextDark]}>
            {isRunning ? "||" : "▶"}
          </Text>
        </Pressable>

        <AnimatedTimer
          timeMs={displayTime}
          isRunning={isRunning}
          hasError={timerHasError}
          isDarkMode={effectiveIsDarkMode}
        />

        <Pressable
          onPress={handleExitPress}
          style={[
            styles.headerButton,
            effectiveIsDarkMode && styles.headerButtonDark,
          ]}
        >
          <Text style={[styles.headerButtonText, effectiveIsDarkMode && styles.headerButtonTextDark]}>
            ✕
          </Text>
        </Pressable>
      </View>

      {/* Exit Confirmation Dialog */}
      <ExitConfirmDialog
        isVisible={showExitConfirm}
        onConfirm={handleExitConfirm}
        onCancel={handleExitCancel}
      />

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Target Display */}
        <View style={styles.targetSection}>
          {mode === "SENTENCE" && session.targetSentence ? (
            <SentenceTargetDisplay
              sentence={session.targetSentence}
              currentIndex={session.currentTargetIndex}
            />
          ) : mode === "FIND_NUMBER" ? (
            <FindTargetDisplay
              currentTarget={currentTarget?.value || ""}
              isDarkMode={effectiveIsDarkMode}
            />
          ) : (
            <DefaultTargetDisplay
              currentTarget={currentTarget?.value || ""}
              isDarkMode={effectiveIsDarkMode}
            />
          )}
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
          isDarkMode={effectiveIsDarkMode}
        />

        {/* Stats Panel */}
        <View style={styles.statsPanel}>
          <View style={[styles.statCard, effectiveIsDarkMode && styles.statCardDark]}>
            <Text style={styles.statLabel}>{t("game.progress")}</Text>
            <View style={[styles.progressBar, effectiveIsDarkMode && styles.progressBarDark]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
            <Text style={[styles.statValue, effectiveIsDarkMode && styles.statValueDark]}>
              {progress} / {total}
            </Text>
          </View>

          <View style={[styles.statCard, effectiveIsDarkMode && styles.statCardDark]}>
            <Text style={styles.statLabel}>{t("game.accuracy")}</Text>
            <Text style={[styles.statValueLarge, effectiveIsDarkMode && styles.statValueDark]}>
              {accuracy}%
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerIndicators}>
          <View style={[styles.footerDot, styles.footerDotActive]} />
          <View style={styles.footerDot} />
          <View style={styles.footerDot} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background.panel,
    borderWidth: 1,
    borderColor: Colors.border.ui,
  },
  headerButtonDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  headerButtonTextDark: {
    color: Colors.text.dark,
  },
  // Main Content
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  // Target Section
  targetSection: {
    marginBottom: 24,
    width: "100%",
    alignItems: "center",
  },
  // Sentence Target
  sentenceContainer: {
    width: "100%",
    backgroundColor: Colors.background.paper,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.accent,
  },
  sentenceLabel: {
    backgroundColor: Colors.primary.default + "20",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  sentenceLabelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.primary.default,
  },
  sentenceText: {
    fontSize: 20,
    lineHeight: 32,
    color: Colors.text.primary,
  },
  // Find Target
  findTargetContainer: {
    alignItems: "center",
  },
  findLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.muted,
    marginBottom: 8,
  },
  findLabelDark: {
    color: Colors.text.darkSecondary,
  },
  findTargetBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary.default,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary.default,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  findTargetText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  // Default Target
  targetContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.panel,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border.ui,
    gap: 16,
  },
  targetContainerDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  targetLabelContainer: {
    alignItems: "center",
  },
  targetLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  targetBadge: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.semantic.success,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.semantic.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  targetBadgeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  // Grid
  gridContainer: {
    alignItems: "center",
  },
  gridRow: {
    flexDirection: "row",
  },
  // Stats Panel
  statsPanel: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background.panel,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border.ui,
    alignItems: "center",
  },
  statCardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  statValueLarge: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text.primary,
  },
  statValueDark: {
    color: Colors.text.dark,
  },
  progressBar: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.text.muted + "20",
    marginBottom: 8,
    overflow: "hidden",
  },
  progressBarDark: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: Colors.semantic.success,
  },
  // Footer
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  footerIndicators: {
    flexDirection: "row",
    gap: 8,
  },
  footerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text.muted + "30",
  },
  footerDotActive: {
    backgroundColor: Colors.semantic.success,
    width: 24,
  },
  // Countdown
  countdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.overlay.backdrop,
  },
  countdownText: {
    fontSize: 120,
    fontWeight: "900",
    color: "#fff",
  },
});
