/**
 * useHaptics - Haptic feedback hook
 */

import { useCallback } from "react";
import * as Haptics from "expo-haptics";
import { useStore } from "../store";

export function useHaptics() {
  const isHapticsEnabled = useStore((state) => state.settings.isHapticsEnabled);

  const impact = useCallback(
    (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
      if (isHapticsEnabled) {
        Haptics.impactAsync(style);
      }
    },
    [isHapticsEnabled]
  );

  const notification = useCallback(
    (type: Haptics.NotificationFeedbackType) => {
      if (isHapticsEnabled) {
        Haptics.notificationAsync(type);
      }
    },
    [isHapticsEnabled]
  );

  const selection = useCallback(() => {
    if (isHapticsEnabled) {
      Haptics.selectionAsync();
    }
  }, [isHapticsEnabled]);

  // Semantic methods
  const tapCorrect = useCallback(() => {
    impact(Haptics.ImpactFeedbackStyle.Light);
  }, [impact]);

  const tapWrong = useCallback(() => {
    notification(Haptics.NotificationFeedbackType.Error);
  }, [notification]);

  const levelClear = useCallback(() => {
    notification(Haptics.NotificationFeedbackType.Success);
  }, [notification]);

  const countdownTick = useCallback(() => {
    selection();
  }, [selection]);

  return {
    impact,
    notification,
    selection,
    tapCorrect,
    tapWrong,
    levelClear,
    countdownTick,
  };
}
