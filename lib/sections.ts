import type { SectionKey } from "./schema";
import type { ManualMode } from "@/types";

export interface SectionMeta {
  id: SectionKey;
  number: number;
  title: string;
  hostTitle?: string;
  description: string;
  hostDescription?: string;
  slug: string;
  modes: ManualMode[];
}

const allSections: Omit<SectionMeta, "number">[] = [
  {
    id: "propertyBasics",
    title: "Property Basics",
    hostTitle: "Property Details",
    description: "Address, size, type, and general property details.",
    hostDescription: "Address, property type, and listing details.",
    slug: "property-basics",
    modes: ["seller", "host"],
  },
  {
    id: "checkInOut",
    title: "Check-in & Check-out",
    description: "Arrival and departure instructions for guests.",
    slug: "check-in-out",
    modes: ["host"],
  },
  {
    id: "houseRules",
    title: "House Rules",
    description: "Guest policies: noise, smoking, pets, parking, and more.",
    slug: "house-rules",
    modes: ["host"],
  },
  {
    id: "emergencyInfo",
    title: "Emergency Info",
    description: "Nearby hospital, police, fire, and emergency numbers.",
    slug: "emergency-info",
    modes: ["seller", "host"],
  },
  {
    id: "utilities",
    title: "Utilities",
    description: "Electric, gas, water, internet, and other utility providers.",
    hostDescription: "WiFi, electric, gas, and water details guests may need.",
    slug: "utilities",
    modes: ["seller", "host"],
  },
  {
    id: "shutoffsPanels",
    title: "Critical Shutoffs & Panels",
    description: "Water main, gas shutoff, breaker panel, and generator info.",
    slug: "shutoffs-panels",
    modes: ["seller", "host"],
  },
  {
    id: "hvac",
    title: "HVAC",
    description: "Heating and cooling systems, filters, and service info.",
    hostDescription: "Thermostat instructions and climate control for guests.",
    slug: "hvac",
    modes: ["seller", "host"],
  },
  {
    id: "waterHeater",
    title: "Water Systems",
    description: "Water heater, softener/conditioner, and radon detection.",
    slug: "water-heater",
    modes: ["seller"],
  },
  {
    id: "majorAppliances",
    title: "Major Appliances",
    description: "Make, model, and warranty for each appliance.",
    hostDescription: "Appliance instructions and quirks guests should know.",
    slug: "major-appliances",
    modes: ["seller", "host"],
  },
  {
    id: "amenitiesGuide",
    title: "Amenities Guide",
    description: "Pool, hot tub, grill, entertainment, and extras for guests.",
    slug: "amenities-guide",
    modes: ["host"],
  },
  {
    id: "exteriorSystems",
    title: "Exterior Systems",
    description: "Roof, gutters, sprinklers, pool, solar, and more.",
    slug: "exterior-systems",
    modes: ["seller"],
  },
  {
    id: "securityAccess",
    title: "Security & Access",
    description: "Alarm, cameras, locks, garage codes, and key locations.",
    hostDescription: "Lockbox, door codes, parking, and access instructions.",
    slug: "security-access",
    modes: ["seller", "host"],
  },
  {
    id: "smartHome",
    title: "Smart Home",
    description: "WiFi, smart devices, hubs, and EV charger details.",
    hostDescription: "WiFi password, TV/streaming, smart devices for guests.",
    slug: "smart-home",
    modes: ["seller", "host"],
  },
  {
    id: "trashRecycling",
    title: "Trash & Recycling",
    description: "Pickup days, bin locations, and recycling rules.",
    hostDescription: "Where to put trash and recycling during your stay.",
    slug: "trash-recycling",
    modes: ["seller", "host"],
  },
  {
    id: "maintenanceContacts",
    title: "Maintenance Contacts",
    hostTitle: "Emergency Contacts",
    description: "Plumber, electrician, HVAC tech, and other service providers.",
    hostDescription: "Who to call if something breaks or goes wrong.",
    slug: "maintenance-contacts",
    modes: ["seller", "host"],
  },
  {
    id: "hoaCommunity",
    title: "HOA / Community",
    description: "HOA details, dues, rules, and management contacts.",
    slug: "hoa-community",
    modes: ["seller"],
  },
  {
    id: "warranties",
    title: "Warranties",
    description: "Home warranty and appliance warranty information.",
    slug: "warranties",
    modes: ["seller"],
  },
  {
    id: "localKnowledge",
    title: "Local Knowledge",
    hostTitle: "Local Recommendations",
    description: "Trusted neighbors, recommendations, schools, and tips.",
    hostDescription: "Restaurants, activities, grocery stores, and local gems.",
    slug: "local-knowledge",
    modes: ["seller", "host"],
  },
  {
    id: "quirksTips",
    title: "Quirks & Tips",
    hostTitle: "Tips & Need-to-Know",
    description: "The little things only the current owner would know.",
    hostDescription: "The little things that make the stay smoother.",
    slug: "quirks-tips",
    modes: ["seller", "host"],
  },
  {
    id: "documentVault",
    title: "Document Vault",
    description: "Links to surveys, inspections, manuals, and permits.",
    slug: "document-vault",
    modes: ["seller"],
  },
  {
    id: "welcomeLetter",
    title: "Welcome Letter",
    hostTitle: "Welcome Message",
    description: "A personal note to the new homeowners.",
    hostDescription: "A personal welcome note for your guests.",
    slug: "welcome-letter",
    modes: ["seller", "host"],
  },
];

export function getSectionsForMode(mode: ManualMode): SectionMeta[] {
  let number = 1;
  return allSections
    .filter((s) => s.modes.includes(mode))
    .map((s) => ({
      ...s,
      number: number++,
      title: mode === "host" && s.hostTitle ? s.hostTitle : s.title,
      description: mode === "host" && s.hostDescription ? s.hostDescription : s.description,
    }));
}

// Default: all sections (for backward compat)
export const sections = getSectionsForMode("seller");

export function getSectionBySlug(slug: string, mode: ManualMode = "seller"): SectionMeta | undefined {
  return getSectionsForMode(mode).find((s) => s.slug === slug);
}

export function getSectionById(id: SectionKey, mode: ManualMode = "seller"): SectionMeta | undefined {
  return getSectionsForMode(mode).find((s) => s.id === id);
}

export function getNextSection(slug: string, mode: ManualMode = "seller"): SectionMeta | undefined {
  const list = getSectionsForMode(mode);
  const index = list.findIndex((s) => s.slug === slug);
  return index >= 0 && index < list.length - 1 ? list[index + 1] : undefined;
}

export function getPreviousSection(slug: string, mode: ManualMode = "seller"): SectionMeta | undefined {
  const list = getSectionsForMode(mode);
  const index = list.findIndex((s) => s.slug === slug);
  return index > 0 ? list[index - 1] : undefined;
}
