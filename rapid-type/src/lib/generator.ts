/**
 * Problem Generator - Creates tiles for each game mode
 */

import type { Tile, GameMode, Difficulty, GridConfig } from "../types";
import { GridConfigs, SampleSentences } from "../constants";

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate UUID
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Generate number tiles (1 to N)
function generateNumberTiles(config: GridConfig): Tile[] {
  const tiles: Tile[] = [];

  for (let i = 0; i < config.totalTiles; i++) {
    tiles.push({
      id: generateId(),
      value: String(i + 1),
      orderIndex: i,
      isCleared: false,
      position: i,
    });
  }

  // Shuffle positions
  const shuffledPositions = shuffle([...Array(config.totalTiles).keys()]);
  return tiles.map((tile, index) => ({
    ...tile,
    position: shuffledPositions[index],
  }));
}

// Generate alphabet tiles (A to Z or subset)
function generateAlphabetTiles(config: GridConfig): Tile[] {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const tiles: Tile[] = [];

  const count = Math.min(config.totalTiles, 26);

  for (let i = 0; i < count; i++) {
    tiles.push({
      id: generateId(),
      value: alphabet[i],
      orderIndex: i,
      isCleared: false,
      position: i,
    });
  }

  // Shuffle positions
  const shuffledPositions = shuffle([...Array(count).keys()]);
  return tiles.map((tile, index) => ({
    ...tile,
    position: shuffledPositions[index],
  }));
}

// Generate sentence tiles (Japanese hiragana)
function generateSentenceTiles(
  config: GridConfig,
  difficulty: Difficulty
): { tiles: Tile[]; sentence: string } {
  // Select sentence based on difficulty
  const sentences =
    difficulty === "EASY"
      ? SampleSentences.simple
      : SampleSentences.proverbs;

  const sentenceData = sentences[Math.floor(Math.random() * sentences.length)];
  const chars = sentenceData.japanese.split("");

  const tiles: Tile[] = chars.map((char, index) => ({
    id: generateId(),
    value: char,
    orderIndex: index,
    isCleared: false,
    position: index,
  }));

  // Shuffle positions
  const shuffledPositions = shuffle([...Array(chars.length).keys()]);
  const shuffledTiles = tiles.map((tile, index) => ({
    ...tile,
    position: shuffledPositions[index],
  }));

  return {
    tiles: shuffledTiles,
    sentence: sentenceData.japanese,
  };
}

// Generate find number tiles (random order target)
function generateFindNumberTiles(config: GridConfig): Tile[] {
  // Same as number tiles but the order is random
  const tiles: Tile[] = [];

  for (let i = 0; i < config.totalTiles; i++) {
    tiles.push({
      id: generateId(),
      value: String(i + 1),
      orderIndex: i,
      isCleared: false,
      position: i,
    });
  }

  // Shuffle both order and positions
  const shuffledOrderIndices = shuffle([...Array(config.totalTiles).keys()]);
  const shuffledPositions = shuffle([...Array(config.totalTiles).keys()]);

  return tiles.map((tile, index) => ({
    ...tile,
    orderIndex: shuffledOrderIndices[index],
    position: shuffledPositions[index],
  }));
}

// Main generator function
export function generateTiles(
  mode: GameMode,
  difficulty: Difficulty
): { tiles: Tile[]; gridConfig: GridConfig; sentence?: string } {
  const gridConfig = GridConfigs[mode][difficulty];

  switch (mode) {
    case "NUMBERS":
      return {
        tiles: generateNumberTiles(gridConfig),
        gridConfig,
      };

    case "ALPHABET":
      return {
        tiles: generateAlphabetTiles(gridConfig),
        gridConfig,
      };

    case "SENTENCE": {
      const { tiles, sentence } = generateSentenceTiles(gridConfig, difficulty);
      return {
        tiles,
        gridConfig: { ...gridConfig, totalTiles: tiles.length },
        sentence,
      };
    }

    case "FIND_NUMBER":
      return {
        tiles: generateFindNumberTiles(gridConfig),
        gridConfig,
      };

    case "FLASH":
      // Flash mode: empty tiles, will be activated one by one
      return {
        tiles: Array(gridConfig.totalTiles)
          .fill(null)
          .map((_, i) => ({
            id: generateId(),
            value: "",
            orderIndex: i,
            isCleared: false,
            position: i,
          })),
        gridConfig,
      };

    default:
      return {
        tiles: generateNumberTiles(gridConfig),
        gridConfig,
      };
  }
}

// Get current target value for display
export function getCurrentTargetValue(
  mode: GameMode,
  tiles: Tile[],
  currentIndex: number,
  sentence?: string
): string {
  if (mode === "SENTENCE" && sentence) {
    return sentence[currentIndex] || "";
  }

  const targetTile = tiles.find((t) => t.orderIndex === currentIndex);
  return targetTile?.value || "";
}
