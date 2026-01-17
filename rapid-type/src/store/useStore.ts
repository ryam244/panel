/**
 * Zustand Store - Mojic
 * Global state management with AsyncStorage persistence
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { GameMode, Difficulty, UserSettings, UserStats, HighScores } from "../types";

// Play limit configuration
export const PLAY_LIMIT_CONFIG = {
  DAILY_FREE_PLAYS: 10, // 1日10回まで無料
  REWARD_BONUS_PLAYS: 5, // リワード広告で+5回
} as const;

// Play limit state
export interface PlayLimitState {
  date: string; // YYYY-MM-DD format
  playsRemaining: number;
  totalPlaysToday: number;
  adsWatchedToday: number;
}

// Game History Entry
export interface GameHistoryEntry {
  id: string;
  mode: GameMode;
  difficulty: Difficulty;
  clearTime: number;
  accuracy: number;
  rank: "S" | "A" | "B" | "C";
  date: string;
}

// Achievement Definition
export interface Achievement {
  id: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

// Extended Store Type
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

  // Tutorial
  hasSeenTutorial: boolean;
  setHasSeenTutorial: (seen: boolean) => void;

  // Game History
  gameHistory: GameHistoryEntry[];
  addGameHistory: (entry: Omit<GameHistoryEntry, "id">) => void;
  clearGameHistory: () => void;

  // Achievements
  achievements: Record<string, Achievement>;
  unlockAchievement: (id: string) => void;
  updateAchievementProgress: (id: string, progress: number) => void;
  getAchievement: (id: string) => Achievement | undefined;

  // Mode-specific stats
  modeStats: Record<string, { gamesPlayed: number; totalTime: number; perfectGames: number }>;
  updateModeStats: (mode: GameMode, difficulty: Difficulty, time: number, isPerfect: boolean) => void;

  // Play Limit (Reward Ads)
  playLimit: PlayLimitState;
  canPlay: () => boolean;
  consumePlay: () => boolean;
  addBonusPlays: () => void;
  getPlaysRemaining: () => number;
  resetPlayLimitIfNewDay: () => void;

  // Hydration
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// Default values
const defaultSettings: UserSettings = {
  isSoundEnabled: true,
  isHapticsEnabled: true,
  isDarkMode: false,
};

const defaultStats: UserStats = {
  totalGamesPlayed: 0,
  totalPlayTime: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastPlayedDate: "",
};

const defaultHighScores: HighScores = {};

// Default play limit
const getTodayDateString = (): string => {
  return new Date().toISOString().slice(0, 10);
};

const defaultPlayLimit: PlayLimitState = {
  date: getTodayDateString(),
  playsRemaining: PLAY_LIMIT_CONFIG.DAILY_FREE_PLAYS,
  totalPlaysToday: 0,
  adsWatchedToday: 0,
};

// Achievement IDs
export const ACHIEVEMENT_IDS = {
  FIRST_CLEAR: "first_clear",
  SPEED_DEMON: "speed_demon",
  PERFECTIONIST: "perfectionist",
  MARATHONER: "marathoner",
  WEEK_STREAK: "week_streak",
  MONTH_STREAK: "month_streak",
  NUMBER_MASTER: "number_master",
  ALPHABET_MASTER: "alphabet_master",
  SENTENCE_MASTER: "sentence_master",
  NO_MISTAKE: "no_mistake",
  FIND_MASTER: "find_master",
  SPEED_KING: "speed_king",
} as const;

// Default achievements
const defaultAchievements: Record<string, Achievement> = {
  [ACHIEVEMENT_IDS.FIRST_CLEAR]: { id: ACHIEVEMENT_IDS.FIRST_CLEAR, unlocked: false },
  [ACHIEVEMENT_IDS.SPEED_DEMON]: { id: ACHIEVEMENT_IDS.SPEED_DEMON, unlocked: false },
  [ACHIEVEMENT_IDS.PERFECTIONIST]: { id: ACHIEVEMENT_IDS.PERFECTIONIST, unlocked: false, progress: 0, maxProgress: 1 },
  [ACHIEVEMENT_IDS.MARATHONER]: { id: ACHIEVEMENT_IDS.MARATHONER, unlocked: false, progress: 0, maxProgress: 100 },
  [ACHIEVEMENT_IDS.WEEK_STREAK]: { id: ACHIEVEMENT_IDS.WEEK_STREAK, unlocked: false, progress: 0, maxProgress: 7 },
  [ACHIEVEMENT_IDS.MONTH_STREAK]: { id: ACHIEVEMENT_IDS.MONTH_STREAK, unlocked: false, progress: 0, maxProgress: 30 },
  [ACHIEVEMENT_IDS.NUMBER_MASTER]: { id: ACHIEVEMENT_IDS.NUMBER_MASTER, unlocked: false },
  [ACHIEVEMENT_IDS.ALPHABET_MASTER]: { id: ACHIEVEMENT_IDS.ALPHABET_MASTER, unlocked: false },
  [ACHIEVEMENT_IDS.SENTENCE_MASTER]: { id: ACHIEVEMENT_IDS.SENTENCE_MASTER, unlocked: false, progress: 0, maxProgress: 50 },
  [ACHIEVEMENT_IDS.NO_MISTAKE]: { id: ACHIEVEMENT_IDS.NO_MISTAKE, unlocked: false, progress: 0, maxProgress: 10 },
  [ACHIEVEMENT_IDS.FIND_MASTER]: { id: ACHIEVEMENT_IDS.FIND_MASTER, unlocked: false },
  [ACHIEVEMENT_IDS.SPEED_KING]: { id: ACHIEVEMENT_IDS.SPEED_KING, unlocked: false, progress: 0, maxProgress: 10 },
};

// Helper functions
const createHighScoreKey = (mode: GameMode, difficulty: Difficulty): string => {
  return `${mode}_${difficulty}`;
};

const isSameDay = (date1: string, date2: string): boolean => {
  return date1.slice(0, 10) === date2.slice(0, 10);
};

const isConsecutiveDay = (lastDate: string, today: string): boolean => {
  const last = new Date(lastDate);
  const current = new Date(today);
  const diffTime = current.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ===================
      // SETTINGS
      // ===================
      settings: defaultSettings,

      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      toggleDarkMode: () =>
        set((state) => ({
          settings: { ...state.settings, isDarkMode: !state.settings.isDarkMode },
        })),

      toggleSound: () =>
        set((state) => ({
          settings: { ...state.settings, isSoundEnabled: !state.settings.isSoundEnabled },
        })),

      toggleHaptics: () =>
        set((state) => ({
          settings: { ...state.settings, isHapticsEnabled: !state.settings.isHapticsEnabled },
        })),

      // ===================
      // HIGH SCORES
      // ===================
      highScores: defaultHighScores,

      getHighScore: (mode, difficulty) => {
        const key = createHighScoreKey(mode, difficulty);
        return get().highScores[key] ?? null;
      },

      setHighScore: (mode, difficulty, time) =>
        set((state) => {
          const key = createHighScoreKey(mode, difficulty);
          const currentBest = state.highScores[key];

          if (currentBest === undefined || time < currentBest) {
            return {
              highScores: { ...state.highScores, [key]: time },
            };
          }
          return state;
        }),

      // ===================
      // STATS
      // ===================
      stats: defaultStats,

      incrementGamesPlayed: () =>
        set((state) => ({
          stats: {
            ...state.stats,
            totalGamesPlayed: state.stats.totalGamesPlayed + 1,
          },
        })),

      addPlayTime: (ms) =>
        set((state) => ({
          stats: {
            ...state.stats,
            totalPlayTime: state.stats.totalPlayTime + ms,
          },
        })),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toISOString();
          const { lastPlayedDate, currentStreak, longestStreak } = state.stats;

          if (!lastPlayedDate) {
            return {
              stats: {
                ...state.stats,
                currentStreak: 1,
                longestStreak: 1,
                lastPlayedDate: today,
              },
            };
          }

          if (isSameDay(lastPlayedDate, today)) {
            return state;
          }

          if (isConsecutiveDay(lastPlayedDate, today)) {
            const newStreak = currentStreak + 1;
            return {
              stats: {
                ...state.stats,
                currentStreak: newStreak,
                longestStreak: Math.max(newStreak, longestStreak),
                lastPlayedDate: today,
              },
            };
          }

          return {
            stats: {
              ...state.stats,
              currentStreak: 1,
              lastPlayedDate: today,
            },
          };
        }),

      // ===================
      // TUTORIAL
      // ===================
      hasSeenTutorial: false,

      setHasSeenTutorial: (seen) => set({ hasSeenTutorial: seen }),

      // ===================
      // GAME HISTORY
      // ===================
      gameHistory: [],

      addGameHistory: (entry) =>
        set((state) => ({
          gameHistory: [
            { ...entry, id: generateId() },
            ...state.gameHistory.slice(0, 99), // Keep last 100
          ],
        })),

      clearGameHistory: () => set({ gameHistory: [] }),

      // ===================
      // ACHIEVEMENTS
      // ===================
      achievements: defaultAchievements,

      unlockAchievement: (id) =>
        set((state) => {
          if (state.achievements[id]?.unlocked) return state;
          return {
            achievements: {
              ...state.achievements,
              [id]: {
                ...state.achievements[id],
                unlocked: true,
                unlockedAt: new Date().toISOString(),
              },
            },
          };
        }),

      updateAchievementProgress: (id, progress) =>
        set((state) => {
          const achievement = state.achievements[id];
          if (!achievement || achievement.unlocked) return state;

          const newProgress = Math.min(progress, achievement.maxProgress || progress);
          const shouldUnlock = achievement.maxProgress && newProgress >= achievement.maxProgress;

          return {
            achievements: {
              ...state.achievements,
              [id]: {
                ...achievement,
                progress: newProgress,
                unlocked: shouldUnlock || achievement.unlocked,
                unlockedAt: shouldUnlock ? new Date().toISOString() : achievement.unlockedAt,
              },
            },
          };
        }),

      getAchievement: (id) => get().achievements[id],

      // ===================
      // MODE STATS
      // ===================
      modeStats: {},

      updateModeStats: (mode, difficulty, time, isPerfect) =>
        set((state) => {
          const key = createHighScoreKey(mode, difficulty);
          const current = state.modeStats[key] || { gamesPlayed: 0, totalTime: 0, perfectGames: 0 };

          return {
            modeStats: {
              ...state.modeStats,
              [key]: {
                gamesPlayed: current.gamesPlayed + 1,
                totalTime: current.totalTime + time,
                perfectGames: isPerfect ? current.perfectGames + 1 : current.perfectGames,
              },
            },
          };
        }),

      // ===================
      // PLAY LIMIT (Reward Ads)
      // ===================
      playLimit: defaultPlayLimit,

      resetPlayLimitIfNewDay: () =>
        set((state) => {
          const today = getTodayDateString();
          if (state.playLimit.date !== today) {
            return {
              playLimit: {
                date: today,
                playsRemaining: PLAY_LIMIT_CONFIG.DAILY_FREE_PLAYS,
                totalPlaysToday: 0,
                adsWatchedToday: 0,
              },
            };
          }
          return state;
        }),

      canPlay: () => {
        const state = get();
        const today = getTodayDateString();
        // If it's a new day, reset and return true
        if (state.playLimit.date !== today) {
          return true;
        }
        return state.playLimit.playsRemaining > 0;
      },

      consumePlay: () => {
        const state = get();
        const today = getTodayDateString();

        // Reset if new day
        if (state.playLimit.date !== today) {
          set({
            playLimit: {
              date: today,
              playsRemaining: PLAY_LIMIT_CONFIG.DAILY_FREE_PLAYS - 1,
              totalPlaysToday: 1,
              adsWatchedToday: 0,
            },
          });
          return true;
        }

        if (state.playLimit.playsRemaining <= 0) {
          return false;
        }

        set({
          playLimit: {
            ...state.playLimit,
            playsRemaining: state.playLimit.playsRemaining - 1,
            totalPlaysToday: state.playLimit.totalPlaysToday + 1,
          },
        });
        return true;
      },

      addBonusPlays: () =>
        set((state) => {
          const today = getTodayDateString();
          // Reset if new day
          if (state.playLimit.date !== today) {
            return {
              playLimit: {
                date: today,
                playsRemaining: PLAY_LIMIT_CONFIG.DAILY_FREE_PLAYS + PLAY_LIMIT_CONFIG.REWARD_BONUS_PLAYS,
                totalPlaysToday: 0,
                adsWatchedToday: 1,
              },
            };
          }
          return {
            playLimit: {
              ...state.playLimit,
              playsRemaining: state.playLimit.playsRemaining + PLAY_LIMIT_CONFIG.REWARD_BONUS_PLAYS,
              adsWatchedToday: state.playLimit.adsWatchedToday + 1,
            },
          };
        }),

      getPlaysRemaining: () => {
        const state = get();
        const today = getTodayDateString();
        if (state.playLimit.date !== today) {
          return PLAY_LIMIT_CONFIG.DAILY_FREE_PLAYS;
        }
        return state.playLimit.playsRemaining;
      },

      // ===================
      // HYDRATION
      // ===================
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "mojic-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Hook to wait for hydration
export const useStoreHydration = () => {
  return useStore((state) => state._hasHydrated);
};
