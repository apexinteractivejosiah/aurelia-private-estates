import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sun,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import {
  Estate,
  FinishUpgrade,
  FINISH_UPGRADES,
  calculateConfiguredEstatePrice,
  formatCurrency,
} from '../utils/syndicateLogic';
import { EstateDualShowcase } from './EstateImage';

interface FloorplansPortalProps {
  estates: Estate[];
  initialEstateId: string;
  activeDossierRefId: string;
  onSyncUpgradesToDossier: (refId: string, estateId: string, upgradeIds: string[], configuredPrice: number) => void;
  onNavigateToClient: () => void;
}

export const FloorplansPortal: React.FC<FloorplansPortalProps> = ({
  estates,
  initialEstateId,
  activeDossierRefId,
  onSyncUpgradesToDossier,
  onNavigateToClient,
}) => {
  const [selectedEstateId, setSelectedEstateId] = useState<string>(
    initialEstateId || estates[0]?.id || 'villa-solana'
  );

  useEffect(() => {
    if (initialEstateId) {
      setSelectedEstateId(initialEstateId);
    }
  }, [initialEstateId]);

  const currentEstate =
    estates.find((e) => e.id === selectedEstateId) || estates[0];

  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    currentEstate.rooms[0]?.id || ''
  );

  useEffect(() => {
    if (currentEstate && currentEstate.rooms.length > 0) {
      setSelectedRoomId(currentEstate.rooms[0].id);
    }
  }, [currentEstate]);

  const [selectedUpgrades, setSelectedUpgrades] = useState<string[]>([
    'calacatta-viola',
  ]);
  const [viewProjection, setViewProjection] = useState<'orthographic' | 'isometric'>('isometric');
  const [syncConfirmation, setSyncConfirmation] = useState<string>('');

  const activeRoom =
    currentEstate.rooms.find((r) => r.id === selectedRoomId) ||
    currentEstate.rooms[0];

  const priceBreakdown = calculateConfiguredEstatePrice(
    currentEstate.price,
    selectedUpgrades,
    FINISH_UPGRADES
  );

  const toggleUpgrade = (upgradeId: string) => {
    setSyncConfirmation('');
    setSelectedUpgrades((prev) =>
      prev.includes(upgradeId)
        ? prev.filter((id) => id !== upgradeId)
        : [...prev, upgradeId]
    );
  };

  const handleLockSpecification = () => {
    onSyncUpgradesToDossier(
      activeDossierRefId,
      currentEstate.id,
      selectedUpgrades,
      priceBreakdown.totalAcquisitionPrice
    );
    setSyncConfirmation(
      `Bespoke architectural specification (${formatCurrency(
        priceBreakdown.totalAcquisitionPrice
      )}) locked to Portfolio Dossier ${activeDossierRefId}.`
    );
  };

  return (
    <div className="space-y-16 pb-20">
      {/* SECTION 3A: ESTATE SELECTOR & DYNAMIC ACQUISITION VALUATION HEADER */}
      <section
        aria-label="3D Floorplan Studio Header"
        className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 space-y-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b-2 border-[#F2ECFA] pb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold mb-2">
              Interactive Architectural Blueprint &amp; Materiality Studio
            </div>
            <h1 className="font-serif-editorial text-3xl sm:text-5xl font-semibold text-[#1E1333]">
              3D Floorplan &amp; Bespoke Finish Studio
            </h1>
          </div>

          {/* Dynamic Total Acquisition Price Display */}
          <div
            data-testid="floorplan-total-price-box"
            className="p-5 rounded-2xl bg-[#2E1065] text-white min-w-[290px] space-y-1 tabular-nums border-2 border-[#6D28D9]"
          >
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#EDE5FA]">
              <span>Configured Total Acquisition Price</span>
              <span>+{selectedUpgrades.length} Finishes</span>
            </div>
            <div className="font-serif-editorial italic text-3xl sm:text-4xl font-semibold text-white">
              {formatCurrency(priceBreakdown.totalAcquisitionPrice)}
            </div>
            <div className="text-xs text-white/80 flex justify-between pt-1">
              <span>Base: {formatCurrency(priceBreakdown.basePrice)}</span>
              <span>Upgrades: +{formatCurrency(priceBreakdown.upgradesTotal)}</span>
            </div>
          </div>
        </div>

        {/* 4 Estate Switcher Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {estates.map((estate) => {
            const isSelected = estate.id === currentEstate.id;
            return (
              <button
                key={estate.id}
                type="button"
                onClick={() => {
                  setSelectedEstateId(estate.id);
                  setSyncConfirmation('');
                }}
                className={`p-4 rounded-2xl text-left transition-all border-2 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#5B21B6] text-white border-[#4C1D95] shadow-md'
                    : 'bg-[#F7F4FC] text-[#1E1333] border-[#DFD3F5] hover:bg-[#EDE5FA]'
                }`}
              >
                <div
                  className={`text-[11px] uppercase tracking-wider font-semibold ${
                    isSelected ? 'text-[#EDE5FA]' : 'text-[#6D28D9]'
                  }`}
                >
                  {estate.location} · {estate.sqFt.toLocaleString()} Sq Ft
                </div>
                <div className="font-serif-editorial text-xl font-semibold mt-1">
                  {estate.shortName}
                </div>
                <div
                  className={`text-xs mt-2 tabular-nums ${
                    isSelected ? 'text-[#EDE5FA]' : 'text-[#5C4D7D]'
                  }`}
                >
                  Base: {formatCurrency(estate.price)}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 3B: FULL-WIDTH ARCHITECTURAL GALLERY + INTERACTIVE SVG BLUEPRINT & ROOM TELEMETRY */}
      <section
        aria-label="Residence Exterior and Interior Gallery"
        className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl overflow-hidden"
      >
        <div className="px-6 sm:px-8 pt-6 pb-4 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#F2ECFA]">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold">
              Exterior &amp; Interior Architectural Photography · {currentEstate.location}
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#1E1333]">
              {currentEstate.title}
            </h2>
          </div>
          <div className="text-xs text-[#5C4D7D] font-medium">
            Click any photograph or &ldquo;Enlarge Photos&rdquo; for full-screen architectural inspection
          </div>
        </div>
        <EstateDualShowcase
          exteriorUrl={currentEstate.imageUrl}
          interiorUrl={currentEstate.interiorImageUrl}
          title={currentEstate.title}
          exteriorCaption={currentEstate.exteriorCaption}
          interiorCaption={currentEstate.interiorCaption}
          heightClass="h-[520px] sm:h-[460px] lg:h-[520px]"
        />
      </section>

      <section
        aria-label="Interactive Architectural Blueprint Canvas"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
      >
        {/* Left 7 Columns: Interactive SVG Architectural Floorplan */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold">
                LiDAR Scan {currentEstate.lidarScanId} · Click Any Architectural Zone
              </div>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#1E1333]">
                {currentEstate.title}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 bg-[#F7F4FC] p-1 rounded-xl border border-[#DFD3F5]">
              <button
                type="button"
                onClick={() => setViewProjection('isometric')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewProjection === 'isometric'
                    ? 'bg-[#5B21B6] text-white'
                    : 'text-[#5C4D7D] hover:text-[#1E1333]'
                }`}
              >
                3D Axonometric Tilt
              </button>
              <button
                type="button"
                onClick={() => setViewProjection('orthographic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewProjection === 'orthographic'
                    ? 'bg-[#5B21B6] text-white'
                    : 'text-[#5C4D7D] hover:text-[#1E1333]'
                }`}
              >
                2D CAD Plan
              </button>
            </div>
          </div>

          {/* Interactive SVG Blueprint Plate */}
          <div className="relative rounded-2xl bg-[#1E1333] p-4 sm:p-6 border-2 border-[#6D28D9] overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-[#EDE5FA] mb-3">
              <span>NORTH AXIS ↑ · SOLAR ORIENTATION CALIBRATED</span>
              <span>SCALE: 1/8&quot; = 1&apos;-0&quot; · MILLIMETER LIDAR VERIFIED</span>
            </div>

            <div
              className={`transition-transform duration-500 ${
                viewProjection === 'isometric'
                  ? 'transform perspective-1000 rotate-x-6 scale-[0.98]'
                  : ''
              }`}
            >
              <svg
                viewBox="0 0 800 400"
                className="w-full h-auto max-h-[380px] select-none"
                role="img"
                aria-label={`Interactive architectural floorplan for ${currentEstate.shortName}`}
              >
                <defs>
                  <pattern
                    id="archGridPurple"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="rgba(223, 211, 245, 0.12)"
                      strokeWidth="0.75"
                    />
                  </pattern>
                </defs>

                {/* Blueprint Grid Background */}
                <rect width="800" height="400" rx="14" fill="#170E29" />
                <rect width="800" height="400" rx="14" fill="url(#archGridPurple)" />

                {/* Perimeter Structural Datum Line */}
                <rect
                  x="25"
                  y="25"
                  width="750"
                  height="350"
                  rx="8"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />

                {/* Clickable Architectural Rooms */}
                {currentEstate.rooms.map((room) => {
                  const isActive = room.id === activeRoom?.id;
                  return (
                    <g
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className="cursor-pointer group"
                    >
                      {viewProjection === 'isometric' && (
                        <rect
                          x={room.svgRect.x + 6}
                          y={room.svgRect.y + 6}
                          width={room.svgRect.width}
                          height={room.svgRect.height}
                          rx="6"
                          fill="rgba(139, 92, 246, 0.22)"
                        />
                      )}

                      <rect
                        x={room.svgRect.x}
                        y={room.svgRect.y}
                        width={room.svgRect.width}
                        height={room.svgRect.height}
                        rx="6"
                        fill={
                          isActive
                            ? 'rgba(139, 92, 246, 0.42)'
                            : 'rgba(247, 244, 252, 0.08)'
                        }
                        stroke={isActive ? '#EDE5FA' : '#8B5CF6'}
                        strokeWidth={isActive ? '2.5' : '1.2'}
                      />

                      <circle
                        cx={room.svgRect.x + 10}
                        cy={room.svgRect.y + 10}
                        r="2.5"
                        fill={isActive ? '#EDE5FA' : '#A78BFA'}
                      />

                      <text
                        x={room.labelPos.x}
                        y={room.labelPos.y - 8}
                        textAnchor="middle"
                        fill={isActive ? '#FFFFFF' : '#EDE5FA'}
                        fontSize="13"
                        fontWeight="600"
                      >
                        {room.name}
                      </text>
                      <text
                        x={room.labelPos.x}
                        y={room.labelPos.y + 12}
                        textAnchor="middle"
                        fill={isActive ? '#F5F0FF' : '#C4B5FD'}
                        fontSize="11"
                      >
                        {room.dimensions} · {room.sqFt.toLocaleString()} Sq Ft
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Room Selection Quick Buttons */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/15">
              {currentEstate.rooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    room.id === activeRoom?.id
                      ? 'bg-[#EDE5FA] text-[#2E1065]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {room.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Selected Room Telemetry & Architectural Spec */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {activeRoom && (
              <div data-testid="selected-room-telemetry" className="space-y-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold">
                    Selected Zone Telemetry · {activeRoom.level}
                  </div>
                  <h3 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#1E1333] mt-0.5">
                    {activeRoom.name}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 tabular-nums">
                  <div className="p-3.5 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5]">
                    <div className="text-[11px] text-[#5C4D7D]">Span &amp; Area</div>
                    <div className="font-serif-editorial text-xl font-semibold text-[#1E1333] mt-0.5">
                      {activeRoom.dimensions} ({activeRoom.sqFt.toLocaleString()} Sq Ft)
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5]">
                    <div className="text-[11px] text-[#5C4D7D]">Clear Ceiling Height</div>
                    <div className="font-serif-editorial text-xl font-semibold text-[#1E1333] mt-0.5">
                      {activeRoom.ceilingHeight}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs bg-[#F7F4FC] p-4 rounded-2xl border border-[#DFD3F5]">
                  <div className="flex items-start gap-2.5">
                    <Sun className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#1E1333] block">Solar &amp; Daylight Orientation</span>
                      <span className="text-[#5C4D7D]">{activeRoom.sunlightExposure}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 pt-2 border-t border-[#DFD3F5]">
                    <ShieldCheck className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#1E1333] block">Acoustic Attenuation Rating</span>
                      <span className="text-[#5C4D7D]">{activeRoom.acousticRating}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 pt-2 border-t border-[#DFD3F5]">
                    <Layers className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#1E1333] block">Base Architectural Specification</span>
                      <span className="text-[#5C4D7D]">{activeRoom.materialSpec}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-[#5C4D7D] border-t border-[#DFD3F5] pt-4 flex items-center justify-between">
            <span>Architect of Record: {currentEstate.architect}</span>
            <span className="font-semibold text-[#5B21B6]">100% LiDAR Verified</span>
          </div>
        </div>
      </section>

      {/* SECTION 3C: BESPOKE FINISH UPGRADES CONFIGURATOR */}
      <section
        aria-label="Bespoke Finish Upgrades Configurator"
        className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-[#F2ECFA] pb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold mb-2">
              Custom Materiality &amp; Quarry Allocation
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1E1333]">
              Bespoke Architectural Finish Upgrades
            </h2>
          </div>
          <div className="text-xs text-[#5C4D7D] tabular-nums">
            Estimated Artisan Fabrication Window:{' '}
            <strong className="text-[#1E1333]">{priceBreakdown.totalLeadTimeWeeks} Weeks</strong> prior to Stage 6 Key Handover
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FINISH_UPGRADES.map((upgrade: FinishUpgrade) => {
            const isChecked = selectedUpgrades.includes(upgrade.id);
            return (
              <div
                key={upgrade.id}
                onClick={() => toggleUpgrade(upgrade.id)}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isChecked
                    ? 'bg-[#2E1065] text-white border-[#5B21B6] shadow-md'
                    : 'bg-[#F7F4FC] text-[#1E1333] border-[#DFD3F5] hover:bg-[#EDE5FA]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] uppercase tracking-wider font-semibold ${
                        isChecked ? 'text-[#EDE5FA]' : 'text-[#6D28D9]'
                      }`}
                    >
                      {upgrade.category}
                    </span>
                    <span className="font-serif-editorial italic text-xl font-semibold tabular-nums">
                      +{formatCurrency(upgrade.priceDelta)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-editorial text-2xl font-semibold">
                      {upgrade.name}
                    </h3>
                    <button
                      type="button"
                      aria-label={`Toggle ${upgrade.name}`}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        isChecked
                          ? 'bg-[#EDE5FA] text-[#2E1065]'
                          : 'bg-[#DFD3F5] text-[#1E1333]'
                      }`}
                    >
                      {isChecked ? 'Selected' : 'Add Finish'}
                    </button>
                  </div>

                  <p
                    className={`text-xs leading-relaxed ${
                      isChecked ? 'text-white/85' : 'text-[#5C4D7D]'
                    }`}
                  >
                    {upgrade.description}
                  </p>
                </div>

                <div
                  className={`pt-3 border-t text-[11px] flex items-center justify-between ${
                    isChecked
                      ? 'border-white/20 text-[#EDE5FA]'
                      : 'border-[#DFD3F5] text-[#5C4D7D]'
                  }`}
                >
                  <span>Origin: {upgrade.origin}</span>
                  <span>Lead Time: {upgrade.leadTimeWeeks} Weeks</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* SECTION 3D: BIND SPECIFICATION TO ESCROW DOSSIER */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FC] border-2 border-[#DFD3F5] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 tabular-nums">
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold">
              Live Escrow Specification Summary ({currentEstate.shortName})
            </div>
            <div className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#1E1333]">
              Total Configured Acquisition: {formatCurrency(priceBreakdown.totalAcquisitionPrice)}
            </div>
            <p className="text-xs text-[#5C4D7D]">
              Includes Base Offering ({formatCurrency(priceBreakdown.basePrice)}) + {selectedUpgrades.length} Custom Architectural Upgrades ({formatCurrency(priceBreakdown.upgradesTotal)}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleLockSpecification}
              className="px-6 py-3.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#EDE5FA]" />
              <span>Bind Finish Spec to Escrow Dossier ({activeDossierRefId})</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToClient}
              className="px-5 py-3.5 bg-[#FFFFFF] hover:bg-[#EDE5FA] text-[#1E1333] border-2 border-[#D5C5F0] text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>View in Client Escrow Portal</span>
              <ArrowUpRight className="w-4 h-4 text-[#6D28D9]" />
            </button>
          </div>
        </div>

        {syncConfirmation && (
          <div className="p-4 rounded-xl bg-[#2E1065] text-[#EDE5FA] text-xs font-semibold flex items-center justify-between">
            <span>{syncConfirmation}</span>
            <button
              type="button"
              onClick={onNavigateToClient}
              className="underline text-white ml-4 cursor-pointer"
            >
              Open Client Escrow Tracker →
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
