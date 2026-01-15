/**
 * Sound Manager - Mojic
 * Placeholder sound system with expo-av
 * Ready to swap with real sound files later
 */

import { Audio } from "expo-av";

// Sound types used in the app
export type SoundType =
  | "correct"      // Correct tap
  | "miss"         // Wrong tap / mistake
  | "countdown"    // Countdown tick (3, 2, 1)
  | "gameStart"    // Game starts
  | "gameClear"    // Game completed
  | "newRecord"    // New high score
  | "buttonTap";   // UI button tap

// Sound configuration
interface SoundConfig {
  volume: number;
  // Add URL when real sounds are available
  // url?: string;
}

const soundConfigs: Record<SoundType, SoundConfig> = {
  correct: { volume: 0.5 },
  miss: { volume: 0.6 },
  countdown: { volume: 0.4 },
  gameStart: { volume: 0.5 },
  gameClear: { volume: 0.7 },
  newRecord: { volume: 0.8 },
  buttonTap: { volume: 0.3 },
};

// Loaded sound objects cache
const loadedSounds: Map<SoundType, Audio.Sound> = new Map();

// Flag to track if audio is initialized
let isInitialized = false;

/**
 * Initialize audio system
 * Call this once when app starts
 */
export async function initializeAudio(): Promise<void> {
  if (isInitialized) return;

  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    isInitialized = true;
  } catch (error) {
    console.warn("Failed to initialize audio:", error);
  }
}

/**
 * Generate a simple tone using oscillator-like approach
 * This is a placeholder - replace with actual sound files
 */
async function generatePlaceholderSound(
  type: SoundType
): Promise<Audio.Sound | null> {
  // For now, we'll use a simple approach
  // In a real app, you would load actual sound files here

  // Placeholder: Return null to indicate no sound file yet
  // The playSound function will handle this gracefully
  return null;
}

/**
 * Load a sound for a given type
 * Replace the generatePlaceholderSound with actual file loading when ready
 */
async function loadSound(type: SoundType): Promise<Audio.Sound | null> {
  if (loadedSounds.has(type)) {
    return loadedSounds.get(type)!;
  }

  try {
    // TODO: Replace with actual sound file loading
    // Example:
    // const { sound } = await Audio.Sound.createAsync(
    //   require('../assets/sounds/correct.mp3'),
    //   { volume: soundConfigs[type].volume }
    // );

    const sound = await generatePlaceholderSound(type);
    if (sound) {
      loadedSounds.set(type, sound);
    }
    return sound;
  } catch (error) {
    console.warn(`Failed to load sound: ${type}`, error);
    return null;
  }
}

/**
 * Play a sound
 * @param type - Type of sound to play
 * @param enabled - Whether sound is enabled (from user settings)
 */
export async function playSound(
  type: SoundType,
  enabled: boolean = true
): Promise<void> {
  if (!enabled) return;

  if (!isInitialized) {
    await initializeAudio();
  }

  try {
    const sound = await loadSound(type);
    if (sound) {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    }
    // If no sound loaded (placeholder mode), fail silently
  } catch (error) {
    // Fail silently - sound is not critical
    console.warn(`Failed to play sound: ${type}`, error);
  }
}

/**
 * Preload all sounds for better performance
 * Call this during app initialization or before game starts
 */
export async function preloadSounds(): Promise<void> {
  if (!isInitialized) {
    await initializeAudio();
  }

  const types: SoundType[] = [
    "correct",
    "miss",
    "countdown",
    "gameStart",
    "gameClear",
    "newRecord",
    "buttonTap",
  ];

  await Promise.all(types.map((type) => loadSound(type)));
}

/**
 * Unload all sounds to free memory
 * Call this when sound settings are disabled or app is backgrounded
 */
export async function unloadSounds(): Promise<void> {
  const unloadPromises: Promise<unknown>[] = [];

  loadedSounds.forEach((sound) => {
    unloadPromises.push(sound.unloadAsync());
  });

  await Promise.all(unloadPromises);
  loadedSounds.clear();
}

/**
 * Sound hook for convenient use in components
 * Usage: const { play } = useSounds();
 *        play('correct');
 */
export function createSoundPlayer(isSoundEnabled: boolean) {
  return {
    play: (type: SoundType) => playSound(type, isSoundEnabled),
    playCorrect: () => playSound("correct", isSoundEnabled),
    playMiss: () => playSound("miss", isSoundEnabled),
    playCountdown: () => playSound("countdown", isSoundEnabled),
    playGameStart: () => playSound("gameStart", isSoundEnabled),
    playGameClear: () => playSound("gameClear", isSoundEnabled),
    playNewRecord: () => playSound("newRecord", isSoundEnabled),
    playButtonTap: () => playSound("buttonTap", isSoundEnabled),
  };
}

// Convenience exports for direct usage
export const SoundManager = {
  initialize: initializeAudio,
  preload: preloadSounds,
  unload: unloadSounds,
  play: playSound,
  createPlayer: createSoundPlayer,
};

export default SoundManager;
