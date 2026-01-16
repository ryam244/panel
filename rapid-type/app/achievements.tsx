/**
 * Achievements Screen - Mojic
 * Shows all achievements with unlock status and progress
 */

import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Lock, Trophy, Zap, Target, Star, Calendar, Award } from "lucide-react-native";
import { useStore, ACHIEVEMENT_IDS, Achievement } from "../src/store";
import { Colors } from "../src/constants";
import { t } from "../src/i18n";

// Achievement definition with icons
interface AchievementDef {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  hasProgress?: boolean;
}

// Get achievement definitions
const getAchievementDefs = (isDarkMode: boolean): AchievementDef[] => {
  const iconColor = isDarkMode ? Colors.text.dark : Colors.text.primary;
  const iconSize = 24;
  const strokeWidth = 1.5;

  return [
    {
      id: ACHIEVEMENT_IDS.FIRST_CLEAR,
      icon: <Star size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
      title: t("achievements.firstClear"),
      description: t("achievements.firstClearDesc"),
    },
    {
      id: ACHIEVEMENT_IDS.SPEED_DEMON,
      icon: <Zap size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
      title: t("achievements.speedDemon"),
      description: t("achievements.speedDemonDesc"),
    },
    {
      id: ACHIEVEMENT_IDS.PERFECTIONIST,
      icon: <Target size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
      title: t("achievements.perfectionist"),
      description: t("achievements.perfectionistDesc"),
    },
    {
      id: ACHIEVEMENT_IDS.MARATHONER,
      icon: <Award size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
      title: t("achievements.marathoner"),
      description: t("achievements.marathonerDesc"),
      hasProgress: true,
    },
    {
      id: ACHIEVEMENT_IDS.WEEK_STREAK,
      icon: <Calendar size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
      title: t("achievements.weekStreak"),
      description: t("achievements.weekStreakDesc"),
      hasProgress: true,
    },
    {
      id: ACHIEVEMENT_IDS.MONTH_STREAK,
      icon: <Calendar size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
      title: t("achievements.monthStreak"),
      description: t("achievements.monthStreakDesc"),
      hasProgress: true,
    },
    {
      id: ACHIEVEMENT_IDS.NUMBER_MASTER,
      icon: <Trophy size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
      title: t("achievements.numberMaster"),
      description: t("achievements.numberMasterDesc"),
    },
    {
      id: ACHIEVEMENT_IDS.ALPHABET_MASTER,
      icon: <Trophy size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
      title: t("achievements.alphabetMaster"),
      description: t("achievements.alphabetMasterDesc"),
    },
    {
      id: ACHIEVEMENT_IDS.SENTENCE_MASTER,
      icon: <Trophy size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
      title: t("achievements.sentenceMaster"),
      description: t("achievements.sentenceMasterDesc"),
      hasProgress: true,
    },
    {
      id: ACHIEVEMENT_IDS.NO_MISTAKE,
      icon: <Target size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
      title: t("achievements.noMistake"),
      description: t("achievements.noMistakeDesc"),
      hasProgress: true,
    },
    {
      id: ACHIEVEMENT_IDS.FIND_MASTER,
      icon: <Trophy size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
      title: "Find Master",
      description: "Clear Find Number Hard mode",
    },
    {
      id: ACHIEVEMENT_IDS.SPEED_KING,
      icon: <Zap size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
      title: "Speed King",
      description: "Get S rank 10 times",
    },
  ];
};

// Achievement card component
const AchievementCard = ({
  def,
  achievement,
  isDarkMode,
}: {
  def: AchievementDef;
  achievement: Achievement | undefined;
  isDarkMode: boolean;
}) => {
  const isUnlocked = achievement?.unlocked || false;
  const progress = achievement?.progress || 0;
  const maxProgress = achievement?.maxProgress || 0;
  const progressPercent = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;

  return (
    <View
      style={[
        styles.achievementCard,
        isDarkMode && styles.achievementCardDark,
        isUnlocked && styles.achievementCardUnlocked,
        !isUnlocked && styles.achievementCardLocked,
      ]}
    >
      <View style={styles.achievementContent}>
        {/* Icon */}
        <View
          style={[
            styles.achievementIcon,
            isUnlocked && styles.achievementIconUnlocked,
            isDarkMode && !isUnlocked && styles.achievementIconDark,
          ]}
        >
          {isUnlocked ? (
            def.icon
          ) : (
            <Lock
              size={24}
              color={isDarkMode ? Colors.text.darkSecondary : Colors.text.muted}
              strokeWidth={1.5}
            />
          )}
        </View>

        {/* Content */}
        <View style={styles.achievementInfo}>
          <View style={styles.achievementHeader}>
            <Text
              style={[
                styles.achievementTitle,
                isDarkMode && styles.achievementTitleDark,
              ]}
            >
              {def.title}
            </Text>
            {isUnlocked && (
              <View style={styles.unlockedBadge}>
                <Text style={styles.unlockedBadgeText}>
                  {t("achievements.unlocked")}
                </Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.achievementDesc,
              isDarkMode && styles.achievementDescDark,
            ]}
          >
            {def.description}
          </Text>

          {/* Progress bar */}
          {def.hasProgress && !isUnlocked && maxProgress > 0 && (
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  isDarkMode && styles.progressBarDark,
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.progressText,
                  isDarkMode && styles.progressTextDark,
                ]}
              >
                {progress} / {maxProgress}
              </Text>
            </View>
          )}

          {/* Unlocked date */}
          {isUnlocked && achievement?.unlockedAt && (
            <Text
              style={[
                styles.unlockedDate,
                isDarkMode && styles.unlockedDateDark,
              ]}
            >
              {new Date(achievement.unlockedAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default function AchievementsScreen() {
  const isDarkMode = useStore((state) => state.settings.isDarkMode);
  const achievements = useStore((state) => state.achievements);

  const achievementDefs = getAchievementDefs(isDarkMode);

  // Count unlocked achievements
  const unlockedCount = Object.values(achievements).filter((a) => a.unlocked).length;
  const totalCount = achievementDefs.length;

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.containerDark]}
      edges={["top", "bottom"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>
          {t("achievements.title")}
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.closeButton, isDarkMode && styles.closeButtonDark]}
        >
          <Text style={[styles.closeButtonText, isDarkMode && styles.closeButtonTextDark]}>
            ✕
          </Text>
        </Pressable>
      </View>

      {/* Progress summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <View style={styles.trophyIcon}>
              <Trophy size={24} color="#fff" strokeWidth={1.5} />
            </View>
            <View>
              <Text style={[styles.summaryCount, isDarkMode && styles.summaryCountDark]}>
                {unlockedCount} / {totalCount}
              </Text>
              <Text style={[styles.summaryLabel, isDarkMode && styles.summaryLabelDark]}>
                {t("achievements.unlocked")}
              </Text>
            </View>
          </View>
          <Text style={styles.summaryPercent}>
            {Math.round((unlockedCount / totalCount) * 100)}%
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {achievementDefs.map((def) => (
          <AchievementCard
            key={def.id}
            def={def}
            achievement={achievements[def.id]}
            isDarkMode={isDarkMode}
          />
        ))}
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text.primary,
  },
  headerTitleDark: {
    color: "#fff",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  closeButtonDark: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  closeButtonText: {
    fontSize: 18,
    color: Colors.text.primary,
  },
  closeButtonTextDark: {
    color: "#fff",
  },
  // Summary
  summaryContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.primary.default + "15",
    borderWidth: 1,
    borderColor: Colors.primary.default + "30",
  },
  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  trophyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary.default,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text.primary,
  },
  summaryCountDark: {
    color: "#fff",
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.text.muted,
  },
  summaryLabelDark: {
    color: "rgba(255,255,255,0.5)",
  },
  summaryPercent: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary.default,
  },
  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  // Achievement Card
  achievementCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.border.ui,
  },
  achievementCardDark: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  achievementCardUnlocked: {
    borderWidth: 2,
    borderColor: Colors.primary.default,
  },
  achievementCardLocked: {
    opacity: 0.7,
  },
  achievementContent: {
    flexDirection: "row",
    gap: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.text.muted + "20",
  },
  achievementIconUnlocked: {
    backgroundColor: Colors.primary.default + "20",
  },
  achievementIconDark: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  achievementInfo: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  achievementTitleDark: {
    color: "#fff",
  },
  unlockedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: Colors.primary.default,
  },
  unlockedBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  },
  achievementDesc: {
    fontSize: 13,
    color: Colors.text.muted,
    lineHeight: 18,
  },
  achievementDescDark: {
    color: "rgba(255,255,255,0.5)",
  },
  // Progress
  progressContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.text.muted + "20",
    overflow: "hidden",
  },
  progressBarDark: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: Colors.primary.default,
  },
  progressText: {
    fontSize: 12,
    color: Colors.text.muted,
    minWidth: 50,
    textAlign: "right",
  },
  progressTextDark: {
    color: "rgba(255,255,255,0.5)",
  },
  // Unlocked date
  unlockedDate: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: 4,
  },
  unlockedDateDark: {
    color: "rgba(255,255,255,0.5)",
  },
});
