import React, { useState, useEffect } from 'react';
import {
  Compass,
  ShieldCheck,
  Plane,
  KeyRound,
  ArrowUpRight,
  Layers,
  Calendar,
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
  TrendingUp,
  CheckCircle2,
  Home,
} from 'lucide-react';
import {
  Estate,
  PortalId,
  calculateMortgageAndYield,
  formatCurrency,
} from '../utils/syndicateLogic';
import { EstateImage, EstateDualShowcase } from './EstateImage';

interface HomePortalProps {
  estates: Estate[];
  onNavigate: (portal: PortalId) => void;
  onInspectFloorplan: (estateId: string) => void;
  onScheduleViewingForEstate: (estateId: string) => void;
}

export const HomePortal: React.FC<HomePortalProps> = ({
  estates,
  onNavigate,
  onInspectFloorplan,
  onScheduleViewingForEstate,
}) => {
  const heroEstates = estates;
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [heroViewAngle, setHeroViewAngle] = useState<'exterior' | 'interior'>('exterior');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % heroEstates.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroEstates.length]);

  // Section 1E: Interactive Mortgage & Investment Yield Calculator state
  const [calcPrice, setCalcPrice] = useState<number>(18500000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(35);
  const [interestRate] = useState<number>(5.25);
  const [appreciationRate, setAppreciationRate] = useState<number>(6.8);
  const [monthlyLease, setMonthlyLease] = useState<number>(135000);

  const yieldMetrics = calculateMortgageAndYield(
    calcPrice,
    downPaymentPct,
    interestRate,
    appreciationRate,
    monthlyLease
  );

  const currentHeroEstate = heroEstates[activeSlideIndex] || estates[0];
  const currentHeroImageSrc =
    heroViewAngle === 'exterior'
      ? currentHeroEstate.imageUrl
      : currentHeroEstate.interiorImageUrl;

  return (
    <div className="space-y-16 pb-20">
      {/* SECTION 1A: FULL-IMAGE WELCOME HERO PAGE WITH BOOK NOW FOR TOUR CTA */}
      <section
        aria-label="Architectural Welcome Hero"
        className="relative w-full min-h-[calc(100vh-5rem)] lg:min-h-[max(calc(100vh-5rem),660px)] flex flex-col justify-between overflow-hidden bg-[#1E1333] border-b-4 border-[#DFD3F5]"
      >
        {/* Full-Bleed Background House Photograph (Exterior or Interior) */}
        <div className="absolute inset-0 z-0">
          <EstateImage
            src={currentHeroImageSrc}
            alt={`${currentHeroEstate.title} (${heroViewAngle === 'exterior' ? 'House Exterior' : 'House Interior'})`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140B26]/92 via-[#140B26]/50 to-[#140B26]/40" />
        </div>

        {/* Top Bar inside Hero: View Toggle & Active Estate Tag */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 pt-4 sm:pt-7 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#1E1333]/85 border border-[#D5C5F0]/35 text-[11px] sm:text-xs tracking-wider sm:tracking-widest uppercase text-[#EDE5FA] font-semibold whitespace-nowrap">
            <span>Aurelia Estates</span>
            <span aria-hidden="true">·</span>
            <span>{currentHeroEstate.location}</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline">{currentHeroEstate.lidarScanId}</span>
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-sm">
            <button
              type="button"
              onClick={() => setHeroViewAngle('exterior')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                heroViewAngle === 'exterior'
                  ? 'bg-[#5B21B6] text-white'
                  : 'text-[#1E1333] hover:bg-[#F2ECFA]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>House Exterior</span>
            </button>
            <button
              type="button"
              onClick={() => setHeroViewAngle('interior')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                heroViewAngle === 'interior'
                  ? 'bg-[#5B21B6] text-white'
                  : 'text-[#1E1333] hover:bg-[#F2ECFA]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>House Interior</span>
            </button>
          </div>
        </div>

        {/* Center Editorial Welcome Copy & Primary Book Now for Tour CTA */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-5 sm:py-10 my-auto">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            <h1 className="font-serif-editorial text-[2.25rem] sm:text-6xl lg:text-[4.25rem] font-semibold leading-[1.06] tracking-tight text-white text-balance">
              Rare Architecture. Private Off-Market Acquisition.
            </h1>

            <p className="text-sm sm:text-xl text-[#EDE5FA] leading-relaxed max-w-2xl font-normal">
              Curated trophy estates with transparent 3D floorplans and real-time digital escrow. Experience private architectural tours by helicopter or chauffeur convoy.
            </p>

            {/* Primary CTA: Book Now for Tour */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              <button
                type="button"
                onClick={() => onScheduleViewingForEstate(currentHeroEstate.id)}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm sm:text-base font-semibold rounded-2xl border-2 border-[#EDE5FA]/50 shadow-lg transition-colors flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#EDE5FA]" />
                <span>Book Now for Tour</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('listings')}
                className="px-4 py-3 sm:px-6 sm:py-4 bg-[#FFFFFF] hover:bg-[#F2ECFA] text-[#1E1333] text-xs sm:text-sm font-semibold rounded-2xl border-2 border-[#DFD3F5] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Explore Trophy Portfolio</span>
              </button>

              <button
                type="button"
                onClick={() => onInspectFloorplan(currentHeroEstate.id)}
                className="px-4 py-3 sm:px-5 sm:py-4 bg-[#1E1333]/85 hover:bg-[#2E1065] text-white border border-[#D5C5F0]/40 text-xs sm:text-sm font-semibold rounded-2xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#C4B5FD]" />
                <span>3D Floorplan Studio</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Welcome Ribbon: Active Residence Details & 4-Residence Selector */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 pb-5 sm:pb-8">
          <div className="bg-[#FFFFFF] border-2 border-[#DFD3F5] rounded-2xl p-3.5 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 shadow-md">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-[#6D28D9] font-semibold">
                <span>
                  {heroViewAngle === 'exterior'
                    ? currentHeroEstate.exteriorCaption
                    : currentHeroEstate.interiorCaption}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[#5B21B6]">Status: {currentHeroEstate.status}</span>
              </div>
              <div className="font-serif-editorial italic text-lg sm:text-2xl font-semibold text-[#1E1333] leading-snug">
                {currentHeroEstate.title}
              </div>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs text-[#5C4D7D] tabular-nums">
                <span>{currentHeroEstate.architect}</span>
                <span aria-hidden="true">·</span>
                <span>{currentHeroEstate.sqFt.toLocaleString()} Sq Ft</span>
                <span aria-hidden="true">·</span>
                <span>{currentHeroEstate.bedrooms} Bedrooms</span>
                <span className="hidden sm:inline" aria-hidden="true">·</span>
                <span className="hidden sm:inline">{currentHeroEstate.acreage}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2">
              {heroEstates.map((estate, idx) => (
                <button
                  key={estate.id}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`px-2.5 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all truncate shrink-0 cursor-pointer text-center ${
                    activeSlideIndex === idx
                      ? 'bg-[#5B21B6] text-white'
                      : 'bg-[#F2ECFA] text-[#1E1333] hover:bg-[#EDE5FA]'
                  }`}
                >
                  0{idx + 1}. {estate.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REMAINING PAGE 1 SECTIONS INSIDE STANDARD CONTAINER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-20">
      {/* SECTION 1B: SYNDICATE METRICS STRIP (4 SOLID LAVENDER ARCHITECTURAL COLUMNS) */}
      <section aria-label="Syndicate Performance Metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_6px_0_0_#EDE5FA] rounded-3xl p-7 flex flex-col justify-between">
          <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold">
            01. Cumulative Execution
          </div>
          <div className="my-4">
            <div className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1E1333] tabular-nums">
              $3.4B Closed Private Volume
            </div>
          </div>
          <p className="text-xs text-[#5C4D7D] leading-relaxed">
            Direct family-office and sovereign trust acquisitions settled across Malibu, Trousdale, Manhattan, and Aspen since 2019.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_6px_0_0_#EDE5FA] rounded-3xl p-7 flex flex-col justify-between">
          <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold">
            02. Settlement Velocity
          </div>
          <div className="my-4">
            <div className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1E1333] tabular-nums">
              18 Average Days to Escrow
            </div>
          </div>
          <p className="text-xs text-[#5C4D7D] leading-relaxed">
            Pre-underwritten ALTA extended title binders and pre-cleared geotechnical disclosures eliminate traditional closing friction.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_6px_0_0_#EDE5FA] rounded-3xl p-7 flex flex-col justify-between">
          <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold">
            03. Engineering Telemetry
          </div>
          <div className="my-4">
            <div className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1E1333] tabular-nums">
              100% Verified Title &amp; LiDAR Scans
            </div>
          </div>
          <p className="text-xs text-[#5C4D7D] leading-relaxed">
            Every residence undergoes millimeter-accurate 3D laser point-cloud scanning and structural caisson certification before listing.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_6px_0_0_#EDE5FA] rounded-3xl p-7 flex flex-col justify-between">
          <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold">
            04. Bespoke Logistics
          </div>
          <div className="my-4">
            <div className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1E1333]">
              Private Aviation Viewing Charter
            </div>
          </div>
          <p className="text-xs text-[#5C4D7D] leading-relaxed">
            Turnkey Sikorsky S-76 helicopter transfers and Maybach security convoys coordinated directly from your private FBO terminal.
          </p>
        </div>
      </section>

      {/* SECTION 1C: FEATURED ESTATES GRID (SHOWING BOTH EXTERIOR & INTERIOR FOR ALL 4 HOUSES) */}
      <section aria-label="Curated Trophy Estates Collection" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold mb-2">
              Curated Monograph Portfolio · Exterior &amp; Interior Views
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1E1333]">
              Architectural Residences in Private Circulation
            </h2>
          </div>
          <p className="text-sm text-[#5C4D7D] max-w-md">
            Every estate card below presents both the House Exterior and the House Interior side-by-side. Toggle views, inspect 3D floorplans, or schedule a private tour.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {estates.map((estate) => (
            <article
              key={estate.id}
              className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Dual Exterior + Interior Header */}
                <EstateDualShowcase
                  exteriorUrl={estate.imageUrl}
                  interiorUrl={estate.interiorImageUrl}
                  title={estate.title}
                  exteriorCaption={estate.exteriorCaption}
                  interiorCaption={estate.interiorCaption}
                  heightClass="h-[440px] sm:h-[420px] lg:h-[440px]"
                />

                {/* Card Body */}
                <div className="p-6 sm:p-8 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#6D28D9]">
                      {estate.location} · {estate.architect}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        estate.status === 'Available'
                          ? 'bg-[#EDE5FA] text-[#4C1D95]'
                          : estate.status === 'Sold'
                          ? 'bg-red-100 text-red-900'
                          : 'bg-[#5B21B6] text-white'
                      }`}
                    >
                      Status: {estate.status}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <h3 className="font-serif-editorial text-2xl sm:text-[1.65rem] font-semibold text-[#1E1333] leading-snug">
                      {estate.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#5C4D7D] border-y-2 border-[#F2ECFA] py-3 tabular-nums">
                    <span className="flex items-center gap-1.5 font-medium text-[#1E1333]">
                      <Maximize2 className="w-3.5 h-3.5 text-[#6D28D9]" />
                      {estate.sqFt.toLocaleString()} Sq Ft
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1.5 font-medium text-[#1E1333]">
                      <BedDouble className="w-3.5 h-3.5 text-[#6D28D9]" />
                      {estate.bedrooms} Bedrooms
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1.5 font-medium text-[#1E1333]">
                      <Bath className="w-3.5 h-3.5 text-[#6D28D9]" />
                      {estate.bathrooms} Baths
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#6D28D9]" />
                      {estate.acreage}
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-[#5C4D7D]">
                    {estate.ArchitecturalHighlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#6D28D9] font-bold">·</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 1-Click Action Buttons */}
              <div className="px-6 sm:px-8 pb-7 pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onInspectFloorplan(estate.id)}
                  className="flex-1 px-4 py-3 bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Inspect 3D Floorplan &amp; Finishes</span>
                </button>
                <button
                  type="button"
                  onClick={() => onScheduleViewingForEstate(estate.id)}
                  className="flex-1 px-4 py-3 bg-[#F2ECFA] hover:bg-[#EDE5FA] text-[#1E1333] border border-[#D5C5F0] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#6D28D9]" />
                  <span>Schedule Private Viewing</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 1D: PRIVATE ACQUISITION PROCESS (4-STEP VISUAL GUIDE) */}
      <section
        aria-label="Private Acquisition Protocol"
        className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 lg:p-12 space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-[#F2ECFA] pb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold mb-2">
              Sovereign Closing Architecture
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1E1333]">
              Four-Stage Private Acquisition Protocol
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('client')}
            className="px-5 py-2.5 bg-[#EDE5FA] hover:bg-[#DFD3F5] text-[#2E1065] text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 self-start md:self-auto whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Open Live Escrow Tracker</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EDE5FA] flex items-center justify-center text-[#5B21B6]">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-xl font-semibold text-[#1E1333]">
                1. Private Viewing &amp; Helicopter Charter
              </h3>
              <p className="text-xs text-[#5C4D7D] leading-relaxed">
                Discreet aviation dispatch from Van Nuys, Teterboro, or Aspen FBO terminals directly to the estate promontory with principal architectural briefing.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#6D28D9] pt-2 border-t border-[#DFD3F5]">
              SLA: Flight Manifest Cleared Within 6 Hours
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EDE5FA] flex items-center justify-center text-[#5B21B6]">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-xl font-semibold text-[#1E1333]">
                2. Bespoke Finish Customization
              </h3>
              <p className="text-xs text-[#5C4D7D] leading-relaxed">
                Configure book-matched Calacatta Viola marble slabs, Smoked European Oak millwork, Sub-Zero wine vaults, and rooftop hydrotherapy decks in our 3D studio.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#6D28D9] pt-2 border-t border-[#DFD3F5]">
              SLA: Direct Quarry &amp; Artisan Allocation
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EDE5FA] flex items-center justify-center text-[#5B21B6]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-xl font-semibold text-[#1E1333]">
                3. Proof of Funds &amp; Escrow Lock
              </h3>
              <p className="text-xs text-[#5C4D7D] leading-relaxed">
                Bilateral Letter of Intent execution with segregated private bank verification, millimeter LiDAR structural sign-off, and clean ALTA extended title insurance.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#6D28D9] pt-2 border-t border-[#DFD3F5]">
              SLA: Multi-Sig Escrow Reference ID Issued
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EDE5FA] flex items-center justify-center text-[#5B21B6]">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-xl font-semibold text-[#1E1333]">
                4. Architectural Key Handover
              </h3>
              <p className="text-xs text-[#5C4D7D] leading-relaxed">
                Off-record grant deed filing through blind trust counsel, biometric security provisioning, and full estate staff onboarding upon wire verification.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#6D28D9] pt-2 border-t border-[#DFD3F5]">
              SLA: Turnkey Sovereign Possession
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1E: INTERACTIVE MORTGAGE & INVESTMENT YIELD CALCULATOR */}
      <section
        aria-label="Interactive Mortgage and Investment Yield Calculator"
        className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 lg:p-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Calculator Sliders */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold mb-2">
                Private Banking &amp; Family Office Analytics
              </div>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1E1333]">
                Interactive Mortgage &amp; Investment Yield Calculator
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4D7D] mt-2">
                Model Lombard credit lines, jumbo private banking facilities, seasonal diplomatic lease yields, and 5-year compounding trophy appreciation.
              </p>
            </div>

            {/* Quick Estate Preset Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {estates.map((est) => (
                <button
                  key={est.id}
                  type="button"
                  onClick={() => {
                    setCalcPrice(est.price);
                    setMonthlyLease(Math.round(est.annualLeasePotential / 12));
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    calcPrice === est.price
                      ? 'bg-[#5B21B6] text-white'
                      : 'bg-[#F2ECFA] text-[#1E1333] hover:bg-[#EDE5FA]'
                  }`}
                >
                  {est.shortName} ({formatCurrency(est.price)})
                </button>
              ))}
            </div>

            <div className="space-y-5 pt-2">
              {/* Slider 1: Purchase Price */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <label htmlFor="calc-purchase-price" className="text-[#5C4D7D]">
                    Acquisition Purchase Price
                  </label>
                  <span className="font-serif-editorial italic text-lg font-semibold text-[#1E1333] tabular-nums">
                    {formatCurrency(calcPrice)}
                  </span>
                </div>
                <input
                  id="calc-purchase-price"
                  type="range"
                  min={10000000}
                  max={35000000}
                  step={100000}
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Number(e.target.value))}
                  className="w-full accent-[#5B21B6] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#5C4D7D] tabular-nums">
                  <span>$10,000,000</span>
                  <span>$22,500,000</span>
                  <span>$35,000,000</span>
                </div>
              </div>

              {/* Slider 2: Down Payment % */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <label htmlFor="calc-down-payment" className="text-[#5C4D7D]">
                    Equity Down Payment Allocation ({downPaymentPct}%)
                  </label>
                  <span className="font-semibold text-[#1E1333] tabular-nums">
                    {formatCurrency(yieldMetrics.downPaymentAmount)} Equity / {formatCurrency(yieldMetrics.loanAmount)} Facility
                  </span>
                </div>
                <input
                  id="calc-down-payment"
                  type="range"
                  min={20}
                  max={100}
                  step={5}
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  className="w-full accent-[#5B21B6] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#5C4D7D] tabular-nums">
                  <span>20% Down</span>
                  <span>50% Down</span>
                  <span>100% All-Cash</span>
                </div>
              </div>

              {/* Slider 3: Appreciation & Seasonal Lease */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <label htmlFor="calc-appreciation" className="text-[#5C4D7D]">
                      Projected Annual Appreciation
                    </label>
                    <span className="font-semibold text-[#5B21B6] tabular-nums">
                      {appreciationRate.toFixed(1)}% / yr
                    </span>
                  </div>
                  <input
                    id="calc-appreciation"
                    type="range"
                    min={3.0}
                    max={12.0}
                    step={0.2}
                    value={appreciationRate}
                    onChange={(e) => setAppreciationRate(Number(e.target.value))}
                    className="w-full accent-[#5B21B6] cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <label htmlFor="calc-lease" className="text-[#5C4D7D]">
                      Monthly Private Lease Valuation
                    </label>
                    <span className="font-semibold text-[#5B21B6] tabular-nums">
                      {formatCurrency(monthlyLease)} / mo
                    </span>
                  </div>
                  <input
                    id="calc-lease"
                    type="range"
                    min={65000}
                    max={250000}
                    step={5000}
                    value={monthlyLease}
                    onChange={(e) => setMonthlyLease(Number(e.target.value))}
                    className="w-full accent-[#5B21B6] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Output Ledger */}
          <div className="lg:col-span-5 bg-[#F7F4FC] border-2 border-[#DFD3F5] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#DFD3F5] pb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold">
                  Capital &amp; Yield Schedule
                </div>
                <div className="font-serif-editorial text-2xl font-semibold text-[#1E1333] mt-0.5">
                  5-Year Projected Valuation
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-[#5B21B6]" />
            </div>

            <div className="grid grid-cols-2 gap-4 tabular-nums">
              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DFD3F5]">
                <div className="text-[11px] text-[#5C4D7D]">5-Year Trophy Asset Value</div>
                <div className="font-serif-editorial text-2xl font-semibold text-[#1E1333] mt-1">
                  {formatCurrency(yieldMetrics.projectedFiveYearValue)}
                </div>
                <div className="text-[11px] text-[#5B21B6] font-semibold mt-0.5">
                  +{formatCurrency(yieldMetrics.fiveYearEquityGain)} Capital Gain
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#DFD3F5]">
                <div className="text-[11px] text-[#5C4D7D]">Gross Annual Lease Yield</div>
                <div className="font-serif-editorial text-2xl font-semibold text-[#1E1333] mt-1">
                  {formatCurrency(yieldMetrics.grossAnnualRentalIncome)}
                </div>
                <div className="text-[11px] text-[#5B21B6] font-semibold mt-0.5">
                  {yieldMetrics.estimatedNetCapRate}% Net Cap Rate
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs border-t border-[#DFD3F5] pt-4 tabular-nums">
              <div className="flex justify-between">
                <span className="text-[#5C4D7D]">Private Bank Facility Principal &amp; Interest (5.25%):</span>
                <span className="font-semibold text-[#1E1333]">
                  {formatCurrency(yieldMetrics.monthlyPrincipalAndInterest)} / mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C4D7D]">Estimated Tax &amp; Chubb Master Policy Reserve:</span>
                <span className="font-semibold text-[#1E1333]">
                  {formatCurrency(yieldMetrics.monthlyPropertyTaxAndIns)} / mo
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#DFD3F5] text-sm">
                <span className="font-medium text-[#1E1333]">Total Monthly Carrying Allocation:</span>
                <span className="font-serif-editorial italic text-xl font-semibold text-[#5B21B6]">
                  {formatCurrency(yieldMetrics.totalMonthlyCarryingCost)} / mo
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('listings')}
              className="w-full py-3.5 px-5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#EDE5FA]" />
              <span>Submit Formal Letter of Intent with This Capital Structure</span>
            </button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};
