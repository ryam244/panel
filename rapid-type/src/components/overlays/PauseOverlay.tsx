/**
 * Pause Overlay - Mojic
 * Displayed when game is paused
 */

import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from "../../constants";
import { t } from "../../i18n";

interface PauseOverlayProps {
  isVisible: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  currentTime: string;
  progress: { current: number; total: number };
}

export const PauseOverlay = ({
  isVisible,
  onResume,
  onRestart,
  onQuit,
  currentTime,
  progress,
}: PauseOverlayProps) => {
  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Pause Card */}
        <View style={styles.card}>
          {/* Title */}
          <Text style={styles.title}>{t("pause.title")}</Text>
          <Text style={styles.subtitle}>{t("pause.subtitle")}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>{t("pause.time")}</Text>
              <Text style={styles.statValue}>{currentTime}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>{t("pause.progress")}</Text>
              <Text style={styles.statValue}>
                {progress.current}/{progress.total}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <Pressable onPress={onResume} style={styles.resumeButton}>
            <Text style={styles.resumeButtonText}>{t("pause.resume")}</Text>
          </Pressable>

          <Pressable onPress={onRestart} style={styles.restartButton}>
            <Text style={styles.restartButtonText}>{t("pause.restart")}</Text>
          </Pressable>

          <Pressable onPress={onQuit} style={styles.quitButton}>
            <Text style={styles.quitButtonText}>{t("pause.quit")}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay.backdrop,
    zIndex: 50,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 24,
    padding: 32,
    backgroundColor: Colors.background.paper,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 8,
    color: Colors.text.primary,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 32,
    color: Colors.text.muted,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.background.panel,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
    color: Colors.text.muted,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.text.primary,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border.light,
  },
  resumeButton: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: Colors.primary.default,
    shadowColor: Colors.primary.default,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  resumeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  restartButton: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: Colors.background.panel,
    borderWidth: 1,
    borderColor: Colors.border.ui,
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text.primary,
  },
  quitButton: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  quitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.semantic.error,
  },
});

export default PauseOverlay;
