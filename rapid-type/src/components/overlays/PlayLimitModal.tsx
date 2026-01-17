/**
 * Play Limit Modal - Mojic
 * Shown when user has exhausted daily plays
 * Offers option to watch rewarded ad for bonus plays
 */

import { useState } from "react";
import { View, Text, Pressable, Modal, ActivityIndicator } from "react-native";
import { useStore, PLAY_LIMIT_CONFIG } from "../../store";
import { useAds } from "../../hooks";
import { Colors } from "../../constants";
import { t } from "../../i18n";

interface PlayLimitModalProps {
  visible: boolean;
  onClose: () => void;
  onPlaysAdded?: () => void;
  isDarkMode: boolean;
}

export function PlayLimitModal({
  visible,
  onClose,
  onPlaysAdded,
  isDarkMode,
}: PlayLimitModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const addBonusPlays = useStore((state) => state.addBonusPlays);
  const getPlaysRemaining = useStore((state) => state.getPlaysRemaining);
  const { showRewarded, rewardedReady } = useAds();

  const handleWatchAd = async () => {
    setIsLoading(true);

    const adShown = await showRewarded(() => {
      // Reward callback - add bonus plays
      addBonusPlays();
    });

    setIsLoading(false);

    if (adShown) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        onPlaysAdded?.();
      }, 1500);
    }
  };

  const bonusPlays = PLAY_LIMIT_CONFIG.REWARD_BONUS_PLAYS;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: isDarkMode
              ? Colors.background.darkPanel
              : Colors.background.panel,
            borderRadius: 24,
            padding: 32,
            width: "100%",
            maxWidth: 340,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 10,
          }}
        >
          {showSuccess ? (
            // Success state
            <>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: Colors.semantic.success + "20",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text style={{ fontSize: 40 }}>🎉</Text>
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "800",
                  color: isDarkMode ? Colors.text.dark : Colors.text.primary,
                  marginBottom: 8,
                }}
              >
                {t("playLimit.thankYou")}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.semantic.success,
                  fontWeight: "600",
                }}
              >
                {t("playLimit.playsAdded").replace("{{count}}", String(bonusPlays))}
              </Text>
            </>
          ) : (
            // Default state
            <>
              {/* Icon */}
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: Colors.primary.default + "20",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text style={{ fontSize: 40 }}>🎮</Text>
              </View>

              {/* Title */}
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "800",
                  color: isDarkMode ? Colors.text.dark : Colors.text.primary,
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                {t("playLimit.exhausted")}
              </Text>

              {/* Subtitle */}
              <Text
                style={{
                  fontSize: 14,
                  color: isDarkMode
                    ? Colors.text.darkSecondary
                    : Colors.text.secondary,
                  textAlign: "center",
                  marginBottom: 28,
                  lineHeight: 20,
                }}
              >
                {t("playLimit.watchAdDesc").replace("{{count}}", String(bonusPlays))}
              </Text>

              {/* Watch Ad Button */}
              <Pressable
                onPress={handleWatchAd}
                disabled={isLoading || !rewardedReady}
                style={{
                  width: "100%",
                  backgroundColor: rewardedReady
                    ? Colors.primary.default
                    : Colors.text.muted,
                  height: 56,
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "700",
                      }}
                    >
                      {t("playLimit.loading")}
                    </Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ fontSize: 20 }}>📺</Text>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "700",
                      }}
                    >
                      {t("playLimit.watchButton").replace("{{count}}", String(bonusPlays))}
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Close Button */}
              <Pressable
                onPress={onClose}
                style={{
                  width: "100%",
                  height: 48,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : Colors.border.ui,
                }}
              >
                <Text
                  style={{
                    color: isDarkMode
                      ? Colors.text.darkSecondary
                      : Colors.text.secondary,
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  {t("playLimit.comeBackTomorrow")}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default PlayLimitModal;
