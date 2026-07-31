import { SiteHeader } from "@/components/layout/SiteHeader";
import { HealthDisclaimer } from "@/components/community/HealthDisclaimer";
import { BearFace } from "@/components/mascot/BearFace";
import { BetaLandingForm } from "./BetaLandingForm";

const KEY_POINTS = [
  {
    emoji: "🙋",
    text: "Fini de se sentir spectateur. À chaque visite, l'app vous dit précisément ce que vous pouvez faire aujourd'hui pour aider votre proche à progresser.",
  },
  {
    emoji: "🗣️",
    text: "La guidance verbale : aider avec des mots, pas avec vos bras. Les bons mots au bon moment fatiguent bien moins que de porter, soutenir ou pousser à sa place.",
  },
  {
    emoji: "🎯",
    text: "Des exercices adaptés à sa situation, conçus avec des enseignants en activité physique adaptée.",
  },
  {
    emoji: "🏡",
    text: "La réadaptation continue après la sortie — vous n'êtes plus seul(e) une fois rentrés à la maison.",
  },
] as const;

export default function BetaPage() {
  return (
    <div className="relative min-h-full overflow-x-hidden bg-[linear-gradient(165deg,#d8efe9_0%,#eef7f4_38%,#f4f8f6_68%,#e7f2ee_100%)] text-text">
      <SiteHeader variant="minimal" />

      {/* —— Hero: one composition —— */}
      <section
        aria-label="Accueil Proche+"
        className="relative flex min-h-[100dvh] flex-col"
      >
        {/* Atmospheric plane — full-bleed, not a card */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="animate-mist-drift absolute -left-[20%] top-[-10%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgb(42_157_143/0.28),transparent_68%)] blur-2xl" />
          <div className="animate-mist-drift absolute -right-[15%] bottom-[-5%] h-[55%] w-[60%] rounded-full bg-[radial-gradient(circle,rgb(245_200_66/0.22),transparent_70%)] blur-2xl [animation-delay:2s]" />
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(to_top,rgb(31_122_111/0.12),transparent)]" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pb-8 pt-16 sm:px-8 sm:pt-20">
          <div className="flex flex-1 flex-col items-center text-center">
            <p
              className="animate-fade-up font-[family-name:var(--font-beta-display)] text-[clamp(2.75rem,12vw,5.5rem)] font-semibold leading-none tracking-tight text-teal-dark"
              style={{ animationDelay: "40ms" }}
            >
              Proche+
            </p>

            <h1
              className="animate-fade-up mt-5 max-w-xl text-balance text-[clamp(1.2rem,3.6vw,1.65rem)] font-bold leading-snug text-text"
              style={{ animationDelay: "120ms" }}
            >
              Vous voulez aider. Vous ne savez pas comment.
              <br className="hidden sm:block" /> Voilà qui change.
            </h1>

            <p
              className="animate-fade-up mt-4 max-w-lg text-pretty text-base leading-relaxed text-text-muted sm:text-lg"
              style={{ animationDelay: "200ms" }}
            >
              Proche+ transforme chaque visite en un moment où vous êtes vraiment
              utile — sans épuiser votre dos, sans deviner, sans culpabiliser de
              &quot;mal faire&quot;.
            </p>

            <div
              className="animate-fade-up mt-7 flex flex-col items-center gap-3 sm:flex-row"
              style={{ animationDelay: "280ms" }}
            >
              <a
                href="#inscription"
                className="animate-cta-glow touch-target inline-flex items-center justify-center rounded-2xl bg-teal px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-teal-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                Je participe au test
              </a>
              <a
                href="#pourquoi"
                className="touch-target inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-teal-dark transition-colors hover:bg-teal/10"
              >
                Découvrir comment
              </a>
            </div>

            {/* Dominant mascot — edge-to-edge atmosphere, centered */}
            <div
              className="animate-fade-up relative mt-auto flex w-full flex-1 items-end justify-center pt-6"
              style={{ animationDelay: "360ms" }}
            >
              <div className="animate-mascot-float relative mx-auto aspect-[4/5] w-[min(92vw,420px)] max-h-[46vh]">
                <div
                  aria-hidden
                  className="absolute inset-x-[8%] bottom-0 top-[18%] rounded-[45%] bg-[radial-gradient(ellipse_at_center,rgb(42_157_143/0.18),transparent_72%)]"
                />
                <BearFace
                  pose="welcome"
                  variant="body"
                  className="relative mx-auto h-full w-full"
                  decorative={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* —— 4 key points —— */}
      <section
        id="pourquoi"
        aria-labelledby="pourquoi-title"
        className="relative border-t border-teal/10 bg-[linear-gradient(180deg,#f7fbfa_0%,#eef6f3_100%)] px-5 py-16 sm:px-8"
      >
        <div className="mx-auto max-w-2xl">
          <h2
            id="pourquoi-title"
            className="font-[family-name:var(--font-beta-display)] text-center text-2xl font-semibold tracking-tight text-teal-dark sm:text-3xl"
          >
            Ce qui change, concrètement
          </h2>
          <ul className="mt-10 space-y-8">
            {KEY_POINTS.map((point, i) => (
              <li
                key={point.emoji}
                className="animate-fade-up flex gap-4"
                style={{ animationDelay: `${80 + i * 70}ms` }}
              >
                <span
                  className="mt-0.5 shrink-0 text-2xl leading-none"
                  aria-hidden
                >
                  {point.emoji}
                </span>
                <p className="text-base leading-relaxed text-text sm:text-lg">
                  {point.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* —— Form: co-construction —— */}
      <section
        id="inscription"
        aria-labelledby="inscription-title"
        className="relative px-5 py-16 sm:px-8"
      >
        <div className="mx-auto max-w-lg">
          <div className="text-center">
            <h2
              id="inscription-title"
              className="font-[family-name:var(--font-beta-display)] text-2xl font-semibold tracking-tight text-teal-dark sm:text-3xl"
            >
              Le site sera bientôt ouvert en test — et on a besoin de vous.
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-text-muted sm:text-lg">
              Inscrivez votre email pour être parmi les premiers aidants à
              l&apos;essayer. Vos retours serviront directement à construire la
              version finale.
            </p>
          </div>

          <div className="mt-8">
            <BetaLandingForm />
          </div>
        </div>
      </section>

      {/* —— Health disclaimer (end) —— */}
      <section
        aria-label="Avertissement santé"
        className="border-t border-teal/10 bg-teal-dark/[0.04] px-5 py-10 sm:px-8"
      >
        <div className="mx-auto max-w-2xl">
          <HealthDisclaimer className="border-0 bg-transparent p-0 text-sm leading-relaxed text-text-muted [&_p:first-child]:font-semibold [&_p:first-child]:text-text" />
        </div>
      </section>
    </div>
  );
}
