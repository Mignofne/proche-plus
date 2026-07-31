import { test, expect } from "@playwright/test";
import { resolveVisitPatientSelection } from "../../src/lib/services/visit-patient-selection";

test.describe("resolveVisitPatientSelection — mode visite", () => {
  test("0 proches → empty", () => {
    expect(
      resolveVisitPatientSelection({
        ownedPatientIds: [],
        requestedPatientId: "p1",
      })
    ).toEqual({ status: "empty" });
  });

  test("1 proche → auto-select, même sans patientId", () => {
    expect(
      resolveVisitPatientSelection({
        ownedPatientIds: ["p1"],
        requestedPatientId: null,
      })
    ).toEqual({ status: "auto", patientId: "p1" });
  });

  test("1 proche avec son patientId → auto", () => {
    expect(
      resolveVisitPatientSelection({
        ownedPatientIds: ["p1"],
        requestedPatientId: "p1",
      })
    ).toEqual({ status: "auto", patientId: "p1" });
  });

  test("1 proche avec patientId étranger → unauthorized", () => {
    expect(
      resolveVisitPatientSelection({
        ownedPatientIds: ["p1"],
        requestedPatientId: "other",
      })
    ).toEqual({ status: "unauthorized" });
  });

  test("N>1 sans patientId → pick", () => {
    expect(
      resolveVisitPatientSelection({
        ownedPatientIds: ["p1", "p2"],
        requestedPatientId: undefined,
      })
    ).toEqual({ status: "pick" });
  });

  test("N>1 avec patientId appartenant à l'aidant → selected", () => {
    expect(
      resolveVisitPatientSelection({
        ownedPatientIds: ["p1", "p2"],
        requestedPatientId: "p2",
      })
    ).toEqual({ status: "selected", patientId: "p2" });
  });

  test("N>1 avec patientId non lié → unauthorized", () => {
    expect(
      resolveVisitPatientSelection({
        ownedPatientIds: ["p1", "p2"],
        requestedPatientId: "hack",
      })
    ).toEqual({ status: "unauthorized" });
  });

  test("ignore les patientId vides / espaces", () => {
    expect(
      resolveVisitPatientSelection({
        ownedPatientIds: ["p1", "p2"],
        requestedPatientId: "   ",
      })
    ).toEqual({ status: "pick" });
  });
});
