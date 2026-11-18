import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Send,
  Search,
  Lock,
  FileSignature,
} from 'lucide-react';
import {
  EscrowDossier,
  Estate,
  BrokerProfile,
  ESCROW_STAGES,
  FINISH_UPGRADES,
  formatCurrency,
} from '../utils/syndicateLogic';
import { EstateDualShowcase } from './EstateImage';

interface ClientEscrowPortalProps {
  dossiers: EscrowDossier[];
  estates: Estate[];
  brokers: BrokerProfile[];
  activeRefId: string;
  onSelectRefId: (refId: string) => void;
  onSendMessage: (refId: string, senderRole: 'client' | 'broker', content: string) => void;
  onSignDocument: (refId: string, docId: string) => void;
}

export const ClientEscrowPortal: React.FC<ClientEscrowPortalProps> = ({
  dossiers,
  estates,
  brokers,
  activeRefId,
  onSelectRefId,
  onSendMessage,
  onSignDocument,
}) => {
  const [inputRefId, setInputRefId] = useState(activeRefId);
  const [messageText, setMessageText] = useState('');
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    setInputRefId(activeRefId);
    setLookupError('');
  }, [activeRefId]);

  const activeDossier =
    dossiers.find((d) => d.refId.toUpperCase() === activeRefId.toUpperCase()) ||
    dossiers[0];

  const targetEstate =
    estates.find((e) => e.id === activeDossier?.estateId) || estates[0];

  const assignedBroker =
    brokers.find((b) => b.id === activeDossier?.assignedBrokerId) || brokers[0];

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = inputRefId.trim().toUpperCase();
    const found = dossiers.find((d) => d.refId.toUpperCase() === cleaned);
    if (!found) {
      setLookupError(
        `Portfolio Reference ID "${cleaned}" was not found. Select APE-7710, APE-6420, or your newly generated ID below.`
      );
      return;
    }
    setLookupError('');
    onSelectRefId(found.refId);
  };

  const handleSendClientMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeDossier) return;
    onSendMessage(activeDossier.refId, 'client', messageText.trim());
    setMessageText('');
  };

  const configuredUpgrades = FINISH_UPGRADES.filter((u) =>
    activeDossier?.selectedUpgrades.includes(u.id)
  );

  return (
    <div className="space-y-16 pb-20">
      {/* SECTION 4A: BUYER PORTFOLIO REFERENCE ID LOOKUP & 1-CLICK SAMPLE SWITCHER */}
      <section
        aria-label="Client Portfolio Reference Lookup"
        className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b-2 border-[#F2ECFA] pb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold mb-2">
              Sovereign Buyer &amp; Family Office Vault
            </div>
            <h1 className="font-serif-editorial text-3xl sm:text-5xl font-semibold text-[#1E1333]">
              Client Escrow &amp; Closing Tracker Portal
            </h1>
          </div>

          {/* Search / Enter Reference ID Form */}
          <form onSubmit={handleLookupSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-[#6D28D9] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="Portfolio Reference ID"
                value={inputRefId}
                onChange={(e) => setInputRefId(e.target.value)}
                placeholder="Enter Reference ID (e.g. APE-7710)"
                className="pl-10 pr-4 py-3 rounded-xl bg-[#F7F4FC] border-2 border-[#D5C5F0] text-xs font-semibold text-[#1E1333] focus:outline-none focus:border-[#5B21B6] tabular-nums"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Load Dossier
            </button>
          </form>
        </div>

        {/* 1-Click Sample & Newly Created Portfolio Reference IDs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#5C4D7D] mr-1">
              Instant Portfolio Dossiers:
            </span>
            {dossiers.map((d) => {
              const isCurrent = d.refId === activeDossier.refId;
              return (
                <button
                  key={d.refId}
                  type="button"
                  onClick={() => onSelectRefId(d.refId)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer tabular-nums ${
                    isCurrent
                      ? 'bg-[#5B21B6] text-white shadow-sm'
                      : 'bg-[#F7F4FC] text-[#1E1333] border border-[#DFD3F5] hover:bg-[#EDE5FA]'
                  }`}
                >
                  {d.refId} ({d.buyerName.split(' ')[0]} {d.buyerName.split(' ')[1] || ''} · Stage {d.stage}/6)
                </button>
              );
            })}
          </div>

          <div className="text-xs text-[#5C4D7D] tabular-nums">
            Active Reference ID: <strong className="text-[#1E1333]">{activeDossier.refId}</strong> · Entity: {activeDossier.buyerEntity}
          </div>
        </div>

        {lookupError && (
          <div className="p-3.5 rounded-xl bg-red-100 border border-red-300 text-xs text-red-900 font-medium">
            {lookupError}
          </div>
        )}
      </section>

      {/* SECTION 4B: LIVE 6-STAGE ESCROW & CLOSING PIPELINE */}
      <section
        aria-label="Live 6-Stage Escrow Pipeline"
        className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-[#F2ECFA] pb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold mb-1">
              Real-Time Settlement Telemetry · Synced with Managing Broker ERP
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1E1333]">
              6-Stage Digital Escrow &amp; Closing Pipeline ({activeDossier.refId})
            </h2>
          </div>

          <div className="text-right tabular-nums">
            <div className="text-xs text-[#5C4D7D]">Current Milestone Status</div>
            <div
              data-testid="client-current-stage-label"
              className="font-serif-editorial italic text-2xl font-semibold text-[#5B21B6]"
            >
              Stage {activeDossier.stage} of 6 — {ESCROW_STAGES[activeDossier.stage - 1]?.title}
            </div>
          </div>
        </div>

        {/* 6 Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ESCROW_STAGES.map((stageObj) => {
            const isCompleted = stageObj.stage < activeDossier.stage;
            const isCurrent = stageObj.stage === activeDossier.stage;
            return (
              <div
                key={stageObj.stage}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                  isCurrent
                    ? 'bg-[#2E1065] text-white border-[#5B21B6] shadow-md'
                    : isCompleted
                    ? 'bg-[#F7F4FC] text-[#1E1333] border-[#D5C5F0]'
                    : 'bg-[#FFFFFF] text-[#5C4D7D] border-[#EDE5FA] opacity-80'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold uppercase tracking-wider ${
                        isCurrent
                          ? 'text-[#EDE5FA]'
                          : isCompleted
                          ? 'text-[#5B21B6]'
                          : 'text-[#5C4D7D]'
                      }`}
                    >
                      {isCompleted
                        ? 'Verified & Cleared'
                        : isCurrent
                        ? 'Active Escrow Stage'
                        : 'Pending Milestone'}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-[#5B21B6]" />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4 text-[#EDE5FA]" />
                    ) : (
                      <Lock className="w-4 h-4 text-[#5C4D7D]/60" />
                    )}
                  </div>

                  <h3 className="font-serif-editorial text-xl font-semibold leading-snug">
                    {stageObj.title}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed ${
                      isCurrent ? 'text-white/85' : 'text-[#5C4D7D]'
                    }`}
                  >
                    {stageObj.subtitle}
                  </p>
                </div>

                <div
                  className={`pt-3 border-t text-[11px] font-semibold ${
                    isCurrent
                      ? 'border-white/20 text-[#EDE5FA]'
                      : 'border-[#DFD3F5] text-[#6D28D9]'
                  }`}
                >
                  Protocol: {stageObj.slaRequirement}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4C: TARGET RESIDENCE SUMMARY & ASSIGNED PRIVATE MANAGING BROKER CARD */}
      <section
        aria-label="Property Summary and Assigned Managing Broker"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
      >
        {/* Left 7 Columns: Acquired Residence (Exterior + Interior) & Financial Breakdown */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border-2 border-[#DFD3F5]">
              <EstateDualShowcase
                exteriorUrl={targetEstate.imageUrl}
                interiorUrl={targetEstate.interiorImageUrl}
                title={targetEstate.title}
                exteriorCaption={targetEstate.exteriorCaption}
                interiorCaption={targetEstate.interiorCaption}
                heightClass="h-[420px] sm:h-[400px]"
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold">
                Subject Trophy Asset · {targetEstate.lidarScanId}
              </div>
              <h3 className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
                {targetEstate.title}
              </h3>
              <p className="text-xs text-[#5C4D7D]">{targetEstate.address}</p>
              <div className="pt-2 flex flex-wrap gap-3 text-xs text-[#1E1333] font-semibold tabular-nums">
                <span>Accepted/Proposed Offer: {formatCurrency(activeDossier.offerAmount)}</span>
                <span>·</span>
                <span>10% Earnest Deposit: {formatCurrency(activeDossier.earnestDeposit)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#DFD3F5] text-xs tabular-nums">
            <div className="p-4 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5]">
              <span className="text-[#5C4D7D] block">Aviation / Tour Protocol</span>
              <span className="font-semibold text-[#1E1333] mt-1 block">
                {activeDossier.transportPreference}
              </span>
              <span className="text-[11px] text-[#5B21B6] font-semibold mt-0.5 block">
                {activeDossier.requestedViewingDate} ({activeDossier.ViewingStatus})
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5]">
              <span className="text-[#5C4D7D] block">Configured Finish Addenda</span>
              <span className="font-semibold text-[#1E1333] mt-1 block">
                {configuredUpgrades.length > 0
                  ? configuredUpgrades.map((u) => u.name).join(', ')
                  : 'Standard Architectural Spec'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5]">
              <span className="text-[#5C4D7D] block">Escrow Custodial Bank</span>
              <span className="font-semibold text-[#1E1333] mt-1 block">
                JP Morgan Private Client Trust
              </span>
              <span className="text-[11px] text-[#5B21B6] font-semibold mt-0.5 block">
                Segregated SWIFT Vault #JPM-8841
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Assigned Private Managing Broker Card */}
        <div
          data-testid="assigned-broker-card"
          className="lg:col-span-5 bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold">
                Assigned Private Managing Broker
              </span>
              <span className="text-[11px] text-[#5C4D7D]">Live ERP Sync</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#5B21B6] text-white flex items-center justify-center font-serif-editorial text-2xl font-semibold shrink-0 border-2 border-[#DFD3F5]">
                {assignedBroker.avatarInitials}
              </div>
              <div>
                <h3 className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
                  {assignedBroker.name}
                </h3>
                <p className="text-xs text-[#5C4D7D]">{assignedBroker.title}</p>
                <p className="text-[11px] text-[#5B21B6] font-semibold mt-0.5">
                  {assignedBroker.licenseNumber}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#5C4D7D]">Direct Encrypted Line:</span>
                <span className="font-semibold text-[#1E1333] tabular-nums">{assignedBroker.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C4D7D]">Private Syndicate Desk:</span>
                <span className="font-semibold text-[#1E1333]">{assignedBroker.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C4D7D]">Primary Office:</span>
                <span className="font-medium text-[#1E1333]">{assignedBroker.office}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#DFD3F5] flex items-center justify-between text-xs text-[#5C4D7D]">
            <span>{assignedBroker.closedVolume}</span>
            <span className="font-semibold text-[#5B21B6]">24/7 Principal Concierge</span>
          </div>
        </div>
      </section>

      {/* SECTION 4D: INTERACTIVE CLOSING DOCUMENT VAULT & LIVE TWO-WAY MESSAGE THREAD */}
      <section
        aria-label="Closing Document Vault and Broker Message Thread"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
      >
        {/* Left 6 Columns: Interactive Closing Document Vault */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold mb-1">
              Cryptographic Closing Room
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#1E1333]">
              Interactive Closing Document Vault
            </h2>
            <p className="text-xs text-[#5C4D7D] mt-1">
              Inspect verified ALTA title commitments, LiDAR engineering files, and countersign pending closing covenants.
            </p>
          </div>

          <div className="space-y-3">
            {activeDossier.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl bg-[#F7F4FC] border border-[#DFD3F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-[#6D28D9] font-semibold">
                    <span>{doc.category}</span>
                    <span>·</span>
                    <span>{doc.fileSize}</span>
                    <span>·</span>
                    <span>{doc.updatedAt}</span>
                  </div>
                  <div className="font-semibold text-xs sm:text-sm text-[#1E1333]">
                    {doc.title}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {doc.status === 'Verified & Countersigned' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-[#EDE5FA] text-[#4C1D95] text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5B21B6]" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSignDocument(activeDossier.refId, doc.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileSignature className="w-3.5 h-3.5 text-[#EDE5FA]" />
                      <span>Countersign Now</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Columns: Live Two-Way Message Thread with Managing Broker */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#6D28D9] font-semibold mb-1">
              Encrypted Two-Way Syndicate Channel
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#1E1333]">
              Direct Broker Escrow Correspondence
            </h2>
            <p className="text-xs text-[#5C4D7D] mt-1">
              Messages transmitted here route immediately to {assignedBroker.name} in the Managing Broker Admin ERP Inbox.
            </p>
          </div>

          {/* Message Feed */}
          <div
            data-testid="client-message-thread"
            className="space-y-3 max-h-[320px] overflow-y-auto pr-1"
          >
            {activeDossier.messages.map((msg) => {
              const isClient = msg.senderRole === 'client';
              return (
                <div
                  key={msg.id}
                  className={`p-4 rounded-2xl text-xs space-y-1.5 ${
                    isClient
                      ? 'bg-[#2E1065] text-white ml-6'
                      : 'bg-[#F7F4FC] text-[#1E1333] border border-[#DFD3F5] mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] opacity-80">
                    <span className="font-semibold">{msg.senderName}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              );
            })}
          </div>

          {/* Send Message Input */}
          <form onSubmit={handleSendClientMessage} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              aria-label="Write message to Managing Broker"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Message ${assignedBroker.name} regarding ${activeDossier.refId}...`}
              className="flex-1 px-4 py-3 rounded-xl bg-[#F7F4FC] border border-[#D5C5F0] text-xs text-[#1E1333] focus:outline-none focus:border-[#5B21B6]"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Transmit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
