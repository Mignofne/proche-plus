"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          background: "#faf7f2",
          color: "#2d2a26",
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
            Une erreur est survenue
          </h1>
          <p style={{ color: "#5c5650", marginBottom: "1.5rem" }}>
            {error.message || "Quelque chose s'est mal passé."}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#2a9d8f",
              color: "white",
              border: "none",
              borderRadius: "1rem",
              padding: "0.75rem 1.5rem",
              fontWeight: 600,
              cursor: "pointer",
              minHeight: 48,
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
