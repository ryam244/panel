/**
 * Pause Overlay - Mojic
 * Displayed when game is paused
 */

import { View, Text, Pressable } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
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
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      className="absolute inset-0 z-50"
      style={{ backgroundColor: Colors.overlay.backdrop }}
    >
      <Animated.View
        entering={SlideInUp.duration(300).springify().damping(15)}
        exiting={SlideOutUp.duration(200)}
        className="flex-1 items-center justify-center px-8"
      >
        {/* Pause Card */}
        <View
          className="w-full max-w-sm rounded-3xl p-8"
          style={{
            backgroundColor: Colors.background.paper,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Title */}
          <Text
            className="text-center text-3xl font-black mb-2"
            style={{ color: Colors.text.primary }}
          >
            {t("pause.title")}
          </Text>
          <Text
            className="text-center text-sm mb-8"
            style={{ color: Colors.text.muted }}
          >
            {t("pause.subtitle")}
          </Text>

          {/* Stats */}
          <View
            className="flex-row justify-around mb-8 py-4 rounded-xl"
            style={{ backgroundColor: Colors.background.panel }}
          >
            <View className="items-center">
              <Text
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: Colors.text.muted }}
              >
                {t("pause.time")}
              </Text>
              <Text
                className="text-xl font-black"
                style={{ color: Colors.text.primary }}
              >
                {currentTime}
              </Text>
            </View>
            <View
              className="w-px"
              style={{ backgroundColor: Colors.border.light }}
            />
            <View className="items-center">
              <Text
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: Colors.text.muted }}
              >
                {t("pause.progress")}
              </Text>
              <Text
                className="text-xl font-black"
                style={{ color: Colors.text.primary }}
              >
                {progress.current}/{progress.total}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <Pressable
            onPress={onResume}
            className="h-14 rounded-xl items-center justify-center mb-3"
            style={{
              backgroundColor: Colors.primary.default,
              shadowColor: Colors.primary.default,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white text-lg font-bold">
              {t("pause.resume")}
            </Text>
          </Pressable>

          <Pressable
            onPress={onRestart}
            className="h-14 rounded-xl items-center justify-center mb-3"
            style={{
              backgroundColor: Colors.background.panel,
              borderWidth: 1,
              borderColor: Colors.border.ui,
            }}
          >
            <Text
              className="text-lg font-bold"
              style={{ color: Colors.text.primary }}
            >
              {t("pause.restart")}
            </Text>
          </Pressable>

          <Pressable
            onPress={onQuit}
            className="h-14 rounded-xl items-center justify-center"
            style={{
              backgroundColor: "transparent",
            }}
          >
            <Text
              className="text-lg font-semibold"
              style={{ color: Colors.semantic.error }}
            >
              {t("pause.quit")}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default PauseOverlay;
