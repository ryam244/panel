/**
 * Exit Confirm Dialog - Mojic
 * Confirmation dialog when user tries to quit during game
 */

import { View, Text, Pressable } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
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
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(100)}
      className="absolute inset-0 z-50 items-center justify-center"
      style={{ backgroundColor: Colors.overlay.backdrop }}
    >
      <Animated.View
        entering={ZoomIn.duration(200).springify().damping(12)}
        exiting={ZoomOut.duration(150)}
        className="mx-8 w-full max-w-xs rounded-2xl p-6"
        style={{
          backgroundColor: Colors.background.paper,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        {/* Icon */}
        <View className="items-center mb-4">
          <View
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: Colors.semantic.warning + "20" }}
          >
            <Text style={{ fontSize: 32 }}>⚠️</Text>
          </View>
        </View>

        {/* Title */}
        <Text
          className="text-center text-xl font-bold mb-2"
          style={{ color: Colors.text.primary }}
        >
          {t("exitConfirm.title")}
        </Text>

        {/* Message */}
        <Text
          className="text-center text-sm mb-6"
          style={{ color: Colors.text.muted }}
        >
          {t("exitConfirm.message")}
        </Text>

        {/* Buttons */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={onCancel}
            className="flex-1 h-12 rounded-xl items-center justify-center"
            style={{
              backgroundColor: Colors.background.panel,
              borderWidth: 1,
              borderColor: Colors.border.ui,
            }}
          >
            <Text
              className="font-bold"
              style={{ color: Colors.text.primary }}
            >
              {t("exitConfirm.cancel")}
            </Text>
          </Pressable>

          <Pressable
            onPress={onConfirm}
            className="flex-1 h-12 rounded-xl items-center justify-center"
            style={{
              backgroundColor: Colors.semantic.error,
            }}
          >
            <Text className="text-white font-bold">
              {t("exitConfirm.confirm")}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default ExitConfirmDialog;
