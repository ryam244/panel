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
     
      style={{ backgroundColor: Colors.overlay.backdrop }}
    >
      <Animated.View
        entering={SlideInUp.duration(300).springify().damping(15)}
        exiting={SlideOutUp.duration(200)}
       
      >
        {/* Pause Card */}
        <View
         
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
           
            style={{ color: Colors.text.primary }}
          >
            {t("pause.title")}
          </Text>
          <Text
           
            style={{ color: Colors.text.muted }}
          >
            {t("pause.subtitle")}
          </Text>

          {/* Stats */}
          <View
           
            style={{ backgroundColor: Colors.background.panel }}
          >
            <View>
              <Text
               
                style={{ color: Colors.text.muted }}
              >
                {t("pause.time")}
              </Text>
              <Text
               
                style={{ color: Colors.text.primary }}
              >
                {currentTime}
              </Text>
            </View>
            <View
             
              style={{ backgroundColor: Colors.border.light }}
            />
            <View>
              <Text
               
                style={{ color: Colors.text.muted }}
              >
                {t("pause.progress")}
              </Text>
              <Text
               
                style={{ color: Colors.text.primary }}
              >
                {progress.current}/{progress.total}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <Pressable
            onPress={onResume}
           
            style={{
              backgroundColor: Colors.primary.default,
              shadowColor: Colors.primary.default,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text>
              {t("pause.resume")}
            </Text>
          </Pressable>

          <Pressable
            onPress={onRestart}
           
            style={{
              backgroundColor: Colors.background.panel,
              borderWidth: 1,
              borderColor: Colors.border.ui,
            }}
          >
            <Text
             
              style={{ color: Colors.text.primary }}
            >
              {t("pause.restart")}
            </Text>
          </Pressable>

          <Pressable
            onPress={onQuit}
           
            style={{
              backgroundColor: "transparent",
            }}
          >
            <Text
             
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
