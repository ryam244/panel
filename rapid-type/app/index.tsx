/**
 * Home Screen - Mojic
 * Main entry point with game mode cards and navigation
 */

import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useStore, PLAY_LIMIT_CONFIG } from "../src/store";
import { useSounds } from "../src/hooks";
import { Colors, ModeInfo, DifficultyInfo } from "../src/constants";
import { t, isJapanese } from "../src/i18n";
import { PlayLimitModal } from "../src/components/overlays";
import type { GameMode, Difficulty } from "../src/types";

// Icon component
const ModeIcon = ({ mode, isSelected }: { mode: GameMode; isSelected: boolean }) => {
  const icons: Record<GameMode, string> = {
    NUMBERS: "123",
    ALPHABET: "ABC",
    SENTENCE: "文",
    FIND_NUMBER: "🔍",
    FLASH: "⚡",
  };

  return (
    <Text
      style={{
        fontSize: 18,
        fontWeight: "800",
        color: isSelected ? "#fff" : Colors.primary.default,
      }}
    >
      {icons[mode]}
    </Text>
  );
};

// Mode Card Component
const ModeCard = ({
  mode,
  isSelected,
  onPress,
}: {
  mode: GameMode;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const info = ModeInfo[mode];
  const isDarkMode = useStore((state) => state.settings.isDarkMode);

  // Get localized mode name
  const modeNames: Record<GameMode, string> = {
    NUMBERS: t("modes.numbers"),
    ALPHABET: t("modes.alphabet"),
    SENTENCE: t("modes.sentence"),
    FIND_NUMBER: t("modes.findNumber"),
    FLASH: t("modes.flash"),
  };

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        borderRadius: 16,
        backgroundColor: isSelected
          ? Colors.primary.default + "20"
          : isDarkMode
            ? "rgba(255, 255, 255, 0.05)"
            : Colors.background.panel,
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected
          ? Colors.primary.default
          : isDarkMode
            ? "rgba(255, 255, 255, 0.1)"
            : Colors.border.primary,
        shadowColor: isSelected ? Colors.primary.default : "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isSelected ? 0.2 : 0.05,
        shadowRadius: 4,
        elevation: isSelected ? 4 : 1,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isSelected
              ? Colors.primary.default
              : isDarkMode
                ? "rgba(255, 255, 255, 0.1)"
                : "#fff",
          }}
        >
          <ModeIcon mode={mode} isSelected={isSelected} />
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: isDarkMode ? Colors.text.dark : Colors.text.primary,
          }}
        >
          {modeNames[mode]}
        </Text>
      </View>

      {isSelected ? (
        <View
          style={{
            backgroundColor: Colors.primary.default,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: "#fff",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {t("home.active")}
          </Text>
        </View>
      ) : (
        <Text
          style={{
            fontSize: 24,
            color: isDarkMode ? "rgba(255,255,255,0.3)" : Colors.text.muted,
          }}
        >
          {">"}
        </Text>
      )}
    </Pressable>
  );
};

// Difficulty Button Component
const DifficultyButton = ({
  difficulty,
  isSelected,
  onPress,
}: {
  difficulty: Difficulty;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const isDarkMode = useStore((state) => state.settings.isDarkMode);

  // Get localized difficulty name
  const diffNames: Record<Difficulty, string> = {
    EASY: t("difficulty.easy"),
    NORMAL: t("difficulty.normal"),
    HARD: t("difficulty.hard"),
  };

  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isSelected
          ? Colors.primary.default
          : isDarkMode
            ? "rgba(255, 255, 255, 0.05)"
            : Colors.background.panel,
        borderWidth: isSelected ? 0 : 1,
        borderColor: isDarkMode
          ? "rgba(255, 255, 255, 0.1)"
          : Colors.border.ui,
      }}
    >
      <Text
        style={{
          fontWeight: "700",
          fontSize: 14,
          color: isSelected
            ? "#fff"
            : isDarkMode
              ? Colors.text.dark
              : Colors.text.primary,
        }}
      >
        {diffNames[difficulty]}
      </Text>
    </Pressable>
  );
};

// Dark Mode Toggle
const DarkModeToggle = () => {
  const isDarkMode = useStore((state) => state.settings.isDarkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);

  return (
    <Pressable
      onPress={toggleDarkMode}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: isDarkMode
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(255, 255, 255, 0.7)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: isDarkMode
          ? "rgba(255, 255, 255, 0.1)"
          : Colors.border.light,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "700",
          color: isDarkMode ? Colors.text.darkSecondary : Colors.text.secondary,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {t("home.darkMode")}
      </Text>
      <View
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          backgroundColor: isDarkMode
            ? Colors.primary.default
            : Colors.text.muted + "40",
          justifyContent: "center",
          paddingHorizontal: 2,
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: "#fff",
            alignSelf: isDarkMode ? "flex-end" : "flex-start",
          }}
        />
      </View>
    </Pressable>
  );
};

export default function HomeScreen() {
  const [selectedMode, setSelectedMode] = useState<GameMode>("NUMBERS");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("NORMAL");
  const [showPlayLimitModal, setShowPlayLimitModal] = useState(false);

  const isDarkMode = useStore((state) => state.settings.isDarkMode);
  const canPlay = useStore((state) => state.canPlay);
  const consumePlay = useStore((state) => state.consumePlay);
  const getPlaysRemaining = useStore((state) => state.getPlaysRemaining);
  const resetPlayLimitIfNewDay = useStore((state) => state.resetPlayLimitIfNewDay);
  const sounds = useSounds();

  // Preload sounds on app start and reset play limit if new day
  useEffect(() => {
    sounds.preload();
    resetPlayLimitIfNewDay();
  }, []);

  // Get current plays remaining
  const playsRemaining = getPlaysRemaining();

  const handleStartGame = () => {
    sounds.playButtonTap();

    // Check if user can play
    if (!canPlay()) {
      setShowPlayLimitModal(true);
      return;
    }

    // Consume a play
    consumePlay();

    router.push({
      pathname: "/game/[mode]",
      params: {
        mode: selectedMode,
        difficulty: selectedDifficulty,
      },
    });
  };

  const handlePlaysAdded = () => {
    // After watching ad and getting bonus plays, user can now play
    // Modal will close automatically, user can tap start again
  };

  // MVP: Show 4 modes (including Find Number)
  const mvpModes: GameMode[] = ["NUMBERS", "ALPHABET", "SENTENCE", "FIND_NUMBER"];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? Colors.background.dark
          : Colors.background.light,
      }}
      edges={["top"]}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingHorizontal: 24,
          paddingTop: 16,
        }}
      >
        <DarkModeToggle />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={{ alignItems: "center", marginTop: 32, marginBottom: 40 }}>
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: Colors.primary.default,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              shadowColor: Colors.primary.default,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 36, fontWeight: "900" }}>
              M
            </Text>
          </View>
          <Text
            style={{
              fontSize: 48,
              fontWeight: "900",
              letterSpacing: -1,
              color: isDarkMode ? Colors.text.dark : Colors.text.primary,
            }}
          >
            {t("app.name")}
          </Text>
          <Text
            style={{
              color: Colors.primary.default,
              fontWeight: "600",
              letterSpacing: 2,
              fontSize: 11,
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            {t("app.tagline")}
          </Text>
        </View>

        {/* Mode Selection */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 16,
              color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted,
            }}
          >
            {t("home.selectMode")}
          </Text>
          <View style={{ gap: 16 }}>
            {mvpModes.map((mode) => (
              <ModeCard
                key={mode}
                mode={mode}
                isSelected={selectedMode === mode}
                onPress={() => setSelectedMode(mode)}
              />
            ))}
          </View>
        </View>

        {/* Difficulty Selection */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 16,
              color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted,
            }}
          >
            {t("home.difficulty")}
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {(["EASY", "NORMAL", "HARD"] as Difficulty[]).map((diff) => (
              <DifficultyButton
                key={diff}
                difficulty={diff}
                isSelected={selectedDifficulty === diff}
                onPress={() => setSelectedDifficulty(diff)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        {/* Plays Remaining Indicator */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
            gap: 8,
          }}
        >
          <View
            style={{
              backgroundColor: isDarkMode
                ? "rgba(255, 255, 255, 0.1)"
                : Colors.primary.default + "15",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 14 }}>🎮</Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: playsRemaining > 0
                  ? (isDarkMode ? Colors.text.dark : Colors.primary.default)
                  : Colors.semantic.error,
              }}
            >
              {t("playLimit.remaining").replace("{{count}}", String(playsRemaining))}
            </Text>
          </View>
        </View>

        {/* Start Button */}
        <Pressable
          onPress={handleStartGame}
          style={{
            backgroundColor: playsRemaining > 0
              ? Colors.primary.default
              : Colors.text.muted,
            height: 60,
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            shadowColor: playsRemaining > 0 ? Colors.primary.default : "transparent",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: playsRemaining > 0 ? 8 : 0,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "800",
              letterSpacing: 1,
            }}
          >
            {playsRemaining > 0 ? t("home.startGame") : t("playLimit.watchAdTitle")}
          </Text>
        </Pressable>

        {/* Bottom Nav */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 32,
            marginTop: 24,
          }}
        >
          {[
            { icon: "📊", label: t("home.scores") },
            { icon: "⚙️", label: t("home.settings") },
            { icon: "🏆", label: t("home.awards") },
          ].map((item) => (
            <Pressable
              key={item.label}
              style={{ alignItems: "center", gap: 4 }}
              onPress={() => {
                if (item.label === t("home.settings")) {
                  router.push("/settings");
                } else if (item.label === t("home.scores")) {
                  router.push("/stats");
                } else if (item.label === t("home.awards")) {
                  router.push("/achievements");
                }
              }}
            >
              <View style={{ padding: 8, borderRadius: 20 }}>
                <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: isDarkMode
                    ? Colors.text.darkSecondary
                    : Colors.text.muted,
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Play Limit Modal */}
      <PlayLimitModal
        visible={showPlayLimitModal}
        onClose={() => setShowPlayLimitModal(false)}
        onPlaysAdded={handlePlaysAdded}
        isDarkMode={isDarkMode}
      />
    </SafeAreaView>
  );
}
