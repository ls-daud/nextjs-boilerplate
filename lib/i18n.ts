export const i18n = {
  defaultLocale: "en",
  locales: ["en", "ja"],
} as const;

export type Locale = (typeof i18n.locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
};

type Copy = {
  heroTitle: string;
  heroSubtitle: string;
  badge: string;
  instructionTitle: string;
  instructionBody: string;
  instructionBullets: string[];
  positiveMeta: string;
  positiveLabel: string;
  positiveHint: string;
  positivePlaceholder: string;
  improvementMeta: string;
  improvementLabel: string;
  improvementHint: string;
  improvementPlaceholder: string;
  nameLabel: string;
  nameHint: string;
  anonymousLabel: string;
  helperTitle: string;
  helperBullets: string[];
  privacyHeading: string;
  privacyBody: string;
  submitCta: string;
  submittingCta: string;
  successTitle: string;
  successBody: string;
  invalidMessage: string;
  errorGeneric: string;
  envMissing: string;
};

export const copy: Record<Locale, Copy> = {
  en: {
    heroTitle: "Feedback for Daud",
    heroSubtitle:
      "I hope to improve next year. Please share concise, constructive feedback about what is going well and what could be improved.",
    badge: "Open until Jun 30",
    instructionTitle: "Quick guidance",
    instructionBody: "Focus on behaviors and impact.",
    instructionBullets: [
      "Keep positives and improvements separate.",
      "Add one concrete example if possible.",
      "English or Japanese is welcome.",
    ],
    positiveMeta: "Question 1 of 2",
    positiveLabel: "What is going well (Keep)",
    positiveHint: "Example: project contributions, collaboration, communication.",
    positivePlaceholder:
      "Example: You kept the release calm by aligning QA early; sharing the checklist sooner would make it even smoother.",
    improvementMeta: "Question 2 of 2",
    improvementLabel: "What could be improved (Improve)",
    improvementHint: "Offer a concrete change you'd like to see next time.",
    improvementPlaceholder:
      "Example: The kickoff was rushed; sending a brief agenda 24h ahead would help everyone prepare.",
    nameLabel: "Your name (optional)",
    nameHint: "Shown to Daud only if you decide to include it.",
    anonymousLabel: "Send feedback anonymously",
    helperTitle: "Tips for helpful feedback",
    helperBullets: [
      "Stick to specific behaviors rather than personality.",
      "Mention context and impact when you can.",
      "Honest feedback is appreciated.",
    ],
    privacyHeading: "Confidentiality",
    privacyBody: "The raw feedback is visible only to Daud.",
    submitCta: "Send feedback",
    submittingCta: "Sending...",
    successTitle: "Thank you!",
    successBody: "Thank you so much for your feedback and suggestions.",
    invalidMessage:
      "Please write at least ten characters in both sections so the feedback stays actionable.",
    errorGeneric:
      "Something went wrong while saving your feedback. Please try again in a moment.",
    envMissing:
      "Supabase is not configured yet. Please add the environment keys.",
  },
  ja: {
    heroTitle: "Daud へのフィードバック",
    heroSubtitle:
      "来年の成長に向けて、良い点と改善点を具体的に教えてください。",
    badge: "受付期限 6月30日",
    instructionTitle: "書き方のポイント",
    instructionBody: "行動と影響に絞ると読みやすくなります。",
    instructionBullets: [
      "良い点と改善点は分けて書く",
      "具体的なエピソードを入れる",
      "日本語・英語どちらでもOK",
    ],
    positiveMeta: "質問 1 / 2",
    positiveLabel: "良かった点（Keep）",
    positiveHint: "例: プロジェクト貢献、連携、コミュニケーションなど。",
    positivePlaceholder:
      "例: QAと早めに連携してリリースを安定させてくれた。次はチェックリストを先に共有するとさらに良い。",
    improvementMeta: "質問 2 / 2",
    improvementLabel: "改善できる点（Improve）",
    improvementHint: "次回こうすると良い、という提案を添えると助かります。",
    improvementPlaceholder:
      "例: キックオフが少し急だったので、24時間前に簡単なアジェンダがあると準備しやすい。",
    nameLabel: "お名前（任意）",
    nameHint: "記入すると本人にのみ表示されます。",
    anonymousLabel: "匿名で送信する",
    helperTitle: "より良いフィードバックのために",
    helperBullets: [
      "性格ではなく行動に触れる",
      "事実と影響をセットで書く",
      "率直でも、やさしい表現だと助かります。",
    ],
    privacyHeading: "共有範囲",
    privacyBody: "フィードバックの原文は本人のみが閲覧します。",
    submitCta: "フィードバックを送信",
    submittingCta: "送信中...",
    successTitle: "ありがとうございます！",
    successBody: "Thank you so much for your feedback and suggestions.",
    invalidMessage: "各欄10文字以上でご記入ください。",
    errorGeneric:
      "送信時にエラーが発生しました。時間をおいて再度お試しください。",
    envMissing:
      "Supabaseの環境変数が未設定です。環境キーを追加してください。",
  },
};
