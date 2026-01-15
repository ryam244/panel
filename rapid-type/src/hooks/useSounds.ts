/**
 * useSounds Hook - Mojic
 * Convenient hook for playing sounds in React components
 */

import { useCallback, useEffect, useMemo } from "react";
import { useStore } from "../store";
import { SoundManager, SoundType, createSoundPlayer } from "../lib/sounds";

/**
 * Hook for playing sounds with automatic settings integration
 * Automatically respects user's sound preferences from the store
 *
 * Usage:
 * const sounds = useSounds();
 * sounds.playCorrect();
 * sounds.play('miss');
 */
export function useSounds() {
  const isSoundEnabled = useStore((state) => state.settings.isSoundEnabled);

  // Initialize audio on first use
  useEffect(() => {
    SoundManager.initialize();
  }, []);

  // Create sound player with current settings
  const player = useMemo(
    () => createSoundPlayer(isSoundEnabled),
    [isSoundEnabled]
  );

  // Wrapped play function for manual control
  const play = useCallback(
    (type: SoundType) => {
      SoundManager.play(type, isSoundEnabled);
    },
    [isSoundEnabled]
  );

  return {
    play,
    playCorrect: player.playCorrect,
    playMiss: player.playMiss,
    playCountdown: player.playCountdown,
    playGameStart: player.playGameStart,
    playGameClear: player.playGameClear,
    playNewRecord: player.playNewRecord,
    playButtonTap: player.playButtonTap,
    // Direct access to manager
    preload: SoundManager.preload,
    unload: SoundManager.unload,
    // Settings
    isEnabled: isSoundEnabled,
  };
}

export default useSounds;
