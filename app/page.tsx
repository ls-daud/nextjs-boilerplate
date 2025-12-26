"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Locale = "en" | "ja";

type Copy = {
  heroTitle: string;
  heroSubtitle: string;
  badge: string;
  positiveLabel: string;
  positivePlaceholder: string;
  improvementLabel: string;
  improvementPlaceholder: string;
  nameLabel: string;
  nameHint: string;
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
  stats: { label: string; value: string }[];
};

const MIN_CHAR_COUNT = 10;
const MAX_CHAR_COUNT = 500;

const revieweeProfile = {
  name: "Daud Bachtiar",
  role: "Software Engineer",
  location: "Tokyo · Platform Team",
  photo:
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
};

const languages: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
];

const copy: Record<Locale, Copy> = {
  en: {
    heroTitle: "Performance review for Daud",
    heroSubtitle:
      "I am prepping my mid-year sync and would love your candid words on what to double down on and what to improve.",
    badge: "Open through 30 Jun",
    positiveLabel: "What have I done well, and how could it be even better?",
    positivePlaceholder:
      "Example: You closed the latency issue quickly by looping in the Tokyo API guild; next time, sharing the playbook proactively would help everyone.",
    improvementLabel:
      "What is not working or needs improvement, and how would you fix it?",
    improvementPlaceholder:
      "Example: Sprint planning felt rushed last cycle; publishing swim-lanes 24h earlier would give QA time to react.",
    nameLabel: "Your name (optional)",
    nameHint: "Leave blank if you prefer to stay anonymous.",
    helperTitle: "How to make this useful",
    helperBullets: [
      "Specific stories beat adjectives. Shout out moments, not just traits.",
      "Write in English or Japanese—whatever is fastest for you.",
      "Everything goes only to me and my direct engineering manager.",
    ],
    privacyHeading: "What happens next",
    privacyBody:
      "I will synthesize the patterns for my VP. Raw entries stay private and I may follow up if I need to clarify an example.",
    submitCta: "Send feedback",
    submittingCta: "Sending...",
    successTitle: "ありがとう / Thank you!",
    successBody:
      "I just logged your feedback. I read every line carefully and will circle back if I have follow-up questions.",
    invalidMessage:
      "Please share at least ten characters for both sections so the feedback stays actionable.",
    errorGeneric:
      "Something went wrong while saving your feedback. Please try again in a moment.",
    envMissing:
      "Supabase is not configured yet. Let Daud know so he can add the environment keys.",
    stats: [
      { label: "Sprint cadence", value: "2 weeks" },
      { label: "Focus area", value: "Craft + Collaboration" },
      { label: "Time needed", value: "~4 minutes" },
    ],
  },
  ja: {
    heroTitle: "ダウドのパフォーマンスレビュー",
    heroSubtitle:
      "ミッドイヤーレビューに向けて率直なフィードバックを集めています。良い点と改善してほしい点を、それぞれ丁寧に教えてください。",
    badge: "6月30日まで受付",
    positiveLabel: "良かった点と、さらに良くするためのヒント",
    positivePlaceholder:
      "例: 東京APIギルドを巻き込んでレイテンシー問題を素早く解決してくれた。今後はプレイブックを事前共有すると皆が動きやすいと思います。",
    improvementLabel: "課題や直したい点、その改善案",
    improvementPlaceholder:
      "例: 直近のスプリント計画は少し急ぎすぎていたので、24時間前にスイムレーンを共有するとQAが準備しやすいです。",
    nameLabel: "お名前 (任意)",
    nameHint: "匿名希望の場合は空欄のままにしてください。",
    helperTitle: "書き方のヒント",
    helperBullets: [
      "抽象的な形容詞よりも具体的な出来事があると助かります。",
      "英語でも日本語でも、書きやすい言語で構いません。",
      "内容は私と直属マネージャーのみが共有します。",
    ],
    privacyHeading: "送信後の扱い",
    privacyBody:
      "頂いた内容は私が整理し、必要に応じてマネージャーへサマリーを共有します。原文はクローズドに保ちます。",
    submitCta: "フィードバックを送信",
    submittingCta: "送信中...",
    successTitle: "ありがとうございます！",
    successBody:
      "フィードバックを受け取りました。すべて目を通し、追加で伺いたい点があれば個別に連絡します。",
    invalidMessage:
      "各フィールドを10文字以上でご記入ください。",
    errorGeneric:
      "送信時にエラーが発生しました。時間をおいて再度お試しください。",
    envMissing:
      "Supabaseの環境変数が未設定です。Daudに連絡して設定を追加してもらってください。",
    stats: [
      { label: "スプリント", value: "2週間" },
      { label: "注力テーマ", value: "品質と連携" },
      { label: "所要時間", value: "約4分" },
    ],
  },
};

type FormFields = {
  strengths: string;
  improvements: string;
  reviewerName: string;
};

type SubmissionState =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [formFields, setFormFields] = useState<FormFields>({
    strengths: "",
    improvements: "",
    reviewerName: "",
  });
  const [submission, setSubmission] = useState<SubmissionState>({ state: "idle" });
  const t = copy[locale];

  const trimmedStrengths = formFields.strengths.trim();
  const trimmedImprovements = formFields.improvements.trim();

  const isValid =
    trimmedStrengths.length >= MIN_CHAR_COUNT &&
    trimmedImprovements.length >= MIN_CHAR_COUNT;

  const resetStatusIfNeeded = () => {
    setSubmission((current) =>
      current.state === "idle" || current.state === "submitting"
        ? current
        : { state: "idle" }
    );
  };

  const handleFieldChange = (
    field: keyof FormFields,
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    resetStatusIfNeeded();
    setFormFields((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      setSubmission({ state: "error", message: t.invalidMessage });
      return;
    }

    if (!supabase) {
      setSubmission({ state: "error", message: t.envMissing });
      return;
    }

    setSubmission({ state: "submitting" });

    const { error } = await supabase.from("feedback").insert([
      {
        reviewee: revieweeProfile.name,
        reviewer_name: formFields.reviewerName.trim() || null,
        good_feedback: trimmedStrengths,
        improve_feedback: trimmedImprovements,
        language: locale,
      },
    ]);

    if (error) {
      setSubmission({ state: "error", message: t.errorGeneric });
      return;
    }

    setSubmission({ state: "success", message: t.successBody });
    setFormFields({ strengths: "", improvements: "", reviewerName: "" });
  };

  const charCounts = {
    strengths: formFields.strengths.length,
    improvements: formFields.improvements.length,
  };

  const statusColor =
    submission.state === "success"
      ? "text-emerald-300"
      : submission.state === "error"
        ? "text-rose-300"
        : "text-white/70";

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-white/10 bg-white/5 p-[1px] shadow-[0_40px_120px_rgba(2,6,23,0.65)]">
        <div className="rounded-[30px] bg-gradient-to-br from-white/10 via-white/5 to-transparent p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <section className="space-y-8">
              <header className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="rounded-full border border-white/20 px-5 py-1.5 text-xs uppercase tracking-[0.3em] text-white/80">
                    {t.badge}
                  </span>
                  <div className="flex items-center gap-2" role="group" aria-label="Language toggle">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setLocale(lang.code)}
                        className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                          locale === lang.code
                            ? "border-white bg-white/90 text-slate-900"
                            : "border-white/20 text-white/70 hover:border-white/50"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-sm uppercase tracking-[0.6em] text-orange-200">
                  {revieweeProfile.location}
                </p>
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold text-white sm:text-5xl">
                    {t.heroTitle}
                  </h1>
                  <p className="text-lg text-white/80">{t.heroSubtitle}</p>
                </div>
              </header>

              <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-white/15 bg-black/20 p-6">
                  <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                    <Image
                      src={revieweeProfile.photo}
                      alt="Daud profile"
                      width={160}
                      height={160}
                      className="h-32 w-32 rounded-2xl object-cover ring-2 ring-white/40"
                      priority
                    />
                    <div className="space-y-2">
                      <p className="text-2xl font-semibold text-white">
                        {revieweeProfile.name}
                      </p>
                      <p className="text-sm text-white/70">{revieweeProfile.role}</p>
                      <p className="text-sm text-white/60">
                        {locale === "en"
                          ? "Currently shaping developer experience across Japan."
                          : "日本の開発者体験向上に取り組んでいます。"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/15 bg-black/20 p-6">
                  <h3 className="text-sm uppercase tracking-[0.4em] text-white/60">
                    {locale === "en" ? "Snapshot" : "スナップショット"}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {t.stats.map((stat) => (
                      <li key={stat.label} className="flex items-center justify-between text-white/80">
                        <span className="text-sm text-white/60">{stat.label}</span>
                        <span className="text-base font-semibold">{stat.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-white/70">
                  {t.helperTitle}
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/80">
                  {t.helperBullets.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="rounded-3xl border border-white/20 bg-black/30 p-6 shadow-[0_25px_80px_rgba(2,6,23,0.55)]">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-semibold text-white/80">
                    {t.positiveLabel}
                  </label>
                  <textarea
                    className="mt-3 min-h-[140px] w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-base text-white/90 focus:border-white focus:outline-none"
                    placeholder={t.positivePlaceholder}
                    value={formFields.strengths}
                    onChange={(event) => handleFieldChange("strengths", event)}
                    maxLength={MAX_CHAR_COUNT}
                    minLength={MIN_CHAR_COUNT}
                    required
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-white/60">
                    <span>
                      {locale === "en"
                        ? `Min ${MIN_CHAR_COUNT} characters`
                        : `最低${MIN_CHAR_COUNT}文字`}
                    </span>
                    <span>
                      {charCounts.strengths}/{MAX_CHAR_COUNT}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-white/80">
                    {t.improvementLabel}
                  </label>
                  <textarea
                    className="mt-3 min-h-[140px] w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-base text-white/90 focus:border-white focus:outline-none"
                    placeholder={t.improvementPlaceholder}
                    value={formFields.improvements}
                    onChange={(event) => handleFieldChange("improvements", event)}
                    maxLength={MAX_CHAR_COUNT}
                    minLength={MIN_CHAR_COUNT}
                    required
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-white/60">
                    <span>
                      {locale === "en"
                        ? `Min ${MIN_CHAR_COUNT} characters`
                        : `最低${MIN_CHAR_COUNT}文字`}
                    </span>
                    <span>
                      {charCounts.improvements}/{MAX_CHAR_COUNT}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-white/80">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-base text-white/90 focus:border-white focus:outline-none"
                    placeholder={t.nameHint}
                    value={formFields.reviewerName}
                    onChange={(event) => handleFieldChange("reviewerName", event)}
                  />
                  <p className="mt-2 text-xs text-white/60">{t.nameHint}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  <p className="font-semibold text-white">{t.privacyHeading}</p>
                  <p className="mt-2 leading-relaxed">{t.privacyBody}</p>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={!isValid || submission.state === "submitting"}
                    className="w-full rounded-2xl bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submission.state === "submitting"
                      ? t.submittingCta
                      : t.submitCta}
                  </button>
                  <p aria-live="polite" className={`text-sm ${statusColor}`}>
                    {submission.state === "success"
                      ? `${t.successTitle} ${submission.message}`
                      : submission.state === "error"
                        ? submission.message
                        : ""}
                  </p>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
