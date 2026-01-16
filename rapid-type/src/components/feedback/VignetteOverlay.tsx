/**
 * VignetteOverlay - Error feedback vignette effect
 * Shows a red overlay around the screen edges on mistake (simplified without reanimated)
 */

import { StyleSheet, View } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Colors } from "../../constants";

interface VignetteOverlayProps {
  isVisible: boolean;
}

export const VignetteOverlay = ({ isVisible }: VignetteOverlayProps) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const prevVisibleRef = useRef(isVisible);

  useEffect(() => {
    // Only show when isVisible changes from false to true
    if (isVisible && !prevVisibleRef.current) {
      setShowOverlay(true);
      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 400);
      return () => clearTimeout(timer);
    }
    prevVisibleRef.current = isVisible;
  }, [isVisible]);

  if (!showOverlay) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.container}>
      {/* Top vignette */}
      <View style={[styles.vignette, styles.top]} />
      {/* Bottom vignette */}
      <View style={[styles.vignette, styles.bottom]} />
      {/* Left vignette */}
      <View style={[styles.vignette, styles.left]} />
      {/* Right vignette */}
      <View style={[styles.vignette, styles.right]} />
    </View>
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
