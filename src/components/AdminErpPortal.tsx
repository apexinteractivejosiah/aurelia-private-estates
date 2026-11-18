import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  Calendar,
  Users,
  MessageSquare,
  ArrowUpRight,
  Plane,
  Send,
} from 'lucide-react';
import {
  Estate,
  EstateStatus,
  EscrowDossier,
  EscrowStageNumber,
  BrokerProfile,
  ESCROW_STAGES,
  formatCurrency,
} from '../utils/syndicateLogic';

export type AdminModuleTab =
  | 'pipeline'
  | 'inventory'
  | 'viewings'
  | 'brokers'
  | 'inbox';

interface AdminErpPortalProps {
  estates: Estate[];
  dossiers: EscrowDossier[];
  brokers: BrokerProfile[];
  initialTab?: AdminModuleTab;
  onUpdateDossierStage: (refId: string, newStage: EscrowStageNumber) => void;
  onUpdateDossierOffer: (refId: string, newOfferAmount: number) => void;
  onUpdateEstateStatus: (estateId: string, newStatus: EstateStatus) => void;
  onUpdateEstatePrice: (estateId: string, newPrice: number) => void;
  onUpdateViewingStatus: (
    refId: string,
    newStatus: EscrowDossier['ViewingStatus'],
    newDate?: string
  ) => void;
  onAssignBrokerToDossier: (refId: string, brokerId: string) => void;
  onSendBrokerReply: (refId: string, messageContent: string) => void;
  onInspectInClientPortal: (refId: string) => void;
}

export const AdminErpPortal: React.FC<AdminErpPortalProps> = ({
  estates,
  dossiers,
  brokers,
  initialTab = 'pipeline',
  onUpdateDossierStage,
  onUpdateDossierOffer,
  onUpdateEstateStatus,
  onUpdateEstatePrice,
  onUpdateViewingStatus,
  onAssignBrokerToDossier,
  onSendBrokerReply,
  onInspectInClientPortal,
}) => {
  const [activeTab, setActiveTab] = useState<AdminModuleTab>(initialTab);
  const [selectedInboxRefId, setSelectedInboxRefId] = useState<string>(
    dossiers[0]?.refId || 'APE-7710'
  );
  const [replyText, setReplyText] = useState<string>('');
  const [offerDrafts, setOfferDrafts] = useState<Record<string, number>>({});
  const [priceDrafts, setPriceDrafts] = useState<Record<string, number>>({});
  const [rescheduleDrafts, setRescheduleDrafts] = useState<Record<string, string>>({});
  const [adminBanner, setAdminBanner] = useState<string>('');

  const totalEscrowVolume = dossiers.reduce((sum, d) => sum + d.offerAmount, 0);
  const totalPortfolioValuation = estates.reduce((sum, e) => sum + e.price, 0);

  const activeInboxDossier =
    dossiers.find((d) => d.refId === selectedInboxRefId) || dossiers[0];

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeInboxDossier) return;
    onSendBrokerReply(activeInboxDossier.refId, replyText.trim());
    setAdminBanner(
      `Broker reply transmitted to ${activeInboxDossier.buyerName} (${activeInboxDossier.refId}) — synced live with Client Escrow Portal.`
    );
    setReplyText('');
  };

  return (
    <div className="space-y-12 pb-20">
      {/* SECTION 6A: EXECUTIVE ERP COMMAND HEADER & KPI TELEMETRY */}
      <section
        aria-label="Managing Broker Admin ERP Header"
        className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 space-y-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-2 border-[#F2ECFA] pb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold mb-2">
              Principal Syndicate Back-Office · Real-Time Bidirectional Sync
            </div>
            <h1 className="font-serif-editorial text-3xl sm:text-5xl font-semibold text-[#1E1333]">
              Managing Broker Admin ERP
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#5C4D7D] max-w-md">
            Control all 5 core syndicate operations below. Every state change to escrow stages, property inventory, broker assignments, or inbox replies propagates immediately across Portals 1, 2, and 4.
          </p>
        </div>

        {/* 4 Executive Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 tabular-nums">
          <div className="p-5 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5]">
            <div className="text-xs text-[#5C4D7D]">Active Escrow Pipeline Volume</div>
            <div className="font-serif-editorial text-3xl font-semibold text-[#1E1333] mt-1">
              {formatCurrency(totalEscrowVolume)}
            </div>
            <div className="text-[11px] text-[#5B21B6] font-semibold mt-1">
              Across {dossiers.length} Verified Buyer Dossiers
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5]">
            <div className="text-xs text-[#5C4D7D]">Total Portfolio Inventory Value</div>
            <div className="font-serif-editorial text-3xl font-semibold text-[#1E1333] mt-1">
              {formatCurrency(totalPortfolioValuation)}
            </div>
            <div className="text-[11px] text-[#5B21B6] font-semibold mt-1">
              4 Ultra-Prime Architectural Assets
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5]">
            <div className="text-xs text-[#5C4D7D]">Scheduled Aviation &amp; Chauffeur Tours</div>
            <div className="font-serif-editorial text-3xl font-semibold text-[#1E1333] mt-1">
              {dossiers.length} Flights / Convoys
            </div>
            <div className="text-[11px] text-[#5B21B6] font-semibold mt-1">
              CAA &amp; FBO Manifests Monitored
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5]">
            <div className="text-xs text-[#5C4D7D]">Licensed Managing Partners</div>
            <div className="font-serif-editorial text-3xl font-semibold text-[#1E1333] mt-1">
              {brokers.length} Senior Principals
            </div>
            <div className="text-[11px] text-[#5B21B6] font-semibold mt-1">
              CA DRE / NY DOS / CO Active
            </div>
          </div>
        </div>

        {/* 5 Synced ERP Module Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Managing Broker ERP Modules"
          className="flex flex-wrap items-center gap-2 pt-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pipeline'}
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-3 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-[#5B21B6] text-white shadow-sm'
                : 'bg-[#F7F4FC] text-[#1E1333] border border-[#DFD3F5] hover:bg-[#EDE5FA]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Escrow &amp; Offers Pipeline</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'inventory'}
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-3 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#5B21B6] text-white shadow-sm'
                : 'bg-[#F7F4FC] text-[#1E1333] border border-[#DFD3F5] hover:bg-[#EDE5FA]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Estate Inventory Manager</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'viewings'}
            onClick={() => setActiveTab('viewings')}
            className={`px-4 py-3 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'viewings'
                ? 'bg-[#5B21B6] text-white shadow-sm'
                : 'bg-[#F7F4FC] text-[#1E1333] border border-[#DFD3F5] hover:bg-[#EDE5FA]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Private Viewings Calendar</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'brokers'}
            onClick={() => setActiveTab('brokers')}
            className={`px-4 py-3 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'brokers'
                ? 'bg-[#5B21B6] text-white shadow-sm'
                : 'bg-[#F7F4FC] text-[#1E1333] border border-[#DFD3F5] hover:bg-[#EDE5FA]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Private Brokers Roster</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'inbox'}
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-3 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'inbox'
                ? 'bg-[#5B21B6] text-white shadow-sm'
                : 'bg-[#F7F4FC] text-[#1E1333] border border-[#DFD3F5] hover:bg-[#EDE5FA]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Client Escrow Inbox</span>
          </button>
        </div>

        {adminBanner && (
          <div className="p-4 rounded-2xl bg-[#2E1065] text-[#EDE5FA] text-xs font-semibold flex items-center justify-between">
            <span>{adminBanner}</span>
            <button
              type="button"
              onClick={() => setAdminBanner('')}
              className="text-white/80 hover:text-white ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </section>

      {/* MODULE 1: ESCROW & OFFERS PIPELINE */}
      {activeTab === 'pipeline' && (
        <section
          aria-label="Escrow and Offers Pipeline Module"
          className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#F2ECFA] pb-5">
            <div>
              <h2 className="font-serif-editorial text-3xl font-semibold text-[#1E1333]">
                Escrow &amp; Offers Pipeline Control
              </h2>
              <p className="text-xs text-[#5C4D7D]">
                Advance any buyer&apos;s closing stage (1–6) or modify accepted offer valuation. Updates reflect immediately in Portal 4 (Client Escrow Portal).
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {dossiers.map((dossier) => {
              const est = estates.find((e) => e.id === dossier.estateId) || estates[0];
              const draftOffer = offerDrafts[dossier.refId] ?? dossier.offerAmount;

              return (
                <div
                  key={dossier.refId}
                  className="p-6 rounded-2xl bg-[#F7F4FC] border-2 border-[#DFD3F5] space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DFD3F5] pb-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-serif-editorial text-2xl font-bold text-[#1E1333] tabular-nums">
                          {dossier.refId}
                        </span>
                        <span className="text-xs font-semibold text-[#5B21B6]">
                          · {dossier.buyerName} ({dossier.buyerEntity})
                        </span>
                      </div>
                      <div className="text-xs text-[#5C4D7D] mt-1">
                        Target Residence: <strong className="text-[#1E1333]">{est.title}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onInspectInClientPortal(dossier.refId)}
                      className="px-4 py-2 rounded-xl bg-white border border-[#D5C5F0] text-xs font-semibold text-[#1E1333] hover:bg-[#5B21B6] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Verify Live in Client Portal ({dossier.refId})</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Stage 1-6 Direct Selector Buttons */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-[#5C4D7D]">
                      Active Closing Stage: <strong className="text-[#1E1333]">Stage {dossier.stage} of 6 — {ESCROW_STAGES[dossier.stage - 1]?.title}</strong>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {ESCROW_STAGES.map((st) => {
                        const isCurrent = dossier.stage === st.stage;
                        return (
                          <button
                            key={st.stage}
                            type="button"
                            onClick={() => {
                              onUpdateDossierStage(dossier.refId, st.stage);
                              setAdminBanner(
                                `Dossier ${dossier.refId} advanced to ${st.title}. Client Escrow Portal updated live.`
                              );
                            }}
                            className={`p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                              isCurrent
                                ? 'bg-[#5B21B6] text-white border-[#4C1D95] font-semibold'
                                : 'bg-white text-[#1E1333] border-[#DFD3F5] hover:bg-[#EDE5FA]'
                            }`}
                          >
                            <div className="text-[10px] uppercase opacity-75">Stage {st.stage}</div>
                            <div className="truncate font-medium mt-0.5">{st.title.replace(/^\d+\.\s*/, '')}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Offer Amount Update Row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#DFD3F5] text-xs tabular-nums">
                    <div className="flex flex-wrap items-center gap-3">
                      <label htmlFor={`offer-input-${dossier.refId}`} className="font-semibold text-[#5C4D7D]">
                        Update Contract / Offer Amount (USD):
                      </label>
                      <input
                        id={`offer-input-${dossier.refId}`}
                        type="number"
                        step={100000}
                        value={draftOffer}
                        onChange={(e) =>
                          setOfferDrafts((prev) => ({
                            ...prev,
                            [dossier.refId]: Number(e.target.value),
                          }))
                        }
                        className="px-3.5 py-2 rounded-xl bg-white border border-[#D5C5F0] font-semibold text-[#1E1333] w-44"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateDossierOffer(dossier.refId, draftOffer);
                          setAdminBanner(
                            `Updated ${dossier.refId} contract valuation to ${formatCurrency(draftOffer)}.`
                          );
                        }}
                        className="px-4 py-2 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-semibold cursor-pointer"
                      >
                        Commit Valuation
                      </button>
                    </div>

                    <div className="text-[#5C4D7D]">
                      10% Earnest Escrow Lock: <strong className="text-[#1E1333]">{formatCurrency(dossier.earnestDeposit)}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* MODULE 2: ESTATE INVENTORY MANAGER */}
      {activeTab === 'inventory' && (
        <section
          aria-label="Estate Inventory Manager Module"
          className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 space-y-6"
        >
          <div className="border-b-2 border-[#F2ECFA] pb-5">
            <h2 className="font-serif-editorial text-3xl font-semibold text-[#1E1333]">
              Estate Inventory &amp; Valuation Manager
            </h2>
            <p className="text-xs text-[#5C4D7D]">
              Toggle any of the 4 trophy residences between Available, In Escrow, Under Contract, and Sold, or adjust offering prices (updates Portal 1 and Portal 2 live).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {estates.map((estate) => {
              const draftPrice = priceDrafts[estate.id] ?? estate.price;
              return (
                <div
                  key={estate.id}
                  className="p-6 rounded-2xl bg-[#F7F4FC] border-2 border-[#DFD3F5] space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#6D28D9] font-semibold">
                      <span>{estate.location} · {estate.lidarScanId}</span>
                      <span>Current Status: {estate.status}</span>
                    </div>
                    <h3 className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
                      {estate.title}
                    </h3>

                    {/* Status Toggle Buttons */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-xs font-semibold text-[#5C4D7D] block">
                        Set Live Market Availability Status:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(['Available', 'In Escrow', 'Under Contract', 'Sold'] as EstateStatus[]).map(
                          (st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                onUpdateEstateStatus(estate.id, st);
                                setAdminBanner(
                                  `${estate.shortName} status updated to "${st}" across Private Collection & Property Portfolio.`
                                );
                              }}
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                                estate.status === st
                                  ? 'bg-[#5B21B6] text-white'
                                  : 'bg-white text-[#1E1333] border border-[#DFD3F5] hover:bg-[#EDE5FA]'
                              }`}
                            >
                              {st}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Edit Listing Price */}
                  <div className="pt-4 border-t border-[#DFD3F5] flex flex-wrap items-center justify-between gap-3 text-xs tabular-nums">
                    <div className="flex items-center gap-2">
                      <label htmlFor={`price-edit-${estate.id}`} className="text-[#5C4D7D] font-semibold">
                        Offering Price:
                      </label>
                      <input
                        id={`price-edit-${estate.id}`}
                        type="number"
                        step={100000}
                        value={draftPrice}
                        onChange={(e) =>
                          setPriceDrafts((prev) => ({
                            ...prev,
                            [estate.id]: Number(e.target.value),
                          }))
                        }
                        className="px-3 py-2 rounded-xl bg-white border border-[#D5C5F0] font-semibold text-[#1E1333] w-40"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateEstatePrice(estate.id, draftPrice);
                        setAdminBanner(
                          `${estate.shortName} listing price updated to ${formatCurrency(draftPrice)}.`
                        );
                      }}
                      className="px-4 py-2 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-semibold cursor-pointer"
                    >
                      Update Offering Price
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* MODULE 3: PRIVATE VIEWINGS CALENDAR */}
      {activeTab === 'viewings' && (
        <section
          aria-label="Private Viewings Calendar Module"
          className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 space-y-6"
        >
          <div className="border-b-2 border-[#F2ECFA] pb-5">
            <h2 className="font-serif-editorial text-3xl font-semibold text-[#1E1333]">
              Private Aviation &amp; Chauffeur Viewings Calendar
            </h2>
            <p className="text-xs text-[#5C4D7D]">
              Approve, clear flight manifests, or reschedule Sikorsky S-76 helicopter and Maybach convoy property tours.
            </p>
          </div>

          <div className="space-y-4">
            {dossiers.map((dossier) => {
              const est = estates.find((e) => e.id === dossier.estateId) || estates[0];
              const dateDraft =
                rescheduleDrafts[dossier.refId] ?? dossier.requestedViewingDate;

              return (
                <div
                  key={dossier.refId}
                  className="p-6 rounded-2xl bg-[#F7F4FC] border-2 border-[#DFD3F5] flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-[#6D28D9] font-semibold">
                      <Plane className="w-4 h-4" />
                      <span>{dossier.transportPreference}</span>
                      <span>·</span>
                      <span>Ref: {dossier.refId}</span>
                    </div>
                    <h3 className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
                      {dossier.buyerName} — {est.shortName} ({est.location})
                    </h3>
                    <div className="text-xs text-[#5C4D7D]">
                      Landing / Arrival Coordinates: {est.helipadCoordinates}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <input
                      type="text"
                      aria-label={`Viewing window for ${dossier.refId}`}
                      value={dateDraft}
                      onChange={(e) =>
                        setRescheduleDrafts((prev) => ({
                          ...prev,
                          [dossier.refId]: e.target.value,
                        }))
                      }
                      className="px-3.5 py-2 rounded-xl bg-white border border-[#D5C5F0] text-[#1E1333] font-semibold w-56"
                    />

                    {(['Confirmed', 'Pending Flight Clearance', 'Rescheduled', 'Completed'] as const).map(
                      (statusOpt) => (
                        <button
                          key={statusOpt}
                          type="button"
                          onClick={() => {
                            onUpdateViewingStatus(dossier.refId, statusOpt, dateDraft);
                            setAdminBanner(
                              `Viewing charter for ${dossier.refId} marked "${statusOpt}" (${dateDraft}).`
                            );
                          }}
                          className={`px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                            dossier.ViewingStatus === statusOpt
                              ? 'bg-[#5B21B6] text-white'
                              : 'bg-white text-[#1E1333] border border-[#DFD3F5] hover:bg-[#EDE5FA]'
                          }`}
                        >
                          {statusOpt}
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* MODULE 4: PRIVATE BROKERS ROSTER */}
      {activeTab === 'brokers' && (
        <section
          aria-label="Private Brokers Roster Module"
          className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 space-y-8"
        >
          <div className="border-b-2 border-[#F2ECFA] pb-5">
            <h2 className="font-serif-editorial text-3xl font-semibold text-[#1E1333]">
              Private Managing Brokers Roster &amp; Dossier Assignment
            </h2>
            <p className="text-xs text-[#5C4D7D]">
              Assign specific Senior Managing Partners to buyer Portfolio Reference IDs. Reassignments sync immediately to the Buyer’s Client Escrow Portal card.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brokers.map((broker) => (
              <div
                key={broker.id}
                className="p-6 rounded-2xl bg-[#F7F4FC] border-2 border-[#DFD3F5] space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#5B21B6] text-white flex items-center justify-center font-serif-editorial text-xl font-semibold">
                      {broker.avatarInitials}
                    </div>
                    <div>
                      <h3 className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
                        {broker.name}
                      </h3>
                      <div className="text-[11px] text-[#6D28D9] font-semibold">
                        {broker.licenseNumber}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#5C4D7D]">{broker.title}</p>
                  <div className="text-xs text-[#1E1333] space-y-1 pt-2 border-t border-[#DFD3F5] tabular-nums">
                    <div>Direct: {broker.phone}</div>
                    <div>Desk: {broker.email}</div>
                    <div className="text-[#5B21B6] font-semibold">{broker.closedVolume}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dossier Broker Assignment Controls */}
          <div className="space-y-4 pt-4 border-t border-[#DFD3F5]">
            <h3 className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
              Assign Managing Broker by Client Reference ID
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dossiers.map((dossier) => (
                <div
                  key={dossier.refId}
                  className="p-5 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-serif-editorial text-xl font-semibold text-[#1E1333] tabular-nums">
                      {dossier.refId} — {dossier.buyerName}
                    </div>
                    <div className="text-xs text-[#5C4D7D]">
                      Currently Assigned:{' '}
                      <strong className="text-[#5B21B6]">
                        {brokers.find((b) => b.id === dossier.assignedBrokerId)?.name}
                      </strong>
                    </div>
                  </div>

                  <select
                    aria-label={`Assign broker for ${dossier.refId}`}
                    value={dossier.assignedBrokerId}
                    onChange={(e) => {
                      onAssignBrokerToDossier(dossier.refId, e.target.value);
                      const foundBroker = brokers.find((b) => b.id === e.target.value);
                      setAdminBanner(
                        `Assigned ${foundBroker?.name} to Portfolio Dossier ${dossier.refId}. Synced live with Client Portal.`
                      );
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-[#D5C5F0] text-xs font-semibold text-[#1E1333]"
                  >
                    {brokers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MODULE 5: CLIENT ESCROW INBOX */}
      {activeTab === 'inbox' && (
        <section
          aria-label="Client Escrow Inbox Module"
          className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 space-y-6"
        >
          <div className="border-b-2 border-[#F2ECFA] pb-5">
            <h2 className="font-serif-editorial text-3xl font-semibold text-[#1E1333]">
              Client Escrow &amp; Concierge Inbox
            </h2>
            <p className="text-xs text-[#5C4D7D]">
              Read and reply to buyer messages and aviation/legal dispatches in real time. Replies appear immediately inside Portal 4 (Client Escrow Portal).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Dossier Thread List */}
            <div className="lg:col-span-4 space-y-3">
              {dossiers.map((d) => {
                const isSelected = d.refId === activeInboxDossier.refId;
                const lastMsg = d.messages[d.messages.length - 1];
                return (
                  <button
                    key={d.refId}
                    type="button"
                    onClick={() => setSelectedInboxRefId(d.refId)}
                    className={`w-full p-4 rounded-2xl text-left transition-all border-2 cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-[#5B21B6] text-white border-[#4C1D95]'
                        : 'bg-[#F7F4FC] text-[#1E1333] border-[#DFD3F5] hover:bg-[#EDE5FA]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold tabular-nums">{d.refId}</span>
                      <span className={isSelected ? 'text-[#EDE5FA]' : 'text-[#6D28D9] font-semibold'}>
                        {d.messages.length} Messages
                      </span>
                    </div>
                    <div className="font-serif-editorial text-lg font-semibold">
                      {d.buyerName}
                    </div>
                    {lastMsg && (
                      <p className="text-xs opacity-80 truncate">{lastMsg.content}</p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Conversation & Broker Reply Form */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#F7F4FC] border-2 border-[#DFD3F5] flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between border-b border-[#DFD3F5] pb-4">
                <div>
                  <h3 className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
                    Dossier {activeInboxDossier.refId} — {activeInboxDossier.buyerName}
                  </h3>
                  <div className="text-xs text-[#5C4D7D]">
                    Assigned Partner:{' '}
                    {brokers.find((b) => b.id === activeInboxDossier.assignedBrokerId)?.name}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onInspectInClientPortal(activeInboxDossier.refId)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#D5C5F0] text-xs font-semibold text-[#1E1333] cursor-pointer"
                >
                  Open Buyer View →
                </button>
              </div>

              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {activeInboxDossier.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl text-xs space-y-1 ${
                      m.senderRole === 'broker'
                        ? 'bg-[#5B21B6] text-white ml-8'
                        : 'bg-white text-[#1E1333] border border-[#DFD3F5] mr-8'
                    }`}
                  >
                    <div className="flex justify-between text-[11px] opacity-80">
                      <span className="font-semibold">{m.senderName} ({m.senderRole.toUpperCase()})</span>
                      <span>{m.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{m.content}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleReplySubmit} className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  aria-label="Managing Broker Official Reply"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply as Managing Partner to ${activeInboxDossier.buyerName}...`}
                  className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#D5C5F0] text-xs text-[#1E1333]"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Send Broker Reply</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
