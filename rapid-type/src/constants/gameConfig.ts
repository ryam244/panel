/**
 * Game Configuration - Rapid Type
 * Grid sizes, difficulty settings, rank thresholds.
 */

import type { GameMode, Difficulty, GridConfig } from "../types";

// Grid configurations per mode and difficulty
export const GridConfigs: Record<GameMode, Record<Difficulty, GridConfig>> = {
  NUMBERS: {
    EASY: { rows: 4, cols: 4, totalTiles: 16 },
    NORMAL: { rows: 5, cols: 4, totalTiles: 20 },
    HARD: { rows: 5, cols: 5, totalTiles: 25 },
  },
  FIND_NUMBER: {
    EASY: { rows: 4, cols: 4, totalTiles: 16 },
    NORMAL: { rows: 5, cols: 4, totalTiles: 20 },
    HARD: { rows: 5, cols: 5, totalTiles: 25 },
  },
  ALPHABET: {
    EASY: { rows: 4, cols: 4, totalTiles: 16 },     // A-P
    NORMAL: { rows: 5, cols: 4, totalTiles: 20 },   // A-T
    HARD: { rows: 5, cols: 6, totalTiles: 26 },     // A-Z (last row has 6)
  },
  SENTENCE: {
    EASY: { rows: 3, cols: 3, totalTiles: 9 },
    NORMAL: { rows: 3, cols: 4, totalTiles: 12 },
    HARD: { rows: 4, cols: 4, totalTiles: 16 },
  },
  FLASH: {
    EASY: { rows: 3, cols: 3, totalTiles: 9 },
    NORMAL: { rows: 4, cols: 4, totalTiles: 16 },
    HARD: { rows: 5, cols: 5, totalTiles: 25 },
  },
  ENDLESS: {
    EASY: { rows: 4, cols: 4, totalTiles: 16 },
    NORMAL: { rows: 5, cols: 5, totalTiles: 25 },
    HARD: { rows: 5, cols: 5, totalTiles: 25 },
  },
};

// Rank thresholds (in milliseconds per tile)
// Lower is better
export const RankThresholds = {
  NUMBERS: {
    EASY: { S: 400, A: 600, B: 800 },   // 16 tiles: S=6.4s, A=9.6s, B=12.8s
    NORMAL: { S: 350, A: 550, B: 750 }, // 20 tiles: S=7s, A=11s, B=15s
    HARD: { S: 300, A: 500, B: 700 },   // 25 tiles: S=7.5s, A=12.5s, B=17.5s
  },
  FIND_NUMBER: {
    EASY: { S: 500, A: 700, B: 900 },
    NORMAL: { S: 450, A: 650, B: 850 },
    HARD: { S: 400, A: 600, B: 800 },
  },
  ALPHABET: {
    EASY: { S: 450, A: 650, B: 850 },
    NORMAL: { S: 400, A: 600, B: 800 },
    HARD: { S: 350, A: 550, B: 750 },
  },
  SENTENCE: {
    EASY: { S: 800, A: 1000, B: 1200 },
    NORMAL: { S: 700, A: 900, B: 1100 },
    HARD: { S: 600, A: 800, B: 1000 },
  },
  FLASH: {
    EASY: { S: 350, A: 450, B: 550 },
    NORMAL: { S: 300, A: 400, B: 500 },
    HARD: { S: 250, A: 350, B: 450 },
  },
  ENDLESS: {
    EASY: { S: 400, A: 600, B: 800 },
    NORMAL: { S: 350, A: 550, B: 750 },
    HARD: { S: 300, A: 500, B: 700 },
  },
};

// Countdown duration in ms
export const COUNTDOWN_DURATION = 3000;

// Timer update interval in ms
export const TIMER_INTERVAL = 10;

// Haptic feedback patterns
export const HapticPatterns = {
  TAP_CORRECT: "impactLight",
  TAP_WRONG: "notificationError",
  LEVEL_CLEAR: "notificationSuccess",
  COUNTDOWN_TICK: "selection",
} as const;

// Animation durations in ms
export const AnimationDurations = {
  tileClear: 200,
  screenTransition: 300,
  countdownTick: 800,
  resultAppear: 400,
  buttonPress: 75,
} as const;

// Mode display info
export const ModeInfo: Record<GameMode, {
  title: string;
  icon: string;
  description: string;
}> = {
  NUMBERS: {
    title: "Numbers",
    icon: "123",
    description: "Tap numbers in order",
  },
  FIND_NUMBER: {
    title: "Find Number",
    icon: "search",
    description: "Find the target number",
  },
  ALPHABET: {
    title: "Alphabet",
    icon: "spellcheck",
    description: "Tap A to Z in order",
  },
  SENTENCE: {
    title: "Sentence",
    icon: "subject",
    description: "Complete the sentence",
  },
  FLASH: {
    title: "Flash",
    icon: "flash_on",
    description: "Tap the flashing panel",
  },
  ENDLESS: {
    title: "Endless",
    icon: "infinity",
    description: "No mistakes allowed",
  },
};

// Difficulty display info
export const DifficultyInfo: Record<Difficulty, {
  label: string;
  color: string;
}> = {
  EASY: { label: "Easy", color: "#5A7269" },
  NORMAL: { label: "Normal", color: "#1754CF" },
  HARD: { label: "Hard", color: "#FF9500" },
};

// Sample sentences for SENTENCE mode (MVP)
export const SampleSentences = {
  proverbs: [
    { japanese: "いしのうえにもさんねん", english: "Persistence pays off" },
    { japanese: "さるもきからおちる", english: "Even experts make mistakes" },
    { japanese: "ちりもつもればやまとなる", english: "Many a little makes a mickle" },
    { japanese: "なくこはそだつ", english: "Crying children grow well" },
    { japanese: "はなよりだんご", english: "Substance over style" },
  ],
  simple: [
    { japanese: "おはようございます", english: "Good morning" },
    { japanese: "ありがとう", english: "Thank you" },
    { japanese: "こんにちは", english: "Hello" },
    { japanese: "さようなら", english: "Goodbye" },
    { japanese: "おやすみなさい", english: "Good night" },
  ],
};
