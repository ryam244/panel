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

// ===================
// ENDLESS MODE CALCULATIONS
// ===================

/**
 * Calculate mental age based on taps and time
 * Higher TPS = higher mental age
 */
export function calculateMentalAge(totalTaps: number, totalTimeMs: number): number {
  if (totalTaps === 0 || totalTimeMs === 0) return 0;

  const tps = (totalTaps / totalTimeMs) * 1000;

  // Endurance bonus (up to +10 years)
  const enduranceBonus = Math.min(10, Math.floor(totalTaps / 50));

  let age: number;
  if (tps < 1.0) {
    age = Math.max(5, Math.floor(tps * 10));
  } else if (tps < 2.0) {
    age = 10 + Math.floor((tps - 1.0) * 10);
  } else if (tps < 3.0) {
    age = 20 + Math.floor((tps - 2.0) * 15);
  } else if (tps < 4.0) {
    age = 35 + Math.floor((tps - 3.0) * 15);
  } else {
    age = 50 + Math.floor((tps - 4.0) * 10);
  }

  return Math.min(99, age + enduranceBonus);
}

/**
 * Calculate IQ score based on taps and time
 */
export function calculateIQ(totalTaps: number, totalTimeMs: number): number {
  if (totalTaps === 0 || totalTimeMs === 0) return 0;

  const tps = (totalTaps / totalTimeMs) * 1000;

  // Endurance bonus (up to +20 IQ)
  const enduranceBonus = Math.min(20, Math.floor(totalTaps / 25));

  let iq: number;
  if (tps < 1.0) {
    iq = 60 + Math.floor(tps * 20);
  } else if (tps < 2.0) {
    iq = 80 + Math.floor((tps - 1.0) * 20);
  } else if (tps < 3.0) {
    iq = 100 + Math.floor((tps - 2.0) * 20);
  } else if (tps < 4.0) {
    iq = 120 + Math.floor((tps - 3.0) * 20);
  } else {
    iq = 140 + Math.floor((tps - 4.0) * 20);
  }

  return Math.min(200, iq + enduranceBonus);
}

/**
 * Get IQ rating description
 */
export function getIQRating(iq: number): string {
  if (iq >= 160) return "天才";
  if (iq >= 140) return "非常に優秀";
  if (iq >= 120) return "優秀";
  if (iq >= 110) return "平均より上";
  if (iq >= 90) return "平均";
  if (iq >= 80) return "平均より下";
  return "頑張ろう";
}

/**
 * Create endless mode result
 */
export function createEndlessResult(
  sessionId: string,
  totalTaps: number,
  totalTimeMs: number,
  roundsCompleted: number,
  previousRecord: number | null
): import("../types").EndlessResult {
  const tps = totalTimeMs > 0 ? (totalTaps / totalTimeMs) * 1000 : 0;
  const mentalAge = calculateMentalAge(totalTaps, totalTimeMs);
  const iqScore = calculateIQ(totalTaps, totalTimeMs);
  const isNewRecord = previousRecord === null || totalTaps > previousRecord;

  return {
    sessionId,
    totalTaps,
    totalTimeMs,
    roundsCompleted,
    mentalAge,
    iqScore,
    tapsPerSecond: Math.round(tps * 10) / 10,
    date: new Date().toISOString(),
    isNewRecord,
    previousRecord: previousRecord ?? undefined,
  };
}
