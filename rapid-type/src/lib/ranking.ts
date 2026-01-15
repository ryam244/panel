/**
 * Ranking Calculator - Determines rank based on performance
 */

import type { GameMode, Difficulty, Rank, GameResult } from "../types";
import { RankThresholds, GridConfigs } from "../constants";

export function calculateRank(
  mode: GameMode,
  difficulty: Difficulty,
  clearTimeMs: number
): Rank {
  const config = GridConfigs[mode][difficulty];
  const thresholds = RankThresholds[mode][difficulty];

  // Calculate time per tile
  const timePerTile = clearTimeMs / config.totalTiles;

  if (timePerTile <= thresholds.S) return "S";
  if (timePerTile <= thresholds.A) return "A";
  if (timePerTile <= thresholds.B) return "B";
  return "C";
}

export function calculateAccuracy(
  totalTiles: number,
  mistakeCount: number
): number {
  if (totalTiles === 0) return 0;
  const correctTaps = totalTiles;
  const totalTaps = correctTaps + mistakeCount;
  return Math.round((correctTaps / totalTaps) * 100 * 10) / 10;
}

export function calculateTapsPerSecond(
  tapTimestamps: number[]
): number {
  if (tapTimestamps.length < 2) return 0;

  const totalTime = tapTimestamps[tapTimestamps.length - 1] - tapTimestamps[0];
  if (totalTime === 0) return 0;

  const tapsCount = tapTimestamps.length - 1;
  const tps = (tapsCount / totalTime) * 1000;

  return Math.round(tps * 10) / 10;
}

export function calculateTapIntervals(
  tapTimestamps: number[]
): number[] {
  const intervals: number[] = [];

  for (let i = 1; i < tapTimestamps.length; i++) {
    intervals.push(tapTimestamps[i] - tapTimestamps[i - 1]);
  }

  return intervals;
}

export function createGameResult(
  sessionId: string,
  mode: GameMode,
  difficulty: Difficulty,
  clearTimeMs: number,
  mistakeCount: number,
  tapTimestamps: number[],
  previousRecord: number | null
): GameResult {
  const config = GridConfigs[mode][difficulty];
  const totalTiles = config.totalTiles;

  const rank = calculateRank(mode, difficulty, clearTimeMs);
  const accuracy = calculateAccuracy(totalTiles, mistakeCount);
  const tapsPerSecond = calculateTapsPerSecond(tapTimestamps);
  const tapIntervals = calculateTapIntervals(tapTimestamps);
  const isNewRecord = previousRecord === null || clearTimeMs < previousRecord;

  return {
    sessionId,
    mode,
    difficulty,
    clearTime: clearTimeMs,
    accuracy,
    rank,
    isNewRecord,
    previousRecord: previousRecord ?? undefined,
    tapsPerSecond,
    tapIntervals,
    date: new Date().toISOString(),
  };
}

// Format time for display (MM:SS.ms)
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const msStr = String(milliseconds).padStart(2, "0");

  return `${mm}:${ss}.${msStr}`;
}

// Format time difference
export function formatTimeDiff(diffMs: number): string {
  const sign = diffMs >= 0 ? "+" : "-";
  const absMs = Math.abs(diffMs);
  const seconds = (absMs / 1000).toFixed(2);
  return `${sign}${seconds}s`;
}
