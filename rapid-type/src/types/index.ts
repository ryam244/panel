/**
 * TypeScript Type Definitions - Rapid Type
 */

// ===================
// GAME MODES
// ===================

export type GameMode =
  | "NUMBERS"      // 数字順押し (1→N)
  | "FIND_NUMBER"  // 数字探し (target search)
  | "ALPHABET"     // アルファベット順押し (A→Z)
  | "SENTENCE"     // 日本語文章
  | "FLASH"        // 光るパネル
  | "ENDLESS";     // エンドレスモード（ミスするまで続く）

export type Difficulty = "EASY" | "NORMAL" | "HARD";

export type GameStatus =
  | "IDLE"        // 待機中
  | "COUNTDOWN"   // カウントダウン中
  | "PLAYING"     // プレイ中
  | "PAUSED"      // 一時停止
  | "FINISHED";   // 終了

export type Rank = "S" | "A" | "B" | "C";

// ===================
// GRID & TILES
// ===================

export interface GridConfig {
  rows: number;
  cols: number;
  totalTiles: number;
}

export interface Tile {
  id: string;
  value: string;           // Display value ("1", "A", "あ")
  orderIndex: number;      // Correct tap order (0-based)
  isCleared: boolean;      // Already tapped
  position: number;        // Grid position (0 to totalTiles-1)
}

// Flash mode specific
export interface FlashTile extends Tile {
  isActive: boolean;       // Currently flashing
  activatedAt: number;     // Timestamp when activated
}

// ===================
// GAME SESSION
// ===================

export interface GameSession {
  sessionId: string;
  mode: GameMode;
  difficulty: Difficulty;
  gridConfig: GridConfig;
  tiles: Tile[];
  currentTargetIndex: number;  // Current target orderIndex
  targetSentence?: string;     // For SENTENCE mode
  startTime: number | null;
  endTime: number | null;
  status: GameStatus;
  mistakeCount: number;
  tapTimestamps: number[];     // Timestamp of each correct tap
}

// ===================
// GAME RESULT
// ===================

export interface GameResult {
  sessionId: string;
  mode: GameMode;
  difficulty: Difficulty;
  clearTime: number;           // Total time in ms
  accuracy: number;            // Percentage (0-100)
  rank: Rank;
  isNewRecord: boolean;
  previousRecord?: number;     // Previous best time
  tapsPerSecond: number;       // Average TPS
  tapIntervals: number[];      // Time between taps
  date: string;                // ISO date string
}

// エンドレスモード結果
export interface EndlessResult {
  sessionId: string;
  totalTaps: number;           // 総タップ数
  totalTimeMs: number;         // 総経過時間
  roundsCompleted: number;     // 完了ラウンド数
  mentalAge: number;           // 精神年齢
  iqScore: number;             // IQスコア
  tapsPerSecond: number;       // 平均TPS
  date: string;                // ISO date string
  isNewRecord: boolean;
  previousRecord?: number;     // 前回の最高タップ数
}

// ===================
// USER DATA
// ===================

export interface UserSettings {
  isSoundEnabled: boolean;
  isHapticsEnabled: boolean;
  isDarkMode: boolean;
}

export interface HighScoreKey {
  mode: GameMode;
  difficulty: Difficulty;
}

export type HighScores = Record<string, number>; // "NUMBERS_NORMAL": 15320 (ms)

export interface UserStats {
  totalGamesPlayed: number;
  totalPlayTime: number;       // ms
  currentStreak: number;       // Days
  longestStreak: number;
  lastPlayedDate: string;      // ISO date
}

// ===================
// STORE
// ===================

export interface AppStore {
  // Settings
  settings: UserSettings;
  setSettings: (settings: Partial<UserSettings>) => void;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  toggleHaptics: () => void;

  // High Scores
  highScores: HighScores;
  getHighScore: (mode: GameMode, difficulty: Difficulty) => number | null;
  setHighScore: (mode: GameMode, difficulty: Difficulty, time: number) => void;

  // Stats
  stats: UserStats;
  incrementGamesPlayed: () => void;
  addPlayTime: (ms: number) => void;
  updateStreak: () => void;

  // Hydration
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// ===================
// COMPONENT PROPS
// ===================

export interface TileCellProps {
  tile: Tile;
  isTarget: boolean;
  onPress: (tile: Tile) => void;
  size: number;
  disabled?: boolean;
}

export interface GridBoardProps {
  tiles: Tile[];
  gridConfig: GridConfig;
  currentTargetIndex: number;
  onTilePress: (tile: Tile) => void;
  disabled?: boolean;
}

export interface TimerDisplayProps {
  timeMs: number;
  isRunning: boolean;
  size?: "normal" | "large";
}

export interface TargetDisplayProps {
  mode: GameMode;
  currentTarget: string;
  sentence?: string;
  progress?: number;
}

export interface StatsCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  variant?: "default" | "highlight" | "primary";
}

export interface ModeCardProps {
  mode: GameMode;
  isSelected: boolean;
  onPress: () => void;
}

// ===================
// NAVIGATION
// ===================

export interface GameRouteParams {
  mode: GameMode;
  difficulty: Difficulty;
}

export interface ResultRouteParams {
  result: string; // JSON stringified GameResult
}

// ===================
// HOOKS
// ===================

export interface UseGameLogicReturn {
  session: GameSession;
  currentTarget: Tile | null;
  handleTilePress: (tile: Tile) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  isCorrect: (tile: Tile) => boolean;
}

export interface UseStopwatchReturn {
  timeMs: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  lap: () => number;
}
