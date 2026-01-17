/**
 * useAds Hook - Mojic
 * Convenient hook for using ads in React components
 */

import { useEffect, useState, useCallback } from "react";
import {
  AdManager,
  showInterstitialAd,
  showRewardedAd,
  isInterstitialReady,
  isRewardedReady,
  isAdsInitialized,
} from "../lib/ads";

/**
 * Hook for managing ads in the app
 * Provides methods to show ads and check availability
 * Note: Ads are initialized in _layout.tsx on app startup
 */
export function useAds() {
  const [isInitialized, setIsInitialized] = useState(isAdsInitialized());
  const [interstitialReady, setInterstitialReady] = useState(false);
  const [rewardedReady, setRewardedReady] = useState(false);

  // Check if already initialized
  useEffect(() => {
    if (!isInitialized && isAdsInitialized()) {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Poll for ad readiness and initialization status
  useEffect(() => {
    const checkReadiness = () => {
      // Check initialization status
      if (!isInitialized && isAdsInitialized()) {
        setIsInitialized(true);
      }

      // Check ad readiness
      if (isAdsInitialized()) {
        setInterstitialReady(isInterstitialReady());
        setRewardedReady(isRewardedReady());
      }
    };

    // Check immediately
    checkReadiness();

    // Poll every 2 seconds
    const interval = setInterval(checkReadiness, 2000);

    return () => clearInterval(interval);
  }, [isInitialized]);

  // Show interstitial ad
  const showInterstitial = useCallback(async () => {
    return showInterstitialAd();
  }, []);

  // Show rewarded ad with callback
  const showRewarded = useCallback(async (onReward?: () => void) => {
    return showRewardedAd(onReward);
  }, []);

  return {
    isInitialized,
    interstitialReady,
    rewardedReady,
    showInterstitial,
    showRewarded,
    isTestMode: AdManager.isTestMode,
  };
}

export default useAds;
