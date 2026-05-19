import type { SectionKey } from "./schema";

export interface SectionMeta {
  id: SectionKey;
  number: number;
  title: string;
  description: string;
  slug: string;
}

export const sections: SectionMeta[] = [
  {
    id: "propertyBasics",
    number: 1,
    title: "Property Basics",
    description: "Address, size, type, and general property details.",
    slug: "property-basics",
  },
  {
    id: "emergencyInfo",
    number: 2,
    title: "Emergency Info",
    description: "Nearby hospital, police, fire, and emergency numbers.",
    slug: "emergency-info",
  },
  {
    id: "utilities",
    number: 3,
    title: "Utilities",
    description: "Electric, gas, water, internet, and other utility providers.",
    slug: "utilities",
  },
  {
    id: "shutoffsPanels",
    number: 4,
    title: "Critical Shutoffs & Panels",
    description: "Water main, gas shutoff, breaker panel, and generator info.",
    slug: "shutoffs-panels",
  },
  {
    id: "hvac",
    number: 5,
    title: "HVAC",
    description: "Heating and cooling systems, filters, and service info.",
    slug: "hvac",
  },
  {
    id: "waterHeater",
    number: 6,
    title: "Water Heater",
    description: "Type, fuel, location, and maintenance details.",
    slug: "water-heater",
  },
  {
    id: "majorAppliances",
    number: 7,
    title: "Major Appliances",
    description: "Make, model, and warranty for each appliance.",
    slug: "major-appliances",
  },
  {
    id: "exteriorSystems",
    number: 8,
    title: "Exterior Systems",
    description: "Roof, gutters, sprinklers, pool, solar, and more.",
    slug: "exterior-systems",
  },
  {
    id: "securityAccess",
    number: 9,
    title: "Security & Access",
    description: "Alarm, cameras, locks, garage codes, and key locations.",
    slug: "security-access",
  },
  {
    id: "smartHome",
    number: 10,
    title: "Smart Home",
    description: "WiFi, smart devices, hubs, and EV charger details.",
    slug: "smart-home",
  },
  {
    id: "trashRecycling",
    number: 11,
    title: "Trash & Recycling",
    description: "Pickup days, bin locations, and recycling rules.",
    slug: "trash-recycling",
  },
  {
    id: "maintenanceContacts",
    number: 12,
    title: "Maintenance Contacts",
    description: "Plumber, electrician, HVAC tech, and other service providers.",
    slug: "maintenance-contacts",
  },
  {
    id: "hoaCommunity",
    number: 13,
    title: "HOA / Community",
    description: "HOA details, dues, rules, and management contacts.",
    slug: "hoa-community",
  },
  {
    id: "warranties",
    number: 14,
    title: "Warranties",
    description: "Home warranty and appliance warranty information.",
    slug: "warranties",
  },
  {
    id: "localKnowledge",
    number: 15,
    title: "Local Knowledge",
    description: "Trusted neighbors, recommendations, schools, and tips.",
    slug: "local-knowledge",
  },
  {
    id: "quirksTips",
    number: 16,
    title: "Quirks & Tips",
    description: "The little things only the current owner would know.",
    slug: "quirks-tips",
  },
  {
    id: "documentVault",
    number: 17,
    title: "Document Vault",
    description: "Links to surveys, inspections, manuals, and permits.",
    slug: "document-vault",
  },
  {
    id: "welcomeLetter",
    number: 18,
    title: "Welcome Letter",
    description: "A personal note to the new homeowners.",
    slug: "welcome-letter",
  },
];

export function getSectionBySlug(slug: string): SectionMeta | undefined {
  return sections.find((s) => s.slug === slug);
}

export function getSectionById(id: SectionKey): SectionMeta | undefined {
  return sections.find((s) => s.id === id);
}

export function getNextSection(slug: string): SectionMeta | undefined {
  const index = sections.findIndex((s) => s.slug === slug);
  return index >= 0 && index < sections.length - 1
    ? sections[index + 1]
    : undefined;
}

export function getPreviousSection(slug: string): SectionMeta | undefined {
  const index = sections.findIndex((s) => s.slug === slug);
  return index > 0 ? sections[index - 1] : undefined;
}
