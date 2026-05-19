import type { HouseManualData, SectionKey } from "./schema";

const STORAGE_KEY = "houseManualData";
const CURRENT_SCHEMA_VERSION = 1;

export function loadManualData(): HouseManualData {
  if (typeof window === "undefined") {
    return { schemaVersion: CURRENT_SCHEMA_VERSION };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { schemaVersion: CURRENT_SCHEMA_VERSION };
    }

    const parsed = JSON.parse(raw) as HouseManualData;

    if (parsed.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      return { schemaVersion: CURRENT_SCHEMA_VERSION };
    }

    return parsed;
  } catch {
    return { schemaVersion: CURRENT_SCHEMA_VERSION };
  }
}

export function saveManualData(data: HouseManualData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...data, schemaVersion: CURRENT_SCHEMA_VERSION })
    );
  } catch (error) {
    console.error("Failed to save manual data:", error);
  }
}

export function saveSectionData<K extends SectionKey>(
  sectionId: K,
  sectionData: HouseManualData[K]
): void {
  const current = loadManualData();
  current[sectionId] = sectionData;
  saveManualData(current);
}

export function clearAllData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function isSectionComplete(
  data: HouseManualData,
  sectionId: SectionKey
): "empty" | "in-progress" | "complete" {
  const sectionData = data[sectionId];
  if (!sectionData) return "empty";

  const values = Object.values(sectionData);
  if (values.length === 0) return "empty";

  const filledValues = values.filter((v) => {
    if (v === undefined || v === null || v === "") return false;
    if (typeof v === "boolean") return true;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") {
      return Object.values(v).some(
        (inner) =>
          inner !== undefined && inner !== null && inner !== ""
      );
    }
    return true;
  });

  if (filledValues.length === 0) return "empty";

  // For property basics, check mandatory fields
  if (sectionId === "propertyBasics") {
    const pb = sectionData as HouseManualData["propertyBasics"];
    if (pb?.address && pb?.cityStateZip) return "complete";
    return "in-progress";
  }

  return "complete";
}

export function getCompletedSectionCount(data: HouseManualData): number {
  const sectionKeys: SectionKey[] = [
    "propertyBasics",
    "emergencyInfo",
    "utilities",
    "shutoffsPanels",
    "hvac",
    "waterHeater",
    "majorAppliances",
    "exteriorSystems",
    "securityAccess",
    "smartHome",
    "trashRecycling",
    "maintenanceContacts",
    "hoaCommunity",
    "warranties",
    "localKnowledge",
    "quirksTips",
    "documentVault",
    "welcomeLetter",
  ];

  return sectionKeys.filter(
    (key) => isSectionComplete(data, key) === "complete"
  ).length;
}
