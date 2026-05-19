import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";
import type { HouseManualData } from "@/lib/schema";
import type { ManualMode } from "@/types";
import type { PDFTheme } from "./themes";
import { defaultTheme } from "./themes";
import { getSectionsForMode } from "@/lib/sections";
import { createStyles } from "./components/PDFStyles";

interface HouseManualPDFProps {
  data: HouseManualData;
  mode?: ManualMode;
  theme?: PDFTheme;
}

// Module-level styles ref — set by the main component before render
let styles = createStyles(defaultTheme);

// ─── Shared Components ───────────────────────────────────────────────

function Footer({ address }: { address: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
      />
      <Text>{address}</Text>
    </View>
  );
}

let rowIndex = 0;
function resetRowIndex() { rowIndex = 0; }

function KVRow({ label, value }: { label: string; value: string | undefined | null }) {
  if (!value) return null;
  const isStriped = rowIndex % 2 === 0;
  rowIndex++;
  return (
    <View style={isStriped ? styles.rowStriped : styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function PhotoField({ src }: { src: string | undefined }) {
  if (!src || !src.startsWith("data:image/")) return null;
  return <Image src={src} style={styles.photo} />;
}

function SectionHeader({ number, title }: { number: number; title: string }) {
  resetRowIndex();
  return (
    <Text style={styles.sectionTitle}>
      {number}. {title}
    </Text>
  );
}

function SubHeader({ title }: { title: string }) {
  resetRowIndex();
  return <Text style={styles.subsectionTitle}>{title}</Text>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  resetRowIndex();
  return (
    <View style={styles.card} wrap={false}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>{title}</Text>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletDot}>{"\u2022"}</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

// ─── Utility blocks ──────────────────────────────────────────────────

function UtilityCard({
  title,
  data,
}: {
  title: string;
  data: { provider?: string; accountNumber?: string; phone?: string; website?: string; notes?: string } | undefined;
}) {
  if (!data) return null;
  const hasValues = Object.values(data).some((v) => v);
  if (!hasValues) return null;

  return (
    <Card title={title}>
      <KVRow label="Provider" value={data.provider} />
      <KVRow label="Account" value={data.accountNumber} />
      <KVRow label="Phone" value={data.phone} />
      <KVRow label="Website" value={data.website} />
      <KVRow label="Notes" value={data.notes} />
    </Card>
  );
}

function ContactCard({
  title,
  data,
}: {
  title: string;
  data: { name?: string; company?: string; phone?: string; email?: string; notes?: string } | undefined;
}) {
  if (!data) return null;
  const hasValues = Object.values(data).some((v) => v);
  if (!hasValues) return null;

  return (
    <Card title={title}>
      <KVRow label="Name" value={data.name} />
      <KVRow label="Company" value={data.company} />
      <KVRow label="Phone" value={data.phone} />
      <KVRow label="Email" value={data.email} />
      <KVRow label="Notes" value={data.notes} />
    </Card>
  );
}

function LocationBlock({
  title,
  data,
}: {
  title: string;
  data: { location?: string; photo?: string } | undefined;
}) {
  if (!data?.location && !data?.photo) return null;

  return (
    <View wrap={false}>
      <SubHeader title={title} />
      <KVRow label="Location" value={data.location} />
      <PhotoField src={data.photo} />
    </View>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────

function hasData(obj: Record<string, unknown> | undefined): boolean {
  if (!obj) return false;
  return Object.values(obj).some((v) => {
    if (v === undefined || v === null || v === "") return false;
    if (typeof v === "boolean") return true;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") return hasData(v as Record<string, unknown>);
    return true;
  });
}

function getCompletedSections(data: HouseManualData, mode: ManualMode = "seller") {
  const sectionMeta = getSectionsForMode(mode);
  return sectionMeta.filter((s) => {
    const sectionData = data[s.id];
    return sectionData && hasData(sectionData as Record<string, unknown>);
  });
}

// ─── Main Document ───────────────────────────────────────────────────

export function HouseManualPDF({ data, mode = "seller", theme = defaultTheme }: HouseManualPDFProps) {
  // Rebuild styles for this render
  styles = createStyles(theme);

  const address = data.propertyBasics?.address || "Property";
  const cityStateZip = data.propertyBasics?.cityStateZip || "";
  const completedSections = getCompletedSections(data, mode);
  const docTitle = mode === "host" ? "Guest Manual" : "House Manual";

  return (
    <Document>
      {/* Cover Page — dark background */}
      <Page size="LETTER" style={styles.coverPage}>
        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 56 }}>
          <Text style={styles.coverBadge}>{docTitle}</Text>
          <Text style={styles.coverTitle}>{address}</Text>
          <Text style={styles.coverCityState}>{cityStateZip}</Text>
          <View style={styles.coverDivider} />
          {data.propertyBasics?.datePrepared && (
            <Text style={styles.coverMeta}>
              Prepared {data.propertyBasics.datePrepared}
            </Text>
          )}
          {data.propertyBasics?.preparedBy && (
            <Text style={styles.coverMeta}>
              By {data.propertyBasics.preparedBy}
            </Text>
          )}
        </View>
        <Text style={styles.coverFooter}>
          Generated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </Text>
      </Page>

      {/* Table of Contents */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.tocTitle}>Contents</Text>
        {completedSections.map((s) => (
          <View key={s.id} style={styles.tocEntry}>
            <Text style={styles.tocNumber}>{String(s.number).padStart(2, "0")}</Text>
            <Text style={styles.tocLabel}>{s.title}</Text>
          </View>
        ))}
        <Footer address={address} />
      </Page>

      {/* Section Pages */}
      {completedSections.map((section) => (
        <Page key={section.id} size="LETTER" style={styles.page} wrap>
          <SectionHeader number={section.number} title={section.title} />
          <SectionContent sectionId={section.id} data={data} />
          <Footer address={address} />
        </Page>
      ))}
    </Document>
  );
}

// ─── Section Content ─────────────────────────────────────────────────

function SectionContent({
  sectionId,
  data,
}: {
  sectionId: string;
  data: HouseManualData;
}) {
  switch (sectionId) {
    case "propertyBasics": {
      const d = data.propertyBasics;
      if (!d) return null;
      resetRowIndex();
      return (
        <View>
          <KVRow label="Address" value={d.address} />
          <KVRow label="City, State, ZIP" value={d.cityStateZip} />
          <KVRow label="Year Built" value={d.yearBuilt} />
          <KVRow label="Square Footage" value={d.squareFootage} />
          <KVRow label="Lot Size" value={d.lotSize} />
          <KVRow label="Bedrooms" value={d.bedrooms} />
          <KVRow label="Bathrooms" value={d.bathrooms} />
          <KVRow
            label="Property Type"
            value={d.propertyType?.replace(/_/g, " ")}
          />
          <KVRow label="Date Prepared" value={d.datePrepared} />
          <KVRow label="Prepared By" value={d.preparedBy} />
        </View>
      );
    }

    case "emergencyInfo": {
      const d = data.emergencyInfo;
      if (!d) return null;
      return (
        <View>
          <Card title="Hospital">
            <KVRow label="Name" value={d.nearestHospitalName} />
            <KVRow label="Address" value={d.nearestHospitalAddress} />
          </Card>
          {resetRowIndex() as undefined}
          <Card title="Emergency Numbers">
            <KVRow label="Police" value={d.policeNonEmergency} />
            <KVRow label="Fire" value={d.fireNonEmergency} />
            <KVRow label="Poison Control" value={d.poisonControl} />
            <KVRow label="Gas Leak" value={d.gasLeakEmergency} />
            <KVRow label="Power Outage" value={d.powerOutageReporting} />
          </Card>
        </View>
      );
    }

    case "utilities": {
      const d = data.utilities;
      if (!d) return null;
      return (
        <View>
          <UtilityCard title="Electric" data={d.electric} />
          <UtilityCard title="Natural Gas" data={d.naturalGas} />
          <UtilityCard title="Water / Sewer" data={d.waterSewer} />
          <UtilityCard title="Trash / Recycling" data={d.trashRecycling} />
          <UtilityCard title="Internet" data={d.internet} />
          {d.hasCableStreaming && <UtilityCard title="Cable / Streaming" data={d.cableStreaming} />}
          {d.hasLandline && <UtilityCard title="Landline" data={d.landline} />}
          {d.hasPropane && <UtilityCard title="Propane" data={d.propane} />}
        </View>
      );
    }

    case "shutoffsPanels": {
      const d = data.shutoffsPanels;
      if (!d) return null;
      return (
        <View>
          <LocationBlock title="Water Main Shutoff" data={d.waterMainShutoff} />
          {d.individualWaterShutoffs && (
            <View>
              <SubHeader title="Individual Water Shutoffs" />
              <Text style={styles.paragraph}>{d.individualWaterShutoffs}</Text>
            </View>
          )}
          <LocationBlock title="Gas Shutoff" data={d.gasShutoff} />
          <LocationBlock title="Main Breaker Panel" data={d.mainBreakerPanel} />
          {d.hasSubPanel && d.subPanelLocations?.map((sp, i) => (
            <LocationBlock key={i} title={`Sub-Panel ${i + 1}`} data={sp} />
          ))}
          {d.hasSurgeProtector && (
            <LocationBlock title="Surge Protector" data={d.surgeProtectorLocation} />
          )}
          {d.hasGenerator && d.generator && (
            <Card title="Generator">
              <KVRow label="Type" value={d.generator.type} />
              <KVRow label="Fuel" value={d.generator.fuel} />
              <KVRow label="Transfer Switch" value={d.generator.transferSwitchLocation} />
              <PhotoField src={d.generator.photo} />
            </Card>
          )}
        </View>
      );
    }

    case "hvac": {
      const d = data.hvac;
      if (!d) return null;
      resetRowIndex();
      return (
        <View>
          <KVRow label="System Type" value={d.systemType} />
          <KVRow label="Heating Fuel" value={d.heatingFuelSource} />
          <KVRow label="Unit Locations" value={d.unitLocations} />
          <KVRow label="Make / Model / Serial" value={d.makeModelSerial} />
          <KVRow label="Install Date" value={d.installDate} />
          <KVRow label="Last Service" value={d.lastServiceDate} />
          {d.serviceCompany && (d.serviceCompany.name || d.serviceCompany.phone) && (
            <Card title="Service Company">
              <KVRow label="Name" value={d.serviceCompany.name} />
              <KVRow label="Phone" value={d.serviceCompany.phone} />
            </Card>
          )}
          <KVRow label="Filter Sizes" value={d.filterSizes} />
          <KVRow label="Change Frequency" value={d.filterChangeFrequency} />
          <KVRow label="Thermostat Type" value={d.thermostatType} />
          {d.hasZones && d.zonesDescription && (
            <View>
              <SubHeader title="Zones" />
              <Text style={styles.paragraph}>{d.zonesDescription}</Text>
            </View>
          )}
        </View>
      );
    }

    case "waterHeater": {
      const d = data.waterHeater;
      if (!d) return null;
      resetRowIndex();
      return (
        <View>
          <KVRow label="Type" value={d.type} />
          <KVRow label="Fuel" value={d.fuel} />
          <KVRow label="Location" value={d.location} />
          <KVRow label="Make / Model / Serial" value={d.makeModelSerial} />
          <KVRow label="Install Date" value={d.installDate} />
          <KVRow label="Capacity" value={d.capacity} />
          <KVRow label="Last Flush / Service" value={d.lastFlushService} />
        </View>
      );
    }

    case "majorAppliances": {
      const d = data.majorAppliances;
      if (!d) return null;
      const appliances = [
        { key: "refrigerator" as const, label: "Refrigerator" },
        { key: "dishwasher" as const, label: "Dishwasher" },
        { key: "rangeCooktop" as const, label: "Range / Cooktop" },
        { key: "ovens" as const, label: "Oven(s)" },
        { key: "microwave" as const, label: "Microwave" },
        { key: "washer" as const, label: "Washer" },
        { key: "dryer" as const, label: "Dryer" },
        { key: "garbageDisposal" as const, label: "Garbage Disposal" },
        { key: "wineFridge" as const, label: "Wine Fridge" },
      ];

      return (
        <View>
          {appliances.map(({ key, label }) => {
            const a = d[key];
            if (!a?.hasAppliance) return null;
            return (
              <Card key={key} title={label}>
                <KVRow label="Make" value={a.make} />
                <KVRow label="Model" value={a.model} />
                <KVRow label="Serial" value={a.serial} />
                <KVRow label="Install Date" value={a.installDate} />
                <KVRow label="Warranty" value={a.warrantyStatus} />
                <KVRow label="Manual" value={a.manualLocation} />
              </Card>
            );
          })}
          {d.otherAppliances?.map((a, i) => (
            <Card key={i} title={a.type || `Other Appliance ${i + 1}`}>
              <KVRow label="Make" value={a.make} />
              <KVRow label="Model" value={a.model} />
              <KVRow label="Serial" value={a.serial} />
              <KVRow label="Install Date" value={a.installDate} />
              <KVRow label="Warranty" value={a.warrantyStatus} />
              <KVRow label="Manual" value={a.manualLocation} />
            </Card>
          ))}
        </View>
      );
    }

    case "exteriorSystems": {
      const d = data.exteriorSystems;
      if (!d) return null;
      return (
        <View>
          {d.roof && (
            <Card title="Roof">
              <KVRow label="Type" value={d.roof.type} />
              <KVRow label="Age" value={d.roof.age} />
              <KVRow label="Last Inspection" value={d.roof.lastInspection} />
            </Card>
          )}
          <KVRow label="Gutters Last Cleaned" value={d.guttersLastCleaned} />
          {d.hasSprinklers && d.sprinklers && (
            <Card title="Sprinkler System">
              <KVRow label="Controller" value={d.sprinklers.controllerLocation} />
              <KVRow label="Zones" value={d.sprinklers.zones} />
              <KVRow label="Schedule" value={d.sprinklers.schedule} />
              <KVRow label="Company" value={d.sprinklers.company} />
            </Card>
          )}
          {d.hasPool && d.pool && (
            <Card title="Pool">
              <KVRow label="Equipment" value={d.pool.equipmentLocation} />
              <KVRow label="Service Co." value={d.pool.serviceCompany} />
              <KVRow label="Chemicals" value={d.pool.chemicalSchedule} />
            </Card>
          )}
          {d.hasSpa && d.spa && (
            <View>
              <SubHeader title="Spa / Hot Tub" />
              <Text style={styles.paragraph}>{d.spa}</Text>
            </View>
          )}
          {d.hasSolar && d.solar && (
            <Card title="Solar">
              <KVRow label="System" value={d.solar.systemType} />
              <KVRow label="Installer" value={d.solar.installer} />
              <KVRow label="Monitoring" value={d.solar.monitoringInfo} />
              <KVRow label="Lease / Owned" value={d.solar.leaseOrOwned} />
            </Card>
          )}
          {d.hasSeptic && d.septic && (
            <Card title="Septic">
              <KVRow label="Location" value={d.septic.location} />
              <KVRow label="Last Pumped" value={d.septic.lastPumped} />
              <KVRow label="Service Co." value={d.septic.serviceCompany} />
            </Card>
          )}
          {d.hasWell && d.well && (
            <Card title="Well">
              <KVRow label="Location" value={d.well.location} />
              <KVRow label="Last Test" value={d.well.lastTest} />
              <KVRow label="Pump Info" value={d.well.pumpInfo} />
            </Card>
          )}
          {d.hasOutdoorLighting && d.outdoorLighting && (
            <Card title="Outdoor Lighting">
              <KVRow label="Controller" value={d.outdoorLighting.controllerLocation} />
            </Card>
          )}
        </View>
      );
    }

    case "securityAccess": {
      const d = data.securityAccess;
      if (!d) return null;
      return (
        <View>
          {d.hasAlarm && d.alarm && (
            <Card title="Alarm System">
              <KVRow label="Provider" value={d.alarm.provider} />
              <KVRow label="Account" value={d.alarm.account} />
              <KVRow label="Panel" value={d.alarm.panelLocation} />
            </Card>
          )}
          {d.hasCameras && d.cameras && (
            <Card title="Security Cameras">
              <KVRow label="System" value={d.cameras.system} />
              <KVRow label="App" value={d.cameras.app} />
              <KVRow label="Notes" value={d.cameras.notes} />
            </Card>
          )}
          {d.hasSmartLocks && d.smartLocks && (
            <Card title="Smart Locks">
              <KVRow label="Brand" value={d.smartLocks.brand} />
              <KVRow label="App" value={d.smartLocks.app} />
              <KVRow label="Codes" value={d.smartLocks.codes} />
            </Card>
          )}
          {d.hasGarageDoor && d.garageDoor && (
            <Card title="Garage Door">
              <KVRow label="Brand" value={d.garageDoor.openerBrand} />
              <KVRow label="Codes" value={d.garageDoor.codes} />
              <KVRow label="Override" value={d.garageDoor.manualOverride} />
            </Card>
          )}
          {d.hasGateCodes && d.gateCodes && (
            <View>
              <SubHeader title="Gate Codes" />
              <Text style={styles.paragraph}>{d.gateCodes}</Text>
            </View>
          )}
          {resetRowIndex() as undefined}
          {d.hasMailboxKey && <KVRow label="Mailbox Key" value={d.mailboxKeyLocation} />}
          {d.hasSpareKey && <KVRow label="Spare Key" value={d.spareKeyLocation} />}
          {d.hasSafe && d.safe && (
            <Card title="Safe">
              <KVRow label="Location" value={d.safe.location} />
              <KVRow label="Combo Handoff" value={d.safe.comboHandoffMethod} />
            </Card>
          )}
        </View>
      );
    }

    case "smartHome": {
      const d = data.smartHome;
      if (!d) return null;
      return (
        <View>
          {d.hasWifi && d.wifi && (
            <Card title="WiFi">
              <KVRow label="Network" value={d.wifi.networkName} />
              <KVRow label="Password" value={d.wifi.password} />
              <KVRow label="Router" value={d.wifi.routerLocation} />
            </Card>
          )}
          {d.hasMeshNodes && d.meshNodes && (
            <View><SubHeader title="Mesh Nodes" /><Text style={styles.paragraph}>{d.meshNodes}</Text></View>
          )}
          {d.hasSmartHub && d.smartHub && (
            <View><SubHeader title="Smart Hub" /><Text style={styles.paragraph}>{d.smartHub}</Text></View>
          )}
          {d.hasSmartSpeakers && d.smartSpeakers && (
            <View><SubHeader title="Smart Speakers" /><Text style={styles.paragraph}>{d.smartSpeakers}</Text></View>
          )}
          {d.hasSmartThermostat && d.smartThermostat && (
            <View><SubHeader title="Smart Thermostat" /><Text style={styles.paragraph}>{d.smartThermostat}</Text></View>
          )}
          {d.hasSmartLighting && d.smartLighting && (
            <View><SubHeader title="Smart Lighting" /><Text style={styles.paragraph}>{d.smartLighting}</Text></View>
          )}
          {d.hasSmartBlinds && d.smartBlinds && (
            <View><SubHeader title="Smart Blinds" /><Text style={styles.paragraph}>{d.smartBlinds}</Text></View>
          )}
          {d.hasEvCharger && d.evCharger && (
            <Card title="EV Charger">
              <KVRow label="Brand" value={d.evCharger.brand} />
              <KVRow label="Amperage" value={d.evCharger.amperage} />
              <KVRow label="Location" value={d.evCharger.location} />
            </Card>
          )}
        </View>
      );
    }

    case "trashRecycling": {
      const d = data.trashRecycling;
      if (!d) return null;
      resetRowIndex();
      return (
        <View>
          <KVRow label="Pickup Days" value={d.pickupDays} />
          <KVRow label="Bin Storage" value={d.binStorageLocation} />
          <KVRow label="Bulk Pickup" value={d.bulkPickup} />
          <KVRow label="Yard Waste" value={d.yardWasteSchedule} />
          <KVRow label="Hauler" value={d.haulerContact} />
          {d.recyclingRules && (
            <View>
              <SubHeader title="Recycling Rules" />
              <Text style={styles.paragraph}>{d.recyclingRules}</Text>
            </View>
          )}
        </View>
      );
    }

    case "maintenanceContacts": {
      const d = data.maintenanceContacts;
      if (!d) return null;
      const contacts = [
        { has: d.hasPlumber, data: d.plumberContact, title: "Plumber" },
        { has: d.hasElectrician, data: d.electricianContact, title: "Electrician" },
        { has: d.hasHvacTech, data: d.hvacTechContact, title: "HVAC Tech" },
        { has: d.hasRoofer, data: d.rooferContact, title: "Roofer" },
        { has: d.hasHandyman, data: d.handymanContact, title: "Handyman" },
        { has: d.hasLandscaper, data: d.landscaperContact, title: "Landscaper" },
        { has: d.hasTreeService, data: d.treeServiceContact, title: "Tree Service" },
        { has: d.hasPoolSpaService, data: d.poolSpaServiceContact, title: "Pool / Spa" },
        { has: d.hasPestControl, data: d.pestControlContact, title: "Pest Control" },
        { has: d.hasCleaner, data: d.cleanerContact, title: "Cleaner" },
        { has: d.hasWindowWasher, data: d.windowWasherContact, title: "Window Washer" },
        { has: d.hasChimneySweep, data: d.chimneySweepContact, title: "Chimney Sweep" },
        { has: d.hasSepticService, data: d.septicServiceContact, title: "Septic Service" },
        { has: d.hasPainter, data: d.painterContact, title: "Painter" },
      ];

      return (
        <View>
          {contacts
            .filter((c) => c.has && c.data)
            .map((c) => (
              <ContactCard key={c.title} title={c.title} data={c.data} />
            ))}
          {d.otherContacts?.map((c, i) => (
            <ContactCard key={i} title={c.role || `Other ${i + 1}`} data={c} />
          ))}
        </View>
      );
    }

    case "hoaCommunity": {
      const d = data.hoaCommunity;
      if (!d?.hasHoa || !d.hoa) return null;
      const h = d.hoa;
      resetRowIndex();
      return (
        <View>
          <KVRow label="HOA Name" value={h.name} />
          <KVRow label="Management" value={h.managementCompany} />
          <KVRow label="Contact" value={h.contactName} />
          <KVRow label="Phone" value={h.contactPhone} />
          <KVRow label="Email" value={h.contactEmail} />
          <KVRow label="Dues" value={h.duesAmount ? `${h.duesAmount} ${h.duesFrequency || ""}`.trim() : undefined} />
          <KVRow label="Portal" value={h.paymentPortalUrl} />
          <KVRow label="CC&Rs" value={h.ccrDocLink} />
          <KVRow label="Quiet Hours" value={h.quietHours} />
          {h.amenityAccess && (
            <View><SubHeader title="Amenity Access" /><Text style={styles.paragraph}>{h.amenityAccess}</Text></View>
          )}
          {h.architecturalReview && (
            <View><SubHeader title="Architectural Review" /><Text style={styles.paragraph}>{h.architecturalReview}</Text></View>
          )}
        </View>
      );
    }

    case "warranties": {
      const d = data.warranties;
      if (!d) return null;
      return (
        <View>
          {d.homeWarranty && (
            <Card title="Home Warranty">
              <KVRow label="Provider" value={d.homeWarranty.provider} />
              <KVRow label="Plan" value={d.homeWarranty.plan} />
              <KVRow label="Expiration" value={d.homeWarranty.expiration} />
              <KVRow label="Claims" value={d.homeWarranty.claimPhone} />
            </Card>
          )}
          {d.applianceWarrantiesSummary && (
            <View>
              <SubHeader title="Appliance Warranties" />
              <Text style={styles.paragraph}>{d.applianceWarrantiesSummary}</Text>
            </View>
          )}
        </View>
      );
    }

    case "localKnowledge": {
      const d = data.localKnowledge;
      if (!d) return null;
      return (
        <View>
          {d.hasTrustedNeighbors && d.trustedNeighbors?.map((n, i) => (
            <Card key={i} title={n.name || `Neighbor ${i + 1}`}>
              <KVRow label="Address" value={n.address} />
              <KVRow label="Phone" value={n.phone} />
              <KVRow label="Helps With" value={n.helpsWith} />
            </Card>
          ))}
          {d.hasRecommendations && d.recommendations && (
            <Card title="Local Recommendations">
              <KVRow label="Grocery" value={d.recommendations.grocery} />
              <KVRow label="Hardware" value={d.recommendations.hardware} />
              <KVRow label="Pharmacy" value={d.recommendations.pharmacy} />
            </Card>
          )}
          {d.hasVet && d.vet && (
            <Card title="Veterinarian">
              <KVRow label="Name" value={d.vet.name} />
              <KVRow label="Phone" value={d.vet.phone} />
              <KVRow label="Address" value={d.vet.address} />
            </Card>
          )}
          {d.hasLocalQuirks && d.localQuirks && (
            <View><SubHeader title="Local Quirks" /><Text style={styles.paragraph}>{d.localQuirks}</Text></View>
          )}
          {d.hasSchoolDistrict && d.schoolDistrict && (
            <View><SubHeader title="School District" /><Text style={styles.paragraph}>{d.schoolDistrict}</Text></View>
          )}
          {d.hasTrafficNotes && d.trafficNotes && (
            <View><SubHeader title="Traffic Notes" /><Text style={styles.paragraph}>{d.trafficNotes}</Text></View>
          )}
        </View>
      );
    }

    case "quirksTips": {
      const d = data.quirksTips;
      if (!d?.quirks?.length) return null;
      const filtered = d.quirks.filter((q) => q && q.trim());
      if (filtered.length === 0) return null;
      return (
        <View>
          {filtered.map((q, i) => (
            <Bullet key={i} text={q} />
          ))}
        </View>
      );
    }

    case "documentVault": {
      const d = data.documentVault;
      if (!d) return null;
      resetRowIndex();
      return (
        <View>
          <KVRow label="Survey / Plot Plan" value={d.surveyPlotPlan} />
          <KVRow label="Inspection Report" value={d.inspectionReport} />
          <KVRow label="Appliance Manuals" value={d.applianceManuals} />
          <KVRow label="Permits" value={d.permits} />
          <KVRow label="Receipts" value={d.receipts} />
          <KVRow label="HOA Documents" value={d.hoaDocs} />
        </View>
      );
    }

    case "welcomeLetter": {
      const d = data.welcomeLetter;
      if (!d?.welcomeLetter) return null;
      return (
        <View>
          <Text style={{ ...styles.paragraph, lineHeight: 1.7, fontSize: 11 }}>
            {d.welcomeLetter}
          </Text>
        </View>
      );
    }

    case "houseRules": {
      const d = data.houseRules;
      if (!d) return null;
      resetRowIndex();
      return (
        <View>
          <KVRow label="Max Guests" value={d.maxGuests} />
          <KVRow label="Quiet Hours" value={d.quietHoursStart && d.quietHoursEnd ? `${d.quietHoursStart} – ${d.quietHoursEnd}` : d.quietHoursStart} />
          <KVRow label="Smoking" value={d.smokingPolicy?.replace(/_/g, " ")} />
          <KVRow label="Pets" value={d.petPolicy?.replace(/_/g, " ")} />
          <KVRow label="Parties" value={d.partyPolicy?.replace(/_/g, " ")} />
          {d.parkingInstructions && (
            <View><SubHeader title="Parking" /><Text style={styles.paragraph}>{d.parkingInstructions}</Text></View>
          )}
          {d.additionalRules && d.additionalRules.filter(r => r?.trim()).length > 0 && (
            <View>
              <SubHeader title="Additional Rules" />
              {d.additionalRules.filter(r => r?.trim()).map((rule, i) => (
                <Bullet key={i} text={rule} />
              ))}
            </View>
          )}
        </View>
      );
    }

    case "checkInOut": {
      const d = data.checkInOut;
      if (!d) return null;
      resetRowIndex();
      return (
        <View>
          <KVRow label="Check-in" value={d.checkInTime} />
          <KVRow label="Check-out" value={d.checkOutTime} />
          <KVRow label="Early Check-in" value={d.earlyCheckIn} />
          <KVRow label="Late Check-out" value={d.lateCheckOut} />
          <KVRow label="Method" value={d.checkInMethod?.replace(/_/g, " ")} />
          <KVRow label="Lock Code" value={d.lockboxCode} />
          <KVRow label="Key Pickup" value={d.keyPickupInstructions} />
          {d.checkInSteps && (
            <View><SubHeader title="Check-in Steps" /><Text style={styles.paragraph}>{d.checkInSteps}</Text></View>
          )}
          {d.checkOutSteps && (
            <View><SubHeader title="Check-out Steps" /><Text style={styles.paragraph}>{d.checkOutSteps}</Text></View>
          )}
          <KVRow label="Luggage Storage" value={d.luggageStorage} />
        </View>
      );
    }

    case "amenitiesGuide": {
      const d = data.amenitiesGuide;
      if (!d) return null;
      const amenities = [
        { has: d.hasPool, title: "Pool", detail: d.poolInstructions },
        { has: d.hasHotTub, title: "Hot Tub", detail: d.hotTubInstructions },
        { has: d.hasGrill, title: "Grill / BBQ", detail: d.grillInstructions },
        { has: d.hasFirepit, title: "Fire Pit", detail: d.firepitInstructions },
        { has: d.hasGameRoom, title: "Game Room", detail: d.gameRoomDetails },
        { has: d.hasGym, title: "Gym", detail: d.gymDetails },
        { has: d.hasStreamingServices, title: "Streaming", detail: d.streamingDetails },
        { has: d.hasBikes, title: "Bikes", detail: d.bikeDetails },
        { has: d.hasBeachGear, title: "Beach Gear", detail: d.beachGearDetails },
      ];
      return (
        <View>
          {amenities.filter(a => a.has).map((a) => (
            <View key={a.title}>
              <SubHeader title={a.title} />
              {a.detail && <Text style={styles.paragraph}>{a.detail}</Text>}
            </View>
          ))}
          {d.otherAmenities && (
            <View><SubHeader title="Other Amenities" /><Text style={styles.paragraph}>{d.otherAmenities}</Text></View>
          )}
        </View>
      );
    }

    default:
      return null;
  }
}
