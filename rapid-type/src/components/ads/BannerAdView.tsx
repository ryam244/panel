/**
 * BannerAdView - Mojic
 * Displays a banner ad at the bottom of screens
 * Uses a placeholder in test mode for easier development
 */

import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants";

// Test mode flag - set to false for production
const IS_TEST_MODE = true;

interface BannerAdViewProps {
  size?: "banner" | "large" | "medium" | "adaptive";
  onError?: (error: Error) => void;
}

export const BannerAdView = ({
  size = "banner",
  onError,
}: BannerAdViewProps) => {
  // In test mode, show a placeholder
  // In production, this would render the actual BannerAd component
  const height = {
    banner: 50,
    large: 100,
    medium: 250,
    adaptive: 60,
  }[size];

  if (IS_TEST_MODE) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={[styles.placeholder, { height: height - 10 }]}>
          <Text style={styles.placeholderText}>AD PLACEHOLDER</Text>
          <Text style={styles.testLabel}>Test Mode</Text>
        </View>
      </View>
    );
  }

  // Production ad code would go here
  // For now, show nothing in non-test mode until real ads are configured
  return null;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background.panel,
    borderTopWidth: 1,
    borderTopColor: Colors.border.ui,
    paddingVertical: 5,
  },
  placeholder: {
    width: "90%",
    backgroundColor: Colors.text.muted + "20",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.ui,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: Colors.text.muted,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
  testLabel: {
    color: Colors.text.muted,
    fontSize: 9,
    marginTop: 2,
  },
});

export default BannerAdView;
