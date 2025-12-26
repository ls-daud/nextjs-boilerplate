"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { copy, i18n, Locale, localeLabels } from "@/lib/i18n";

const MIN_CHAR_COUNT = 10;
const MAX_CHAR_COUNT = 1000;

const revieweeProfile = {
  handle: "ls-daud",
  name: "Daud Abdilah Zubaidi",
  role: "Software Engineer",
  location: "lakesuccess-jp",
  photo: "/me.png",
};

const languages = i18n.locales.map((code) => ({
  code,
  label: localeLabels[code],
}));

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
  const [locale, setLocale] = useState<Locale>(i18n.defaultLocale);
  const [formFields, setFormFields] = useState<FormFields>({
    strengths: "",
    improvements: "",
    reviewerName: "",
  });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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

  const handleAnonymousChange = (event: ChangeEvent<HTMLInputElement>) => {
    resetStatusIfNeeded();
    const checked = event.target.checked;
    setIsAnonymous(checked);
    if (checked) {
      setFormFields((prev) => ({ ...prev, reviewerName: "" }));
    }
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
        reviewer_name: isAnonymous ? null : formFields.reviewerName.trim() || null,
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
    setIsAnonymous(false);
    setShowSuccess(true);
  };

  const charCounts = {
    strengths: formFields.strengths.length,
    improvements: formFields.improvements.length,
  };

  const statusTone =
    submission.state === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-slate-200 bg-slate-50 text-slate-600";
  const showStatus = submission.state === "error";
  const closeSuccessModal = () => {
    setShowSuccess(false);
    setSubmission({ state: "idle" });
  };

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-slate-200/70 bg-white/80 p-[1px] shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
        <div className="rounded-[30px] bg-gradient-to-br from-white via-slate-50 to-sky-50/70 p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="space-y-8">
              <header className="space-y-6 motion-rise">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-slate-500">
                    {t.badge}
                  </span>
                  <div
                    className="flex items-center gap-2"
                    role="group"
                    aria-label="Language toggle"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setLocale(lang.code)}
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                          locale === lang.code
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <Image
                      src={revieweeProfile.photo}
                      alt={
                        locale === "en"
                          ? "Daud Abdilah Zubaidi profile photo"
                          : "Daud Abdilah Zubaidiのプロフィール写真"
                      }
                      width={96}
                      height={96}
                      className="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-200"
                      priority
                    />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {revieweeProfile.handle}
                      </p>
                      <p className="text-lg font-semibold text-slate-900">
                        {revieweeProfile.name}
                      </p>
                      <p className="text-sm text-slate-600">{revieweeProfile.role}</p>
                      <p className="text-sm text-slate-500">{revieweeProfile.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                    {locale === "en" ? "Peer feedback" : "ピアフィードバック"}
                  </p>
                  <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                    {t.heroTitle}
                  </h1>
                  <p className="text-base leading-relaxed text-slate-600">
                    {t.heroSubtitle}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 text-sm text-slate-600 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">
                    {t.instructionTitle}
                  </p>
                  <p className="mt-2 leading-relaxed">{t.instructionBody}</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    {t.instructionBullets.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </header>

              <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm motion-rise delay-2">
                <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                  {t.helperTitle}
                </h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {t.helperBullets.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 text-sm text-slate-600 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                  {t.privacyHeading}
                </p>
                <p className="mt-3 leading-relaxed">{t.privacyBody}</p>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.12)] motion-rise delay-3">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                    {t.positiveMeta}
                  </p>
                  <label className="mt-3 block text-base font-semibold text-slate-900">
                    {t.positiveLabel}
                  </label>
                  <p className="mt-2 text-sm text-slate-600">{t.positiveHint}</p>
                  <textarea
                    className="mt-3 min-h-[220px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-[15px] leading-relaxed text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    placeholder={t.positivePlaceholder}
                    value={formFields.strengths}
                    onChange={(event) => handleFieldChange("strengths", event)}
                    maxLength={MAX_CHAR_COUNT}
                    minLength={MIN_CHAR_COUNT}
                    required
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
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

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                    {t.improvementMeta}
                  </p>
                  <label className="mt-3 block text-base font-semibold text-slate-900">
                    {t.improvementLabel}
                  </label>
                  <p className="mt-2 text-sm text-slate-600">{t.improvementHint}</p>
                  <textarea
                    className="mt-3 min-h-[220px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-[15px] leading-relaxed text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    placeholder={t.improvementPlaceholder}
                    value={formFields.improvements}
                    onChange={(event) => handleFieldChange("improvements", event)}
                    maxLength={MAX_CHAR_COUNT}
                    minLength={MIN_CHAR_COUNT}
                    required
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
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
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="text-sm font-semibold text-slate-900">
                      {t.nameLabel}
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                        checked={isAnonymous}
                        onChange={handleAnonymousChange}
                      />
                      {t.anonymousLabel}
                    </label>
                  </div>
                  <input
                    type="text"
                    className={`mt-3 w-full rounded-2xl border px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-100 ${
                      isAnonymous
                        ? "border-slate-200 bg-slate-100 text-slate-400"
                        : "border-slate-200 bg-white text-slate-900 focus:border-sky-400"
                    }`}
                    placeholder={t.nameHint}
                    value={formFields.reviewerName}
                    onChange={(event) => handleFieldChange("reviewerName", event)}
                    disabled={isAnonymous}
                  />
                  <p className="mt-2 text-xs text-slate-500">{t.nameHint}</p>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={submission.state === "submitting"}
                    className="w-full rounded-2xl bg-sky-600 px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submission.state === "submitting"
                      ? t.submittingCta
                      : t.submitCta}
                  </button>
                  {showStatus ? (
                    <div
                      role="status"
                      aria-live="polite"
                      className={`rounded-2xl border px-4 py-3 text-sm ${statusTone}`}
                    >
                      {submission.message}
                    </div>
                  ) : null}
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
      {showSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-900">{t.successTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{t.successBody}</p>
            <button
              type="button"
              onClick={closeSuccessModal}
              className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
