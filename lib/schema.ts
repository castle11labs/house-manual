import { z } from "zod";

// --- Helper Schemas ---

const utilityContactSchema = z.object({
  provider: z.string().optional(),
  accountNumber: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
});

const locationFieldSchema = z.object({
  location: z.string().optional(),
  photo: z.string().optional(),
});

const contactSchema = z.object({
  name: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  notes: z.string().optional(),
});

const applianceSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  serial: z.string().optional(),
  installDate: z.string().optional(),
  warrantyStatus: z.string().optional(),
  manualLocation: z.string().optional(),
});

// --- Section Schemas ---

const propertyBasicsSchema = z.object({
  address: z.string().min(1, "Address is required"),
  cityStateZip: z.string().min(1, "City, State, ZIP is required"),
  yearBuilt: z.string().optional(),
  squareFootage: z.string().optional(),
  lotSize: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  propertyType: z
    .enum(["single_family", "condo", "townhouse", "multi_family", "other"])
    .optional(),
  datePrepared: z.string().optional(),
  preparedBy: z.string().optional(),
});

const emergencyInfoSchema = z.object({
  nearestHospitalName: z.string().optional(),
  nearestHospitalAddress: z.string().optional(),
  policeNonEmergency: z.string().optional(),
  fireNonEmergency: z.string().optional(),
  poisonControl: z.string().optional(),
  gasLeakEmergency: z.string().optional(),
  powerOutageReporting: z.string().optional(),
});

const utilitiesSchema = z.object({
  electric: utilityContactSchema.optional(),
  naturalGas: utilityContactSchema.optional(),
  waterSewer: utilityContactSchema.optional(),
  trashRecycling: utilityContactSchema.optional(),
  internet: utilityContactSchema.optional(),
  hasCableStreaming: z.boolean().optional(),
  cableStreaming: utilityContactSchema.optional(),
  hasLandline: z.boolean().optional(),
  landline: utilityContactSchema.optional(),
  hasPropane: z.boolean().optional(),
  propane: utilityContactSchema.optional(),
});

const shutoffsPanelsSchema = z.object({
  waterMainShutoff: locationFieldSchema.optional(),
  individualWaterShutoffs: z.string().optional(),
  gasShutoff: locationFieldSchema.optional(),
  mainBreakerPanel: locationFieldSchema.optional(),
  hasSubPanel: z.boolean().optional(),
  subPanelLocations: z.array(locationFieldSchema).optional(),
  hasSurgeProtector: z.boolean().optional(),
  surgeProtectorLocation: locationFieldSchema.optional(),
  hasGenerator: z.boolean().optional(),
  generator: z
    .object({
      type: z.string().optional(),
      fuel: z.string().optional(),
      transferSwitchLocation: z.string().optional(),
      photo: z.string().optional(),
    })
    .optional(),
});

const hvacSchema = z.object({
  systemType: z.string().optional(),
  heatingFuelSource: z.string().optional(),
  unitLocations: z.string().optional(),
  makeModelSerial: z.string().optional(),
  installDate: z.string().optional(),
  lastServiceDate: z.string().optional(),
  serviceCompany: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  filterSizes: z.string().optional(),
  filterChangeFrequency: z.string().optional(),
  thermostatType: z.string().optional(),
  hasZones: z.boolean().optional(),
  zonesDescription: z.string().optional(),
});

const waterHeaterSchema = z.object({
  type: z.enum(["tank", "tankless", "hybrid"]).optional(),
  fuel: z.enum(["gas", "electric", "solar"]).optional(),
  location: z.string().optional(),
  makeModelSerial: z.string().optional(),
  installDate: z.string().optional(),
  capacity: z.string().optional(),
  lastFlushService: z.string().optional(),
});

const applianceEntrySchema = z.object({
  hasAppliance: z.boolean().optional(),
  ...applianceSchema.shape,
});

const otherApplianceSchema = applianceSchema.extend({
  type: z.string().optional(),
});

const majorAppliancesSchema = z.object({
  refrigerator: applianceEntrySchema.optional(),
  dishwasher: applianceEntrySchema.optional(),
  rangeCooktop: applianceEntrySchema.optional(),
  ovens: applianceEntrySchema.optional(),
  microwave: applianceEntrySchema.optional(),
  washer: applianceEntrySchema.optional(),
  dryer: applianceEntrySchema.optional(),
  garbageDisposal: applianceEntrySchema.optional(),
  wineFridge: applianceEntrySchema.optional(),
  otherAppliances: z.array(otherApplianceSchema).optional(),
});

const exteriorSystemsSchema = z.object({
  roof: z
    .object({
      type: z.string().optional(),
      age: z.string().optional(),
      lastInspection: z.string().optional(),
    })
    .optional(),
  guttersLastCleaned: z.string().optional(),
  hasSprinklers: z.boolean().optional(),
  sprinklers: z
    .object({
      controllerLocation: z.string().optional(),
      zones: z.string().optional(),
      schedule: z.string().optional(),
      company: z.string().optional(),
    })
    .optional(),
  hasPool: z.boolean().optional(),
  pool: z
    .object({
      equipmentLocation: z.string().optional(),
      serviceCompany: z.string().optional(),
      chemicalSchedule: z.string().optional(),
    })
    .optional(),
  hasSpa: z.boolean().optional(),
  spa: z.string().optional(),
  hasSolar: z.boolean().optional(),
  solar: z
    .object({
      systemType: z.string().optional(),
      installer: z.string().optional(),
      monitoringInfo: z.string().optional(),
      leaseOrOwned: z.string().optional(),
    })
    .optional(),
  hasSeptic: z.boolean().optional(),
  septic: z
    .object({
      location: z.string().optional(),
      lastPumped: z.string().optional(),
      serviceCompany: z.string().optional(),
    })
    .optional(),
  hasWell: z.boolean().optional(),
  well: z
    .object({
      location: z.string().optional(),
      lastTest: z.string().optional(),
      pumpInfo: z.string().optional(),
    })
    .optional(),
  hasOutdoorLighting: z.boolean().optional(),
  outdoorLighting: z
    .object({
      controllerLocation: z.string().optional(),
    })
    .optional(),
});

const securityAccessSchema = z.object({
  hasAlarm: z.boolean().optional(),
  alarm: z
    .object({
      provider: z.string().optional(),
      account: z.string().optional(),
      panelLocation: z.string().optional(),
    })
    .optional(),
  hasCameras: z.boolean().optional(),
  cameras: z
    .object({
      system: z.string().optional(),
      app: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  hasSmartLocks: z.boolean().optional(),
  smartLocks: z
    .object({
      brand: z.string().optional(),
      app: z.string().optional(),
      codes: z.string().optional(),
    })
    .optional(),
  hasGarageDoor: z.boolean().optional(),
  garageDoor: z
    .object({
      openerBrand: z.string().optional(),
      codes: z.string().optional(),
      manualOverride: z.string().optional(),
    })
    .optional(),
  hasGateCodes: z.boolean().optional(),
  gateCodes: z.string().optional(),
  hasMailboxKey: z.boolean().optional(),
  mailboxKeyLocation: z.string().optional(),
  hasSpareKey: z.boolean().optional(),
  spareKeyLocation: z.string().optional(),
  hasSafe: z.boolean().optional(),
  safe: z
    .object({
      location: z.string().optional(),
      comboHandoffMethod: z.string().optional(),
    })
    .optional(),
});

const smartHomeSchema = z.object({
  hasWifi: z.boolean().optional(),
  wifi: z
    .object({
      networkName: z.string().optional(),
      password: z.string().optional(),
      routerLocation: z.string().optional(),
    })
    .optional(),
  hasMeshNodes: z.boolean().optional(),
  meshNodes: z.string().optional(),
  hasSmartHub: z.boolean().optional(),
  smartHub: z.string().optional(),
  hasSmartSpeakers: z.boolean().optional(),
  smartSpeakers: z.string().optional(),
  hasSmartThermostat: z.boolean().optional(),
  smartThermostat: z.string().optional(),
  hasSmartLighting: z.boolean().optional(),
  smartLighting: z.string().optional(),
  hasSmartBlinds: z.boolean().optional(),
  smartBlinds: z.string().optional(),
  hasEvCharger: z.boolean().optional(),
  evCharger: z
    .object({
      brand: z.string().optional(),
      amperage: z.string().optional(),
      location: z.string().optional(),
    })
    .optional(),
});

const trashRecyclingSchema = z.object({
  pickupDays: z.string().optional(),
  binStorageLocation: z.string().optional(),
  recyclingRules: z.string().optional(),
  bulkPickup: z.string().optional(),
  yardWasteSchedule: z.string().optional(),
  haulerContact: z.string().optional(),
});

const contactWithRoleSchema = contactSchema.extend({
  role: z.string().optional(),
});

const maintenanceContactsSchema = z.object({
  hasPlumber: z.boolean().optional(),
  plumberContact: contactSchema.optional(),
  hasElectrician: z.boolean().optional(),
  electricianContact: contactSchema.optional(),
  hasHvacTech: z.boolean().optional(),
  hvacTechContact: contactSchema.optional(),
  hasRoofer: z.boolean().optional(),
  rooferContact: contactSchema.optional(),
  hasHandyman: z.boolean().optional(),
  handymanContact: contactSchema.optional(),
  hasLandscaper: z.boolean().optional(),
  landscaperContact: contactSchema.optional(),
  hasTreeService: z.boolean().optional(),
  treeServiceContact: contactSchema.optional(),
  hasPoolSpaService: z.boolean().optional(),
  poolSpaServiceContact: contactSchema.optional(),
  hasPestControl: z.boolean().optional(),
  pestControlContact: contactSchema.optional(),
  hasCleaner: z.boolean().optional(),
  cleanerContact: contactSchema.optional(),
  hasWindowWasher: z.boolean().optional(),
  windowWasherContact: contactSchema.optional(),
  hasChimneySweep: z.boolean().optional(),
  chimneySweepContact: contactSchema.optional(),
  hasSepticService: z.boolean().optional(),
  septicServiceContact: contactSchema.optional(),
  hasPainter: z.boolean().optional(),
  painterContact: contactSchema.optional(),
  otherContacts: z.array(contactWithRoleSchema).optional(),
});

const hoaCommunitySchema = z.object({
  hasHoa: z.boolean().optional(),
  hoa: z
    .object({
      name: z.string().optional(),
      managementCompany: z.string().optional(),
      contactName: z.string().optional(),
      contactPhone: z.string().optional(),
      contactEmail: z.string().optional(),
      duesAmount: z.string().optional(),
      duesFrequency: z.string().optional(),
      paymentPortalUrl: z.string().optional(),
      ccrDocLink: z.string().optional(),
      amenityAccess: z.string().optional(),
      quietHours: z.string().optional(),
      architecturalReview: z.string().optional(),
    })
    .optional(),
});

const warrantiesSchema = z.object({
  homeWarranty: z
    .object({
      provider: z.string().optional(),
      plan: z.string().optional(),
      expiration: z.string().optional(),
      claimPhone: z.string().optional(),
    })
    .optional(),
  applianceWarrantiesSummary: z.string().optional(),
});

const trustedNeighborSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  helpsWith: z.string().optional(),
});

const localKnowledgeSchema = z.object({
  hasTrustedNeighbors: z.boolean().optional(),
  trustedNeighbors: z.array(trustedNeighborSchema).optional(),
  hasRecommendations: z.boolean().optional(),
  recommendations: z
    .object({
      grocery: z.string().optional(),
      hardware: z.string().optional(),
      pharmacy: z.string().optional(),
    })
    .optional(),
  hasVet: z.boolean().optional(),
  vet: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  hasLocalQuirks: z.boolean().optional(),
  localQuirks: z.string().optional(),
  hasSchoolDistrict: z.boolean().optional(),
  schoolDistrict: z.string().optional(),
  hasTrafficNotes: z.boolean().optional(),
  trafficNotes: z.string().optional(),
});

const quirksTipsSchema = z.object({
  quirks: z.array(z.string()).optional(),
});

const documentVaultSchema = z.object({
  surveyPlotPlan: z.string().optional(),
  inspectionReport: z.string().optional(),
  applianceManuals: z.string().optional(),
  permits: z.string().optional(),
  receipts: z.string().optional(),
  hoaDocs: z.string().optional(),
});

const welcomeLetterSchema = z.object({
  welcomeLetter: z.string().optional(),
});

// --- Host-Specific Schemas ---

const houseRulesSchema = z.object({
  maxGuests: z.string().optional(),
  quietHoursStart: z.string().optional(),
  quietHoursEnd: z.string().optional(),
  smokingPolicy: z.string().optional(),
  petPolicy: z.string().optional(),
  partyPolicy: z.string().optional(),
  parkingInstructions: z.string().optional(),
  additionalRules: z.array(z.string()).optional(),
});

const checkInOutSchema = z.object({
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  checkInMethod: z.string().optional(),
  lockboxCode: z.string().optional(),
  keyPickupInstructions: z.string().optional(),
  checkInSteps: z.string().optional(),
  checkOutSteps: z.string().optional(),
  earlyCheckIn: z.string().optional(),
  lateCheckOut: z.string().optional(),
  luggageStorage: z.string().optional(),
});

const amenitiesGuideSchema = z.object({
  hasPool: z.boolean().optional(),
  poolInstructions: z.string().optional(),
  hasHotTub: z.boolean().optional(),
  hotTubInstructions: z.string().optional(),
  hasGrill: z.boolean().optional(),
  grillInstructions: z.string().optional(),
  hasFirepit: z.boolean().optional(),
  firepitInstructions: z.string().optional(),
  hasGameRoom: z.boolean().optional(),
  gameRoomDetails: z.string().optional(),
  hasGym: z.boolean().optional(),
  gymDetails: z.string().optional(),
  hasBikes: z.boolean().optional(),
  bikeDetails: z.string().optional(),
  hasBeachGear: z.boolean().optional(),
  beachGearDetails: z.string().optional(),
  hasStreamingServices: z.boolean().optional(),
  streamingDetails: z.string().optional(),
  otherAmenities: z.string().optional(),
});

// --- Master Schema ---

export const houseManualSchema = z.object({
  schemaVersion: z.literal(1),
  propertyBasics: propertyBasicsSchema.optional(),
  emergencyInfo: emergencyInfoSchema.optional(),
  utilities: utilitiesSchema.optional(),
  shutoffsPanels: shutoffsPanelsSchema.optional(),
  hvac: hvacSchema.optional(),
  waterHeater: waterHeaterSchema.optional(),
  majorAppliances: majorAppliancesSchema.optional(),
  exteriorSystems: exteriorSystemsSchema.optional(),
  securityAccess: securityAccessSchema.optional(),
  smartHome: smartHomeSchema.optional(),
  trashRecycling: trashRecyclingSchema.optional(),
  maintenanceContacts: maintenanceContactsSchema.optional(),
  hoaCommunity: hoaCommunitySchema.optional(),
  warranties: warrantiesSchema.optional(),
  localKnowledge: localKnowledgeSchema.optional(),
  quirksTips: quirksTipsSchema.optional(),
  documentVault: documentVaultSchema.optional(),
  welcomeLetter: welcomeLetterSchema.optional(),
  // Host-specific
  houseRules: houseRulesSchema.optional(),
  checkInOut: checkInOutSchema.optional(),
  amenitiesGuide: amenitiesGuideSchema.optional(),
});

export type HouseManualData = z.infer<typeof houseManualSchema>;

// Export sub-schemas for use in section forms
export {
  propertyBasicsSchema,
  emergencyInfoSchema,
  utilitiesSchema,
  shutoffsPanelsSchema,
  hvacSchema,
  waterHeaterSchema,
  majorAppliancesSchema,
  exteriorSystemsSchema,
  securityAccessSchema,
  smartHomeSchema,
  trashRecyclingSchema,
  maintenanceContactsSchema,
  hoaCommunitySchema,
  warrantiesSchema,
  localKnowledgeSchema,
  quirksTipsSchema,
  documentVaultSchema,
  welcomeLetterSchema,
  houseRulesSchema,
  checkInOutSchema,
  amenitiesGuideSchema,
};

// Export helper schemas
export {
  utilityContactSchema,
  locationFieldSchema,
  contactSchema,
  applianceSchema,
  applianceEntrySchema,
  otherApplianceSchema,
  contactWithRoleSchema,
  trustedNeighborSchema,
};

// Export inferred types for helper schemas
export type UtilityContact = z.infer<typeof utilityContactSchema>;
export type LocationField = z.infer<typeof locationFieldSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type ApplianceEntry = z.infer<typeof applianceEntrySchema>;
export type OtherAppliance = z.infer<typeof otherApplianceSchema>;
export type ContactWithRole = z.infer<typeof contactWithRoleSchema>;
export type TrustedNeighbor = z.infer<typeof trustedNeighborSchema>;

// Section key type
export type SectionKey = keyof Omit<HouseManualData, "schemaVersion">;
