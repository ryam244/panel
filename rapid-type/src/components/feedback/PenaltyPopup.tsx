/**
 * PenaltyPopup - Floating penalty time display
 * Shows "+1.0s" floating up from tap position on mistake
 */

import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Colors, TextStyles } from "../../constants";

interface PenaltyPopupProps {
  penaltyTime: number;        // Penalty in seconds (e.g., 1.0)
  position: { x: number; y: number }; // Tap position
  isVisible: boolean;
  onComplete?: () => void;
}

export const PenaltyPopup = ({
  penaltyTime,
  position,
  isVisible,
  onComplete,
}: PenaltyPopupProps) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    if (isVisible) {
      // Reset
      translateY.value = 0;
      opacity.value = 0;
      scale.value = 0.5;

      // Animate: fade in, float up, fade out
      opacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withDelay(
          400,
          withTiming(0, { duration: 300 }, (finished) => {
            if (finished && onComplete) {
              runOnJS(onComplete)();
            }
          })
        )
      );

      translateY.value = withTiming(-60, {
        duration: 800,
        easing: Easing.out(Easing.quad),
      });

      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 200,
      });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  if (!isVisible && opacity.value === 0) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: position.x - 40,
          top: position.y - 20,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.bubble}>
        <Text style={styles.text}>+{penaltyTime.toFixed(1)}s</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 200,
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  bubble: {
    backgroundColor: Colors.semantic.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: Colors.semantic.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    ...TextStyles.penalty,
    color: Colors.neutral.white,
    textAlign: "center",
  },
});

export default PenaltyPopup;
