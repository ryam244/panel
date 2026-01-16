/**
 * ShakeTile - Simple tile component (animations removed for Expo Go compatibility)
 */

import { StyleSheet, Text, Pressable, View } from "react-native";
import { Colors, TextStyles, BorderRadius } from "../../constants";
import type { Tile } from "../../types";

interface ShakeTileProps {
  tile: Tile;
  isTarget: boolean;
  onPress: (tile: Tile) => void;
  size: number;
  disabled?: boolean;
  hasError?: boolean;
  isCorrect?: boolean;
  isDarkMode?: boolean;
  mode?: "numbers" | "alphabet" | "sentence";
}

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
  if (tile.isCleared) {
    return <View style={[styles.clearedTile, { width: size, height: size }]} />;
  }

  const isSentenceMode = mode === "sentence";
  const textStyle = isSentenceMode
    ? TextStyles.japaneseChar
    : TextStyles.tileNumber;

  const backgroundColor = hasError
    ? Colors.panel.error
    : isDarkMode
      ? "rgba(255, 255, 255, 0.08)"
      : Colors.panel.default;

  const borderColor = hasError
    ? Colors.border.error
    : isDarkMode
      ? "rgba(255, 255, 255, 0.15)"
      : Colors.border.default;

  const textColor = hasError
    ? Colors.neutral.white
    : isDarkMode
      ? Colors.text.dark
      : Colors.text.primary;

  return (
    <Pressable
      onPress={() => onPress(tile)}
      disabled={disabled || tile.isCleared}
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          backgroundColor,
          borderColor,
        },
        isDarkMode && styles.tileDark,
        isCorrect && styles.tileCorrect,
      ]}
    >
      <Text style={[textStyle, { color: textColor }]}>
        {tile.value}
      </Text>
    </Pressable>
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
    shadowColor: Colors.neumorphic.light.shadowDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tileDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: Colors.neumorphic.dark.shadowDark,
  },
  tileCorrect: {
    transform: [{ scale: 1.05 }],
  },
  clearedTile: {
    borderRadius: BorderRadius.tile,
    backgroundColor: "transparent",
  },
});

export default ShakeTile;
