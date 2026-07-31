import type { Metadata } from "next";
import { Nunito, Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-beta-display",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-beta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Proche+ — Bêta aidants",
  description:
    "Proche+ transforme chaque visite en un moment où vous êtes vraiment utile — sans épuiser votre dos, sans deviner, sans culpabiliser.",
};

export default function BetaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${outfit.variable} ${nunito.variable} font-[family-name:var(--font-beta-sans)]`}
    >
      {children}
    </div>
  );
}
