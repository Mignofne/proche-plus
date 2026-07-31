import { test, expect } from "@playwright/test";
import { parseBearDescription } from "../../src/lib/studio/parse-scene";

test.describe("Parseur description ours", () => {
  test("bureau + lampe → desk", () => {
    const r = parseBearDescription(
      "je veux qu’il soit assis au bureau avec une lampe allumée"
    );
    expect(r.scene).toBe("desk");
    expect(r.matched).toBe(true);
  });

  test("scroll au lit → bed", () => {
    const r = parseBearDescription("scroll au lit avec son téléphone");
    expect(r.scene).toBe("bed");
  });

  test("canapé triste → sofa + sad", () => {
    const r = parseBearDescription(
      "sur le canapé, un peu triste, besoin de réconfort"
    );
    expect(r.scene).toBe("sofa");
    expect(r.mood).toBe("sad");
  });

  test("manger à table → meal + duo", () => {
    const r = parseBearDescription("à table, j’ai fait à manger des pâtes");
    expect(r.scene).toBe("meal");
    expect(r.bearCount).toBe(2);
  });

  test("bras levés → wave + happy", () => {
    const r = parseBearDescription("bras levés, tout content");
    expect(r.scene).toBe("wave");
    expect(r.mood).toBe("happy");
  });

  test("deux ours qui se rassurent → duo", () => {
    const r = parseBearDescription("deux ours, l’un rassure l’autre");
    expect(r.scene).toBe("duo");
    expect(r.bearCount).toBe(2);
  });

  test("balcon → balcony", () => {
    const r = parseBearDescription("escapade balcon, prendre l’air");
    expect(r.scene).toBe("balcony");
  });

  test("vide → welcome non matché", () => {
    const r = parseBearDescription("   ");
    expect(r.scene).toBe("welcome");
    expect(r.matched).toBe(false);
  });

  test("inconnu → welcome fallback", () => {
    const r = parseBearDescription("je veux un truc zyx improbable");
    expect(r.scene).toBe("welcome");
    expect(r.matched).toBe(false);
  });

  test("accueil / debout → welcome matché", () => {
    const r = parseBearDescription("debout, regard doux et calme");
    expect(r.scene).toBe("welcome");
    expect(r.matched).toBe(true);
  });
});
