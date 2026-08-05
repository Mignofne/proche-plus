import {
  AbsoluteFill,
  Img,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { RemotionExerciseTutoProps } from "@/lib/exercises/tuto-video-core";
import {
  DEFAULT_TUTO_INTRO_FRAMES,
  DEFAULT_TUTO_OUTRO_FRAMES,
  DEFAULT_TUTO_STEP_FRAMES,
  TUTO_TYPO,
  splitInstructionForDisplay,
} from "@/lib/exercises/tuto-video-core";

const COLORS = {
  cream: "#FAF7F2",
  ink: "#2D2A26",
  muted: "#5C534A",
  teal: "#2A9D8F",
  sun: "#F5C842",
  terracotta: "#C67B5C",
  panel: "#F3EDE4",
};

function toStaticRel(src: string): string {
  return src.startsWith("/") ? src.slice(1) : src;
}

function accentColor(accent: RemotionExerciseTutoProps["accent"]): string {
  if (accent === "sun") return COLORS.sun;
  if (accent === "terracotta") return COLORS.terracotta;
  return COLORS.teal;
}

/** Bandeau instruction XL — lisible aidant / senior */
function InstructionPanel({
  exerciseName,
  themeLabel,
  levelCode,
  tier,
  stepLabel,
  instruction,
  objective,
  accent,
  mode,
}: {
  exerciseName: string;
  themeLabel: string;
  levelCode: string;
  tier: number;
  stepLabel?: string;
  instruction?: string;
  objective?: string;
  accent: RemotionExerciseTutoProps["accent"];
  mode: "intro" | "step" | "outro";
}) {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const fade = spring({ frame, fps, config: { damping: 20, stiffness: 90 } });
  const pad = width * 0.06;
  const accentHex = accentColor(accent);

  const lines =
    instruction != null
      ? splitInstructionForDisplay(instruction, width > 1200 ? 36 : 28)
      : [];

  const instructionSize =
    lines.some((l) => l.length > 28)
      ? TUTO_TYPO.instructionMin
      : TUTO_TYPO.instruction;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.panel,
        fontFamily: "Nunito, system-ui, sans-serif",
        padding: `${pad}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        opacity: fade,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <span
          style={{
            color: accentHex,
            fontWeight: 800,
            fontSize: TUTO_TYPO.meta,
            letterSpacing: "-0.02em",
          }}
        >
          Proche+
        </span>
        <span
          style={{
            color: COLORS.muted,
            fontWeight: 700,
            fontSize: TUTO_TYPO.meta - 2,
            textAlign: "right",
          }}
        >
          {themeLabel} · {levelCode} · p{tier}
        </span>
      </div>

      {mode === "intro" && (
        <>
          <h1
            style={{
              margin: 0,
              color: COLORS.ink,
              fontSize: TUTO_TYPO.exerciseTitle,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
            }}
          >
            {exerciseName}
          </h1>
          {objective ? (
            <p
              style={{
                marginTop: 20,
                color: COLORS.muted,
                fontSize: TUTO_TYPO.objective,
                fontWeight: 600,
                lineHeight: 1.35,
              }}
            >
              {objective}
            </p>
          ) : null}
        </>
      )}

      {mode === "step" && stepLabel && instruction && (
        <>
          <div
            style={{
              alignSelf: "flex-start",
              background: accentHex,
              color: COLORS.cream,
              fontWeight: 800,
              fontSize: TUTO_TYPO.stepBadge,
              padding: "10px 22px",
              borderRadius: 999,
              marginBottom: 20,
            }}
          >
            {stepLabel}
          </div>
          {lines.map((line, i) => (
            <p
              key={i}
              style={{
                margin: i === 0 ? 0 : "8px 0 0",
                color: COLORS.ink,
                fontSize: instructionSize,
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              « {line} »
            </p>
          ))}
        </>
      )}

      {mode === "outro" && (
        <p
          style={{
            margin: 0,
            color: COLORS.ink,
            fontSize: TUTO_TYPO.instruction,
            fontWeight: 800,
            lineHeight: 1.2,
            textAlign: "center",
          }}
        >
          Bravo — à ton rythme.
        </p>
      )}
    </AbsoluteFill>
  );
}

function DemoPanel({ sceneSrc }: { sceneSrc: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inAnim = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80 },
  });
  const scale = interpolate(inAnim, [0, 1], [0.96, 1]);

  return (
    <AbsoluteFill style={{ background: COLORS.cream, overflow: "hidden" }}>
      <Img
        src={staticFile(toStaticRel(sceneSrc))}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center bottom",
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
}

/** Layout tuto : instructions EN GROS en haut, ours en démo en bas (9:16) */
function TutoStepFrame({
  exerciseName,
  themeLabel,
  levelCode,
  tier,
  stepIndex,
  stepTotal,
  instruction,
  sceneSrc,
  accent,
}: {
  exerciseName: string;
  themeLabel: string;
  levelCode: string;
  tier: number;
  stepIndex: number;
  stepTotal: number;
  instruction: string;
  sceneSrc: string;
  accent: RemotionExerciseTutoProps["accent"];
}) {
  const { height } = useVideoConfig();
  const instructionHeight = Math.round(height * 0.38);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: instructionHeight }}>
        <InstructionPanel
          exerciseName={exerciseName}
          themeLabel={themeLabel}
          levelCode={levelCode}
          tier={tier}
          stepLabel={`Étape ${stepIndex} / ${stepTotal}`}
          instruction={instruction}
          accent={accent}
          mode="step"
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: instructionHeight,
          bottom: 0,
        }}
      >
        <DemoPanel sceneSrc={sceneSrc} />
      </div>
    </AbsoluteFill>
  );
}

/**
 * Vidéo tuto exercice — une étape = consigne XL + démo ours.
 * Spec : docs/exercise-tuto-video-spec.md
 */
export const ProchePlusExerciseTuto: React.FC<RemotionExerciseTutoProps> = ({
  exerciseName,
  themeLabel,
  levelCode,
  tier,
  objective,
  steps,
  introFrames = DEFAULT_TUTO_INTRO_FRAMES,
  outroFrames = DEFAULT_TUTO_OUTRO_FRAMES,
  defaultStepFrames = DEFAULT_TUTO_STEP_FRAMES,
  accent = "teal",
}) => {
  const { height } = useVideoConfig();
  const instructionHeight = Math.round(height * 0.42);
  const safeSteps = steps.length > 0 ? steps : [];

  return (
    <AbsoluteFill style={{ background: COLORS.cream }}>
      <Series>
        <Series.Sequence durationInFrames={introFrames}>
          <AbsoluteFill>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: instructionHeight,
              }}
            >
              <InstructionPanel
                exerciseName={exerciseName}
                themeLabel={themeLabel}
                levelCode={levelCode}
                tier={tier}
                objective={objective}
                accent={accent}
                mode="intro"
              />
            </div>
            {safeSteps[0] ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: instructionHeight,
                  bottom: 0,
                }}
              >
                <DemoPanel sceneSrc={safeSteps[0].sceneSrc} />
              </div>
            ) : null}
          </AbsoluteFill>
        </Series.Sequence>

        {safeSteps.map((step, i) => (
          <Series.Sequence
            key={`${step.sceneSrc}-${i}`}
            durationInFrames={step.durationInFrames ?? defaultStepFrames}
          >
            <TutoStepFrame
              exerciseName={exerciseName}
              themeLabel={themeLabel}
              levelCode={levelCode}
              tier={tier}
              stepIndex={i + 1}
              stepTotal={safeSteps.length}
              instruction={step.instruction}
              sceneSrc={step.sceneSrc}
              accent={accent}
            />
          </Series.Sequence>
        ))}

        <Series.Sequence durationInFrames={outroFrames}>
          <AbsoluteFill>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: instructionHeight,
              }}
            >
              <InstructionPanel
                exerciseName={exerciseName}
                themeLabel={themeLabel}
                levelCode={levelCode}
                tier={tier}
                accent={accent}
                mode="outro"
              />
            </div>
            {safeSteps[safeSteps.length - 1] ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: instructionHeight,
                  bottom: 0,
                }}
              >
                <DemoPanel sceneSrc={safeSteps[safeSteps.length - 1]!.sceneSrc} />
              </div>
            ) : null}
          </AbsoluteFill>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
