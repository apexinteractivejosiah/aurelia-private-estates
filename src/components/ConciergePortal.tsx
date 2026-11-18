import React, { useState } from 'react';
import {
  Plane,
  Scale,
  ShieldCheck,
  Send,
  Lock,
} from 'lucide-react';
import {
  EscrowDossier,
  Estate,
  BrokerProfile,
} from '../utils/syndicateLogic';

interface ConciergePortalProps {
  dossiers: EscrowDossier[];
  estates: Estate[];
  brokers: BrokerProfile[];
  activeRefId: string;
  onDispatchConciergeInquiry: (
    refId: string,
    category: string,
    departureFbo: string,
    messageContent: string
  ) => void;
  onOpenAdminInbox: () => void;
}

export const ConciergePortal: React.FC<ConciergePortalProps> = ({
  dossiers,
  estates,
  brokers,
  activeRefId,
  onDispatchConciergeInquiry,
  onOpenAdminInbox,
}) => {
  const [selectedRefId, setSelectedRefId] = useState<string>(
    activeRefId || dossiers[0]?.refId || 'APE-7710'
  );
  const [inquiryCategory, setInquiryCategory] = useState<string>(
    'Sikorsky S-76 Helipad Flight Clearance'
  );
  const [departureFbo, setDepartureFbo] = useState<string>(
    'Van Nuys Jet Center (KVNY) — Hangar 4'
  );
  const [inquiryBody, setInquiryBody] = useState<string>('');
  const [dispatchConfirmation, setDispatchConfirmation] = useState<string>('');

  const handleConciergeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryBody.trim()) return;

    onDispatchConciergeInquiry(
      selectedRefId,
      inquiryCategory,
      departureFbo,
      inquiryBody.trim()
    );
    setDispatchConfirmation(
      `Priority Concierge Dispatch routed to Managing Broker Inbox under Dossier ${selectedRefId}.`
    );
    setInquiryBody('');
  };

  return (
    <div className="space-y-16 pb-20">
      {/* SECTION 5A: PRIVATE AVIATION & LEGAL INQUIRY DESK HERO */}
      <section
        aria-label="Private Aviation and Legal Concierge Header"
        className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-2 border-[#F2ECFA] pb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold mb-2">
              Sovereign Flight Operations &amp; Cross-Border Structuring
            </div>
            <h1 className="font-serif-editorial text-3xl sm:text-5xl font-semibold text-[#1E1333]">
              Private Aviation &amp; Legal Inquiry Desk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#5C4D7D] max-w-md">
            Direct communication window routing aviation manifests, Delaware/Zurich blind-trust instructions, and diplomatic security directives straight into the Managing Broker&apos;s ERP Inbox.
          </p>
        </div>

        {/* 3 Aviation Corridor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6D28D9] font-semibold">
              <span>CALIFORNIA COASTAL CORRIDOR</span>
              <Plane className="w-4 h-4" />
            </div>
            <h2 className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
              Van Nuys (KVNY) → Malibu Bluff &amp; Trousdale
            </h2>
            <p className="text-xs text-[#5C4D7D] leading-relaxed">
              11-minute twin-engine Sikorsky S-76D flight time from Signature Flight Support Hangar 4 directly to Villa Solana coastal promontory pad.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6D28D9] font-semibold">
              <span>MANHATTAN SKYLINE CORRIDOR</span>
              <Plane className="w-4 h-4" />
            </div>
            <h2 className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
              Teterboro (KTEB) → East 34th &amp; 740 Park
            </h2>
            <p className="text-xs text-[#5C4D7D] leading-relaxed">
              7-minute AgustaWestland AW139 rotor transfer from Teterboro customs tarmac with Maybach S680 armored escort to Aurelia Penthouse.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6D28D9] font-semibold">
              <span>ROCKY MOUNTAIN ALPINE CORRIDOR</span>
              <Plane className="w-4 h-4" />
            </div>
            <h2 className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
              Aspen Pitkin FBO (KASE) → Red Mountain
            </h2>
            <p className="text-xs text-[#5C4D7D] leading-relaxed">
              6-minute private snow-cleared convoy from Atlantic Aviation FBO straight into Meadowbrook Sanctuary’s geothermal heated motorcourt.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5B: DIRECT CONCIERGE DISPATCH WINDOW (ROUTES STRAIGHT TO BROKER INBOX) */}
      <section
        aria-label="Direct Concierge Dispatch Window"
        className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 lg:p-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-5">
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold">
              Priority Telemetry Link
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1E1333]">
              Transmit Aviation or Legal Directive to Managing Broker
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4D7D] leading-relaxed">
              Every inquiry dispatched below is logged directly into your active Escrow Dossier and triggers an immediate alert in the Managing Broker Admin ERP Inbox.
            </p>

            <div className="p-5 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5] space-y-3 text-xs">
              <div className="font-semibold text-[#1E1333]">On-Duty Senior Managing Partners:</div>
              {brokers.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-1.5 border-b border-[#DFD3F5] last:border-none">
                  <div>
                    <div className="font-semibold text-[#1E1333]">{b.name}</div>
                    <div className="text-[11px] text-[#5C4D7D]">{b.office}</div>
                  </div>
                  <span className="text-[#5B21B6] font-semibold tabular-nums">{b.phone}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleConciergeSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FC] border-2 border-[#DFD3F5] space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="concierge-ref" className="block text-xs font-semibold text-[#1E1333] mb-1.5">
                    Linked Portfolio Reference ID
                  </label>
                  <select
                    id="concierge-ref"
                    value={selectedRefId}
                    onChange={(e) => setSelectedRefId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C5F0] text-xs font-semibold text-[#1E1333] tabular-nums"
                  >
                    {dossiers.map((d) => (
                      <option key={d.refId} value={d.refId}>
                        {d.refId} — {d.buyerName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="concierge-category" className="block text-xs font-semibold text-[#1E1333] mb-1.5">
                    Concierge &amp; Legal Desk Category
                  </label>
                  <select
                    id="concierge-category"
                    value={inquiryCategory}
                    onChange={(e) => setInquiryCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C5F0] text-xs font-semibold text-[#1E1333]"
                  >
                    <option value="Sikorsky S-76 Helipad Flight Clearance">Sikorsky S-76 Helipad Flight Clearance</option>
                    <option value="Blind Trust & Sovereign Title Structuring">Blind Trust &amp; Sovereign Title Structuring</option>
                    <option value="Cross-Border SWIFT / Fedwire Escrow Verification">Cross-Border SWIFT / Fedwire Escrow Verification</option>
                    <option value="Private Armed Security & Art Curatorial Transit">Private Armed Security &amp; Art Curatorial Transit</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="concierge-fbo" className="block text-xs font-semibold text-[#1E1333] mb-1.5">
                  Departure FBO Terminal / Legal Jurisdiction
                </label>
                <input
                  id="concierge-fbo"
                  type="text"
                  value={departureFbo}
                  onChange={(e) => setDepartureFbo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C5F0] text-xs text-[#1E1333]"
                />
              </div>

              <div>
                <label htmlFor="concierge-message" className="block text-xs font-semibold text-[#1E1333] mb-1.5">
                  Formal Concierge or Counsel Directive *
                </label>
                <textarea
                  id="concierge-message"
                  rows={4}
                  value={inquiryBody}
                  onChange={(e) => setInquiryBody(e.target.value)}
                  placeholder="Enter tail number, passenger manifest, trust counsel contact, or wire settlement instructions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C5F0] text-xs text-[#1E1333]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#EDE5FA]" />
                <span>Route Inquiry Directly to Managing Broker ERP Inbox</span>
              </button>
            </form>

            {dispatchConfirmation && (
              <div className="mt-4 p-4 rounded-xl bg-[#2E1065] text-[#EDE5FA] text-xs font-semibold flex items-center justify-between">
                <span>{dispatchConfirmation}</span>
                <button
                  type="button"
                  onClick={onOpenAdminInbox}
                  className="underline text-white ml-4 cursor-pointer"
                >
                  Inspect in Managing Broker Inbox →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5C: SOVEREIGN TRUST, TAX & PRIVACY STRUCTURING ADVISORY */}
      <section
        aria-label="Legal and Sovereign Structuring Protocols"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_6px_0_0_#EDE5FA] rounded-3xl p-7 space-y-3">
          <Scale className="w-6 h-6 text-[#5B21B6]" />
          <h3 className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
            Double-Blind Delaware &amp; Wyoming LLC Formation
          </h3>
          <p className="text-xs text-[#5C4D7D] leading-relaxed">
            Our in-house tax counsel structures anonymous single-purpose acquisition vehicles so public county grant deed registries never expose beneficial family office principals.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_6px_0_0_#EDE5FA] rounded-3xl p-7 space-y-3">
          <ShieldCheck className="w-6 h-6 text-[#5B21B6]" />
          <h3 className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
            1031 Trophy Asset &amp; Aviation Exchanges
          </h3>
          <p className="text-xs text-[#5C4D7D] leading-relaxed">
            Seamless tax-deferred exchange coordination for institutional real estate portfolios transitioning into coastal Malibu, Beverly Hills, Manhattan, or Aspen holdings.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_6px_0_0_#EDE5FA] rounded-3xl p-7 space-y-3">
          <Lock className="w-6 h-6 text-[#5B21B6]" />
          <h3 className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
            Museum Fine Art &amp; Wine Vault Logistics
          </h3>
          <p className="text-xs text-[#5C4D7D] leading-relaxed">
            Climate-stabilized air-ride transport, UL Class-3 vault calibration, and Chubb fine-art endorsement underwriting completed prior to Stage 6 key delivery.
          </p>
        </div>
      </section>

      {/* SECTION 5D: HELIPAD & FBO CLEARED RESIDENCE REGISTRY */}
      <section
        aria-label="Estate Aviation Coordinates"
        className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 space-y-6"
      >
        <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#1E1333]">
          Verified Estate Helipad &amp; Private FBO Approach Coordinates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs tabular-nums">
          {estates.map((est) => (
            <div key={est.id} className="p-4 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5] space-y-1.5">
              <div className="font-serif-editorial text-lg font-semibold text-[#1E1333]">
                {est.shortName}
              </div>
              <div className="text-[#6D28D9] font-semibold">{est.location}</div>
              <div className="text-[#5C4D7D]">{est.helipadCoordinates}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
