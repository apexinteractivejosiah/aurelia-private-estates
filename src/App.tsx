/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import {
  PortalId,
  Estate,
  EstateStatus,
  EscrowDossier,
  EscrowStageNumber,
  BrokerProfile,
  INITIAL_ESTATES,
  INITIAL_DOSSIERS,
  INITIAL_BROKERS,
  generatePortfolioRefId,
  advanceEscrowStage,
  formatCurrency,
} from './utils/syndicateLogic';
import { HomePortal } from './components/HomePortal';
import { ListingsPortal } from './components/ListingsPortal';
import { FloorplansPortal } from './components/FloorplansPortal';
import { ClientEscrowPortal } from './components/ClientEscrowPortal';
import { ConciergePortal } from './components/ConciergePortal';
import { AdminErpPortal, AdminModuleTab } from './components/AdminErpPortal';

const PORTAL_NAV_ITEMS: { id: PortalId; label: string }[] = [
  { id: 'home', label: 'Private Collection' },
  { id: 'listings', label: 'Property Portfolio' },
  { id: 'floorplans', label: '3D Floorplan & Finishes' },
  { id: 'client', label: 'Client Escrow Portal' },
  { id: 'concierge', label: 'Private Concierge Mail' },
  { id: 'admin', label: 'Managing Broker Admin ERP' },
];

export default function App() {
  const [activePortal, setActivePortal] = useState<PortalId>('home');
  const [estates, setEstates] = useState<Estate[]>(INITIAL_ESTATES);
  const [dossiers, setDossiers] = useState<EscrowDossier[]>(INITIAL_DOSSIERS);
  const [brokers] = useState<BrokerProfile[]>(INITIAL_BROKERS);

  // Cross-portal context states
  const [selectedFloorplanEstateId, setSelectedFloorplanEstateId] =
    useState<string>('villa-solana');
  const [selectedBookingEstateId, setSelectedBookingEstateId] = useState<
    string | null
  >(null);
  const [scrollToBookingForm, setScrollToBookingForm] = useState<boolean>(false);
  const [activeClientRefId, setActiveClientRefId] = useState<string>('APE-7710');
  const [adminInitialTab, setAdminInitialTab] =
    useState<AdminModuleTab>('pipeline');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleNavigatePortal = (portal: PortalId) => {
    setActivePortal(portal);
    setMobileMenuOpen(false);
    if (portal !== 'listings') {
      setScrollToBookingForm(false);
    }
    window.scrollTo(0, 0);
  };

  // Navigate to 3D Floorplans for a specific estate
  const handleInspectFloorplan = (estateId: string) => {
    setSelectedFloorplanEstateId(estateId);
    handleNavigatePortal('floorplans');
  };

  // Navigate to Listings Viewing/LOI desk for a specific estate
  const handleScheduleViewingForEstate = (estateId: string) => {
    setSelectedBookingEstateId(estateId);
    setScrollToBookingForm(true);
    setActivePortal('listings');
  };

  // Create new Dossier from Listings Viewing / LOI form
  const handleCreateDossier = (payload: {
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
  }): EscrowDossier => {
    const existingIds = dossiers.map((d) => d.refId);
    const newRefId = generatePortfolioRefId(existingIds);
    const initialStage: EscrowStageNumber =
      payload.submissionType === 'loi' ? 2 : 1;

    const newDossier: EscrowDossier = {
      refId: newRefId,
      buyerName: payload.buyerName,
      buyerEntity: payload.buyerEntity,
      buyerEmail: payload.buyerEmail,
      buyerPhone: payload.buyerPhone,
      estateId: payload.estateId,
      offerAmount: payload.offerAmount,
      earnestDeposit: Math.round(payload.offerAmount * 0.1),
      stage: initialStage,
      assignedBrokerId: brokers[0].id,
      transportPreference: payload.transportPreference,
      requestedViewingDate: payload.requestedViewingDate,
      ViewingStatus: 'Confirmed',
      selectedUpgrades: ['calacatta-viola'],
      createdAt: '2026-11-17',
      notes: payload.notes,
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          title: 'Bilateral Sovereign NDA & Aviation Manifest Clearance',
          category: 'Purchase Covenant',
          status: 'Verified & Countersigned',
          updatedAt: 'Nov 17, 2026',
          fileSize: '3.4 MB PDF',
        },
        {
          id: `doc-${Date.now()}-2`,
          title: 'Preliminary LiDAR Structural & ALTA Title Commitment',
          category: 'Architectural LiDAR',
          status: 'Awaiting Buyer Signature',
          updatedAt: 'Nov 17, 2026',
          fileSize: '21.8 MB PDF',
        },
      ],
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderRole: 'broker',
          senderName: brokers[0].name,
          timestamp: 'Nov 17, 2026 • Just Now',
          content: `Welcome ${payload.buyerName}. Dossier ${newRefId} has been initialized for ${
            estates.find((e) => e.id === payload.estateId)?.shortName || 'your residence'
          }. Your ${payload.transportPreference} and escrow instructions are now live.`,
        },
      ],
    };

    setDossiers((prev) => [newDossier, ...prev]);
    setActiveClientRefId(newRefId);
    return newDossier;
  };

  // Sync Floorplan Finish Upgrades to Active Dossier
  const handleSyncUpgradesToDossier = (
    refId: string,
    estateId: string,
    upgradeIds: string[],
    configuredPrice: number
  ) => {
    setDossiers((prev) =>
      prev.map((d) =>
        d.refId === refId
          ? {
              ...d,
              estateId,
              selectedUpgrades: upgradeIds,
              offerAmount: configuredPrice,
              earnestDeposit: Math.round(configuredPrice * 0.1),
            }
          : d
      )
    );
  };

  // Client / Broker Message Handler
  const handleSendMessage = (
    refId: string,
    senderRole: 'client' | 'broker',
    content: string
  ) => {
    setDossiers((prev) =>
      prev.map((d) => {
        if (d.refId !== refId) return d;
        const assignedBroker =
          brokers.find((b) => b.id === d.assignedBrokerId) || brokers[0];
        const senderName =
          senderRole === 'client' ? d.buyerName : assignedBroker.name;
        return {
          ...d,
          messages: [
            ...d.messages,
            {
              id: `msg-${Date.now()}`,
              senderRole,
              senderName,
              timestamp: 'Nov 17, 2026 • Live',
              content,
            },
          ],
        };
      })
    );
  };

  // Countersign Closing Document in Client Vault
  const handleSignDocument = (refId: string, docId: string) => {
    setDossiers((prev) =>
      prev.map((d) =>
        d.refId === refId
          ? {
              ...d,
              documents: d.documents.map((doc) =>
                doc.id === docId
                  ? { ...doc, status: 'Verified & Countersigned' }
                  : doc
              ),
            }
          : d
      )
    );
  };

  // Concierge Inquiry Dispatch -> Routes into Dossier & Broker Inbox
  const handleDispatchConciergeInquiry = (
    refId: string,
    category: string,
    departureFbo: string,
    messageContent: string
  ) => {
    const formatted = `[${category} | ${departureFbo}] ${messageContent}`;
    handleSendMessage(refId, 'client', formatted);
  };

  // Admin ERP Handlers
  const handleUpdateDossierStage = (
    refId: string,
    newStage: EscrowStageNumber
  ) => {
    setDossiers((prev) =>
      prev.map((d) => (d.refId === refId ? advanceEscrowStage(d, newStage) : d))
    );
  };

  const handleUpdateDossierOffer = (refId: string, newOfferAmount: number) => {
    setDossiers((prev) =>
      prev.map((d) =>
        d.refId === refId
          ? {
              ...d,
              offerAmount: newOfferAmount,
              earnestDeposit: Math.round(newOfferAmount * 0.1),
            }
          : d
      )
    );
  };

  const handleUpdateEstateStatus = (
    estateId: string,
    newStatus: EstateStatus
  ) => {
    setEstates((prev) =>
      prev.map((est) =>
        est.id === estateId ? { ...est, status: newStatus } : est
      )
    );
  };

  const handleUpdateEstatePrice = (estateId: string, newPrice: number) => {
    setEstates((prev) =>
      prev.map((est) => {
        if (est.id !== estateId) return est;
        const formattedMillions = formatCurrency(newPrice);
        const updatedTitle = est.title.replace(
          /\(\$[\d,]+\)$/,
          `(${formattedMillions})`
        );
        return {
          ...est,
          price: newPrice,
          title: updatedTitle,
        };
      })
    );
  };

  const handleUpdateViewingStatus = (
    refId: string,
    newStatus: EscrowDossier['ViewingStatus'],
    newDate?: string
  ) => {
    setDossiers((prev) =>
      prev.map((d) =>
        d.refId === refId
          ? {
              ...d,
              ViewingStatus: newStatus,
              requestedViewingDate: newDate || d.requestedViewingDate,
            }
          : d
      )
    );
  };

  const handleAssignBrokerToDossier = (refId: string, brokerId: string) => {
    setDossiers((prev) =>
      prev.map((d) =>
        d.refId === refId ? { ...d, assignedBrokerId: brokerId } : d
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F4FC] text-[#1E1333] relative overflow-x-hidden">
      {/* SOLID ARCHITECTURAL NAVIGATION DOCK (NO GLASS BLUR) */}
      <header className="fixed top-0 inset-x-0 z-[100] bg-[#FFFFFF] border-b-2 border-[#DFD3F5] shadow-[0_4px_0_0_#EDE5FA]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavigatePortal('home')}
            className="font-serif-editorial text-lg sm:text-xl font-bold tracking-tight text-[#1E1333] whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            AURELIA PRIVATE ESTATES
          </button>

          {/* Zone 2: Desktop 6 Portal Navigation Links */}
          <nav
            aria-label="Primary Syndicate Portals"
            className="hidden lg:flex items-center gap-1 py-1"
          >
            {PORTAL_NAV_ITEMS.map((item) => {
              const isActive = activePortal === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigatePortal(item.id)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#5B21B6] text-white shadow-sm'
                      : 'text-[#5C4D7D] hover:text-[#1E1333] hover:bg-[#F2ECFA]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Desktop Primary Action & Mobile Drawer Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleNavigatePortal('client')}
              className="hidden lg:inline-flex px-3.5 py-2 rounded-xl bg-[#2E1065] hover:bg-[#5B21B6] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Escrow Dossier: {activeClientRefId}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close portal navigation menu' : 'Open portal navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F2ECFA] border border-[#DFD3F5] text-[#1E1333] text-xs font-semibold cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-[#5B21B6]" /> : <Menu className="w-4 h-4 text-[#5B21B6]" />}
              <span>Portals</span>
            </button>
          </div>
        </div>

        {/* Mobile Portal Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Syndicate Portals"
            className="lg:hidden border-t border-[#DFD3F5] bg-[#FFFFFF] px-4 py-4 space-y-2 shadow-lg"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PORTAL_NAV_ITEMS.map((item) => {
                const isActive = activePortal === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigatePortal(item.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#5B21B6] text-white'
                        : 'bg-[#F7F4FC] text-[#1E1333] hover:bg-[#EDE5FA]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => handleNavigatePortal('client')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#2E1065] text-white text-xs font-semibold text-center cursor-pointer"
            >
              Escrow Dossier: {activeClientRefId}
            </button>
          </nav>
        )}
      </header>

      {/* MAIN PORTAL VIEWPORT */}
      <main
        className={
          activePortal === 'home'
            ? 'relative z-10 w-full pt-20'
            : 'relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 pt-28'
        }
      >
        {activePortal === 'home' && (
          <HomePortal
            estates={estates}
            onNavigate={handleNavigatePortal}
            onInspectFloorplan={handleInspectFloorplan}
            onScheduleViewingForEstate={handleScheduleViewingForEstate}
          />
        )}

        {activePortal === 'listings' && (
          <ListingsPortal
            estates={estates}
            selectedEstateForBooking={selectedBookingEstateId}
            scrollToBookingForm={scrollToBookingForm}
            onScrollHandled={() => setScrollToBookingForm(false)}
            onInspectFloorplan={handleInspectFloorplan}
            onCreateDossier={handleCreateDossier}
            onOpenClientPortalWithRef={(refId) => {
              setActiveClientRefId(refId);
              handleNavigatePortal('client');
            }}
          />
        )}

        {activePortal === 'floorplans' && (
          <FloorplansPortal
            estates={estates}
            initialEstateId={selectedFloorplanEstateId}
            activeDossierRefId={activeClientRefId}
            onSyncUpgradesToDossier={handleSyncUpgradesToDossier}
            onNavigateToClient={() => handleNavigatePortal('client')}
          />
        )}

        {activePortal === 'client' && (
          <ClientEscrowPortal
            dossiers={dossiers}
            estates={estates}
            brokers={brokers}
            activeRefId={activeClientRefId}
            onSelectRefId={setActiveClientRefId}
            onSendMessage={handleSendMessage}
            onSignDocument={handleSignDocument}
          />
        )}

        {activePortal === 'concierge' && (
          <ConciergePortal
            dossiers={dossiers}
            estates={estates}
            brokers={brokers}
            activeRefId={activeClientRefId}
            onDispatchConciergeInquiry={handleDispatchConciergeInquiry}
            onOpenAdminInbox={() => {
              setAdminInitialTab('inbox');
              handleNavigatePortal('admin');
            }}
          />
        )}

        {activePortal === 'admin' && (
          <AdminErpPortal
            estates={estates}
            dossiers={dossiers}
            brokers={brokers}
            initialTab={adminInitialTab}
            onUpdateDossierStage={handleUpdateDossierStage}
            onUpdateDossierOffer={handleUpdateDossierOffer}
            onUpdateEstateStatus={handleUpdateEstateStatus}
            onUpdateEstatePrice={handleUpdateEstatePrice}
            onUpdateViewingStatus={handleUpdateViewingStatus}
            onAssignBrokerToDossier={handleAssignBrokerToDossier}
            onSendBrokerReply={(refId, content) =>
              handleSendMessage(refId, 'broker', content)
            }
            onInspectInClientPortal={(refId) => {
              setActiveClientRefId(refId);
              handleNavigatePortal('client');
            }}
          />
        )}
      </main>

      {/* QUIET ARCHITECTURAL FOOTER */}
      <footer className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 pb-12">
        <div className="bg-[#FFFFFF] border-2 border-[#DFD3F5] shadow-[0_8px_0_0_#EDE5FA] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-serif-editorial text-2xl font-semibold text-[#1E1333]">
              AURELIA PRIVATE ESTATES
            </div>
            <p className="text-xs text-[#5C4D7D]">
              Ultra-Prime Architectural Residences · 3D LiDAR Floorplan Studio · Sovereign Digital Escrow Syndicate
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#5C4D7D] font-medium">
            {PORTAL_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigatePortal(item.id)}
                className="hover:text-[#5B21B6] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#5C4D7D] tabular-nums">
            © 2026 Aurelia Private Estates Syndicate. Malibu · Trousdale · Manhattan · Aspen.
          </div>
        </div>
      </footer>
    </div>
  );
}
