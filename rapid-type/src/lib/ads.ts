/**
 * Ad Manager - Mojic
 * Google Mobile Ads integration with AdMob
 *
 * App ID: ca-app-pub-6258470133022211~6887279803
 *
 * In development mode, uses test ad unit IDs.
 * In production mode, uses real AdMob ad unit IDs.
 */

import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  AdEventType,
} from "react-native-google-mobile-ads";
import mobileAds from "react-native-google-mobile-ads";

// ================================================
// CONFIGURATION
// ================================================

// Set to false for production release
const IS_TEST_MODE = __DEV__;

// AdMob App ID (configured in app.json plugin)
const APP_ID = "ca-app-pub-6258470133022211~6887279803";

// Ad Unit IDs
// TODO: Replace with your production ad unit IDs before release
const AD_UNIT_IDS = {
  // Test IDs (used in development)
  test: {
    rewarded: TestIds.REWARDED,
  },
  // Production IDs
  production: {
    rewarded: "ca-app-pub-6258470133022211/7834966756",
  },
};

// Get the appropriate ad unit ID based on mode
const getRewardedAdUnitId = (): string => {
  return IS_TEST_MODE ? AD_UNIT_IDS.test.rewarded : AD_UNIT_IDS.production.rewarded;
};

// ================================================
// STATE
// ================================================

let isInitialized = false;
let rewardedAd: RewardedAd | null = null;
let rewardedReady = false;
let rewardCallback: (() => void) | null = null;

// ================================================
// INITIALIZATION
// ================================================

/**
 * Initialize the Google Mobile Ads SDK
 */
export async function initializeAds(): Promise<void> {
  if (isInitialized) return;

  try {
    // Initialize the Mobile Ads SDK
    await mobileAds().initialize();
    isInitialized = true;
    console.log(`[Ads] SDK initialized (${IS_TEST_MODE ? "TEST MODE" : "PRODUCTION"})`);

    // Start loading ads
    loadRewardedAd();
  } catch (error) {
    console.error("[Ads] Failed to initialize:", error);
  }
}

// ================================================
// REWARDED AD
// ================================================

/**
 * Load a rewarded ad
 */
function loadRewardedAd(): void {
  if (!isInitialized) {
    console.warn("[Ads] Cannot load ad before initialization");
    return;
  }

  try {
    const adUnitId = getRewardedAdUnitId();
    rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
      keywords: ["game", "puzzle", "brain training"],
    });

    // Set up event listeners
    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        rewardedReady = true;
        console.log("[Ads] Rewarded ad loaded");
      }
    );

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("[Ads] User earned reward:", reward);
        if (rewardCallback) {
          rewardCallback();
          rewardCallback = null;
        }
      }
    );

    const unsubscribeClosed = rewardedAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log("[Ads] Rewarded ad closed");
        rewardedReady = false;
        // Cleanup and reload
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeClosed();
        unsubscribeError();
        // Load next ad
        setTimeout(loadRewardedAd, 1000);
      }
    );

    const unsubscribeError = rewardedAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error("[Ads] Rewarded ad error:", error);
        rewardedReady = false;
        // Cleanup
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeClosed();
        unsubscribeError();
        // Retry after delay
        setTimeout(loadRewardedAd, 5000);
      }
    );

    // Start loading
    rewardedAd.load();
  } catch (error) {
    console.error("[Ads] Failed to create rewarded ad:", error);
  }
}

/**
 * Show rewarded ad
 * @param onReward - Callback when user completes watching
 * @returns true if ad was shown, false if not ready
 */
export async function showRewardedAd(onReward?: () => void): Promise<boolean> {
  if (!isInitialized || !rewardedReady || !rewardedAd) {
    console.log("[Ads] Rewarded ad not ready");
    return false;
  }

  try {
    // Store the callback
    rewardCallback = onReward || null;

    // Show the ad
    await rewardedAd.show();
    return true;
  } catch (error) {
    console.error("[Ads] Failed to show rewarded ad:", error);
    rewardCallback = null;
    return false;
  }
}

/**
 * Check if rewarded ad is ready to show
 */
export function isRewardedReady(): boolean {
  return rewardedReady;
}

// ================================================
// LEGACY API (for backwards compatibility)
// ================================================

// These are kept for backwards compatibility but are no longer used
let interstitialReady = false;

export async function showInterstitialAd(): Promise<boolean> {
  // Interstitial ads are not used in this app
  console.log("[Ads] Interstitial ads not implemented");
  return false;
}

export function isInterstitialReady(): boolean {
  return interstitialReady;
}

export function createAdManagers(): void {
  // No-op - ads are loaded automatically after initialization
}

// ================================================
// EXPORTS
// ================================================

/**
 * Ad Manager singleton export
 */
export const AdManager = {
  initialize: initializeAds,
  createManagers: createAdManagers,
  showInterstitial: showInterstitialAd,
  showRewarded: showRewardedAd,
  isInterstitialReady,
  isRewardedReady,
  isTestMode: IS_TEST_MODE,
  appId: APP_ID,
};

export default AdManager;
