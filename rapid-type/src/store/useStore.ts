/**
 * Zustand Store - Rapid Type
 * Global state management with MMKV persistence
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import type { AppStore, GameMode, Difficulty, UserSettings, UserStats, HighScores } from "../types";

// MMKV instance
const storage = new MMKV({ id: "rapid-type-store" });

// Custom storage adapter for Zustand
const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

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

// Helper to create high score key
const createHighScoreKey = (mode: GameMode, difficulty: Difficulty): string => {
  return `${mode}_${difficulty}`;
};

// Helper to check if same day
const isSameDay = (date1: string, date2: string): boolean => {
  return date1.slice(0, 10) === date2.slice(0, 10);
};

// Helper to check if consecutive day
const isConsecutiveDay = (lastDate: string, today: string): boolean => {
  const last = new Date(lastDate);
  const current = new Date(today);
  const diffTime = current.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
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

          // Only update if new time is better (lower)
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

          // First play ever
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

          // Same day - no change
          if (isSameDay(lastPlayedDate, today)) {
            return state;
          }

          // Consecutive day - increment streak
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

          // Streak broken - reset to 1
          return {
            stats: {
              ...state.stats,
              currentStreak: 1,
              lastPlayedDate: today,
            },
          };
        }),

      // ===================
      // HYDRATION
      // ===================
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "rapid-type-storage",
      storage: createJSONStorage(() => mmkvStorage),
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
