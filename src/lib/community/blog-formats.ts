import type { CommunityGeoFormat } from "@prisma/client";

export const GEO_FORMAT_META: Record<
  CommunityGeoFormat,
  {
    label: string;
    requiresFaq: boolean;
    requiresHowto: boolean;
    tldrOptionalShort: boolean;
  }
> = {
  definition_glossaire: {
    label: "Définition / glossaire",
    requiresFaq: false,
    requiresHowto: false,
    tldrOptionalShort: false,
  },
  faq_qr: {
    label: "FAQ / Q&R",
    requiresFaq: true,
    requiresHowto: false,
    tldrOptionalShort: false,
  },
  guide_howto: {
    label: "Guide pratique étape par étape",
    requiresFaq: false,
    requiresHowto: true,
    tldrOptionalShort: false,
  },
  comparatif: {
    label: "Comparatif",
    requiresFaq: false,
    requiresHowto: false,
    tldrOptionalShort: false,
  },
  checklist: {
    label: "Checklist",
    requiresFaq: false,
    requiresHowto: false,
    tldrOptionalShort: false,
  },
  tldr_resume: {
    label: "TL;DR / résumé exécutif",
    requiresFaq: false,
    requiresHowto: false,
    tldrOptionalShort: false,
  },
  liste_structuree: {
    label: "Liste structurée",
    requiresFaq: false,
    requiresHowto: false,
    tldrOptionalShort: false,
  },
  fiche_pratique: {
    label: "Fiche pratique",
    requiresFaq: false,
    requiresHowto: false,
    tldrOptionalShort: true,
  },
};

export function buildArticleJsonLd(article: {
  titleSeo: string;
  metaDescription: string;
  slug: string;
  authorName: string;
  publishedAt: Date | null;
  updatedContentAt: Date | null;
  format: CommunityGeoFormat;
  faqJson: string | null;
  howtoJson: string | null;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://procheplus.fr";
  const url = `${baseUrl}/blog/${article.slug}`;
  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.titleSeo,
      description: article.metaDescription,
      author: { "@type": "Person", name: article.authorName },
      datePublished: article.publishedAt?.toISOString(),
      dateModified: (
        article.updatedContentAt || article.publishedAt
      )?.toISOString(),
      mainEntityOfPage: url,
    },
  ];

  if (GEO_FORMAT_META[article.format].requiresFaq && article.faqJson) {
    try {
      const faq = JSON.parse(article.faqJson) as {
        question: string;
        answer: string;
      }[];
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      });
    } catch {
      /* ignore */
    }
  }

  if (GEO_FORMAT_META[article.format].requiresHowto && article.howtoJson) {
    try {
      const steps = JSON.parse(article.howtoJson) as {
        titre: string;
        detail: string;
      }[];
      schemas.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: article.titleSeo,
        step: steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.titre,
          text: s.detail,
        })),
      });
    } catch {
      /* ignore */
    }
  }

  return schemas;
}
