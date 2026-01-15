/**
 * Japanese translations - Mojic
 */

export const ja = {
  // App
  app: {
    name: "Mojic",
    tagline: "反射神経を鍛えよう",
  },

  // Home Screen
  home: {
    selectMode: "ゲームモードを選択",
    difficulty: "難易度",
    startGame: "ゲームスタート",
    scores: "スコア",
    settings: "設定",
    awards: "実績",
    darkMode: "ダークモード",
    active: "選択中",
  },

  // Game Modes
  modes: {
    numbers: "数字",
    numbersDesc: "1から順番にタップ",
    alphabet: "アルファベット",
    alphabetDesc: "AからZを順番にタップ",
    sentence: "文章",
    sentenceDesc: "文字を順番にタップ",
    findNumber: "数字探し",
    findNumberDesc: "ターゲットを見つけてタップ",
    flash: "フラッシュ",
    flashDesc: "光ったらタップ",
  },

  // Difficulty
  difficulty: {
    easy: "かんたん",
    normal: "ふつう",
    hard: "むずかしい",
  },

  // Game Screen
  game: {
    time: "タイム",
    next: "次",
    progress: "進捗",
    accuracy: "正確性",
    pause: "一時停止",
    resume: "再開",
    restart: "やり直し",
    quit: "終了",
    paused: "一時停止中",
    currentSentence: "お題",
    category: "カテゴリ",
    proverb: "ことわざ",
    target: "ターゲット",
    find: "探す",
    findThis: "この数字を探せ",
    searchGrid: "グリッドを探そう",
  },

  // Countdown
  countdown: {
    ready: "準備は？",
    go: "スタート！",
  },

  // Pause Screen
  pause: {
    title: "一時停止",
    subtitle: "ちょっと休憩",
    time: "タイム",
    progress: "進捗",
    resume: "再開する",
    restart: "やり直す",
    quit: "ゲームを終了",
  },

  // Exit Confirm Dialog
  exitConfirm: {
    title: "ゲームを終了しますか？",
    message: "進行状況は保存されません。本当に終了しますか？",
    cancel: "キャンセル",
    confirm: "終了する",
  },

  // Result Screen
  result: {
    clear: "クリア！",
    excellent: "素晴らしいパフォーマンス",
    great: "よくできました！",
    good: "がんばりました",
    tryAgain: "練習を続けよう",
    finalTime: "最終タイム",
    record: "記録",
    newBest: "自己ベスト更新！",
    rank: "ランク",
    tps: "TPS",
    tapsPerSecond: "タップ/秒",
    consistency: "タップの安定性",
    retry: "もう一度",
    nextLevel: "次のレベル",
    share: "結果をシェア",
    home: "ホーム",
    penalty: "ペナルティ",
    mistakes: "ミス",
    noPenalty: "ペナルティなし",
  },

  // Settings
  settings: {
    title: "設定",
    preferences: "設定項目",
    darkMode: "ダークモード",
    darkModeDesc: "暗い場所で目の負担を軽減",
    sound: "効果音",
    soundDesc: "タップやクリア時に音を再生",
    haptics: "振動フィードバック",
    hapticsDesc: "タップやイベント時に振動",
    language: "言語",
    languageDesc: "アプリの言語を選択",
    statistics: "統計",
    gamesPlayed: "プレイ回数",
    totalPlayTime: "総プレイ時間",
    currentStreak: "連続記録",
    longestStreak: "最長連続記録",
    days: "日",
    version: "バージョン",
  },

  // Statistics Screen
  stats: {
    title: "統計",
    overview: "概要",
    bestTimes: "ベストタイム",
    noRecords: "まだ記録がありません",
    playToRecord: "ゲームをプレイして記録を作ろう！",
    totalGames: "総プレイ数",
    avgTime: "平均タイム",
    avgAccuracy: "平均正確性",
    history: "最近の履歴",
  },

  // Achievements
  achievements: {
    title: "実績",
    unlocked: "解除済み",
    locked: "未解除",
    progress: "進捗",
    // Achievement names
    firstClear: "はじめの一歩",
    firstClearDesc: "最初のゲームをクリア",
    speedDemon: "スピードスター",
    speedDemonDesc: "数字モードを10秒以内にクリア",
    perfectionist: "パーフェクト",
    perfectionistDesc: "正確性100%でクリア",
    marathoner: "マラソンランナー",
    marathonerDesc: "100回プレイ",
    weekStreak: "一週間の戦士",
    weekStreakDesc: "7日連続でプレイ",
    monthStreak: "一ヶ月の達人",
    monthStreakDesc: "30日連続でプレイ",
    numberMaster: "数字マスター",
    numberMasterDesc: "数字モード・難しいをクリア",
    alphabetMaster: "アルファベットマスター",
    alphabetMasterDesc: "アルファベットモード・難しいをクリア",
    sentenceMaster: "文章マスター",
    sentenceMasterDesc: "文章モードを50回クリア",
    noMistake: "ノーミス",
    noMistakeDesc: "ミスなしで10回クリア",
  },

  // Tutorial
  tutorial: {
    skip: "スキップ",
    next: "次へ",
    done: "始める！",
    // Slides
    slide1Title: "Mojicへようこそ！",
    slide1Desc: "反射神経とパターン認識を鍛えよう",
    slide2Title: "順番にタップ",
    slide2Desc: "数字や文字を正しい順番で見つけてタップ",
    slide3Title: "速さが大事",
    slide3Desc: "早くクリアするほど良いランクに！",
    slide4Title: "ミスに注意",
    slide4Desc: "間違えるとペナルティタイムが追加。集中！",
  },

  // Errors & Feedback
  feedback: {
    correct: "正解！",
    incorrect: "ミス！",
    penaltyTime: "+{{time}}秒",
  },

  // Time formatting
  time: {
    hours: "時間",
    minutes: "分",
    seconds: "秒",
  },

  // Empty states
  empty: {
    noScores: "まだスコアがありません",
    playFirst: "まずはゲームをプレイしよう！",
    noAchievements: "まだ実績がありません",
    keepPlaying: "プレイを続けて実績を解除しよう！",
  },

  // Ads
  ads: {
    watchAd: "広告を見る",
    getBonus: "ボーナスをもらう",
    noThanks: "今はいい",
  },
};
