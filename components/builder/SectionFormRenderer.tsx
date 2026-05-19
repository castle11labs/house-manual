"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useCallback, useRef, useState } from "react";
import { Check } from "lucide-react";
import type { SectionKey, HouseManualData } from "@/lib/schema";
import { loadManualData, saveSectionData } from "@/lib/storage";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { FormSection } from "@/components/ui/FormSection";
import { RepeatableField } from "@/components/ui/RepeatableField";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { UtilityContactFields } from "./UtilityContactFields";
import { ContactFields } from "./ContactFields";

interface SectionFormRendererProps {
  sectionId: SectionKey;
  onSave: () => void;
}

export function SectionFormRenderer({ sectionId, onSave }: SectionFormRendererProps) {
  const data = loadManualData();
  const sectionData = data[sectionId] || {};
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const { register, watch, setValue: rawSetValue, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: sectionData as Record<string, unknown>,
  });

  // Wrapper to avoid strict type issues with setValue
  const setValue = (name: string, value: unknown) => {
    rawSetValue(name, value, { shouldDirty: true, shouldValidate: true });
  };

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const autoSave = useCallback(
    (formData: Record<string, unknown>) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      setSaveStatus("saving");
      saveTimeoutRef.current = setTimeout(() => {
        saveSectionData(sectionId, formData as HouseManualData[typeof sectionId]);
        setSaveStatus("saved");
        fadeTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
      }, 500);
    },
    [sectionId]
  );

  useEffect(() => {
    const subscription = watch((formData) => {
      autoSave(formData as Record<string, unknown>);
    });
    return () => {
      subscription.unsubscribe();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [watch, autoSave]);

  const onSubmit = handleSubmit((formData) => {
    saveSectionData(sectionId, formData as HouseManualData[typeof sectionId]);
    onSave();
  });

  const watchBool = (name: string): boolean => !!watch(name);
  const watchString = (name: string): string | undefined => watch(name) as string | undefined;

  switch (sectionId) {
    case "propertyBasics":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection title="Address">
            <input type="hidden" {...register("address", { required: "Address is required" })} />
            <AddressAutocomplete
              label="Street Address *"
              value={watchString("address") || ""}
              error={errors.address?.message as string}
              onChange={(val) => setValue("address", val)}
              onSelect={({ street, cityStateZip }) => {
                setValue("address", street);
                setValue("cityStateZip", cityStateZip);
              }}
            />
            <Input
              label="City, State, ZIP *"
              {...register("cityStateZip", { required: "City, State, ZIP is required" })}
              error={errors.cityStateZip?.message as string}
            />
          </FormSection>
          <FormSection title="Property Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Year Built" {...register("yearBuilt")} />
              <Input label="Square Footage" {...register("squareFootage")} />
              <Input label="Lot Size" {...register("lotSize")} />
              <Input label="Bedrooms" {...register("bedrooms")} />
              <Input label="Bathrooms" {...register("bathrooms")} />
              <Select
                label="Property Type"
                {...register("propertyType")}
                placeholder="Select type"
                options={[
                  { value: "single_family", label: "Single Family" },
                  { value: "condo", label: "Condo" },
                  { value: "townhouse", label: "Townhouse" },
                  { value: "multi_family", label: "Multi-Family" },
                  { value: "other", label: "Other" },
                ]}
              />
            </div>
          </FormSection>
          <FormSection title="Preparation Info">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Date Prepared" type="date" {...register("datePrepared")} />
              <Input label="Prepared By" {...register("preparedBy")} />
            </div>
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "emergencyInfo":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection title="Nearest Hospital">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Hospital Name" {...register("nearestHospitalName")} />
              <Input label="Hospital Address" {...register("nearestHospitalAddress")} />
            </div>
          </FormSection>
          <FormSection title="Emergency Numbers">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Police (Non-Emergency)" {...register("policeNonEmergency")} />
              <Input label="Fire (Non-Emergency)" {...register("fireNonEmergency")} />
              <Input label="Poison Control" {...register("poisonControl")} />
              <Input label="Gas Leak Emergency" {...register("gasLeakEmergency")} />
              <Input label="Power Outage Reporting" {...register("powerOutageReporting")} />
            </div>
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "utilities":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection>
            <UtilityContactFields register={register} prefix={"electric" as never} title="Electric" />
          </FormSection>
          <FormSection>
            <UtilityContactFields register={register} prefix={"naturalGas" as never} title="Natural Gas" />
          </FormSection>
          <FormSection>
            <UtilityContactFields register={register} prefix={"waterSewer" as never} title="Water / Sewer" />
          </FormSection>
          <FormSection>
            <UtilityContactFields register={register} prefix={"trashRecycling" as never} title="Trash / Recycling" />
          </FormSection>
          <FormSection>
            <UtilityContactFields register={register} prefix={"internet" as never} title="Internet" />
          </FormSection>
          <FormSection>
            <Toggle
              label="Cable / Streaming service?"
              checked={watchBool("hasCableStreaming")}
              onChange={(v) => setValue("hasCableStreaming", v)}
            />
            {watchBool("hasCableStreaming") && (
              <div className="mt-4">
                <UtilityContactFields register={register} prefix={"cableStreaming" as never} title="Cable / Streaming" />
              </div>
            )}
          </FormSection>
          <FormSection>
            <Toggle
              label="Landline?"
              checked={watchBool("hasLandline")}
              onChange={(v) => setValue("hasLandline", v)}
            />
            {watchBool("hasLandline") && (
              <div className="mt-4">
                <UtilityContactFields register={register} prefix={"landline" as never} title="Landline" />
              </div>
            )}
          </FormSection>
          <FormSection>
            <Toggle
              label="Propane?"
              checked={watchBool("hasPropane")}
              onChange={(v) => setValue("hasPropane", v)}
            />
            {watchBool("hasPropane") && (
              <div className="mt-4">
                <UtilityContactFields register={register} prefix={"propane" as never} title="Propane" />
              </div>
            )}
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "shutoffsPanels":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection title="Water Main Shutoff">
            <Input label="Location" {...register("waterMainShutoff.location")} />
            <PhotoUpload
              label="Photo"
              value={watchString("waterMainShutoff.photo")}
              onChange={(v) => setValue("waterMainShutoff.photo", v)}
            />
          </FormSection>
          <FormSection title="Individual Water Shutoffs">
            <Textarea
              label="Describe individual shutoff locations"
              {...register("individualWaterShutoffs")}
            />
          </FormSection>
          <FormSection title="Gas Shutoff">
            <Input label="Location" {...register("gasShutoff.location")} />
            <PhotoUpload
              label="Photo"
              value={watchString("gasShutoff.photo")}
              onChange={(v) => setValue("gasShutoff.photo", v)}
            />
          </FormSection>
          <FormSection title="Main Breaker Panel">
            <Input label="Location" {...register("mainBreakerPanel.location")} />
            <PhotoUpload
              label="Photo"
              value={watchString("mainBreakerPanel.photo")}
              onChange={(v) => setValue("mainBreakerPanel.photo", v)}
            />
          </FormSection>
          <FormSection>
            <Toggle
              label="Sub-panel?"
              checked={watchBool("hasSubPanel")}
              onChange={(v) => setValue("hasSubPanel", v)}
            />
            {watchBool("hasSubPanel") && (
              <SubPanelFields control={control} register={register} watch={watch} setValue={setValue} />
            )}
          </FormSection>
          <FormSection>
            <Toggle
              label="Surge protector?"
              checked={watchBool("hasSurgeProtector")}
              onChange={(v) => setValue("hasSurgeProtector", v)}
            />
            {watchBool("hasSurgeProtector") && (
              <div className="mt-4 space-y-3">
                <Input label="Location" {...register("surgeProtectorLocation.location")} />
                <PhotoUpload
                  label="Photo"
                  value={watchString("surgeProtectorLocation.photo")}
                  onChange={(v) => setValue("surgeProtectorLocation.photo", v)}
                />
              </div>
            )}
          </FormSection>
          <FormSection>
            <Toggle
              label="Generator?"
              checked={watchBool("hasGenerator")}
              onChange={(v) => setValue("hasGenerator", v)}
            />
            {watchBool("hasGenerator") && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Type" {...register("generator.type")} />
                <Input label="Fuel" {...register("generator.fuel")} />
                <Input label="Transfer Switch Location" {...register("generator.transferSwitchLocation")} />
                <div className="sm:col-span-2">
                  <PhotoUpload
                    label="Photo"
                    value={watchString("generator.photo")}
                    onChange={(v) => setValue("generator.photo", v)}
                  />
                </div>
              </div>
            )}
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "hvac":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection title="System Info">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="System Type" placeholder="e.g. Central air, heat pump" {...register("systemType")} />
              <Input label="Heating Fuel Source" placeholder="e.g. Natural gas, electric" {...register("heatingFuelSource")} />
              <Input label="Unit Locations" placeholder="e.g. Basement, attic" {...register("unitLocations")} />
              <Input label="Make / Model / Serial" {...register("makeModelSerial")} />
              <Input label="Install Date" type="date" {...register("installDate")} />
              <Input label="Last Service Date" type="date" {...register("lastServiceDate")} />
            </div>
          </FormSection>
          <FormSection title="Service Company">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Company Name" {...register("serviceCompany.name")} />
              <Input label="Phone" {...register("serviceCompany.phone")} />
            </div>
          </FormSection>
          <FormSection title="Filters & Thermostat">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Filter Sizes" {...register("filterSizes")} />
              <Input label="Filter Change Frequency" {...register("filterChangeFrequency")} />
              <Input label="Thermostat Type" {...register("thermostatType")} />
            </div>
            <div className="mt-4">
              <Toggle
                label="Has zones?"
                checked={watchBool("hasZones")}
                onChange={(v) => setValue("hasZones", v)}
              />
              {watchBool("hasZones") && (
                <div className="mt-3">
                  <Textarea label="Zones Description" {...register("zonesDescription")} />
                </div>
              )}
            </div>
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "waterHeater":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Type"
                {...register("type")}
                placeholder="Select type"
                options={[
                  { value: "tank", label: "Tank" },
                  { value: "tankless", label: "Tankless" },
                  { value: "hybrid", label: "Hybrid" },
                ]}
              />
              <Select
                label="Fuel"
                {...register("fuel")}
                placeholder="Select fuel"
                options={[
                  { value: "gas", label: "Gas" },
                  { value: "electric", label: "Electric" },
                  { value: "solar", label: "Solar" },
                ]}
              />
              <Input label="Location" {...register("location")} />
              <Input label="Make / Model / Serial" {...register("makeModelSerial")} />
              <Input label="Install Date" type="date" {...register("installDate")} />
              <Input label="Capacity" placeholder="e.g. 50 gallons" {...register("capacity")} />
              <Input label="Last Flush / Service" type="date" {...register("lastFlushService")} />
            </div>
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "majorAppliances":
      return <MajorAppliancesForm register={register} watch={watch} setValue={setValue} control={control} onSubmit={onSubmit} saveStatus={saveStatus} />;

    case "exteriorSystems":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection title="Roof">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Type" placeholder="e.g. Asphalt shingle, tile" {...register("roof.type")} />
              <Input label="Age" placeholder="e.g. 10 years" {...register("roof.age")} />
              <Input label="Last Inspection" type="date" {...register("roof.lastInspection")} />
            </div>
          </FormSection>
          <FormSection>
            <Input label="Gutters Last Cleaned" type="date" {...register("guttersLastCleaned")} />
          </FormSection>
          {[
            { key: "hasSprinklers", label: "Sprinkler system?", fields: (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input label="Controller Location" {...register("sprinklers.controllerLocation")} />
                <Input label="Zones" {...register("sprinklers.zones")} />
                <Input label="Schedule" {...register("sprinklers.schedule")} />
                <Input label="Company" {...register("sprinklers.company")} />
              </div>
            )},
            { key: "hasPool", label: "Pool?", fields: (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input label="Equipment Location" {...register("pool.equipmentLocation")} />
                <Input label="Service Company" {...register("pool.serviceCompany")} />
                <Input label="Chemical Schedule" {...register("pool.chemicalSchedule")} />
              </div>
            )},
            { key: "hasSpa", label: "Spa / Hot tub?", fields: (
              <div className="mt-4">
                <Textarea label="Details" {...register("spa")} />
              </div>
            )},
            { key: "hasSolar", label: "Solar panels?", fields: (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input label="System Type" {...register("solar.systemType")} />
                <Input label="Installer" {...register("solar.installer")} />
                <Input label="Monitoring Info" {...register("solar.monitoringInfo")} />
                <Input label="Lease or Owned" {...register("solar.leaseOrOwned")} />
              </div>
            )},
            { key: "hasSeptic", label: "Septic system?", fields: (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input label="Location" {...register("septic.location")} />
                <Input label="Last Pumped" type="date" {...register("septic.lastPumped")} />
                <Input label="Service Company" {...register("septic.serviceCompany")} />
              </div>
            )},
            { key: "hasWell", label: "Well?", fields: (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input label="Location" {...register("well.location")} />
                <Input label="Last Test" type="date" {...register("well.lastTest")} />
                <Input label="Pump Info" {...register("well.pumpInfo")} />
              </div>
            )},
            { key: "hasOutdoorLighting", label: "Outdoor lighting?", fields: (
              <div className="mt-4">
                <Input label="Controller Location" {...register("outdoorLighting.controllerLocation")} />
              </div>
            )},
          ].map(({ key, label, fields }) => (
            <FormSection key={key}>
              <Toggle
                label={label}
                checked={watchBool(key)}
                onChange={(v) => setValue(key, v)}
              />
              {watchBool(key) && fields}
            </FormSection>
          ))}
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "securityAccess":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          {[
            { key: "hasAlarm", label: "Alarm system?", fields: (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input label="Provider" {...register("alarm.provider")} />
                <Input label="Account" {...register("alarm.account")} />
                <Input label="Panel Location" {...register("alarm.panelLocation")} />
              </div>
            )},
            { key: "hasCameras", label: "Security cameras?", fields: (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input label="System" {...register("cameras.system")} />
                <Input label="App" {...register("cameras.app")} />
                <Input label="Notes" {...register("cameras.notes")} />
              </div>
            )},
            { key: "hasSmartLocks", label: "Smart locks?", fields: (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input label="Brand" {...register("smartLocks.brand")} />
                <Input label="App" {...register("smartLocks.app")} />
                <Input label="Codes" {...register("smartLocks.codes")} />
              </div>
            )},
            { key: "hasGarageDoor", label: "Garage door opener?", fields: (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input label="Opener Brand" {...register("garageDoor.openerBrand")} />
                <Input label="Codes" {...register("garageDoor.codes")} />
                <Input label="Manual Override" {...register("garageDoor.manualOverride")} />
              </div>
            )},
            { key: "hasGateCodes", label: "Gate codes?", fields: (
              <div className="mt-4">
                <Textarea label="Gate Codes" {...register("gateCodes")} />
              </div>
            )},
            { key: "hasMailboxKey", label: "Mailbox key?", fields: (
              <div className="mt-4">
                <Input label="Key Location" {...register("mailboxKeyLocation")} />
              </div>
            )},
            { key: "hasSpareKey", label: "Spare key?", fields: (
              <div className="mt-4">
                <Input label="Key Location" {...register("spareKeyLocation")} />
              </div>
            )},
            { key: "hasSafe", label: "Safe?", fields: (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input label="Location" {...register("safe.location")} />
                <Input label="Combo Handoff Method" {...register("safe.comboHandoffMethod")} />
              </div>
            )},
          ].map(({ key, label, fields }) => (
            <FormSection key={key}>
              <Toggle
                label={label}
                checked={watchBool(key)}
                onChange={(v) => setValue(key, v)}
              />
              {watchBool(key) && fields}
            </FormSection>
          ))}
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "smartHome":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection>
            <Toggle label="WiFi?" checked={watchBool("hasWifi")} onChange={(v) => setValue("hasWifi", v)} />
            {watchBool("hasWifi") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input label="Network Name" {...register("wifi.networkName")} />
                <Input label="Password" {...register("wifi.password")} />
                <Input label="Router Location" {...register("wifi.routerLocation")} />
              </div>
            )}
          </FormSection>
          {[
            { key: "hasMeshNodes", label: "Mesh WiFi nodes?", field: <Textarea label="Details" {...register("meshNodes")} /> },
            { key: "hasSmartHub", label: "Smart hub?", field: <Textarea label="Details" {...register("smartHub")} /> },
            { key: "hasSmartSpeakers", label: "Smart speakers?", field: <Textarea label="Details" {...register("smartSpeakers")} /> },
            { key: "hasSmartThermostat", label: "Smart thermostat?", field: <Textarea label="Details" {...register("smartThermostat")} /> },
            { key: "hasSmartLighting", label: "Smart lighting?", field: <Textarea label="Details" {...register("smartLighting")} /> },
            { key: "hasSmartBlinds", label: "Smart blinds?", field: <Textarea label="Details" {...register("smartBlinds")} /> },
          ].map(({ key, label, field }) => (
            <FormSection key={key}>
              <Toggle label={label} checked={watchBool(key)} onChange={(v) => setValue(key, v)} />
              {watchBool(key) && <div className="mt-4">{field}</div>}
            </FormSection>
          ))}
          <FormSection>
            <Toggle label="EV Charger?" checked={watchBool("hasEvCharger")} onChange={(v) => setValue("hasEvCharger", v)} />
            {watchBool("hasEvCharger") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input label="Brand" {...register("evCharger.brand")} />
                <Input label="Amperage" {...register("evCharger.amperage")} />
                <Input label="Location" {...register("evCharger.location")} />
              </div>
            )}
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "trashRecycling":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Pickup Days" placeholder="e.g. Tuesday, Friday" {...register("pickupDays")} />
              <Input label="Bin Storage Location" {...register("binStorageLocation")} />
            </div>
            <Textarea label="Recycling Rules" {...register("recyclingRules")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Bulk Pickup" {...register("bulkPickup")} />
              <Input label="Yard Waste Schedule" {...register("yardWasteSchedule")} />
              <Input label="Hauler Contact" {...register("haulerContact")} />
            </div>
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "maintenanceContacts":
      return <MaintenanceContactsForm register={register} watch={watch} setValue={setValue} control={control} onSubmit={onSubmit} saveStatus={saveStatus} />;

    case "hoaCommunity":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection>
            <Toggle label="Has HOA?" checked={watchBool("hasHoa")} onChange={(v) => setValue("hasHoa", v)} />
            {watchBool("hasHoa") && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="HOA Name" {...register("hoa.name")} />
                  <Input label="Management Company" {...register("hoa.managementCompany")} />
                  <Input label="Contact Name" {...register("hoa.contactName")} />
                  <Input label="Contact Phone" {...register("hoa.contactPhone")} />
                  <Input label="Contact Email" {...register("hoa.contactEmail")} />
                  <Input label="Dues Amount" {...register("hoa.duesAmount")} />
                  <Input label="Dues Frequency" placeholder="e.g. Monthly, Quarterly" {...register("hoa.duesFrequency")} />
                  <Input label="Payment Portal URL" {...register("hoa.paymentPortalUrl")} />
                </div>
                <Input label="CC&R Document Link" {...register("hoa.ccrDocLink")} />
                <Textarea label="Amenity Access" {...register("hoa.amenityAccess")} />
                <Input label="Quiet Hours" {...register("hoa.quietHours")} />
                <Textarea label="Architectural Review Notes" {...register("hoa.architecturalReview")} />
              </div>
            )}
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "warranties":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection title="Home Warranty">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Provider" {...register("homeWarranty.provider")} />
              <Input label="Plan" {...register("homeWarranty.plan")} />
              <Input label="Expiration" type="date" {...register("homeWarranty.expiration")} />
              <Input label="Claim Phone" {...register("homeWarranty.claimPhone")} />
            </div>
          </FormSection>
          <FormSection title="Appliance Warranties">
            <Textarea
              label="Summary"
              placeholder="Summarize any active appliance warranties..."
              {...register("applianceWarrantiesSummary")}
            />
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "localKnowledge":
      return <LocalKnowledgeForm register={register} watch={watch} setValue={setValue} control={control} onSubmit={onSubmit} saveStatus={saveStatus} />;

    case "quirksTips":
      return <QuirksTipsForm control={control} onSubmit={onSubmit} saveStatus={saveStatus} />;

    case "documentVault":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection title="Document Links" description="Paste URLs to important documents.">
            <Input label="Survey / Plot Plan" {...register("surveyPlotPlan")} />
            <Input label="Inspection Report" {...register("inspectionReport")} />
            <Input label="Appliance Manuals" {...register("applianceManuals")} />
            <Input label="Permits" {...register("permits")} />
            <Input label="Receipts" {...register("receipts")} />
            <Input label="HOA Documents" {...register("hoaDocs")} />
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "welcomeLetter":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection title="Welcome Letter" description="Write a personal note to the new homeowners.">
            <Textarea
              placeholder="Dear new homeowner..."
              className="min-h-[200px]"
              {...register("welcomeLetter")}
            />
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "houseRules":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection title="Guest Policies">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Max Guests" placeholder="e.g., 8" {...register("maxGuests")} />
              <Select
                label="Smoking Policy"
                {...register("smokingPolicy")}
                placeholder="Select policy"
                options={[
                  { value: "no_smoking", label: "No smoking anywhere" },
                  { value: "outside_only", label: "Outside only" },
                  { value: "designated_areas", label: "Designated areas" },
                ]}
              />
              <Select
                label="Pet Policy"
                {...register("petPolicy")}
                placeholder="Select policy"
                options={[
                  { value: "no_pets", label: "No pets" },
                  { value: "pets_allowed", label: "Pets welcome" },
                  { value: "with_approval", label: "With prior approval" },
                ]}
              />
              <Select
                label="Party / Event Policy"
                {...register("partyPolicy")}
                placeholder="Select policy"
                options={[
                  { value: "no_parties", label: "No parties or events" },
                  { value: "small_gatherings", label: "Small gatherings OK" },
                  { value: "with_approval", label: "With prior approval" },
                ]}
              />
            </div>
          </FormSection>
          <FormSection title="Quiet Hours">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Quiet Hours Start" placeholder="e.g., 10:00 PM" {...register("quietHoursStart")} />
              <Input label="Quiet Hours End" placeholder="e.g., 8:00 AM" {...register("quietHoursEnd")} />
            </div>
          </FormSection>
          <FormSection title="Parking">
            <Textarea
              label="Parking Instructions"
              placeholder="Where to park, permits needed, how many vehicles..."
              {...register("parkingInstructions")}
            />
          </FormSection>
          <FormSection title="Additional Rules">
            {(() => {
              const AdditionalRulesField = () => {
                const { fields, append, remove } = useFieldArray({ control, name: "additionalRules" as never });
                return (
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <input
                          {...register(`additionalRules.${index}`)}
                          className="flex-1 px-4 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
                          placeholder="e.g., No shoes inside please"
                        />
                        <button type="button" onClick={() => remove(index)} className="p-2 text-text-secondary hover:text-danger transition-colors cursor-pointer rounded-md hover:bg-danger/5" aria-label="Remove rule">&times;</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => append("")} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer">+ Add a rule</button>
                  </div>
                );
              };
              return <AdditionalRulesField />;
            })()}
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "checkInOut":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection title="Timing">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Check-in Time" placeholder="e.g., 3:00 PM" {...register("checkInTime")} />
              <Input label="Check-out Time" placeholder="e.g., 11:00 AM" {...register("checkOutTime")} />
              <Input label="Early Check-in" placeholder="Available on request? Extra fee?" {...register("earlyCheckIn")} />
              <Input label="Late Check-out" placeholder="Available on request? Extra fee?" {...register("lateCheckOut")} />
            </div>
          </FormSection>
          <FormSection title="Arrival Instructions">
            <Select
              label="Check-in Method"
              {...register("checkInMethod")}
              placeholder="Select method"
              options={[
                { value: "lockbox", label: "Lockbox / Key safe" },
                { value: "smart_lock", label: "Smart lock / Code" },
                { value: "in_person", label: "In-person handoff" },
                { value: "front_desk", label: "Front desk / Concierge" },
                { value: "other", label: "Other" },
              ]}
            />
            {(watchString("checkInMethod") === "lockbox" || watchString("checkInMethod") === "smart_lock") && (
              <Input label="Lock Code" placeholder="e.g., 1234#" {...register("lockboxCode")} />
            )}
            {watchString("checkInMethod") === "in_person" && (
              <Input label="Key Pickup Instructions" placeholder="Where and when to meet..." {...register("keyPickupInstructions")} />
            )}
            <Textarea
              label="Step-by-Step Check-in Instructions"
              placeholder="1. Park in the driveway&#10;2. Find the lockbox on the front door&#10;3. Enter code to get key&#10;4. Let yourself in"
              className="min-h-[120px]"
              {...register("checkInSteps")}
            />
          </FormSection>
          <FormSection title="Departure Instructions">
            <Textarea
              label="Check-out Steps"
              placeholder="1. Strip beds and start a load of towels&#10;2. Run the dishwasher&#10;3. Take trash out&#10;4. Lock up and return key to lockbox"
              className="min-h-[120px]"
              {...register("checkOutSteps")}
            />
            <Input label="Luggage Storage" placeholder="Available before/after check-in/out?" {...register("luggageStorage")} />
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    case "amenitiesGuide":
      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection title="Outdoor">
            <Toggle label="Pool" description="Is there a pool available for guests?" checked={watchBool("hasPool")} onChange={(v) => setValue("hasPool", v)} />
            {watchBool("hasPool") && (
              <Textarea label="Pool Instructions" placeholder="Hours, rules, how to heat, cover removal..." {...register("poolInstructions")} />
            )}
            <Toggle label="Hot Tub / Spa" checked={watchBool("hasHotTub")} onChange={(v) => setValue("hasHotTub", v)} />
            {watchBool("hasHotTub") && (
              <Textarea label="Hot Tub Instructions" placeholder="How to turn on, temperature controls, rules..." {...register("hotTubInstructions")} />
            )}
            <Toggle label="Grill / BBQ" checked={watchBool("hasGrill")} onChange={(v) => setValue("hasGrill", v)} />
            {watchBool("hasGrill") && (
              <Textarea label="Grill Instructions" placeholder="Propane location, how to start, cleanup..." {...register("grillInstructions")} />
            )}
            <Toggle label="Fire Pit" checked={watchBool("hasFirepit")} onChange={(v) => setValue("hasFirepit", v)} />
            {watchBool("hasFirepit") && (
              <Textarea label="Fire Pit Instructions" placeholder="Where the wood is, how to start, safety rules..." {...register("firepitInstructions")} />
            )}
          </FormSection>
          <FormSection title="Indoor">
            <Toggle label="Game Room" checked={watchBool("hasGameRoom")} onChange={(v) => setValue("hasGameRoom", v)} />
            {watchBool("hasGameRoom") && (
              <Textarea label="Game Room Details" placeholder="What's available, where things are stored..." {...register("gameRoomDetails")} />
            )}
            <Toggle label="Gym / Exercise Equipment" checked={watchBool("hasGym")} onChange={(v) => setValue("hasGym", v)} />
            {watchBool("hasGym") && (
              <Textarea label="Gym Details" placeholder="Equipment available, rules..." {...register("gymDetails")} />
            )}
            <Toggle label="Streaming Services" description="Netflix, Hulu, etc. already logged in?" checked={watchBool("hasStreamingServices")} onChange={(v) => setValue("hasStreamingServices", v)} />
            {watchBool("hasStreamingServices") && (
              <Textarea label="Streaming Details" placeholder="Which services are available, how to access..." {...register("streamingDetails")} />
            )}
          </FormSection>
          <FormSection title="Extras">
            <Toggle label="Bikes" checked={watchBool("hasBikes")} onChange={(v) => setValue("hasBikes", v)} />
            {watchBool("hasBikes") && (
              <Textarea label="Bike Details" placeholder="Location, locks, helmets..." {...register("bikeDetails")} />
            )}
            <Toggle label="Beach Gear" checked={watchBool("hasBeachGear")} onChange={(v) => setValue("hasBeachGear", v)} />
            {watchBool("hasBeachGear") && (
              <Textarea label="Beach Gear Details" placeholder="Chairs, umbrellas, towels, where stored..." {...register("beachGearDetails")} />
            )}
            <Textarea label="Other Amenities" placeholder="Anything else guests should know about..." {...register("otherAmenities")} />
          </FormSection>
          <SubmitButton saveStatus={saveStatus} />
        </form>
      );

    default:
      return <p className="text-text-secondary">Section not found.</p>;
  }
}

function SaveIndicator({ status }: { status: "idle" | "saving" | "saved" }) {
  if (status === "idle") return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium transition-opacity duration-300 ${
        status === "saved" ? "text-accent" : "text-text-secondary"
      }`}
    >
      {status === "saving" ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-pulse" />
          Saving...
        </>
      ) : (
        <>
          <Check className="w-3.5 h-3.5" />
          Saved
        </>
      )}
    </span>
  );
}

function SubmitButton({ saveStatus }: { saveStatus: "idle" | "saving" | "saved" }) {
  return (
    <div className="flex items-center justify-between">
      <SaveIndicator status={saveStatus} />
      <button
        type="submit"
        className="inline-flex items-center px-5 py-2.5 bg-cta text-white font-medium rounded-lg hover:bg-cta-hover transition-colors shadow-sm cursor-pointer"
      >
        Save & Continue
      </button>
    </div>
  );
}

// --- Sub-panel repeatable fields ---
function SubPanelFields({ control, register, watch, setValue }: {
  control: ReturnType<typeof useForm>["control"];
  register: ReturnType<typeof useForm>["register"];
  watch: ReturnType<typeof useForm>["watch"];
  setValue: ReturnType<typeof useForm>["setValue"];
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subPanelLocations",
  });

  return (
    <div className="mt-4">
      <RepeatableField
        label="Sub-panel Locations"
        items={fields}
        onAdd={() => append({ location: "", photo: undefined })}
        onRemove={remove}
        addLabel="Add sub-panel"
        renderItem={(_item, index) => (
          <div className="space-y-3">
            <Input label="Location" {...register(`subPanelLocations.${index}.location`)} />
            <PhotoUpload
              label="Photo"
              value={watch(`subPanelLocations.${index}.photo`)}
              onChange={(v) => setValue(`subPanelLocations.${index}.photo`, v)}
            />
          </div>
        )}
      />
    </div>
  );
}

// --- Major Appliances Form ---
function MajorAppliancesForm({ register, watch, setValue, control, onSubmit, saveStatus }: {
  register: ReturnType<typeof useForm>["register"];
  watch: ReturnType<typeof useForm>["watch"];
  setValue: ReturnType<typeof useForm>["setValue"];
  control: ReturnType<typeof useForm>["control"];
  onSubmit: () => void;
  saveStatus: "idle" | "saving" | "saved";
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "otherAppliances",
  });

  const appliances = [
    { key: "refrigerator", label: "Refrigerator" },
    { key: "dishwasher", label: "Dishwasher" },
    { key: "rangeCooktop", label: "Range / Cooktop" },
    { key: "ovens", label: "Oven(s)" },
    { key: "microwave", label: "Microwave" },
    { key: "washer", label: "Washer" },
    { key: "dryer", label: "Dryer" },
    { key: "garbageDisposal", label: "Garbage Disposal" },
    { key: "wineFridge", label: "Wine Fridge" },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {appliances.map(({ key, label }) => (
        <FormSection key={key}>
          <Toggle
            label={label}
            checked={!!watch(`${key}.hasAppliance`)}
            onChange={(v) => setValue(`${key}.hasAppliance`, v)}
          />
          {watch(`${key}.hasAppliance`) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Input label="Make" {...register(`${key}.make`)} />
              <Input label="Model" {...register(`${key}.model`)} />
              <Input label="Serial" {...register(`${key}.serial`)} />
              <Input label="Install Date" type="date" {...register(`${key}.installDate`)} />
              <Input label="Warranty Status" {...register(`${key}.warrantyStatus`)} />
              <Input label="Manual Location" {...register(`${key}.manualLocation`)} />
            </div>
          )}
        </FormSection>
      ))}
      <FormSection title="Other Appliances">
        <RepeatableField
          label=""
          items={fields}
          onAdd={() => append({ type: "", make: "", model: "", serial: "", installDate: "", warrantyStatus: "", manualLocation: "" })}
          onRemove={remove}
          addLabel="Add appliance"
          renderItem={(_item, index) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Type" {...register(`otherAppliances.${index}.type`)} />
              <Input label="Make" {...register(`otherAppliances.${index}.make`)} />
              <Input label="Model" {...register(`otherAppliances.${index}.model`)} />
              <Input label="Serial" {...register(`otherAppliances.${index}.serial`)} />
              <Input label="Install Date" type="date" {...register(`otherAppliances.${index}.installDate`)} />
              <Input label="Warranty Status" {...register(`otherAppliances.${index}.warrantyStatus`)} />
              <div className="sm:col-span-2">
                <Input label="Manual Location" {...register(`otherAppliances.${index}.manualLocation`)} />
              </div>
            </div>
          )}
        />
      </FormSection>
      <SubmitButton saveStatus={saveStatus} />
    </form>
  );
}

// --- Maintenance Contacts Form ---
function MaintenanceContactsForm({ register, watch, setValue, control, onSubmit, saveStatus }: {
  register: ReturnType<typeof useForm>["register"];
  watch: ReturnType<typeof useForm>["watch"];
  setValue: ReturnType<typeof useForm>["setValue"];
  control: ReturnType<typeof useForm>["control"];
  onSubmit: () => void;
  saveStatus: "idle" | "saving" | "saved";
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "otherContacts",
  });

  const contacts = [
    { key: "Plumber", hasKey: "hasPlumber", contactKey: "plumberContact" },
    { key: "Electrician", hasKey: "hasElectrician", contactKey: "electricianContact" },
    { key: "HVAC Tech", hasKey: "hasHvacTech", contactKey: "hvacTechContact" },
    { key: "Roofer", hasKey: "hasRoofer", contactKey: "rooferContact" },
    { key: "Handyman", hasKey: "hasHandyman", contactKey: "handymanContact" },
    { key: "Landscaper", hasKey: "hasLandscaper", contactKey: "landscaperContact" },
    { key: "Tree Service", hasKey: "hasTreeService", contactKey: "treeServiceContact" },
    { key: "Pool / Spa Service", hasKey: "hasPoolSpaService", contactKey: "poolSpaServiceContact" },
    { key: "Pest Control", hasKey: "hasPestControl", contactKey: "pestControlContact" },
    { key: "Cleaner", hasKey: "hasCleaner", contactKey: "cleanerContact" },
    { key: "Window Washer", hasKey: "hasWindowWasher", contactKey: "windowWasherContact" },
    { key: "Chimney Sweep", hasKey: "hasChimneySweep", contactKey: "chimneySweepContact" },
    { key: "Septic Service", hasKey: "hasSepticService", contactKey: "septicServiceContact" },
    { key: "Painter", hasKey: "hasPainter", contactKey: "painterContact" },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {contacts.map(({ key, hasKey, contactKey }) => (
        <FormSection key={hasKey}>
          <Toggle
            label={key}
            checked={!!watch(hasKey)}
            onChange={(v) => setValue(hasKey, v)}
          />
          {watch(hasKey) && (
            <div className="mt-4">
              <ContactFields register={register} prefix={contactKey as never} />
            </div>
          )}
        </FormSection>
      ))}
      <FormSection title="Other Contacts">
        <RepeatableField
          label=""
          items={fields}
          onAdd={() => append({ role: "", name: "", company: "", phone: "", email: "", notes: "" })}
          onRemove={remove}
          addLabel="Add contact"
          renderItem={(_item, index) => (
            <div className="space-y-3">
              <Input label="Role" placeholder="e.g. Locksmith" {...register(`otherContacts.${index}.role`)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Name" {...register(`otherContacts.${index}.name`)} />
                <Input label="Company" {...register(`otherContacts.${index}.company`)} />
                <Input label="Phone" {...register(`otherContacts.${index}.phone`)} />
                <Input label="Email" {...register(`otherContacts.${index}.email`)} />
              </div>
              <Input label="Notes" {...register(`otherContacts.${index}.notes`)} />
            </div>
          )}
        />
      </FormSection>
      <SubmitButton saveStatus={saveStatus} />
    </form>
  );
}

// --- Local Knowledge Form ---
function LocalKnowledgeForm({ register, watch, setValue, control, onSubmit, saveStatus }: {
  register: ReturnType<typeof useForm>["register"];
  watch: ReturnType<typeof useForm>["watch"];
  setValue: ReturnType<typeof useForm>["setValue"];
  control: ReturnType<typeof useForm>["control"];
  onSubmit: () => void;
  saveStatus: "idle" | "saving" | "saved";
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "trustedNeighbors",
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormSection>
        <Toggle label="Trusted neighbors?" checked={!!watch("hasTrustedNeighbors")} onChange={(v) => setValue("hasTrustedNeighbors", v)} />
        {watch("hasTrustedNeighbors") && (
          <div className="mt-4">
            <RepeatableField
              label="Trusted Neighbors"
              items={fields}
              onAdd={() => append({ name: "", address: "", phone: "", helpsWith: "" })}
              onRemove={remove}
              addLabel="Add neighbor"
              renderItem={(_item, index) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label="Name" {...register(`trustedNeighbors.${index}.name`)} />
                  <Input label="Address" {...register(`trustedNeighbors.${index}.address`)} />
                  <Input label="Phone" {...register(`trustedNeighbors.${index}.phone`)} />
                  <Input label="Helps With" {...register(`trustedNeighbors.${index}.helpsWith`)} />
                </div>
              )}
            />
          </div>
        )}
      </FormSection>
      <FormSection>
        <Toggle label="Local recommendations?" checked={!!watch("hasRecommendations")} onChange={(v) => setValue("hasRecommendations", v)} />
        {watch("hasRecommendations") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Input label="Grocery" {...register("recommendations.grocery")} />
            <Input label="Hardware" {...register("recommendations.hardware")} />
            <Input label="Pharmacy" {...register("recommendations.pharmacy")} />
          </div>
        )}
      </FormSection>
      <FormSection>
        <Toggle label="Vet?" checked={!!watch("hasVet")} onChange={(v) => setValue("hasVet", v)} />
        {watch("hasVet") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Input label="Name" {...register("vet.name")} />
            <Input label="Phone" {...register("vet.phone")} />
            <Input label="Address" {...register("vet.address")} />
          </div>
        )}
      </FormSection>
      {[
        { key: "hasLocalQuirks", label: "Local quirks?", field: <Textarea label="Details" {...register("localQuirks")} /> },
        { key: "hasSchoolDistrict", label: "School district info?", field: <Textarea label="Details" {...register("schoolDistrict")} /> },
        { key: "hasTrafficNotes", label: "Traffic notes?", field: <Textarea label="Details" {...register("trafficNotes")} /> },
      ].map(({ key, label, field }) => (
        <FormSection key={key}>
          <Toggle label={label} checked={!!watch(key)} onChange={(v) => setValue(key, v)} />
          {watch(key) && <div className="mt-4">{field}</div>}
        </FormSection>
      ))}
      <SubmitButton saveStatus={saveStatus} />
    </form>
  );
}

// --- Quirks & Tips Form ---
function QuirksTipsForm({ control, onSubmit, saveStatus }: {
  control: ReturnType<typeof useForm>["control"];
  onSubmit: () => void;
  saveStatus: "idle" | "saving" | "saved";
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "quirks",
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormSection title="House Quirks" description="Things only the current owner would know.">
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...control.register(`quirks.${index}`)}
                className="flex-1 px-4 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
                placeholder={
                  [
                    "The dishwasher needs the door slammed twice to seal.",
                    "Garage door opener struggles in cold weather, hold the button for 3 seconds.",
                    "Mailbox door sticks, lift while turning.",
                    "Hot water in the master bath takes 90 seconds to arrive.",
                  ][index % 4]
                }
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-text-secondary hover:text-danger transition-colors cursor-pointer rounded-md hover:bg-danger/5"
                aria-label="Remove quirk"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append("")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer"
          >
            + Add a quirk
          </button>
        </div>
      </FormSection>
      <SubmitButton saveStatus={saveStatus} />
    </form>
  );
}
