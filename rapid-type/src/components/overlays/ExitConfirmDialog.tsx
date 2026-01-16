/**
 * Exit Confirm Dialog - Mojic
 * Confirmation dialog when user tries to quit during game (simplified without reanimated)
 */

import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from "../../constants";
import { t } from "../../i18n";

interface ExitConfirmDialogProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ExitConfirmDialog = ({
  isVisible,
  onConfirm,
  onCancel,
}: ExitConfirmDialogProps) => {
  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Text style={styles.icon}>⚠️</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {t("exitConfirm.title")}
        </Text>

        {/* Message */}
        <Text style={styles.message}>
          {t("exitConfirm.message")}
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>
              {t("exitConfirm.cancel")}
            </Text>
          </Pressable>

          <Pressable onPress={onConfirm} style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>
              {t("exitConfirm.confirm")}
            </Text>
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
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  dialog: {
    backgroundColor: Colors.background.paper,
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 32,
    maxWidth: 320,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.semantic.warning + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: Colors.text.primary,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    color: Colors.text.muted,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background.panel,
    borderWidth: 1,
    borderColor: Colors.border.ui,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.semantic.error,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default ExitConfirmDialog;
