import React, { useState, useEffect } from 'react';
import {
  Plane,
  FileSignature,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Search,
  Shield,
} from 'lucide-react';
import {
  Estate,
  EstateLocation,
  EstateStatus,
  EscrowDossier,
  filterEstates,
  formatCurrency,
} from '../utils/syndicateLogic';
import { EstateDualShowcase } from './EstateImage';

interface ListingsPortalProps {
  estates: Estate[];
  selectedEstateForBooking: string | null;
  scrollToBookingForm?: boolean;
  onScrollHandled?: () => void;
  onInspectFloorplan: (estateId: string) => void;
  onCreateDossier: (payload: {
    buyerName: string;
    buyerEntity: string;
    buyerEmail: string;
    buyerPhone: string;
    estateId: string;
    offerAmount: number;
    transportPreference: EscrowDossier['transportPreference'];
    requestedViewingDate: string;
    submissionType: 'viewing' | 'loi';
    notes: string;
  }) => EscrowDossier;
  onOpenClientPortalWithRef: (refId: string) => void;
}

export const ListingsPortal: React.FC<ListingsPortalProps> = ({
  estates,
  selectedEstateForBooking,
  scrollToBookingForm = false,
  onScrollHandled,
  onInspectFloorplan,
  onCreateDossier,
  onOpenClientPortalWithRef,
}) => {
  const [locationFilter, setLocationFilter] = useState<EstateLocation | 'All'>('All');
  const [priceBandFilter, setPriceBandFilter] = useState<'All' | 'Under $18M' | '$18M – $22M' | 'Over $22M'>('All');
  const [statusFilter, setStatusFilter] = useState<EstateStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking / LOI Form state
  const [formMode, setFormMode] = useState<'viewing' | 'loi'>('viewing');
  const [bookingEstateId, setBookingEstateId] = useState<string>(
    selectedEstateForBooking || estates[0]?.id || 'villa-solana'
  );
  const [buyerName, setBuyerName] = useState('');
  const [buyerEntity, setBuyerEntity] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [offerAmount, setOfferAmount] = useState<number>(18500000);
  const [transportPreference, setTransportPreference] = useState<EscrowDossier['transportPreference']>(
    'Sikorsky S-76 Helicopter Charter'
  );
  const [requestedViewingDate, setRequestedViewingDate] = useState('2026-11-25 • 15:30 Local');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [createdDossier, setCreatedDossier] = useState<EscrowDossier | null>(null);

  useEffect(() => {
    if (selectedEstateForBooking) {
      setBookingEstateId(selectedEstateForBooking);
      const found = estates.find((e) => e.id === selectedEstateForBooking);
      if (found) {
        setOfferAmount(found.price);
      }
    }
  }, [selectedEstateForBooking, estates]);

  useEffect(() => {
    if (scrollToBookingForm) {
      const el = document.getElementById('private-viewing-loi-desk');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      onScrollHandled?.();
    }
  }, [scrollToBookingForm, onScrollHandled]);

  const handleEstateSelectChange = (newId: string) => {
    setBookingEstateId(newId);
    const found = estates.find((e) => e.id === newId);
    if (found) {
      setOfferAmount(found.price);
    }
  };

  const filteredEstates = filterEstates(
    estates,
    locationFilter,
    priceBandFilter,
    statusFilter,
    searchQuery
  );

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerEmail.trim()) {
      setFormError('Please provide the Principal Name and Family Office Email to generate an Escrow Reference ID.');
      return;
    }
    setFormError('');

    const dossier = onCreateDossier({
      buyerName: buyerName.trim(),
      buyerEntity: buyerEntity.trim() || 'Private Sovereign Trust',
      buyerEmail: buyerEmail.trim(),
      buyerPhone: buyerPhone.trim() || '+1 (310) 555-0199',
      estateId: bookingEstateId,
      offerAmount: Number(offerAmount) || 18500000,
      transportPreference,
      requestedViewingDate,
      submissionType: formMode,
      notes:
        notes.trim() ||
        (formMode === 'loi'
          ? 'Formal Letter of Intent submitted via Property Portfolio Desk.'
          : 'Private aviation/chauffeur viewing charter reserved via Property Portfolio Desk.'),
    });

    setCreatedDossier(dossier);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* SECTION 2A: PORTFOLIO HEADER & MULTI-DIMENSIONAL FILTER BAR */}
      <section
        aria-label="Portfolio Filter Controls"
        className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 space-y-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-2 border-[#F2ECFA] pb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold mb-2">
              Off-Market Trophy Registry · Exterior &amp; Interior Inspection
            </div>
            <h1 className="font-serif-editorial text-3xl sm:text-5xl font-semibold text-[#1E1333]">
              Architectural Property Portfolio &amp; Acquisition Desk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#5C4D7D] max-w-md">
            Filter verified residences by enclave, capital band, or live escrow availability. Every residence features full exterior house architecture and interior room photography.
          </p>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Location Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#5C4D7D]">
              1. Enclave / Location
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(['All', 'Malibu', 'Beverly Hills', 'Manhattan', 'Aspen'] as const).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocationFilter(loc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    locationFilter === loc
                      ? 'bg-[#5B21B6] text-white'
                      : 'bg-[#F7F4FC] text-[#1E1333] border border-[#DFD3F5] hover:bg-[#EDE5FA]'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Price Band Filter */}
          <div className="space-y-2">
            <label htmlFor="price-band-select" className="block text-xs font-semibold text-[#5C4D7D]">
              2. Valuation Band
            </label>
            <select
              id="price-band-select"
              value={priceBandFilter}
              onChange={(e) => setPriceBandFilter(e.target.value as typeof priceBandFilter)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F7F4FC] border border-[#D5C5F0] text-xs font-semibold text-[#1E1333] focus:outline-none focus:border-[#5B21B6]"
            >
              <option value="All">All Capital Bands ($14M – $25M+)</option>
              <option value="Under $18M">Under $18,000,000</option>
              <option value="$18M – $22M">$18,000,000 – $22,000,000</option>
              <option value="Over $22M">Over $22,000,000</option>
            </select>
          </div>

          {/* Availability Status Filter */}
          <div className="space-y-2">
            <label htmlFor="status-filter-select" className="block text-xs font-semibold text-[#5C4D7D]">
              3. Live Escrow Status
            </label>
            <select
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F7F4FC] border border-[#D5C5F0] text-xs font-semibold text-[#1E1333] focus:outline-none focus:border-[#5B21B6]"
            >
              <option value="All">All Statuses ({estates.length} Estates)</option>
              <option value="Available">Available for Immediate LOI</option>
              <option value="In Escrow">In Escrow / Under Contract</option>
              <option value="Sold">Closed / Sold</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label htmlFor="portfolio-search" className="block text-xs font-semibold text-[#5C4D7D]">
              4. Search Architect or Residence
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#6D28D9] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="portfolio-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Olson Kundig, Trousdale, Malibu..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F4FC] border border-[#D5C5F0] text-xs text-[#1E1333] focus:outline-none focus:border-[#5B21B6]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2B: FILTERED TROPHY ESTATES CATALOG */}
      <section aria-label="Filtered Trophy Estates" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#1E1333]">
            Showing {filteredEstates.length} of {estates.length} Verified Trophy Residences
          </h2>
          {(locationFilter !== 'All' || priceBandFilter !== 'All' || statusFilter !== 'All' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setLocationFilter('All');
                setPriceBandFilter('All');
                setStatusFilter('All');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-[#5B21B6] hover:underline cursor-pointer"
            >
              Reset All Portfolio Filters
            </button>
          )}
        </div>

        {filteredEstates.length === 0 ? (
          <div className="bg-[#FFFFFF] border-2 border-[#DFD3F5] rounded-3xl p-12 text-center space-y-4">
            <p className="font-serif-editorial text-2xl text-[#1E1333]">
              No residences match your current filter combination.
            </p>
            <button
              type="button"
              onClick={() => {
                setLocationFilter('All');
                setPriceBandFilter('All');
                setStatusFilter('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-[#5B21B6] text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Show All 4 Trophy Residences
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEstates.map((estate) => (
              <div
                key={estate.id}
                className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <EstateDualShowcase
                    exteriorUrl={estate.imageUrl}
                    interiorUrl={estate.interiorImageUrl}
                    title={estate.title}
                    exteriorCaption={estate.exteriorCaption}
                    interiorCaption={estate.interiorCaption}
                    heightClass="h-[440px] sm:h-[420px] lg:h-[440px]"
                  />

                  <div className="p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#6D28D9]">
                        {estate.location} · {estate.lidarScanId}
                      </span>
                      <span className="bg-[#EDE5FA] text-[#4C1D95] px-3 py-1 rounded-lg font-semibold">
                        {estate.status} · {formatCurrency(estate.price)}
                      </span>
                    </div>

                    <h3 className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
                      {estate.title}
                    </h3>

                    <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5] text-xs tabular-nums">
                      <div>
                        <span className="text-[#5C4D7D] block">Living Area</span>
                        <span className="font-semibold text-[#1E1333]">{estate.sqFt.toLocaleString()} Sq Ft</span>
                      </div>
                      <div>
                        <span className="text-[#5C4D7D] block">Configuration</span>
                        <span className="font-semibold text-[#1E1333]">{estate.bedrooms} BD / {estate.bathrooms} BA</span>
                      </div>
                      <div>
                        <span className="text-[#5C4D7D] block">Grounds / Terrace</span>
                        <span className="font-semibold text-[#1E1333]">{estate.acreage}</span>
                      </div>
                    </div>

                    <div className="text-xs text-[#5C4D7D] space-y-1">
                      <div>
                        <strong className="text-[#1E1333]">Lead Architect:</strong> {estate.architect} ({estate.yearBuilt})
                      </div>
                      <div>
                        <strong className="text-[#1E1333]">Aviation Landing Coordinates:</strong> {estate.helipadCoordinates}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-7 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleEstateSelectChange(estate.id);
                      const el = document.getElementById('private-viewing-loi-desk');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 px-4 py-3 bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plane className="w-3.5 h-3.5" />
                    <span>Reserve Viewing / Submit LOI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onInspectFloorplan(estate.id)}
                    className="px-4 py-3 bg-[#F2ECFA] hover:bg-[#EDE5FA] text-[#1E1333] border border-[#D5C5F0] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#6D28D9]" />
                    <span>3D Floorplan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2C: RESERVE PRIVATE CHAUFFEUR / HELICOPTER VIEWING OR SUBMIT FORMAL LOI */}
      <section
        id="private-viewing-loi-desk"
        aria-label="Private Viewing and Letter of Intent Desk"
        className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 lg:p-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold">
              Direct Syndicate Onboarding
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1E1333]">
              Reserve Private Chauffeur / Helicopter Viewing or Submit Formal LOI
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4D7D] leading-relaxed">
              Submitting this dispatch immediately generates your unique Client Portfolio Reference ID (e.g., <span className="font-semibold text-[#1E1333]">APE-7741</span>) and synchronizes your dossier across the Client Escrow Portal and the Managing Broker Admin ERP.
            </p>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5]">
              <button
                type="button"
                onClick={() => setFormMode('viewing')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  formMode === 'viewing'
                    ? 'bg-[#5B21B6] text-white'
                    : 'text-[#5C4D7D] hover:text-[#1E1333]'
                }`}
              >
                Reserve Private Chauffeur / Helicopter Viewing
              </button>
              <button
                type="button"
                onClick={() => setFormMode('loi')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  formMode === 'loi'
                    ? 'bg-[#5B21B6] text-white'
                    : 'text-[#5C4D7D] hover:text-[#1E1333]'
                }`}
              >
                Submit Formal Letter of Intent
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5] space-y-3 text-xs">
              <div className="font-semibold text-[#1E1333] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#6D28D9]" />
                <span>Sovereign Privacy &amp; Instant ERP Synchronization</span>
              </div>
              <p className="text-[#5C4D7D] leading-relaxed">
                All aviation manifests and Letters of Intent are encrypted under Delaware/Zurich blind-trust protocols. Upon submission, your Reference ID can be inspected immediately in Portal 4 (Client Escrow Portal) and Portal 6 (Managing Broker Admin ERP).
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubmitForm} className="space-y-5 bg-[#F7F4FC] p-6 sm:p-8 rounded-2xl border-2 border-[#DFD3F5]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="booking-estate" className="block text-xs font-semibold text-[#1E1333] mb-1.5">
                    Target Trophy Residence
                  </label>
                  <select
                    id="booking-estate"
                    value={bookingEstateId}
                    onChange={(e) => handleEstateSelectChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C5F0] text-xs font-semibold text-[#1E1333]"
                  >
                    {estates.map((est) => (
                      <option key={est.id} value={est.id}>
                        {est.shortName} — {est.location} ({formatCurrency(est.price)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="booking-transport" className="block text-xs font-semibold text-[#1E1333] mb-1.5">
                    Aviation / Ground Transport Protocol
                  </label>
                  <select
                    id="booking-transport"
                    value={transportPreference}
                    onChange={(e) =>
                      setTransportPreference(e.target.value as EscrowDossier['transportPreference'])
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C5F0] text-xs font-semibold text-[#1E1333]"
                  >
                    <option value="Sikorsky S-76 Helicopter Charter">Sikorsky S-76 Helicopter Charter</option>
                    <option value="Maybach Chauffeur Convoy">Maybach Chauffeur Convoy</option>
                    <option value="Private Gulfstream FBO Transfer">Private Gulfstream FBO Transfer</option>
                    <option value="Direct On-Site Arrival">Direct On-Site Arrival</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="buyer-name" className="block text-xs font-semibold text-[#1E1333] mb-1.5">
                    Principal Buyer / Family Office Representative *
                  </label>
                  <input
                    id="buyer-name"
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g., Lady Victoria Sterling"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C5F0] text-xs text-[#1E1333]"
                  />
                </div>

                <div>
                  <label htmlFor="buyer-entity" className="block text-xs font-semibold text-[#1E1333] mb-1.5">
                    Acquiring Trust or Holding Entity
                  </label>
                  <input
                    id="buyer-entity"
                    type="text"
                    value={buyerEntity}
                    onChange={(e) => setBuyerEntity(e.target.value)}
                    placeholder="e.g., Sterling Sovereign Holdings LLC"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C5F0] text-xs text-[#1E1333]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="buyer-email" className="block text-xs font-semibold text-[#1E1333] mb-1.5">
                    Private Counsel / Principal Email *
                  </label>
                  <input
                    id="buyer-email"
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="victoria@sterlingtrust.co.uk"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C5F0] text-xs text-[#1E1333]"
                  />
                </div>

                <div>
                  <label htmlFor="offer-amount" className="block text-xs font-semibold text-[#1E1333] mb-1.5">
                    Proposed Offer / Valuation (USD)
                  </label>
                  <input
                    id="offer-amount"
                    type="number"
                    step={50000}
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C5F0] text-xs font-semibold text-[#1E1333] tabular-nums"
                  />
                </div>

                <div>
                  <label htmlFor="viewing-date" className="block text-xs font-semibold text-[#1E1333] mb-1.5">
                    Requested Flight / Viewing Window
                  </label>
                  <input
                    id="viewing-date"
                    type="text"
                    value={requestedViewingDate}
                    onChange={(e) => setRequestedViewingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C5F0] text-xs text-[#1E1333]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="booking-notes" className="block text-xs font-semibold text-[#1E1333] mb-1.5">
                  Special Aviation, Security, or Escrow Directives
                </label>
                <textarea
                  id="booking-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specify FBO tail number, architectural engineering inspection focus, or blind-trust deed instructions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C5F0] text-xs text-[#1E1333]"
                />
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-xs text-red-900 font-medium">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileSignature className="w-4 h-4 text-[#EDE5FA]" />
                <span>
                  {formMode === 'viewing'
                    ? 'Generate Portfolio Reference ID & Confirm Private Viewing Charter'
                    : 'Generate Portfolio Reference ID & Execute Formal Letter of Intent'}
                </span>
              </button>
            </form>

            {/* Generated Reference ID Confirmation Banner */}
            {createdDossier && (
              <div
                data-testid="generated-ref-banner"
                className="mt-6 p-6 rounded-2xl bg-[#2E1065] text-white space-y-4 border-2 border-[#6D28D9]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-[#EDE5FA] font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Syndicate Escrow Dossier Provisioned &amp; Synced</span>
                  </div>
                  <span className="text-xs text-white/80 tabular-nums">
                    Earnest Deposit Allocation: {formatCurrency(createdDossier.earnestDeposit)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/20">
                  <div>
                    <div className="text-xs text-[#EDE5FA]">Client Portfolio Reference ID</div>
                    <div className="font-serif-editorial text-3xl font-semibold text-white tabular-nums">
                      {createdDossier.refId}
                    </div>
                    <div className="text-xs text-white/85 mt-0.5">
                      Principal: {createdDossier.buyerName} · Offer: {formatCurrency(createdDossier.offerAmount)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenClientPortalWithRef(createdDossier.refId)}
                    className="px-5 py-3 bg-[#EDE5FA] hover:bg-white text-[#2E1065] text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Inspect {createdDossier.refId} in Client Escrow Portal</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2D: ARCHITECTURAL SPECIFICATION & LIDAR COMPARISON MATRIX */}
      <section
        aria-label="Comparative Architectural Matrix"
        className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 space-y-6"
      >
        <div>
          <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold mb-1">
            Engineering &amp; Valuation Matrix
          </div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#1E1333]">
            Side-by-Side Trophy Asset Specification Ledger
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="border-b-2 border-[#DFD3F5] text-[#5C4D7D]">
                <th className="py-3.5 pr-4 font-semibold">Residence Monograph</th>
                <th className="py-3.5 px-4 font-semibold">Enclave</th>
                <th className="py-3.5 px-4 font-semibold">Lead Architect</th>
                <th className="py-3.5 px-4 font-semibold">Interior Sq Ft</th>
                <th className="py-3.5 px-4 font-semibold">LiDAR Registry</th>
                <th className="py-3.5 px-4 font-semibold">Offering Price</th>
                <th className="py-3.5 pl-4 font-semibold">Live Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE5FA]">
              {estates.map((est) => (
                <tr key={est.id} className="hover:bg-[#F7F4FC] transition-colors">
                  <td className="py-4 pr-4 font-serif-editorial text-base font-semibold text-[#1E1333]">
                    {est.shortName}
                  </td>
                  <td className="py-4 px-4 text-[#5C4D7D]">{est.location}</td>
                  <td className="py-4 px-4 text-[#5C4D7D]">{est.architect}</td>
                  <td className="py-4 px-4 font-semibold text-[#1E1333]">
                    {est.sqFt.toLocaleString()} Sq Ft
                  </td>
                  <td className="py-4 px-4 text-[#6D28D9] font-semibold">{est.lidarScanId}</td>
                  <td className="py-4 px-4 font-serif-editorial italic text-base font-semibold text-[#1E1333]">
                    {formatCurrency(est.price)}
                  </td>
                  <td className="py-4 pl-4 font-semibold text-[#5B21B6]">{est.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
