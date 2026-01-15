/**
 * ShakeTile - Animated tile with shake effect on error
 * Includes brick-red color change and horizontal shake
 */

import { StyleSheet, Text, Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  useSharedValue,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Colors, TextStyles, BorderRadius } from "../../constants";
import type { Tile } from "../../types";

interface ShakeTileProps {
  tile: Tile;
  isTarget: boolean;
  onPress: (tile: Tile) => void;
  size: number;
  disabled?: boolean;
  hasError?: boolean;      // Trigger error animation
  isCorrect?: boolean;     // Trigger correct animation
  isDarkMode?: boolean;
  mode?: "numbers" | "alphabet" | "sentence";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ShakeTile = ({
  tile,
  isTarget,
  onPress,
  size,
  disabled = false,
  hasError = false,
  isCorrect = false,
  isDarkMode = false,
  mode = "numbers",
}: ShakeTileProps) => {
  const shakeX = useSharedValue(0);
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(0);
  const correctPulse = useSharedValue(0);

  // Error shake animation
  useEffect(() => {
    if (hasError) {
      // Horizontal shake
      shakeX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(-4, { duration: 50 }),
        withTiming(4, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );

      // Color flash to brick red
      colorProgress.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, {
          duration: 600,
          easing: Easing.out(Easing.quad),
        })
      );
    }
  }, [hasError]);

  // Correct pulse animation
  useEffect(() => {
    if (isCorrect) {
      correctPulse.value = withSequence(
        withSpring(1.08, { damping: 8, stiffness: 400 }),
        withSpring(1, { damping: 12, stiffness: 200 })
      );
    }
  }, [isCorrect]);

  const animatedStyle = useAnimatedStyle(() => {
    const errorBg = Colors.panel.error;
    const normalBg = isDarkMode
      ? "rgba(255, 255, 255, 0.08)"
      : Colors.panel.default;

    return {
      transform: [
        { translateX: shakeX.value },
        { scale: correctPulse.value > 1 ? correctPulse.value : scale.value },
      ],
      backgroundColor: colorProgress.value > 0
        ? errorBg
        : normalBg,
      borderColor: colorProgress.value > 0
        ? Colors.border.error
        : (isDarkMode ? "rgba(255, 255, 255, 0.15)" : Colors.border.default),
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      color: colorProgress.value > 0.5
        ? Colors.neutral.white
        : (isDarkMode ? Colors.text.dark : Colors.text.primary),
    };
  });

  if (tile.isCleared) {
    return <View style={[styles.clearedTile, { width: size, height: size }]} />;
  }

  const isSentenceMode = mode === "sentence";
  const textStyle = isSentenceMode
    ? TextStyles.japaneseChar
    : TextStyles.tileNumber;

  return (
    <AnimatedPressable
      onPress={() => onPress(tile)}
      disabled={disabled || tile.isCleared}
      style={[
        styles.tile,
        {
          width: size,
          height: size,
        },
        isDarkMode && styles.tileDark,
        animatedStyle,
      ]}
    >
      <Animated.Text style={[textStyle, textAnimatedStyle]}>
        {tile.value}
      </Animated.Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    borderRadius: BorderRadius.tile,
    borderWidth: 2,
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.panel.default,
    // Neumorphic shadow (light mode)
    shadowColor: Colors.neumorphic.light.shadowDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tileDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.15)",
    // Neumorphic shadow (dark mode)
    shadowColor: Colors.neumorphic.dark.shadowDark,
  },
  clearedTile: {
    borderRadius: BorderRadius.tile,
    backgroundColor: "transparent",
  },
});

export default ShakeTile;
