import Link from "next/link";

export function LegalFooter() {
  return (
    <footer className="border-t border-cream-dark bg-cream px-4 py-6">
      <nav
        aria-label="Informations légales"
        className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-5 gap-y-3 text-sm"
      >
        <Link className="text-teal hover:text-teal-dark hover:underline" href="/cgu">
          CGU
        </Link>
        <Link
          className="text-teal hover:text-teal-dark hover:underline"
          href="/conditions-etablissement"
        >
          Conditions établissement
        </Link>
        <Link
          className="text-teal hover:text-teal-dark hover:underline"
          href="/mentions-legales"
        >
          Mentions légales
        </Link>
        <Link
          className="text-teal hover:text-teal-dark hover:underline"
          href="/politique-de-confidentialite"
        >
          Politique de confidentialité
        </Link>
      </nav>
    </footer>
  );
}
