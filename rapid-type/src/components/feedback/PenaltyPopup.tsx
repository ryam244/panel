/**
 * PenaltyPopup - Floating penalty time display
 * Shows "+1.0s" floating at tap position on mistake (simplified without reanimated)
 */

import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect, useRef } from "react";
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
  const [showPopup, setShowPopup] = useState(false);
  const prevVisibleRef = useRef(isVisible);

  useEffect(() => {
    // Only show when isVisible changes from false to true
    if (isVisible && !prevVisibleRef.current) {
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
        onComplete?.();
      }, 800);
      return () => clearTimeout(timer);
    }
    prevVisibleRef.current = isVisible;
  }, [isVisible, onComplete]);

  if (!showPopup) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: position.x - 40,
          top: position.y - 20,
        },
      ]}
    >
      <View style={styles.bubble}>
        <Text style={styles.text}>+{penaltyTime.toFixed(1)}s</Text>
      </View>
    </View>
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
