/**
 * AnimatedTimer - Timer with error flash effect
 * Flashes red briefly on mistake to provide instant feedback
 */

import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSequence,
  withTiming,
  useSharedValue,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
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
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    if (hasError) {
      // Flash red on error
      colorProgress.value = withSequence(
        withTiming(1, { duration: 50 }),
        withTiming(0, {
          duration: 400,
          easing: Easing.out(Easing.quad),
        })
      );
    }
  }, [hasError]);

  const animatedStyle = useAnimatedStyle(() => {
    const errorColor = Colors.timer.error;
    const normalColor = isDarkMode
      ? Colors.timer.defaultDark
      : Colors.timer.default;

    // Interpolate between normal and error color
    // Using opacity trick since interpolateColor needs worklet
    return {
      opacity: 1,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      color: colorProgress.value > 0.5
        ? Colors.timer.error
        : (isDarkMode ? Colors.timer.defaultDark : Colors.timer.default),
      transform: [
        {
          scale: colorProgress.value > 0.5
            ? 1.05
            : 1,
        },
      ],
    };
  });

  const isLarge = size === "large";

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
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
      <Animated.Text
        style={[
          isLarge ? styles.timeLarge : styles.time,
          textAnimatedStyle,
        ]}
      >
        {formatTime(timeMs)}
      </Animated.Text>
    </Animated.View>
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
});

export default AnimatedTimer;
