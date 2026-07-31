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
    <div className="relative min-h-full overflow-x-hidden bg-gradient-to-b from-cream via-cream to-teal/10 text-text">
      <SiteHeader variant="minimal" />

      {/* —— Hero: brand + copy left, bear right —— */}
      <section
        aria-label="Accueil Proche+"
        className="relative flex min-h-[min(100dvh,920px)] flex-col"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="animate-mist-drift absolute -left-[18%] top-[-8%] h-[55%] w-[55%] rounded-full bg-[radial-gradient(circle,rgb(42_157_143/0.12),transparent_70%)] blur-2xl" />
          <div className="animate-mist-drift absolute -right-[12%] bottom-[-4%] h-[48%] w-[50%] rounded-full bg-[radial-gradient(circle,rgb(245_200_66/0.14),transparent_72%)] blur-2xl [animation-delay:2s]" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 items-center gap-8 px-5 pb-12 pt-14 sm:px-8 sm:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 lg:pb-16">
          {/* Copy column */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <p
              className="animate-fade-up font-[family-name:var(--font-beta-display)] text-[clamp(2.75rem,11vw,4.75rem)] font-semibold leading-none tracking-tight text-teal-dark"
              style={{ animationDelay: "40ms" }}
            >
              Proche+
            </p>

            <h1
              className="animate-fade-up mt-5 max-w-xl text-balance text-[clamp(1.25rem,3.4vw,1.7rem)] font-bold leading-snug text-text"
              style={{ animationDelay: "120ms" }}
            >
              Vous voulez aider. Vous ne savez pas comment.
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
              className="animate-fade-up mt-7 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center lg:justify-start"
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
          </div>

          {/* Bear column — right on desktop; below copy on mobile (brand stays first) */}
          <div
            className="animate-fade-up flex justify-center lg:justify-end"
            style={{ animationDelay: "320ms" }}
          >
            <div className="animate-mascot-float relative aspect-[4/5] w-[min(72vw,320px)] max-h-[42vh] lg:w-[min(100%,380px)] lg:max-h-[min(58vh,480px)]">
              <div
                aria-hidden
                className="absolute inset-x-[10%] bottom-[4%] top-[22%] rounded-[45%] bg-[radial-gradient(ellipse_at_center,rgb(42_157_143/0.1),transparent_72%)]"
              />
              <BearFace
                pose="welcome"
                variant="body"
                className="relative h-full w-full"
                decorative={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* —— 4 key points —— */}
      <section
        id="pourquoi"
        aria-labelledby="pourquoi-title"
        className="relative border-t border-cream-dark bg-cream-dark/40 px-5 py-16 sm:px-8"
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
        className="border-t border-cream-dark bg-cream-dark/30 px-5 py-10 sm:px-8"
      >
        <div className="mx-auto max-w-2xl">
          <HealthDisclaimer className="border-0 bg-transparent p-0 text-sm leading-relaxed text-text-muted [&_p:first-child]:font-semibold [&_p:first-child]:text-text" />
        </div>
      </section>
    </div>
  );
}
