/**
 * Tutorial Screen - Mojic
 * First-time user onboarding with swipeable cards
 */

import { useState, useRef } from "react";
import { View, Text, Pressable, Dimensions, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import {
  Target,
  Zap,
  Trophy,
  AlertCircle,
} from "lucide-react-native";
import { Colors } from "../src/constants";
import { t } from "../src/i18n";
import { useStore } from "../src/store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface TutorialSlide {
  id: string;
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  color: string;
}

const slides: TutorialSlide[] = [
  {
    id: "1",
    icon: <Target size={64} color={Colors.primary.default} strokeWidth={2} />,
    titleKey: "tutorial.slide1Title",
    descKey: "tutorial.slide1Desc",
    color: Colors.primary.default,
  },
  {
    id: "2",
    icon: <Zap size={64} color={Colors.semantic.warning} strokeWidth={2} />,
    titleKey: "tutorial.slide2Title",
    descKey: "tutorial.slide2Desc",
    color: Colors.semantic.warning,
  },
  {
    id: "3",
    icon: <Trophy size={64} color={Colors.rank.S} strokeWidth={2} />,
    titleKey: "tutorial.slide3Title",
    descKey: "tutorial.slide3Desc",
    color: Colors.rank.S,
  },
  {
    id: "4",
    icon: <AlertCircle size={64} color={Colors.semantic.error} strokeWidth={2} />,
    titleKey: "tutorial.slide4Title",
    descKey: "tutorial.slide4Desc",
    color: Colors.semantic.error,
  },
];

const SlideItem = ({
  item,
  index,
  scrollX,
}: {
  item: TutorialSlide;
  index: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View
      style={{ width: SCREEN_WIDTH }}
      className="items-center justify-center px-8"
    >
      <Animated.View style={animatedStyle} className="items-center">
        {/* Icon Container */}
        <View
          className="w-32 h-32 rounded-full items-center justify-center mb-8"
          style={{ backgroundColor: item.color + "15" }}
        >
          {item.icon}
        </View>

        {/* Title */}
        <Text
          className="text-2xl font-black text-center mb-4"
          style={{ color: Colors.text.primary }}
        >
          {t(item.titleKey)}
        </Text>

        {/* Description */}
        <Text
          className="text-base text-center leading-6"
          style={{ color: Colors.text.secondary }}
        >
          {t(item.descKey)}
        </Text>
      </Animated.View>
    </View>
  );
};

const Pagination = ({
  scrollX,
  totalSlides,
}: {
  scrollX: Animated.SharedValue<number>;
  totalSlides: number;
}) => {
  return (
    <View className="flex-row justify-center gap-2">
      {Array.from({ length: totalSlides }).map((_, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          const inputRange = [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ];

          const width = interpolate(
            scrollX.value,
            inputRange,
            [8, 24, 8],
            Extrapolation.CLAMP
          );

          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.3, 1, 0.3],
            Extrapolation.CLAMP
          );

          return {
            width,
            opacity,
          };
        });

        return (
          <Animated.View
            key={index}
            className="h-2 rounded-full"
            style={[
              { backgroundColor: Colors.primary.default },
              animatedStyle,
            ]}
          />
        );
      })}
    </View>
  );
};

export default function TutorialScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const setHasSeenTutorial = useStore((state) => state.setHasSeenTutorial);

  const handleSkip = () => {
    setHasSeenTutorial(true);
    router.replace("/");
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleSkip();
    }
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors.background.light }}
      edges={["top", "bottom"]}
    >
      {/* Skip Button */}
      <View className="flex-row justify-end px-6 pt-4">
        <Pressable
          onPress={handleSkip}
          className="px-4 py-2 rounded-full"
          style={{ backgroundColor: Colors.text.muted + "20" }}
        >
          <Text
            className="text-sm font-semibold"
            style={{ color: Colors.text.muted }}
          >
            {t("tutorial.skip")}
          </Text>
        </Pressable>
      </View>

      {/* Slides */}
      <View className="flex-1 justify-center">
        <FlatList
          ref={flatListRef}
          data={slides}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={(event) => {
            scrollX.value = event.nativeEvent.contentOffset.x;
          }}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / SCREEN_WIDTH
            );
            setCurrentIndex(index);
          }}
          renderItem={({ item, index }) => (
            <SlideItem item={item} index={index} scrollX={scrollX} />
          )}
        />
      </View>

      {/* Bottom Section */}
      <View className="px-6 pb-8">
        {/* Pagination */}
        <View className="mb-8">
          <Pagination scrollX={scrollX} totalSlides={slides.length} />
        </View>

        {/* Next/Done Button */}
        <Pressable
          onPress={handleNext}
          className="h-14 rounded-xl items-center justify-center"
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
            {isLastSlide ? t("tutorial.done") : t("tutorial.next")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
