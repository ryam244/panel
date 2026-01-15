/**
 * VignetteOverlay - Error feedback vignette effect
 * Shows a red gradient around the screen edges on mistake
 */

import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { Colors } from "../../constants";

const { width, height } = Dimensions.get("window");

interface VignetteOverlayProps {
  isVisible: boolean;
}

export const VignetteOverlay = ({ isVisible }: VignetteOverlayProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSequence(
        withTiming(isVisible ? 1 : 0, {
          duration: 100,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(0, {
          duration: 400,
          easing: Easing.in(Easing.quad),
        })
      ),
    };
  }, [isVisible]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, animatedStyle]}
    >
      {/* Top vignette */}
      <Animated.View style={[styles.vignette, styles.top]} />
      {/* Bottom vignette */}
      <Animated.View style={[styles.vignette, styles.bottom]} />
      {/* Left vignette */}
      <Animated.View style={[styles.vignette, styles.left]} />
      {/* Right vignette */}
      <Animated.View style={[styles.vignette, styles.right]} />
    </Animated.View>
  );
};

const VIGNETTE_SIZE = 80;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  vignette: {
    position: "absolute",
    backgroundColor: Colors.overlay.errorVignetteStrong,
  },
  top: {
    top: 0,
    left: 0,
    right: 0,
    height: VIGNETTE_SIZE,
    // Gradient effect via opacity
    opacity: 0.8,
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: VIGNETTE_SIZE,
    opacity: 0.8,
  },
  left: {
    top: 0,
    bottom: 0,
    left: 0,
    width: VIGNETTE_SIZE,
    opacity: 0.6,
  },
  right: {
    top: 0,
    bottom: 0,
    right: 0,
    width: VIGNETTE_SIZE,
    opacity: 0.6,
  },
});

export default VignetteOverlay;
