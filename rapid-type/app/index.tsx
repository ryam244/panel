/**
 * Home Screen - Mojic
 * Main entry point with game mode cards and navigation
 */

import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useStore } from "../src/store";
import { useSounds } from "../src/hooks";
import { Colors, ModeInfo, DifficultyInfo } from "../src/constants";
import { t, isJapanese } from "../src/i18n";
import type { GameMode, Difficulty } from "../src/types";

// Mode Card Component - Compact 2-column layout
const ModeCard = ({
  mode,
  isSelected,
  onPress,
}: {
  mode: GameMode;
  isSelected: boolean;
  onPress: () => void;
}) => {
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
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 14,
        backgroundColor: isSelected
          ? Colors.primary.default
          : isDarkMode
            ? "rgba(255, 255, 255, 0.05)"
            : Colors.background.panel,
        borderWidth: isSelected ? 0 : 1,
        borderColor: isDarkMode
          ? "rgba(255, 255, 255, 0.1)"
          : Colors.border.primary,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isSelected
            ? "rgba(255, 255, 255, 0.2)"
            : isDarkMode
              ? "rgba(255, 255, 255, 0.1)"
              : Colors.primary.default + "15",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "800",
            color: isSelected ? "#fff" : Colors.primary.default,
          }}
        >
          {mode === "NUMBERS" ? "123" : mode === "ALPHABET" ? "ABC" : mode === "SENTENCE" ? "文" : "🔍"}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "700",
          color: isSelected
            ? "#fff"
            : isDarkMode
              ? Colors.text.dark
              : Colors.text.primary,
          textAlign: "center",
        }}
      >
        {modeNames[mode]}
      </Text>
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
  const isDarkMode = useStore((state) => state.settings.isDarkMode);
  const sounds = useSounds();

  // Preload sounds on app start
  useEffect(() => {
    sounds.preload();
  }, []);

  const handleStartGame = () => {
    sounds.playButtonTap();
    router.push({
      pathname: "/game/[mode]",
      params: {
        mode: selectedMode,
        difficulty: selectedDifficulty,
      },
    });
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
          paddingHorizontal: 20,
          paddingTop: 8,
        }}
      >
        <DarkModeToggle />
      </View>

      {/* Main Content - No Scroll */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Title Section - Compact */}
        <View style={{ alignItems: "center", marginTop: 16, marginBottom: 24 }}>
          <View
            style={{
              width: 60,
              height: 60,
              backgroundColor: Colors.primary.default,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
              shadowColor: Colors.primary.default,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "900" }}>
              M
            </Text>
          </View>
          <Text
            style={{
              fontSize: 36,
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
              fontSize: 10,
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            {t("app.tagline")}
          </Text>
        </View>

        {/* Mode Selection - 2x2 Grid */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 12,
              color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted,
            }}
          >
            {t("home.selectMode")}
          </Text>
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {mvpModes.slice(0, 2).map((mode) => (
                <ModeCard
                  key={mode}
                  mode={mode}
                  isSelected={selectedMode === mode}
                  onPress={() => setSelectedMode(mode)}
                />
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {mvpModes.slice(2, 4).map((mode) => (
                <ModeCard
                  key={mode}
                  mode={mode}
                  isSelected={selectedMode === mode}
                  onPress={() => setSelectedMode(mode)}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Difficulty Selection */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 12,
              color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted,
            }}
          >
            {t("home.difficulty")}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
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
      </View>

      {/* Footer Actions */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        {/* Start Button */}
        <Pressable
          onPress={handleStartGame}
          style={{
            backgroundColor: Colors.primary.default,
            height: 60,
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            shadowColor: Colors.primary.default,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
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
            {t("home.startGame")}
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
    </SafeAreaView>
  );
}
