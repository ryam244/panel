# PROJECT.md - Rapid Type (パネルタップゲーム)

## 1. Project Overview

**アプリ名:** Rapid Type
**コンセプト:** 反射神経・視野探索・読解処理を測定・トレーニングする順押しスピードゲーム
**ターゲット:** 脳トレユーザー / ゲーマー / 教育（子供の文字学習）
**プラットフォーム:** iOS / Android (React Native + Expo)

### USP (Unique Selling Proposition)
- 「あなたの脳の"速度"を数値化して育てる」
- かな文章モードが唯一無二の差別化ポイント
- 生成AIによる無限の問題生成

---

## 2. Game Modes (5種類)

### Mode 1: Numbers (数字順押し)
- **ルール:** 1から順番に数字パネルをタップ
- **グリッド:** 4x4 / 5x5 / 6x6 (難易度別)
- **計測:** クリアタイム（ミリ秒単位）
- **勝利条件:** 全パネル消去

### Mode 2: Find Number (数字探し)
- **ルール:** 画面上部に表示された「ターゲット数字」を探してタップ
- **グリッド:** 4x5 / 5x5
- **計測:** クリアタイム + 正確性（ミス回数）
- **特徴:** 数字がランダム配置、視野探索トレーニング

### Mode 3: Alphabet (アルファベット順押し)
- **ルール:** A→Zを順番にタップ
- **グリッド:** 4x5 (20文字) / 5x5 (25文字) / 5x6 (26文字全部)
- **計測:** クリアタイム

### Mode 4: Sentence (日本語文章)
- **ルール:** 上部に表示されたお題（ひらがな文章）を順番にタップ
- **グリッド:** 3x3 / 4x4 (文字数による)
- **カテゴリ:** ことわざ / 俳句 / 食べ物 / 雑学
- **特徴:** 読解しながら押す必要がある（単なる反射ではない）

### Mode 5: Flash Panel (光るパネル)
- **ルール:** 空白のグリッド上で光ったパネルを素早くタップ
- **グリッド:** 3x3 / 4x4
- **計測:** 反応速度平均 + 正確性
- **連続モード:** 制限時間内に何回反応できるか

---

## 3. Tech Stack

| カテゴリ | 技術選定 | 理由 |
|---------|---------|------|
| Framework | React Native (Expo SDK 52+) | AI実装精度が最高、Managed Workflowで開発速度最大化 |
| Language | TypeScript | 型安全、AIのコード生成精度向上 |
| Routing | Expo Router | ファイルベース、記述量最小化 |
| Styling | NativeWind (Tailwind CSS) | AI生成との親和性、修正容易 |
| State Management | Zustand | シンプル、persist対応、Redux不要 |
| Local Storage | react-native-mmkv | 高速読み書き、ハイスコア保存 |
| Haptics | expo-haptics | タップ感触フィードバック |
| Animations | react-native-reanimated | UIスレッド動作、連打してもカクつかない |
| Ads | react-native-google-mobile-ads | 収益化（将来実装） |

---

## 4. UI Design System (HTMLリファレンス基準)

### 4.1 Color Palette

```typescript
// Light Mode (Primary)
const Colors = {
  // Backgrounds
  backgroundLight: '#FFFDF5',  // Soft cream (menu)
  backgroundGame: '#FDFBF7',   // Cream game bg
  backgroundPaper: '#F2F0E9',  // Japanese mode
  backgroundResult: '#F4F5F7', // Result screen

  // Primary
  primary: '#1754CF',          // Main blue
  primaryLight: '#0D93F2',     // Game accent

  // Semantic
  success: '#5A7269',          // Sage green (correct)
  warning: '#FF9500',          // Orange (clear/alert)
  teal: '#2DD4BF',             // Teal accent

  // Neutrals
  navyDeep: '#0A1A3F',         // Deep navy
  charcoal: '#1A2332',         // Text primary
  ink: '#2D3136',              // Text secondary

  // Panels
  panelMuted: '#E5E9F0',       // Muted panel bg
  stone: '#E5E1D8',            // Japanese stone bg
  uiBorder: '#CBD5E1',         // Border color
  accentBorder: '#C4C0B5',     // Japanese border

  // Dark Mode
  backgroundDark: '#111621',
}
```

### 4.2 Typography

```typescript
const Typography = {
  fontFamily: {
    display: 'Lexend',           // Headings, numbers
    body: 'Plus Jakarta Sans',   // Body text
    japanese: 'Noto Sans JP',    // Japanese text
  },
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 18,
    xl: 24,
    '2xl': 32,
    '3xl': 44,
    '4xl': 56,
    '5xl': 72,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  }
}
```

### 4.3 Spacing & Layout

```typescript
const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
}

const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
}
```

---

## 5. Screen Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Splash Screen                          │
│                   (Logo + Asset Load)                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Home Screen                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│  │ Numbers  │ │ Alphabet │ │ Sentence │  ← Mode Cards       │
│  └──────────┘ └──────────┘ └──────────┘                     │
│  ┌──────────┐ ┌──────────┐                                  │
│  │Find Num  │ │  Flash   │                                  │
│  └──────────┘ └──────────┘                                  │
│                                                              │
│        [ ▶ START GAME ]    ← Primary CTA                    │
│                                                              │
│  [Scores]    [Settings]    [Awards]    ← Bottom Nav         │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Difficulty Select                         │
│         [Easy 4x4]  [Normal 5x5]  [Hard 6x6]                │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     Countdown Overlay                        │
│                        3 → 2 → 1 → GO!                       │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Game Play Screen                        │
│  [Pause]           TIME: 00:08.45            [Settings]     │
│                                                              │
│              ┌─────────────────┐                            │
│              │   Next: 12      │  ← Target Display          │
│              └─────────────────┘                            │
│                                                              │
│       ┌───┬───┬───┬───┐                                     │
│       │ 7 │ 2 │19 │ 5 │                                     │
│       ├───┼───┼───┼───┤                                     │
│       │12 │24 │ 1 │15 │    ← Grid Board                     │
│       ├───┼───┼───┼───┤                                     │
│       │ 3 │21 │ 9 │18 │                                     │
│       ├───┼───┼───┼───┤                                     │
│       │11 │ 6 │25 │14 │                                     │
│       └───┴───┴───┴───┘                                     │
│                                                              │
│    [Progress: 11/25]        [Accuracy: 98.2%]               │
└────────────────────────────┬────────────────────────────────┘
                             │ All panels cleared
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Result Screen                           │
│                                                              │
│                        CLEAR!                                │
│                  [Excellent Performance]                     │
│                                                              │
│                      00:15.32                                │
│                     Final Time                               │
│                                                              │
│   ┌─────────┬─────────┬─────────┐                           │
│   │ Record  │Accuracy │  Rank   │                           │
│   │New Best!│   98%   │    S    │                           │
│   └─────────┴─────────┴─────────┘                           │
│                                                              │
│   ┌─────────────────────────────┐                           │
│   │      Tap Consistency        │                           │
│   │      [Graph]    7.4 TPS     │                           │
│   └─────────────────────────────┘                           │
│                                                              │
│       [Retry]        [Next Level →]                         │
│              [Share Results]                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Data Models

```typescript
// ゲームモード定義
export type GameMode =
  | 'NUMBERS'      // 数字順押し
  | 'FIND_NUMBER'  // 数字探し
  | 'ALPHABET'     // ABC順押し
  | 'SENTENCE'     // 日本語文章
  | 'FLASH';       // 光るパネル

// 難易度
export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

// グリッド設定
export interface GridConfig {
  rows: number;
  cols: number;
  totalTiles: number;
}

// 1つのタイル
export interface Tile {
  id: string;
  value: string;           // 表示文字 ("1", "A", "あ")
  orderIndex: number;      // 正解順序
  isCleared: boolean;      // 押されたか
  position: number;        // グリッド位置
}

// ゲームセッション
export interface GameSession {
  sessionId: string;
  mode: GameMode;
  difficulty: Difficulty;
  targetSentence?: string; // Sentenceモード用
  tiles: Tile[];
  currentTarget: number;   // 現在のターゲットindex
  startTime: number | null;
  endTime: number | null;
  status: 'IDLE' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'FINISHED';
  mistakeCount: number;
  tapTimes: number[];      // 各タップの時刻（TPS計算用）
}

// プレイ結果
export interface GameResult {
  sessionId: string;
  mode: GameMode;
  difficulty: Difficulty;
  clearTime: number;       // ミリ秒
  accuracy: number;        // パーセント
  rank: 'S' | 'A' | 'B' | 'C';
  isNewRecord: boolean;
  tapsPerSecond: number;   // TPS
  date: string;
}

// ユーザー設定
export interface UserSettings {
  isSoundEnabled: boolean;
  isHapticsEnabled: boolean;
  isDarkMode: boolean;
}

// ハイスコア
export interface HighScores {
  [key: string]: number;   // "NUMBERS_NORMAL": 15320 (ms)
}

// 永続化ストア
export interface Store {
  settings: UserSettings;
  highScores: HighScores;
  totalGamesPlayed: number;
  currentStreak: number;
}
```

---

## 7. Directory Structure

```
/app
├── _layout.tsx              # Root layout, providers
├── index.tsx                # Home/Menu screen
├── game
│   └── [mode].tsx           # Dynamic game screen
├── result.tsx               # Result screen
└── settings.tsx             # Settings screen

/src
├── components
│   ├── ui/                  # Generic UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── IconButton.tsx
│   │   └── ProgressBar.tsx
│   └── game/                # Game-specific components
│       ├── GridBoard.tsx
│       ├── TileCell.tsx
│       ├── TargetDisplay.tsx
│       ├── Timer.tsx
│       ├── CountdownOverlay.tsx
│       └── StatsPanel.tsx
│
├── hooks/
│   ├── useGameLogic.ts      # Core game logic
│   ├── useStopwatch.ts      # Timer hook
│   └── useHaptics.ts        # Vibration feedback
│
├── lib/
│   ├── generator.ts         # Problem generation
│   ├── ranking.ts           # Rank calculation
│   └── sounds.ts            # Sound management
│
├── store/
│   └── useStore.ts          # Zustand store
│
├── constants/
│   ├── colors.ts            # Color palette
│   ├── typography.ts        # Font definitions
│   ├── spacing.ts           # Spacing scale
│   └── gameConfig.ts        # Grid configs, thresholds
│
└── types/
    └── index.ts             # TypeScript types
```

---

## 8. MVP Implementation Roadmap

### Phase 1: Project Setup
- [x] Initialize Expo project (SDK 52+)
- [x] Install dependencies (NativeWind, Zustand, Reanimated, MMKV)
- [x] Configure NativeWind (tailwind.config.js)
- [x] Create theme constants (colors, typography, spacing)
- [x] Create TypeScript types

### Phase 2: Core UI Components
- [x] Button component (inline in screens)
- [x] Card component (inline in screens)
- [x] IconButton component (inline in screens)
- [x] ProgressBar component (inline in screens)

### Phase 3: Home Screen
- [x] Layout structure
- [x] Mode selection cards (3 modes for MVP)
- [x] Dark mode toggle
- [x] START button
- [x] Bottom navigation (Scores, Settings, Awards)

### Phase 4: Game Play Screen
- [x] Header (Pause, Timer, Settings)
- [x] TargetDisplay component
- [x] GridBoard component
- [x] TileCell component (with animations)
- [x] StatsPanel (Progress, Accuracy)

### Phase 5: Game Logic
- [x] useGameLogic hook (tap handling, validation)
- [x] useStopwatch hook (millisecond precision)
- [x] Problem generator (shuffle, sentence parsing)
- [x] State management (Zustand store)

### Phase 6: Result Screen
- [x] Clear banner
- [x] Time display
- [x] Stats cards (Record, Accuracy, Rank)
- [x] Consistency graph (placeholder)
- [x] Action buttons (Retry, Next Level, Share)

### Phase 7: Polish
- [x] Countdown overlay (3-2-1-GO)
- [x] Haptic feedback
- [ ] Sound effects
- [ ] Animations (tile clear with Reanimated)
- [ ] Error handling & edge cases

---

## 9. Current Status

**Phase:** 7 - Polish (MVP Core Complete)
**Progress:** Core functionality implemented. Ready for testing and polish.

---

## 10. Dependencies (Pinned Versions)

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-haptics": "~14.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "react-native-reanimated": "~3.16.0",
    "react-native-mmkv": "^3.0.0",
    "zustand": "^5.0.0",
    "nativewind": "^4.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## 11. Quality Criteria

### Performance
- 60 FPS維持（連打時も）
- タイマー精度: 10ms以内の誤差
- 初回起動: 2秒以内

### UX
- 即リスタート（ボタン1タップ）
- ミスフィードバック: 50ms以内
- 正解フィードバック: Haptics + Visual

### Code Quality
- TypeScript strict mode
- ロジックとUIの分離
- ハードコード禁止（テーマファイル活用）
