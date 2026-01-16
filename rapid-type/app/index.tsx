/**
 * Home Screen - Mojic
 * Main entry point with game mode cards and navigation
 */

import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Hash,
  Type,
  FileText,
  Search,
  Zap,
  BarChart2,
  Settings,
  Trophy,
  ChevronRight,
} from "lucide-react-native";
import { useStore } from "../src/store";
import { useSounds } from "../src/hooks";
import { Colors, ModeInfo, DifficultyInfo } from "../src/constants";
import { t, isJapanese } from "../src/i18n";
import type { GameMode, Difficulty } from "../src/types";

// Icon component using lucide
const ModeIcon = ({ mode, isSelected }: { mode: GameMode; isSelected: boolean }) => {
  const iconColor = isSelected ? "#fff" : Colors.primary.default;
  const iconSize = 22;
  const strokeWidth = 1.5;

  const icons: Record<GameMode, React.ReactNode> = {
    NUMBERS: <Hash size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
    ALPHABET: <Type size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
    SENTENCE: <FileText size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
    FIND_NUMBER: <Search size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
    FLASH: <Zap size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
  };

  return <>{icons[mode]}</>;
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
      style={[
        styles.modeCard,
        isSelected && styles.modeCardSelected,
        isDarkMode && styles.modeCardDark,
        isSelected && isDarkMode && styles.modeCardSelectedDark,
      ]}
    >
      <View style={styles.modeCardContent}>
        <View
          style={[
            styles.modeIconContainer,
            isSelected && styles.modeIconContainerSelected,
            isDarkMode && styles.modeIconContainerDark,
          ]}
        >
          <ModeIcon mode={mode} isSelected={isSelected} />
        </View>
        <Text
          style={[
            styles.modeCardTitle,
            isDarkMode && styles.modeCardTitleDark,
          ]}
        >
          {modeNames[mode]}
        </Text>
      </View>

      {isSelected ? (
        <View style={styles.activeBadge}>
          <Text style={styles.activeBadgeText}>
            {t("home.active")}
          </Text>
        </View>
      ) : (
        <ChevronRight
          size={24}
          color={isDarkMode ? "rgba(255,255,255,0.3)" : Colors.text.muted}
          strokeWidth={1.5}
        />
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
      style={[
        styles.difficultyButton,
        isSelected && styles.difficultyButtonSelected,
        isDarkMode && styles.difficultyButtonDark,
      ]}
    >
      <Text
        style={[
          styles.difficultyButtonText,
          isSelected && styles.difficultyButtonTextSelected,
          isDarkMode && styles.difficultyButtonTextDark,
        ]}
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
      style={[styles.darkModeToggle, isDarkMode && styles.darkModeToggleDark]}
    >
      <Text
        style={[styles.darkModeLabel, isDarkMode && styles.darkModeLabelDark]}
      >
        {t("home.darkMode")}
      </Text>
      <View
        style={[
          styles.toggleTrack,
          isDarkMode && styles.toggleTrackActive,
        ]}
      >
        <View
          style={[
            styles.toggleThumb,
            isDarkMode && styles.toggleThumbActive,
          ]}
        />
      </View>
    </Pressable>
  );
};

// Nav Item Component
const NavItem = ({
  icon,
  label,
  onPress,
  isDarkMode,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  isDarkMode: boolean;
}) => {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <View style={styles.navIconContainer}>
        {icon}
      </View>
      <Text style={[styles.navLabel, isDarkMode && styles.navLabelDark]}>
        {label}
      </Text>
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

  const navIconColor = isDarkMode ? Colors.text.darkSecondary : Colors.text.muted;

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.containerDark]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <DarkModeToggle />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={[styles.appTitle, isDarkMode && styles.appTitleDark]}>
            {t("app.name")}
          </Text>
          <Text style={styles.tagline}>
            {t("app.tagline")}
          </Text>
        </View>

        {/* Mode Selection */}
        <View style={styles.modeSection}>
          <Text style={[styles.sectionLabel, isDarkMode && styles.sectionLabelDark]}>
            {t("home.selectMode")}
          </Text>
          <View style={styles.modeList}>
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
        <View style={styles.difficultySection}>
          <Text style={[styles.sectionLabel, isDarkMode && styles.sectionLabelDark]}>
            {t("home.difficulty")}
          </Text>
          <View style={styles.difficultyList}>
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
      <View style={styles.footer}>
        {/* Start Button */}
        <Pressable onPress={handleStartGame} style={styles.startButton}>
          <Text style={styles.startButtonText}>
            {t("home.startGame")}
          </Text>
        </Pressable>

        {/* Bottom Nav */}
        <View style={styles.bottomNav}>
          <NavItem
            icon={<BarChart2 size={20} color={navIconColor} strokeWidth={1.5} />}
            label={t("home.scores")}
            onPress={() => router.push("/stats")}
            isDarkMode={isDarkMode}
          />
          <NavItem
            icon={<Settings size={20} color={navIconColor} strokeWidth={1.5} />}
            label={t("home.settings")}
            onPress={() => router.push("/settings")}
            isDarkMode={isDarkMode}
          />
          <NavItem
            icon={<Trophy size={20} color={navIconColor} strokeWidth={1.5} />}
            label={t("home.awards")}
            onPress={() => router.push("/achievements")}
            isDarkMode={isDarkMode}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  containerDark: {
    backgroundColor: Colors.background.dark,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  // Dark Mode Toggle
  darkModeToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  darkModeToggleDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  darkModeLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  darkModeLabelDark: {
    color: Colors.text.darkSecondary,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.text.muted + "40",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleTrackActive: {
    backgroundColor: Colors.primary.default,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
  },
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  // Title Section
  titleSection: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 40,
  },
  logoContainer: {
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
  },
  logoText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "900",
  },
  appTitle: {
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -1,
    color: Colors.text.primary,
  },
  appTitleDark: {
    color: Colors.text.dark,
  },
  tagline: {
    color: Colors.primary.default,
    fontWeight: "600",
    letterSpacing: 2,
    fontSize: 11,
    textTransform: "uppercase",
    marginTop: 8,
  },
  // Section Label
  sectionLabel: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 16,
    color: Colors.text.muted,
  },
  sectionLabelDark: {
    color: Colors.text.darkSecondary,
  },
  // Mode Section
  modeSection: {
    marginBottom: 32,
  },
  modeList: {
    gap: 12,
  },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.background.panel,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  modeCardSelected: {
    backgroundColor: Colors.primary.default + "15",
    borderWidth: 2,
    borderColor: Colors.primary.default,
  },
  modeCardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modeCardSelectedDark: {
    backgroundColor: Colors.primary.default + "20",
    borderColor: Colors.primary.default,
  },
  modeCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  modeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  modeIconContainerSelected: {
    backgroundColor: Colors.primary.default,
  },
  modeIconContainerDark: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  modeCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  modeCardTitleDark: {
    color: Colors.text.dark,
  },
  activeBadge: {
    backgroundColor: Colors.primary.default,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // Difficulty Section
  difficultySection: {
    marginBottom: 32,
  },
  difficultyList: {
    flexDirection: "row",
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background.panel,
    borderWidth: 1,
    borderColor: Colors.border.ui,
  },
  difficultyButtonSelected: {
    backgroundColor: Colors.primary.default,
    borderWidth: 0,
  },
  difficultyButtonDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  difficultyButtonText: {
    fontWeight: "700",
    fontSize: 14,
    color: Colors.text.primary,
  },
  difficultyButtonTextSelected: {
    color: "#fff",
  },
  difficultyButtonTextDark: {
    color: Colors.text.dark,
  },
  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  startButton: {
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
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },
  // Bottom Nav
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginTop: 24,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navIconContainer: {
    padding: 8,
    borderRadius: 20,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: Colors.text.muted,
  },
  navLabelDark: {
    color: Colors.text.darkSecondary,
  },
});
