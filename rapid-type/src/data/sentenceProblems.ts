/**
 * Sentence Mode Problem Data - Mojic
 * Japanese proverbs, idioms, and phrases for Sentence mode
 */

export interface SentenceProblem {
  id: string;
  text: string;           // ひらがなのみ（プレイヤーがタップする文字列）
  display: string;        // 漢字混じり（表示用、任意）
  meaning: string;        // 意味（日本語）
  meaningEn: string;      // 意味（英語）
  category: SentenceCategory;
  difficulty: 'easy' | 'normal' | 'hard';
}

export type SentenceCategory =
  | 'proverb'      // ことわざ
  | 'idiom'        // 慣用句
  | 'food'         // 食べ物
  | 'animal'       // 動物
  | 'nature'       // 自然
  | 'life';        // 生活

/**
 * Sentence Problems Database
 * 50+ problems organized by category and difficulty
 */
export const SentenceProblems: SentenceProblem[] = [
  // ========== PROVERBS (ことわざ) - EASY ==========
  {
    id: 'proverb_001',
    text: 'いしのうえにもさんねん',
    display: '石の上にも三年',
    meaning: '辛抱強く続ければ必ず成功する',
    meaningEn: 'Persistence pays off',
    category: 'proverb',
    difficulty: 'easy',
  },
  {
    id: 'proverb_002',
    text: 'さるもきからおちる',
    display: '猿も木から落ちる',
    meaning: '名人でも失敗することがある',
    meaningEn: 'Even experts make mistakes',
    category: 'proverb',
    difficulty: 'easy',
  },
  {
    id: 'proverb_003',
    text: 'ちりもつもればやまとなる',
    display: '塵も積もれば山となる',
    meaning: '小さなものも積み重なれば大きくなる',
    meaningEn: 'Many a little makes a mickle',
    category: 'proverb',
    difficulty: 'easy',
  },
  {
    id: 'proverb_004',
    text: 'ななころびやおき',
    display: '七転び八起き',
    meaning: '何度失敗しても諦めずに立ち上がる',
    meaningEn: 'Fall seven times, stand up eight',
    category: 'proverb',
    difficulty: 'easy',
  },
  {
    id: 'proverb_005',
    text: 'いぬもあるけばぼうにあたる',
    display: '犬も歩けば棒に当たる',
    meaning: '行動すれば思わぬ幸運に出会う',
    meaningEn: 'Fortune comes to those who seek it',
    category: 'proverb',
    difficulty: 'easy',
  },
  {
    id: 'proverb_006',
    text: 'はなよりだんご',
    display: '花より団子',
    meaning: '風流より実益を取る',
    meaningEn: 'Practicality over aesthetics',
    category: 'proverb',
    difficulty: 'easy',
  },
  {
    id: 'proverb_007',
    text: 'ねこにこばん',
    display: '猫に小判',
    meaning: '価値のわからない者に与えても無駄',
    meaningEn: 'Casting pearls before swine',
    category: 'proverb',
    difficulty: 'easy',
  },
  {
    id: 'proverb_008',
    text: 'えびでたいをつる',
    display: '海老で鯛を釣る',
    meaning: '少ない投資で大きな利益を得る',
    meaningEn: 'A small investment yields big returns',
    category: 'proverb',
    difficulty: 'easy',
  },

  // ========== PROVERBS (ことわざ) - NORMAL ==========
  {
    id: 'proverb_009',
    text: 'あめふってじかたまる',
    display: '雨降って地固まる',
    meaning: '困難の後は状況が良くなる',
    meaningEn: 'After a storm comes a calm',
    category: 'proverb',
    difficulty: 'normal',
  },
  {
    id: 'proverb_010',
    text: 'じごうじとく',
    display: '自業自得',
    meaning: '自分の行いの結果は自分に返ってくる',
    meaningEn: 'You reap what you sow',
    category: 'proverb',
    difficulty: 'normal',
  },
  {
    id: 'proverb_011',
    text: 'いちごいちえ',
    display: '一期一会',
    meaning: '一生に一度の出会いを大切にする',
    meaningEn: 'Once in a lifetime encounter',
    category: 'proverb',
    difficulty: 'normal',
  },
  {
    id: 'proverb_012',
    text: 'せいてんのへきれき',
    display: '青天の霹靂',
    meaning: '突然の衝撃的な出来事',
    meaningEn: 'A bolt from the blue',
    category: 'proverb',
    difficulty: 'normal',
  },
  {
    id: 'proverb_013',
    text: 'おにのめにもなみだ',
    display: '鬼の目にも涙',
    meaning: '冷酷な人も時には感動する',
    meaningEn: 'Even the hardest heart can be moved',
    category: 'proverb',
    difficulty: 'normal',
  },
  {
    id: 'proverb_014',
    text: 'とらのいをかるきつね',
    display: '虎の威を借る狐',
    meaning: '他人の権力を利用して威張る',
    meaningEn: 'Borrowing authority from others',
    category: 'proverb',
    difficulty: 'normal',
  },
  {
    id: 'proverb_015',
    text: 'ぬかにくぎ',
    display: '糠に釘',
    meaning: '手応えがない、効果がない',
    meaningEn: 'Like talking to a wall',
    category: 'proverb',
    difficulty: 'normal',
  },

  // ========== PROVERBS (ことわざ) - HARD ==========
  {
    id: 'proverb_016',
    text: 'がりょうてんせい',
    display: '画竜点睛',
    meaning: '仕上げの最も重要な部分',
    meaningEn: 'The finishing touch',
    category: 'proverb',
    difficulty: 'hard',
  },
  {
    id: 'proverb_017',
    text: 'しんしょうぼうだい',
    display: '針小棒大',
    meaning: '物事を大げさに言うこと',
    meaningEn: 'Making a mountain out of a molehill',
    category: 'proverb',
    difficulty: 'hard',
  },
  {
    id: 'proverb_018',
    text: 'ごじゅっぽひゃっぽ',
    display: '五十歩百歩',
    meaning: '大差がない、似たり寄ったり',
    meaningEn: 'Six of one, half a dozen of the other',
    category: 'proverb',
    difficulty: 'hard',
  },

  // ========== IDIOMS (慣用句) - EASY ==========
  {
    id: 'idiom_001',
    text: 'あたまがいい',
    display: '頭がいい',
    meaning: '賢い、頭の回転が速い',
    meaningEn: 'Smart, clever',
    category: 'idiom',
    difficulty: 'easy',
  },
  {
    id: 'idiom_002',
    text: 'てをぬく',
    display: '手を抜く',
    meaning: '手間を省いて楽をする',
    meaningEn: 'Cut corners',
    category: 'idiom',
    difficulty: 'easy',
  },
  {
    id: 'idiom_003',
    text: 'きがきく',
    display: '気が利く',
    meaning: '細かいところに気がつく',
    meaningEn: 'Attentive, thoughtful',
    category: 'idiom',
    difficulty: 'easy',
  },
  {
    id: 'idiom_004',
    text: 'めがまわる',
    display: '目が回る',
    meaning: 'とても忙しい',
    meaningEn: 'Extremely busy',
    category: 'idiom',
    difficulty: 'easy',
  },
  {
    id: 'idiom_005',
    text: 'はらがたつ',
    display: '腹が立つ',
    meaning: '怒りを感じる',
    meaningEn: 'To get angry',
    category: 'idiom',
    difficulty: 'easy',
  },
  {
    id: 'idiom_006',
    text: 'みみがいたい',
    display: '耳が痛い',
    meaning: '批判されて辛い',
    meaningEn: 'Hard to hear criticism',
    category: 'idiom',
    difficulty: 'easy',
  },

  // ========== IDIOMS (慣用句) - NORMAL ==========
  {
    id: 'idiom_007',
    text: 'あしをひっぱる',
    display: '足を引っ張る',
    meaning: '他人の邪魔をする',
    meaningEn: 'To hold someone back',
    category: 'idiom',
    difficulty: 'normal',
  },
  {
    id: 'idiom_008',
    text: 'かたをもつ',
    display: '肩を持つ',
    meaning: '味方をする、支持する',
    meaningEn: 'To take sides with',
    category: 'idiom',
    difficulty: 'normal',
  },
  {
    id: 'idiom_009',
    text: 'くちがかるい',
    display: '口が軽い',
    meaning: '秘密を守れない',
    meaningEn: 'Unable to keep secrets',
    category: 'idiom',
    difficulty: 'normal',
  },
  {
    id: 'idiom_010',
    text: 'こしがひくい',
    display: '腰が低い',
    meaning: '謙虚で丁寧な態度',
    meaningEn: 'Humble and polite',
    category: 'idiom',
    difficulty: 'normal',
  },

  // ========== FOOD (食べ物) - EASY ==========
  {
    id: 'food_001',
    text: 'おにぎり',
    display: 'おにぎり',
    meaning: '米を握った日本の代表的な食べ物',
    meaningEn: 'Rice ball',
    category: 'food',
    difficulty: 'easy',
  },
  {
    id: 'food_002',
    text: 'らーめん',
    display: 'ラーメン',
    meaning: '中華風の麺料理',
    meaningEn: 'Ramen noodles',
    category: 'food',
    difficulty: 'easy',
  },
  {
    id: 'food_003',
    text: 'すし',
    display: '寿司',
    meaning: '酢飯と魚介類の料理',
    meaningEn: 'Sushi',
    category: 'food',
    difficulty: 'easy',
  },
  {
    id: 'food_004',
    text: 'てんぷら',
    display: '天ぷら',
    meaning: '衣をつけて揚げた料理',
    meaningEn: 'Tempura',
    category: 'food',
    difficulty: 'easy',
  },
  {
    id: 'food_005',
    text: 'みそしる',
    display: '味噌汁',
    meaning: '味噌を使った日本の伝統的なスープ',
    meaningEn: 'Miso soup',
    category: 'food',
    difficulty: 'easy',
  },
  {
    id: 'food_006',
    text: 'たこやき',
    display: 'たこ焼き',
    meaning: 'タコが入った丸い焼き物',
    meaningEn: 'Takoyaki (octopus balls)',
    category: 'food',
    difficulty: 'easy',
  },

  // ========== ANIMAL (動物) - EASY ==========
  {
    id: 'animal_001',
    text: 'いぬ',
    display: '犬',
    meaning: '人間の最良の友',
    meaningEn: 'Dog',
    category: 'animal',
    difficulty: 'easy',
  },
  {
    id: 'animal_002',
    text: 'ねこ',
    display: '猫',
    meaning: '人気のペット動物',
    meaningEn: 'Cat',
    category: 'animal',
    difficulty: 'easy',
  },
  {
    id: 'animal_003',
    text: 'うさぎ',
    display: '兎',
    meaning: '長い耳を持つ可愛い動物',
    meaningEn: 'Rabbit',
    category: 'animal',
    difficulty: 'easy',
  },
  {
    id: 'animal_004',
    text: 'ぱんだ',
    display: 'パンダ',
    meaning: '白と黒の模様を持つ熊',
    meaningEn: 'Panda',
    category: 'animal',
    difficulty: 'easy',
  },
  {
    id: 'animal_005',
    text: 'きりん',
    display: 'キリン',
    meaning: '首が長い動物',
    meaningEn: 'Giraffe',
    category: 'animal',
    difficulty: 'easy',
  },

  // ========== NATURE (自然) - EASY ==========
  {
    id: 'nature_001',
    text: 'さくら',
    display: '桜',
    meaning: '日本を代表する春の花',
    meaningEn: 'Cherry blossom',
    category: 'nature',
    difficulty: 'easy',
  },
  {
    id: 'nature_002',
    text: 'ふじさん',
    display: '富士山',
    meaning: '日本一高い山',
    meaningEn: 'Mount Fuji',
    category: 'nature',
    difficulty: 'easy',
  },
  {
    id: 'nature_003',
    text: 'たいよう',
    display: '太陽',
    meaning: '地球に光と熱を与える恒星',
    meaningEn: 'Sun',
    category: 'nature',
    difficulty: 'easy',
  },
  {
    id: 'nature_004',
    text: 'にじ',
    display: '虹',
    meaning: '雨上がりに空に現れる七色の光',
    meaningEn: 'Rainbow',
    category: 'nature',
    difficulty: 'easy',
  },
  {
    id: 'nature_005',
    text: 'うみ',
    display: '海',
    meaning: '塩水をたたえた広大な水域',
    meaningEn: 'Ocean, sea',
    category: 'nature',
    difficulty: 'easy',
  },

  // ========== LIFE (生活) - EASY ==========
  {
    id: 'life_001',
    text: 'おはよう',
    display: 'おはよう',
    meaning: '朝の挨拶',
    meaningEn: 'Good morning',
    category: 'life',
    difficulty: 'easy',
  },
  {
    id: 'life_002',
    text: 'ありがとう',
    display: 'ありがとう',
    meaning: '感謝の気持ちを表す言葉',
    meaningEn: 'Thank you',
    category: 'life',
    difficulty: 'easy',
  },
  {
    id: 'life_003',
    text: 'おやすみ',
    display: 'おやすみ',
    meaning: '寝る前の挨拶',
    meaningEn: 'Good night',
    category: 'life',
    difficulty: 'easy',
  },
  {
    id: 'life_004',
    text: 'いただきます',
    display: 'いただきます',
    meaning: '食事前の挨拶',
    meaningEn: 'Said before eating',
    category: 'life',
    difficulty: 'easy',
  },
  {
    id: 'life_005',
    text: 'ごちそうさま',
    display: 'ごちそうさま',
    meaning: '食事後の感謝の言葉',
    meaningEn: 'Said after eating',
    category: 'life',
    difficulty: 'easy',
  },
  {
    id: 'life_006',
    text: 'がんばって',
    display: '頑張って',
    meaning: '励ましの言葉',
    meaningEn: 'Do your best, good luck',
    category: 'life',
    difficulty: 'easy',
  },

  // ========== LIFE (生活) - NORMAL ==========
  {
    id: 'life_007',
    text: 'おつかれさま',
    display: 'お疲れ様',
    meaning: '労をねぎらう言葉',
    meaningEn: 'Thank you for your hard work',
    category: 'life',
    difficulty: 'normal',
  },
  {
    id: 'life_008',
    text: 'よろしくおねがいします',
    display: 'よろしくお願いします',
    meaning: '依頼や挨拶の言葉',
    meaningEn: 'Nice to meet you / Please',
    category: 'life',
    difficulty: 'normal',
  },
  {
    id: 'life_009',
    text: 'おじゃまします',
    display: 'お邪魔します',
    meaning: '他人の家に入る時の挨拶',
    meaningEn: 'Excuse me for intruding',
    category: 'life',
    difficulty: 'normal',
  },
  {
    id: 'life_010',
    text: 'おめでとう',
    display: 'おめでとう',
    meaning: 'お祝いの言葉',
    meaningEn: 'Congratulations',
    category: 'life',
    difficulty: 'easy',
  },
];

/**
 * Get problems by difficulty
 */
export const getProblemsByDifficulty = (
  difficulty: 'easy' | 'normal' | 'hard'
): SentenceProblem[] => {
  return SentenceProblems.filter((p) => p.difficulty === difficulty);
};

/**
 * Get problems by category
 */
export const getProblemsByCategory = (
  category: SentenceCategory
): SentenceProblem[] => {
  return SentenceProblems.filter((p) => p.category === category);
};

/**
 * Get random problem by difficulty
 */
export const getRandomProblem = (
  difficulty: 'easy' | 'normal' | 'hard'
): SentenceProblem => {
  const problems = getProblemsByDifficulty(difficulty);
  const randomIndex = Math.floor(Math.random() * problems.length);
  return problems[randomIndex];
};

/**
 * Get multiple random problems (non-repeating)
 */
export const getRandomProblems = (
  count: number,
  difficulty?: 'easy' | 'normal' | 'hard'
): SentenceProblem[] => {
  let pool = difficulty
    ? getProblemsByDifficulty(difficulty)
    : [...SentenceProblems];

  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export default SentenceProblems;
