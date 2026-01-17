/**
 * useGameLogic - Core game state and logic
 */

import { useState, useCallback, useMemo } from "react";
import type { GameSession, GameMode, Difficulty, Tile, UseGameLogicReturn } from "../types";
import { generateTiles, getCurrentTargetValue } from "../lib/generator";
import { useStopwatch } from "./useStopwatch";
import { useHaptics } from "./useHaptics";
import { useStore } from "../store";

// Generate session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function useGameLogic(
  mode: GameMode,
  difficulty: Difficulty
): UseGameLogicReturn {
  const { timeMs, isRunning, start, stop, reset: resetTimer, lap } = useStopwatch();
  const { tapCorrect, tapWrong, levelClear } = useHaptics();
  const getHighScore = useStore((state) => state.getHighScore);

  // Generate initial tiles
  const initialData = useMemo(() => generateTiles(mode, difficulty), [mode, difficulty]);

  const [session, setSession] = useState<GameSession>(() => ({
    sessionId: generateSessionId(),
    mode,
    difficulty,
    gridConfig: initialData.gridConfig,
    tiles: initialData.tiles,
    currentTargetIndex: 0,
    targetSentence: initialData.sentence,
    startTime: null,
    endTime: null,
    status: "IDLE",
    mistakeCount: 0,
    tapTimestamps: [],
  }));

  // Get current target tile
  const currentTarget = useMemo(() => {
    return session.tiles.find((t) => t.orderIndex === session.currentTargetIndex) || null;
  }, [session.tiles, session.currentTargetIndex]);

  // Check if tile is correct
  // For SENTENCE mode: allow tapping any tile with the same character as the current target
  const isCorrect = useCallback(
    (tile: Tile): boolean => {
      if (mode === "SENTENCE") {
        // Get the current target character
        const targetTile = session.tiles.find((t) => t.orderIndex === session.currentTargetIndex);
        if (!targetTile) return false;
        // Allow any uncleared tile with the same value
        return !tile.isCleared && tile.value === targetTile.value;
      }
      return tile.orderIndex === session.currentTargetIndex;
    },
    [mode, session.tiles, session.currentTargetIndex]
  );

  // Handle tile press
  const handleTilePress = useCallback(
    (tile: Tile) => {
      if (session.status !== "PLAYING" || tile.isCleared) return;

      if (isCorrect(tile)) {
        // Correct tap
        tapCorrect();

        const timestamp = lap();

        // For SENTENCE mode: always clear the tile with the current orderIndex
        // This ensures tiles are cleared in the correct order even if user taps a duplicate
        const tileIdToClear = mode === "SENTENCE"
          ? session.tiles.find((t) => t.orderIndex === session.currentTargetIndex)?.id || tile.id
          : tile.id;

        const newTiles = session.tiles.map((t) =>
          t.id === tileIdToClear ? { ...t, isCleared: true } : t
        );

        const nextIndex = session.currentTargetIndex + 1;
        const isFinished = nextIndex >= session.tiles.length;

        if (isFinished) {
          // Game complete
          stop();
          levelClear();

          setSession((prev) => ({
            ...prev,
            tiles: newTiles,
            currentTargetIndex: nextIndex,
            status: "FINISHED",
            endTime: Date.now(),
            tapTimestamps: [...prev.tapTimestamps, timestamp],
          }));
        } else {
          setSession((prev) => ({
            ...prev,
            tiles: newTiles,
            currentTargetIndex: nextIndex,
            tapTimestamps: [...prev.tapTimestamps, timestamp],
          }));
        }
      } else {
        // Wrong tap
        tapWrong();

        setSession((prev) => ({
          ...prev,
          mistakeCount: prev.mistakeCount + 1,
        }));
      }
    },
    [session.status, session.tiles, session.currentTargetIndex, isCorrect, tapCorrect, tapWrong, levelClear, lap, stop]
  );

  // Start game
  const startGame = useCallback(() => {
    start();
    setSession((prev) => ({
      ...prev,
      status: "PLAYING",
      startTime: Date.now(),
      tapTimestamps: [0], // First timestamp at 0
    }));
  }, [start]);

  // Pause game
  const pauseGame = useCallback(() => {
    stop();
    setSession((prev) => ({
      ...prev,
      status: "PAUSED",
    }));
  }, [stop]);

  // Resume game
  const resumeGame = useCallback(() => {
    start();
    setSession((prev) => ({
      ...prev,
      status: "PLAYING",
    }));
  }, [start]);

  // Reset game
  const resetGame = useCallback(() => {
    resetTimer();
    const newData = generateTiles(mode, difficulty);

    setSession({
      sessionId: generateSessionId(),
      mode,
      difficulty,
      gridConfig: newData.gridConfig,
      tiles: newData.tiles,
      currentTargetIndex: 0,
      targetSentence: newData.sentence,
      startTime: null,
      endTime: null,
      status: "IDLE",
      mistakeCount: 0,
      tapTimestamps: [],
    });
  }, [resetTimer, mode, difficulty]);

  return {
    session: {
      ...session,
      // Inject current time for real-time display
      startTime: session.startTime,
      endTime: session.endTime || (session.status === "FINISHED" ? timeMs : null),
    },
    currentTarget,
    handleTilePress,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    isCorrect,
  };
}
