/**
 * AnimatedTimer - Timer with error flash effect
 * Shows time with visual feedback on mistakes (simplified without reanimated)
 */

import { StyleSheet, View, Text } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Colors, TextStyles } from "../../constants";

interface AnimatedTimerProps {
  timeMs: number;
  isRunning: boolean;
  hasError: boolean;       // Trigger error flash
  isDarkMode?: boolean;
  size?: "normal" | "large";
}

// Format time to MM:SS.ms
const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
};

export const AnimatedTimer = ({
  timeMs,
  isRunning,
  hasError,
  isDarkMode = false,
  size = "normal",
}: AnimatedTimerProps) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const prevErrorRef = useRef(hasError);

  useEffect(() => {
    // Only flash when hasError changes from false to true
    if (hasError && !prevErrorRef.current) {
      setIsFlashing(true);
      const timer = setTimeout(() => {
        setIsFlashing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    prevErrorRef.current = hasError;
  }, [hasError]);

  const isLarge = size === "large";
  const textColor = isFlashing
    ? Colors.timer.error
    : isDarkMode
    ? Colors.timer.defaultDark
    : Colors.timer.default;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.label,
            isDarkMode && styles.labelDark,
          ]}
        >
          TIME
        </Text>
      </View>
      <Text
        style={[
          isLarge ? styles.timeLarge : styles.time,
          { color: textColor },
          isFlashing && styles.flashScale,
        ]}
      >
        {formatTime(timeMs)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
  labelContainer: {
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: Colors.text.muted,
  },
  labelDark: {
    color: Colors.text.darkSecondary,
  },
  time: {
    ...TextStyles.timer,
    fontVariant: ["tabular-nums"],
  },
  timeLarge: {
    ...TextStyles.timerLarge,
    fontVariant: ["tabular-nums"],
  },
  flashScale: {
    transform: [{ scale: 1.05 }],
  },
});

export default AnimatedTimer;
