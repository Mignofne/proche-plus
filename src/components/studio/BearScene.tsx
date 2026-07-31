import type { StudioMood, StudioSceneId } from "@/lib/studio/parse-scene";

const FUR = "#8B5E3C";
const FUR_DEEP = "#6B4423";
const SNOUT = "#C4A484";
const NOSE = "#3D2B1F";
const BLUSH = "#E8A090";
const CREAM = "#F5EDE4";

function mouthPath(mood: StudioMood): string {
  switch (mood) {
    case "happy":
      return "M40 62 Q50 72 60 62";
    case "sad":
      return "M42 66 Q50 60 58 66";
    case "thinking":
      return "M46 64 Q52 62 56 65";
    case "tired":
      return "M44 64 Q50 65 56 64";
    default:
      return "M42 63 Q50 68 58 63";
  }
}

function BearBody({
  x = 0,
  y = 0,
  scale = 1,
  mood = "calm",
  arms = "down",
  tear = false,
}: {
  x?: number;
  y?: number;
  scale?: number;
  mood?: StudioMood;
  arms?: "down" | "up" | "hold" | "comfort";
  tear?: boolean;
}) {
  const eyeY = mood === "tired" ? 48 : 46;
  const eyeOpen = mood !== "tired" && mood !== "happy";

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Body */}
      <ellipse cx="50" cy="118" rx="38" ry="34" fill={FUR} />
      <ellipse cx="50" cy="122" rx="26" ry="24" fill={CREAM} />

      {/* Arms */}
      {arms === "up" && (
        <>
          <ellipse
            cx="12"
            cy="78"
            rx="12"
            ry="18"
            fill={FUR}
            transform="rotate(-35 12 78)"
          />
          <ellipse
            cx="88"
            cy="78"
            rx="12"
            ry="18"
            fill={FUR}
            transform="rotate(35 88 78)"
          />
        </>
      )}
      {arms === "down" && (
        <>
          <ellipse cx="14" cy="118" rx="11" ry="16" fill={FUR} />
          <ellipse cx="86" cy="118" rx="11" ry="16" fill={FUR} />
        </>
      )}
      {arms === "hold" && (
        <>
          <ellipse
            cx="22"
            cy="108"
            rx="11"
            ry="15"
            fill={FUR}
            transform="rotate(25 22 108)"
          />
          <ellipse
            cx="78"
            cy="108"
            rx="11"
            ry="15"
            fill={FUR}
            transform="rotate(-25 78 108)"
          />
        </>
      )}
      {arms === "comfort" && (
        <>
          <ellipse cx="14" cy="118" rx="11" ry="16" fill={FUR} />
          <ellipse
            cx="92"
            cy="100"
            rx="12"
            ry="16"
            fill={FUR}
            transform="rotate(40 92 100)"
          />
        </>
      )}

      {/* Feet */}
      <ellipse cx="34" cy="148" rx="14" ry="8" fill={FUR_DEEP} />
      <ellipse cx="66" cy="148" rx="14" ry="8" fill={FUR_DEEP} />

      {/* Head */}
      <ellipse cx="22" cy="28" rx="13" ry="12" fill={FUR_DEEP} />
      <ellipse cx="78" cy="28" rx="13" ry="12" fill={FUR_DEEP} />
      <ellipse cx="22" cy="28" rx="6.5" ry="5.5" fill="#A67B5B" />
      <ellipse cx="78" cy="28" rx="6.5" ry="5.5" fill="#A67B5B" />
      <ellipse cx="50" cy="52" rx="36" ry="34" fill={FUR} />
      <ellipse cx="50" cy="60" rx="17" ry="14" fill={SNOUT} />
      <ellipse cx="50" cy="56" rx="6.5" ry="5" fill={NOSE} />
      <circle cx="38" cy="58" r="5" fill={BLUSH} opacity="0.55" />
      <circle cx="62" cy="58" r="5" fill={BLUSH} opacity="0.55" />

      {eyeOpen ? (
        <>
          <circle cx="38" cy={eyeY} r="3.4" fill={NOSE} />
          <circle cx="62" cy={eyeY} r="3.4" fill={NOSE} />
          <circle cx="37" cy={eyeY - 1} r="1" fill="#F5EDE4" opacity="0.75" />
          <circle cx="61" cy={eyeY - 1} r="1" fill="#F5EDE4" opacity="0.75" />
        </>
      ) : mood === "happy" ? (
        <>
          <path
            d="M33 46 Q38 42 43 46"
            fill="none"
            stroke={NOSE}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M57 46 Q62 42 67 46"
            fill="none"
            stroke={NOSE}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M33 47 H43"
            stroke={NOSE}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M57 47 H67"
            stroke={NOSE}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </>
      )}

      <path
        d={mouthPath(mood)}
        fill="none"
        stroke={NOSE}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {tear && (
        <path
          d="M66 52 Q68 58 66 62"
          fill="none"
          stroke="#6B9BD1"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

function DeskProps() {
  return (
    <g>
      <rect x="40" y="210" width="240" height="18" rx="4" fill="#A67B5B" />
      <rect x="55" y="228" width="12" height="40" fill="#8B5E3C" />
      <rect x="250" y="228" width="12" height="40" fill="#8B5E3C" />
      {/* Lamp */}
      <rect x="58" y="150" width="8" height="60" fill="#4A5568" />
      <path d="M40 150 Q62 120 84 150 Z" fill="#5B6BE0" />
      <ellipse cx="62" cy="152" rx="22" ry="8" fill="#F5C842" opacity="0.45" />
      {/* Laptop */}
      <rect x="130" y="188" width="70" height="22" rx="2" fill="#3D4450" />
      <rect x="136" y="192" width="58" height="12" rx="1" fill="#89A7C4" />
      {/* Mug */}
      <rect x="220" y="192" width="22" height="18" rx="3" fill="#5B6BE0" />
      <path
        d="M242 196 Q250 200 242 208"
        fill="none"
        stroke="#5B6BE0"
        strokeWidth="3"
      />
      {/* Sparkles */}
      <circle cx="48" cy="128" r="2" fill="#fff" />
      <circle cx="78" cy="118" r="1.5" fill="#fff" />
      <circle cx="92" cy="136" r="1.5" fill="#fff" />
    </g>
  );
}

function BedProps() {
  return (
    <g>
      <rect x="50" y="200" width="220" height="55" rx="12" fill="#7B6BBF" />
      <rect x="60" y="175" width="70" height="35" rx="8" fill="#F5EDE4" />
      <rect x="190" y="175" width="70" height="35" rx="8" fill="#F5EDE4" />
      <rect x="30" y="160" width="28" height="50" rx="4" fill="#A67B5B" />
      <ellipse cx="44" cy="150" rx="14" ry="8" fill="#F5C842" opacity="0.7" />
      <rect x="260" y="195" width="30" height="24" rx="6" fill="#5B6BE0" />
      <text
        x="275"
        y="211"
        textAnchor="middle"
        fontSize="9"
        fill="#fff"
        fontFamily="Nunito, sans-serif"
        fontWeight="700"
      >
        10:00
      </text>
    </g>
  );
}

function SofaProps() {
  return (
    <g>
      <rect x="70" y="195" width="180" height="55" rx="16" fill="#5C4033" />
      <rect x="80" y="175" width="50" height="40" rx="10" fill="#6B4423" />
      <rect x="190" y="175" width="50" height="40" rx="10" fill="#6B4423" />
    </g>
  );
}

function MealProps() {
  return (
    <g>
      <rect x="60" y="210" width="200" height="16" rx="3" fill="#5C4033" />
      <ellipse cx="160" cy="205" rx="28" ry="10" fill="#F5EDE4" />
      <ellipse cx="160" cy="202" rx="18" ry="6" fill="#C67B5C" />
      <path
        d="M148 198 Q160 190 172 198"
        fill="none"
        stroke="#8B5E3C"
        strokeWidth="2"
      />
    </g>
  );
}

function BalconyProps() {
  return (
    <g>
      <rect x="40" y="80" width="240" height="140" rx="4" fill="#E8E2D8" />
      <rect x="55" y="95" width="90" height="110" rx="2" fill="#A8C5D8" />
      <rect x="160" y="95" width="90" height="110" rx="2" fill="#A8C5D8" />
      <rect x="200" y="180" width="70" height="40" rx="8" fill="#7B6BBF" />
      <rect x="70" y="210" width="100" height="12" rx="2" fill="#A67B5B" />
      <circle cx="90" cy="204" r="8" fill="#5B6BE0" />
      <circle cx="115" cy="204" r="8" fill="#5B6BE0" />
    </g>
  );
}

export function BearScene({
  scene,
  mood,
  bearCount,
  className,
  x,
  y,
  width = 400,
  height = 300,
  nested = false,
}: {
  scene: StudioSceneId;
  mood: StudioMood;
  bearCount: 1 | 2;
  className?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  /** Quand true, rendu en <svg> imbriqué (aperçu post). */
  nested?: boolean;
}) {
  const tear = mood === "sad";

  return (
    <svg
      viewBox="0 0 320 280"
      className={className}
      role="img"
      aria-label={`Scène ${scene}`}
      {...(nested
        ? { x, y, width, height }
        : { width: "100%", height: "100%" })}
    >
      <ellipse cx="160" cy="255" rx="90" ry="10" fill="#000" opacity="0.08" />

      {scene === "desk" && (
        <>
          <DeskProps />
          <BearBody x={110} y={55} scale={0.85} mood={mood} arms="hold" />
        </>
      )}

      {scene === "bed" && (
        <>
          <BedProps />
          <BearBody x={115} y={70} scale={0.8} mood={mood === "calm" ? "tired" : mood} arms="hold" />
          {/* Phone */}
          <rect x="175" y="145" width="22" height="32" rx="3" fill="#2D2A26" />
          <rect x="178" y="149" width="16" height="22" rx="1" fill="#89A7C4" />
        </>
      )}

      {scene === "sofa" && (
        <>
          <SofaProps />
          {bearCount === 2 ? (
            <>
              <BearBody x={70} y={70} scale={0.75} mood="sad" tear arms="down" />
              <BearBody
                x={145}
                y={65}
                scale={0.78}
                mood="calm"
                arms="comfort"
              />
            </>
          ) : (
            <BearBody x={110} y={65} scale={0.85} mood={mood} tear={tear} arms="down" />
          )}
        </>
      )}

      {scene === "meal" && (
        <>
          <MealProps />
          <BearBody x={55} y={55} scale={0.78} mood={mood === "calm" ? "happy" : mood} arms="hold" />
          <BearBody x={155} y={55} scale={0.78} mood="happy" arms="hold" />
        </>
      )}

      {scene === "wave" && (
        <BearBody x={95} y={40} scale={1} mood={mood === "calm" ? "happy" : mood} arms="up" />
      )}

      {scene === "duo" && (
        <>
          <BearBody x={45} y={55} scale={0.85} mood={mood === "calm" ? "thinking" : mood} arms="down" />
          <BearBody x={145} y={50} scale={0.9} mood="happy" arms="comfort" />
          <path
            d="M150 70 L155 62 L160 70"
            fill="none"
            stroke="#5B6BE0"
            strokeWidth="2"
            opacity="0.6"
          />
          <path
            d="M165 68 L170 60 L175 68"
            fill="none"
            stroke="#5B6BE0"
            strokeWidth="2"
            opacity="0.6"
          />
        </>
      )}

      {scene === "balcony" && (
        <>
          <BalconyProps />
          <BearBody x={100} y={90} scale={0.7} mood={mood} arms="down" />
          {bearCount === 2 && (
            <BearBody x={160} y={100} scale={0.55} mood="happy" arms="down" />
          )}
        </>
      )}

      {scene === "welcome" && (
        <BearBody x={95} y={40} scale={1} mood={mood} arms="down" />
      )}
    </svg>
  );
}
