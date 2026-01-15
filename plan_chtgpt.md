世界トップクラスのモバイルアプリ・アーキテクト兼CTOとして、あなたのプロジェクトを成功に導くための技術選定と設計を行います。

今回の要件である「スピードゲーム」かつ「AIによるVibe Coding（高速自動実装）」を最優先事項とした場合、私の判断は以下の通りです。

Task 1: Framework Selection
選定フレームワーク: React Native (Expo Managed Workflow)

選定理由:

AIのコード生成精度が最強: Vibe Coding（AI駆動開発）において、最も重要なのは「AIが学習しているデータ量」と「構造の宣言性」です。React (TypeScript) の学習データはFlutter (Dart) に比べて圧倒的に多く、AIはReactのコンポーネント構造やHooksのロジック（useEffectやuseState）を非常に高い精度で出力します。

UI構築の速度（Tailwind CSSの活用）: React Nativeでは「NativeWind (Tailwind CSS)」が利用可能です。AIにとってCSSクラスの羅列によるスタイリングは、FlutterのWidgetネスト構造よりも遥かにミスの少ないコードを生成しやすく、修正も容易です。

グリッドロジックとの親和性: 今回の「パネルを順番に押す」というゲーム性は、配列データの操作（map関数によるレンダリング）が中心です。これはReactの宣言的UIが最も得意とする領域であり、AIに指示を出した際にバグの少ないコードが一発で生成されやすい構成です。

Task 2: Technical Specification (PRD)
選定した React Native (Expo SDK 52+) / TypeScript を前提とした技術設計書です。

1. 画面フローとUX (User Experience)
ユーザーの思考を途切れさせない「ハイテンポな遷移」を設計します。

Splash Screen (起動画面)

アプリロゴの表示と、バックグラウンドでのアセット読み込み。

Home Screen (モード選択)

大きなカード形式で3つのモードを表示（数字、アルファベット、かな文章）。

「Start」タップで即座にゲーム画面へ遷移（ローディングを感じさせない）。

Game Play Screen (プレイ画面)

Countdown: 3-2-1-GO のオーバーレイ演出。

Main Board: 画面中央にグリッド（4x4 や 5x5）でタイルを表示。

HUD: 経過時間（ミリ秒単位）、現在のターゲット（「次は 'A'」など）。

Feedback: 正解時は軽い触覚フィードバック（Haptics）とパーティクル演出。不正解時は画面シェイク。

Game Over/Clear: 全パネル消去で即座にResultへ。

Result Screen (結果発表)

クリアタイム、ランク（S/A/B/C）、New Record表示。

「もう一度（Retry）」ボタンを親指が届きやすい位置に配置（最重要）。

「シェア」ボタン。

2. データモデル (TypeScript Interfaces)
AIに実装させる際、この型定義を最初に読み込ませることで整合性を保ちます。

TypeScript

// ゲームのモード定義
export type GameMode = 'NUMBER' | 'ALPHABET' | 'KANA_SENTENCE';

// 1つのタイルの状態
export interface Tile {
  id: string;        // UUID (一意の識別子)
  value: string;     // 表示文字 ("1", "A", "あ")
  orderIndex: number; // 正解順序 (0, 1, 2...)
  isCleared: boolean; // 既に押されたかどうか
  position: number;  // グリッド上の位置 (シャッフル用)
}

// ゲームセッションの状態
export interface GameSession {
  sessionId: string;
  mode: GameMode;
  targetSentence?: string; // かなモード用の正解文章
  tiles: Tile[];
  startTime: number | null;
  endTime: number | null;
  status: 'IDLE' | 'PLAYING' | 'FINISHED';
  mistakeCount: number;
}

// ユーザー設定・記録 (永続化対象)
export interface UserSettings {
  isSoundEnabled: boolean;
  isHapticsEnabled: boolean;
  highScores: {
    [key in GameMode]: number; // ミリ秒単位のベストタイム
  };
}
3. ディレクトリ構成 (Expo Router Best Practices)
AIがコンテキストを理解しやすいよう、機能ごとに分離しつつフラットな構成を保ちます。

Plaintext

/app
  ├── _layout.tsx       # 全体レイアウト・プロバイダー設定
  ├── index.tsx         # Home Screen
  ├── game
  │   └── [mode].tsx    # Game Play Screen (動的ルート)
  └── result.tsx        # Result Screen
/src
  ├── components
  │   ├── ui            # 汎用部品 (Button, Card)
  │   └── game          # ゲーム固有部品 (GridBoard, TileCell, Timer)
  ├── hooks             # カスタムHooks
  │   ├── useGameLogic.ts  # ゲームの判定ロジック
  │   └── useStopwatch.ts  # 時間計測
  ├── lib               # ユーティリティ
  │   ├── generator.ts  # 問題生成ロジック (数字・文字のシャッフル)
  │   └── sounds.ts     # 音声再生管理
  ├── store             # 状態管理
  │   └── useStore.ts
  └── constants         # 定数 (色、難易度設定、かな文章リスト)
4. 状態管理・アーキテクチャ
Vibe Codingにおいて、複雑なReduxは推奨しません。シンプルかつ強力な以下の構成を採用します。

Global State: Zustand

ユーザー設定（音、振動、ハイスコア）の管理に使用。

persist ミドルウェアを使い、自動的にローカルストレージ（AsyncStorage/MMKV）に保存させます。

Local State: React.useState / useReducer

ゲーム中の高速な状態変化（タイルのクリア状況、タイマー）は、グローバルステートに入れず、useGameLogic.ts 内のローカルステートで完結させ、再レンダリングを最適化します。

Styling: NativeWind (Tailwind CSS)

className="flex-1 bg-gray-900 justify-center items-center" のように記述。AIの実装速度が最大化されます。

Router: Expo Router

ファイルベースルーティングにより、画面遷移のコード記述量を最小限に抑えます。

5. 外部連携・機能要件
MVP（Minimum Viable Product）ではバックエンドレス構成を推奨しますが、拡張性を考慮して以下を定義します。

Local Persistence (データ保存):

react-native-mmkv: 読み書きが非常に高速なキーバリューストア。ゲームのハイスコア保存における遅延をゼロにします。

Haptics (触覚):

expo-haptics: タイルタップ時の「カチッ」という物理的な反応を実装し、UXを向上させます。

Animations:

react-native-reanimated: タイルが消える際のアニメーションや、正解時のエフェクトに使用。UIスレッドで動作するため、連打してもカクつきません。

AdMob (マネタイズ - 将来実装):

react-native-google-mobile-ads を想定。Result画面の下部にバナー、またはリトライ数回ごとにインタースティシャル広告を表示する余地を残します。
