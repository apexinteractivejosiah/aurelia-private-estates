export type PortalId = 'home' | 'listings' | 'floorplans' | 'client' | 'concierge' | 'admin';

export type EstateStatus = 'Available' | 'In Escrow' | 'Under Contract' | 'Sold';

export type EstateLocation = 'Malibu' | 'Beverly Hills' | 'Manhattan' | 'Aspen';

export interface FloorplanRoom {
  id: string;
  name: string;
  level: string;
  dimensions: string;
  sqFt: number;
  ceilingHeight: string;
  sunlightExposure: string;
  acousticRating: string;
  materialSpec: string;
  svgRect: { x: number; y: number; width: number; height: number };
  labelPos: { x: number; y: number };
}

export interface Estate {
  id: string;
  title: string;
  shortName: string;
  subtitle: string;
  location: EstateLocation;
  address: string;
  price: number;
  sqFt: number;
  bedrooms: number;
  bathrooms: number;
  acreage: string;
  status: EstateStatus;
  imageUrl: string;
  interiorImageUrl: string;
  exteriorCaption: string;
  interiorCaption: string;
  architect: string;
  yearBuilt: number;
  lidarScanId: string;
  helipadCoordinates: string;
  annualLeasePotential: number;
  ArchitecturalHighlights: string[];
  rooms: FloorplanRoom[];
}

export interface FinishUpgrade {
  id: string;
  name: string;
  origin: string;
  category: string;
  priceDelta: number;
  leadTimeWeeks: number;
  description: string;
  sustainabilityNote: string;
}

export type EscrowStageNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface EscrowStageInfo {
  stage: EscrowStageNumber;
  title: string;
  subtitle: string;
  slaRequirement: string;
}

export interface EscrowDocument {
  id: string;
  title: string;
  category: 'Title & Survey' | 'Architectural LiDAR' | 'Financial Escrow' | 'Purchase Covenant';
  status: 'Verified & Countersigned' | 'Awaiting Buyer Signature' | 'In Legal Review';
  updatedAt: string;
  fileSize: string;
}

export interface EscrowMessage {
  id: string;
  senderRole: 'client' | 'broker';
  senderName: string;
  timestamp: string;
  content: string;
}

export interface EscrowDossier {
  refId: string;
  buyerName: string;
  buyerEntity: string;
  buyerEmail: string;
  buyerPhone: string;
  estateId: string;
  offerAmount: number;
  earnestDeposit: number;
  stage: EscrowStageNumber;
  assignedBrokerId: string;
  transportPreference: 'Sikorsky S-76 Helicopter Charter' | 'Maybach Chauffeur Convoy' | 'Private Gulfstream FBO Transfer' | 'Direct On-Site Arrival';
  requestedViewingDate: string;
  ViewingStatus: 'Confirmed' | 'Pending Flight Clearance' | 'Rescheduled' | 'Completed';
  selectedUpgrades: string[];
  createdAt: string;
  documents: EscrowDocument[];
  messages: EscrowMessage[];
  notes: string;
}

export interface BrokerProfile {
  id: string;
  name: string;
  title: string;
  licenseNumber: string;
  phone: string;
  email: string;
  office: string;
  closedVolume: string;
  specialty: string;
  avatarInitials: string;
}

export interface MortgageYieldResult {
  loanAmount: number;
  downPaymentAmount: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTaxAndIns: number;
  totalMonthlyCarryingCost: number;
  grossAnnualRentalIncome: number;
  projectedFiveYearValue: number;
  fiveYearEquityGain: number;
  estimatedNetCapRate: number;
}

export const ESCROW_STAGES: EscrowStageInfo[] = [
  {
    stage: 1,
    title: '1. Private Viewing Confirmed',
    subtitle: 'Aviation flight manifest or private security convoy cleared with estate house manager.',
    slaRequirement: 'NDA & Proof of Liquidity on File',
  },
  {
    stage: 2,
    title: '2. Offer Accepted',
    subtitle: 'Formal Letter of Intent countersigned by selling family office and syndicate counsel.',
    slaRequirement: 'Bilateral LOI Execution',
  },
  {
    stage: 3,
    title: '3. Architectural & Structural Inspection',
    subtitle: 'Millimeter-grade LiDAR verification, geotechnical cliff/foundation audit, and MEP diagnostics.',
    slaRequirement: '72-Hour Engineering Sign-Off',
  },
  {
    stage: 4,
    title: '4. Title & Legal Clearance',
    subtitle: 'Sovereign title insurance policy underwritten with zero encumbrances or coastal/airspace liens.',
    slaRequirement: 'Clean ALTA Extended Policy',
  },
  {
    stage: 5,
    title: '5. Wire Transfer Verified',
    subtitle: 'Escrow settlement funds received via Fedwire / SWIFT into segregated syndicate trust account.',
    slaRequirement: 'Multi-Sig Treasury Confirmation',
  },
  {
    stage: 6,
    title: '6. Deed Recorded & Keys Delivered',
    subtitle: 'Grant deed recorded privately; biometric architectural credentials handed over on site.',
    slaRequirement: 'White-Glove Key Handover',
  },
];

export const FINISH_UPGRADES: FinishUpgrade[] = [
  {
    id: 'calacatta-viola',
    name: 'Calacatta Viola Marble',
    origin: 'Carrara & Apuan Alps, Italy',
    category: 'Monolithic Culinary & Primary Bath Slab',
    priceDelta: 420000,
    leadTimeWeeks: 6,
    description: 'Book-matched 30mm solid Italian brecciated marble slabs with deep cabernet veining across island waterfalls and primary wet room walls.',
    sustainabilityNote: 'Quarried from certified single-block Tuscan heritage extraction.',
  },
  {
    id: 'smoked-european-oak',
    name: 'Smoked European Oak',
    origin: 'Bavarian Forest, Germany',
    category: 'Wide-Plank Architectural Flooring & Millwork',
    priceDelta: 310000,
    leadTimeWeeks: 4,
    description: 'Kiln-smoked 400mm wide-plank heartwood boards treated with raw cold-pressed flaxseed oil and acoustic cork sub-isolation.',
    sustainabilityNote: 'FSC-100% sustainably harvested century-growth timber.',
  },
  {
    id: 'sub-zero-wine-vault',
    name: 'Sub-Zero Wine Vault',
    origin: 'Madison, Wisconsin & Custom Bronze Glazing',
    category: '1,800-Bottle Climate-Controlled Sommelier Gallery',
    priceDelta: 265000,
    leadTimeWeeks: 5,
    description: 'Tri-zone humidity-stabilized structural glass enclosure with UV-filtered bronze mullions, biometric lock, and decanting altar.',
    sustainabilityNote: 'Low-vibration magnetic compressor architecture.',
  },
  {
    id: 'rooftop-spa-deck',
    name: 'Rooftop Spa Deck',
    origin: 'Custom Architectural Marine Engineering',
    category: 'Cantilevered Hydrotherapy & Cold-Plunge Terrace',
    priceDelta: 580000,
    leadTimeWeeks: 8,
    description: 'Zero-edge heated travertine vitality pool, dual cedar infrared sauna cabin, and sunken limestone fire lounge.',
    sustainabilityNote: 'Closed-loop solar-thermal heat exchange recovery.',
  },
];

export const INITIAL_BROKERS: BrokerProfile[] = [
  {
    id: 'broker-1',
    name: 'Julian Vance-Sterling',
    title: 'Senior Managing Partner, Coastal & Trousdale Division',
    licenseNumber: 'DRE #01894412 • Syndicate Principal',
    phone: '+1 (310) 892-4410',
    email: 'j.sterling@aureliaprivate.com',
    office: 'Beverly Hills & Malibu Private Aviation Hangar 4',
    closedVolume: '$1.45B Career Private Volume',
    specialty: 'Coastal Cantilevered Estates & Family Office Blind Trusts',
    avatarInitials: 'JV',
  },
  {
    id: 'broker-2',
    name: 'Camille Laurent-Voss',
    title: 'Managing Director, Manhattan & Alpine Trophy Assets',
    licenseNumber: 'NY DOS #103012994 • CO ER-400918',
    phone: '+1 (212) 918-7704',
    email: 'c.laurent@aureliaprivate.com',
    office: '712 Fifth Avenue Penthouse Suite, New York',
    closedVolume: '$1.18B Career Private Volume',
    specialty: 'Penthouses, Air Rights & Ski-In Sanctuary Acquisitions',
    avatarInitials: 'CL',
  },
  {
    id: 'broker-3',
    name: 'Marcus Thorne-Alverez',
    title: 'Head of Cross-Border Escrow & Sovereign Structuring',
    licenseNumber: 'DRE #01920048 • LL.M Tax Counsel',
    phone: '+1 (970) 429-8831',
    email: 'm.thorne@aureliaprivate.com',
    office: 'Aspen Core & Geneva Private Desk',
    closedVolume: '$820M Career Private Volume',
    specialty: '1031 Sovereign Exchanges & Multi-Jurisdictional Trusts',
    avatarInitials: 'MT',
  },
];

export const INITIAL_ESTATES: Estate[] = [
  {
    id: 'villa-solana',
    title: 'Villa Solana — Cliffside Infinity Pool Residence, Malibu ($18,500,000)',
    shortName: 'Villa Solana',
    subtitle: 'Cliffside Infinity Pool Residence, Malibu',
    location: 'Malibu',
    address: '28410 Pacific Coast Promontory, Malibu, CA 90265',
    price: 18500000,
    sqFt: 11400,
    bedrooms: 6,
    bathrooms: 9,
    acreage: '2.4 Coastal Acres',
    status: 'Available',
    imageUrl: '/assets/estates/villa-solana-exterior.jpg',
    interiorImageUrl: '/assets/estates/villa-solana-interior.jpg',
    exteriorCaption: 'House Exterior — Cliffside White Villa & Cantilevered Pool Terrace',
    interiorCaption: 'House Interior — Sunlit Oceanfront Great Room & Travertine Lounge',
    architect: 'Olson Kundig & Studio Aurelia',
    yearBuilt: 2025,
    lidarScanId: 'LIDAR-MLB-8841-A',
    helipadCoordinates: '34.0259° N, 118.7798° W (CAA Cleared Pad)',
    annualLeasePotential: 1450000,
    ArchitecturalHighlights: [
      '110-foot zero-edge saltwater infinity pool cantilevered over the Pacific bluff',
      'Board-formed architectural concrete and warm travertine thermal mass walls',
      'Motorized 18-foot Vitrocsa invisible glass walls with hurricane-grade glazing',
    ],
    rooms: [
      {
        id: 'vs-great-room',
        name: 'Oceanfront Great Room & Pavilion',
        level: 'Main Promontory Level',
        dimensions: '54\' × 32\'',
        sqFt: 1728,
        ceilingHeight: '16.5 ft Poured Concrete Coffered',
        sunlightExposure: 'South-West Panoramic Sunset Axis (270° Ocean Glare Control)',
        acousticRating: 'STC-64 Marine Wave Attenuation Glazing',
        materialSpec: 'Honed Roman Travertine & Brushed Bronze Reveals',
        svgRect: { x: 40, y: 40, width: 320, height: 180 },
        labelPos: { x: 200, y: 125 },
      },
      {
        id: 'vs-infinity-terrace',
        name: 'Cantilevered Infinity Pool Deck',
        level: 'Main Promontory Level',
        dimensions: '110\' × 28\'',
        sqFt: 3080,
        ceilingHeight: 'Open Sky / 14 ftLouvre Pergola',
        sunlightExposure: 'Full Zenith & Golden Hour Pacific Horizon',
        acousticRating: 'Natural Coastal Surf Ambient',
        materialSpec: 'Flamed Basalt Stone & Zero-Edge Basalt Weir',
        svgRect: { x: 40, y: 235, width: 520, height: 125 },
        labelPos: { x: 300, y: 295 },
      },
      {
        id: 'vs-culinary',
        name: 'Sculpted Bronze Culinary Wing',
        level: 'Main Promontory Level',
        dimensions: '34\' × 24\'',
        sqFt: 816,
        ceilingHeight: '14.0 ft Smoked Oak Slat',
        sunlightExposure: 'East Morning Courtyard Light + South Ocean Sightline',
        acousticRating: 'STC-58 Whisper-Quiet Prep Kitchen Isolation',
        materialSpec: 'Gaggenau 400 Series & Monolithic Stone Island',
        svgRect: { x: 375, y: 40, width: 185, height: 180 },
        labelPos: { x: 467, y: 125 },
      },
      {
        id: 'vs-primary-suite',
        name: 'Primary Cliffside Sanctuary Suite',
        level: 'Upper Private Wing',
        dimensions: '42\' × 28\'',
        sqFt: 1176,
        ceilingHeight: '13.5 ft Warm Plaster Vault',
        sunlightExposure: 'West-South-West Sunset & Catalina Island View',
        acousticRating: 'STC-68 Studio-Grade Acoustic Enclave',
        materialSpec: 'Venetian Marmorino Plaster & Dual Onyx Wet Room',
        svgRect: { x: 575, y: 40, width: 185, height: 200 },
        labelPos: { x: 667, y: 135 },
      },
      {
        id: 'vs-wellness-vault',
        name: 'Subterranean Wine & Cinema Gallery',
        level: 'Lower Bedrock Level',
        dimensions: '38\' × 22\'',
        sqFt: 836,
        ceilingHeight: '12.0 ft Acoustic Fabric Coffer',
        sunlightExposure: 'Controlled Museum Fiber-Optic 2700K Illumination',
        acousticRating: 'STC-72 Dolby Reference Screening Isolation',
        materialSpec: 'Raw Limestone Bedrock Wall & Smoked Bronze Racking',
        svgRect: { x: 575, y: 255, width: 185, height: 105 },
        labelPos: { x: 667, y: 305 },
      },
    ],
  },
  {
    id: 'glass-pavilion',
    title: 'The Glass Pavilion — Beverly Hills Trousdale ($24,900,000)',
    shortName: 'The Glass Pavilion',
    subtitle: 'Beverly Hills Trousdale',
    location: 'Beverly Hills',
    address: '1108 Loma Vista Drive, Trousdale Estates, Beverly Hills, CA 90210',
    price: 24900000,
    sqFt: 14200,
    bedrooms: 7,
    bathrooms: 11,
    acreage: '1.15 Promontory Acres',
    status: 'Available',
    imageUrl: '/assets/estates/glass-pavilion-exterior.jpg',
    interiorImageUrl: '/assets/estates/glass-pavilion-interior.jpg',
    exteriorCaption: 'House Exterior — Beverly Hills Trousdale Glass & Courtyard Facade',
    interiorCaption: 'House Interior — Double-Volume Atrium & Floating Timber Gallery',
    architect: 'SAOTA & Marmol Radziner',
    yearBuilt: 2026,
    lidarScanId: 'LIDAR-BH-9021-T',
    helipadCoordinates: '34.0981° N, 118.3965° W (Private Motorcourt & Van Nuys Heli-Link)',
    annualLeasePotential: 1920000,
    ArchitecturalHighlights: [
      'Unobstructed 300-degree jetliner views from Downtown Los Angeles to the Pacific Ocean',
      'Single-story Trousdale horizontal silhouette with 16-foot structural low-iron glass walls',
      '12-car subterranean museum gallery with hydraulic turntable and biometric vault',
    ],
    rooms: [
      {
        id: 'gp-atrium',
        name: 'Central Glass Atrium & Reflecting Gallery',
        level: 'Single-Story Trousdale Horizon',
        dimensions: '62\' × 34\'',
        sqFt: 2108,
        ceilingHeight: '16.0 ft Cantilevered Steel & Limestone',
        sunlightExposure: '360° Clerestory Diffused Zenith Daylight',
        acousticRating: 'STC-65 Triple-Laminated Low-Iron Glass',
        materialSpec: 'Book-Matched Silver Travertine & Brushed Brass Columns',
        svgRect: { x: 40, y: 40, width: 350, height: 190 },
        labelPos: { x: 215, y: 130 },
      },
      {
        id: 'gp-motorcourt',
        name: '12-Car Subterranean Collector Auto Gallery',
        level: 'Gallery Vault Level',
        dimensions: '68\' × 30\'',
        sqFt: 2040,
        ceilingHeight: '13.0 ft Illuminated Barrisol Ceiling',
        sunlightExposure: 'Skylit Water Oculi + Museum CRI-98 Framing',
        acousticRating: 'STC-70 Vibration-Damped Post-Tension Slab',
        materialSpec: 'Polished Basaltina & Anodized Bronze Turntable',
        svgRect: { x: 40, y: 245, width: 350, height: 115 },
        labelPos: { x: 215, y: 300 },
      },
      {
        id: 'gp-primary-wing',
        name: 'Trousdale Jetliner Primary Wing',
        level: 'Single-Story Trousdale Horizon',
        dimensions: '48\' × 30\'',
        sqFt: 1440,
        ceilingHeight: '15.0 ft Floating Walnut Plane',
        sunlightExposure: 'South-West Century City & Ocean Horizon Axis',
        acousticRating: 'STC-68 Blackout Motorized Silk Drapery Cavity',
        materialSpec: 'Custom Suede Wall Panels & Dual Calacatta Hammam',
        svgRect: { x: 405, y: 40, width: 355, height: 155 },
        labelPos: { x: 582, y: 115 },
      },
      {
        id: 'gp-culinary-pavilion',
        name: 'Chef’s Show Kitchen & Formal Loggia',
        level: 'Single-Story Trousdale Horizon',
        dimensions: '46\' × 26\'',
        sqFt: 1196,
        ceilingHeight: '15.0 ft Seamless Indoor-Outdoor Soffit',
        sunlightExposure: 'South Pool Reflection & Sunset Glow',
        acousticRating: 'STC-60 Dual-Kitchen Service Partition',
        materialSpec: 'Boffi Custom Bronze System & Travertine Monolith',
        svgRect: { x: 405, y: 210, width: 355, height: 150 },
        labelPos: { x: 582, y: 285 },
      },
    ],
  },
  {
    id: 'aurelia-penthouse',
    title: 'Aurelia Penthouse — Double-Height Great Room, Manhattan ($14,200,000)',
    shortName: 'Aurelia Penthouse',
    subtitle: 'Double-Height Great Room, Manhattan',
    location: 'Manhattan',
    address: '740 Park & 61st Street Sky Crown, Penthouse A, New York, NY 10065',
    price: 14200000,
    sqFt: 6850,
    bedrooms: 5,
    bathrooms: 6,
    acreage: '1,900 Sq Ft Private Sky Loggia',
    status: 'In Escrow',
    imageUrl: '/assets/estates/aurelia-penthouse-exterior.jpg',
    interiorImageUrl: '/assets/estates/aurelia-penthouse-interior.jpg',
    exteriorCaption: 'House Exterior — Multi-Level Architectural Villa & Illuminated Terraces',
    interiorCaption: 'House Interior — Double-Height Formal Salon & Floor-to-Ceiling Glass',
    architect: 'Foster + Partners & Gilles & Boissier',
    yearBuilt: 2025,
    lidarScanId: 'LIDAR-NYC-7401-PH',
    helipadCoordinates: '40.7644° N, 73.9680° W (East 34th Heliport 7-Min Blade Transfer)',
    annualLeasePotential: 1080000,
    ArchitecturalHighlights: [
      '24-foot double-height great room overlooking Central Park South and Midtown skyline',
      'Private high-speed key-locked elevator vestibule finished in hand-rubbed bronze',
      'Wrap-around heated limestone sky terrace with outdoor wood-burning hearth',
    ],
    rooms: [
      {
        id: 'ap-great-room',
        name: 'Double-Height Central Park Salon',
        level: '82nd Floor Sky Level',
        dimensions: '48\' × 28\'',
        sqFt: 1344,
        ceilingHeight: '24.0 ft Double-Height Architectural Glass',
        sunlightExposure: 'North Central Park Canopy & West Hudson Sunset',
        acousticRating: 'STC-66 Manhattan Sky-Quiet Triple Glazing',
        materialSpec: 'French Chevron Oak & Carved Limestone Fireplace',
        svgRect: { x: 40, y: 40, width: 370, height: 200 },
        labelPos: { x: 225, y: 135 },
      },
      {
        id: 'ap-sky-terrace',
        name: 'Wrap-Around Heated Limestone Sky Loggia',
        level: '82nd Floor Perimeter',
        dimensions: '95\' × 20\'',
        sqFt: 1900,
        ceilingHeight: 'Open Air / Wind-Baffled Glass Parapet',
        sunlightExposure: '270° Unobstructed Manhattan Skyline Exposure',
        acousticRating: 'High-Altitude Acoustic Serenity',
        materialSpec: 'Radiant-Heated Indiana Limestone & Bronze Planters',
        svgRect: { x: 40, y: 255, width: 720, height: 105 },
        labelPos: { x: 400, y: 305 },
      },
      {
        id: 'ap-library-dining',
        name: 'Formal Dining & Collector’s Art Library',
        level: '82nd Floor Sky Level',
        dimensions: '32\' × 22\'',
        sqFt: 704,
        ceilingHeight: '14.0 ft Coffered Plaster',
        sunlightExposure: 'East River Morning Illumination',
        acousticRating: 'STC-62 Gallery Climate & Humidity Lock',
        materialSpec: 'Smoked Eucalyptus Millwork & Silk Wallcovering',
        svgRect: { x: 425, y: 40, width: 165, height: 200 },
        labelPos: { x: 507, y: 135 },
      },
      {
        id: 'ap-primary-mezzanine',
        name: 'Mezzanine Primary Penthouse Suite',
        level: '83rd Floor Crown Level',
        dimensions: '38\' × 26\'',
        sqFt: 988,
        ceilingHeight: '12.5 ft Vaulted Sky Lit',
        sunlightExposure: 'South Empire State & Reservoir Views',
        acousticRating: 'STC-70 Private Floating Floor Slab',
        materialSpec: 'Loro Piana Cashmere Wall Panels & Onyx Bath',
        svgRect: { x: 605, y: 40, width: 155, height: 200 },
        labelPos: { x: 682, y: 135 },
      },
    ],
  },
  {
    id: 'meadowbrook-sanctuary',
    title: 'Meadowbrook Sanctuary — Bespoke Marble Culinary Wing, Aspen ($16,800,000)',
    shortName: 'Meadowbrook Sanctuary',
    subtitle: 'Bespoke Marble Culinary Wing, Aspen',
    location: 'Aspen',
    address: '490 Red Mountain Ranch Road, Aspen, CO 81611',
    price: 16800000,
    sqFt: 9600,
    bedrooms: 6,
    bathrooms: 8,
    acreage: '4.8 Alpine Meadow Acres',
    status: 'Available',
    imageUrl: '/assets/estates/meadowbrook-exterior.jpg',
    interiorImageUrl: '/assets/estates/meadowbrook-interior.jpg',
    exteriorCaption: 'House Exterior — Aspen Alpine Timber, Stone & Glass Sanctuary',
    interiorCaption: 'House Interior — Bespoke Marble Culinary Wing & Open Dining Hall',
    architect: 'Studio B Architecture & Vincent Van Duysen',
    yearBuilt: 2025,
    lidarScanId: 'LIDAR-ASP-4902-RM',
    helipadCoordinates: '39.2083° N, 106.8175° W (ASE Private FBO 6-Min Convoy)',
    annualLeasePotential: 1380000,
    ArchitecturalHighlights: [
      'Bespoke monolithic Italian marble culinary wing with dual cantilevered islands',
      'Geothermal snow-melt driveway, terraces, and private ski-prep locker room',
      'Direct Continental Divide and Ajax Mountain sightlines through 15-foot bronze portals',
    ],
    rooms: [
      {
        id: 'ms-culinary-wing',
        name: 'Bespoke Marble Culinary & Dining Wing',
        level: 'Main Alpine Ridge Level',
        dimensions: '52\' × 28\'',
        sqFt: 1456,
        ceilingHeight: '15.5 ft Reclaimed Douglas Fir & Bronze',
        sunlightExposure: 'South-West Ajax Mountain & Aspen Sun Exposure',
        acousticRating: 'STC-62 Acoustic Timber Baffle Ceiling',
        materialSpec: 'Monolithic Book-Matched Marble & Custom La Cornue Range',
        svgRect: { x: 40, y: 40, width: 380, height: 195 },
        labelPos: { x: 230, y: 135 },
      },
      {
        id: 'ms-alpine-hearth',
        name: 'Great Hearth Salon & Continental Divide Lounge',
        level: 'Main Alpine Ridge Level',
        dimensions: '44\' × 30\'',
        sqFt: 1320,
        ceilingHeight: '18.0 ft Cantilevered Steel Roof',
        sunlightExposure: 'Full Southern Winter Solar Gain Axis',
        acousticRating: 'STC-66 Triple-Pane Argon Alpine Glazing',
        materialSpec: 'Dry-Stacked Colorado Quartzite & Brushed Bronze',
        svgRect: { x: 435, y: 40, width: 325, height: 195 },
        labelPos: { x: 597, y: 135 },
      },
      {
        id: 'ms-ski-apresspa',
        name: 'Private Ski Room & Geothermal Onsen Spa',
        level: 'Lower Meadow Walk-Out',
        dimensions: '46\' × 24\'',
        sqFt: 1104,
        ceilingHeight: '12.5 ft Cedar & Honed Granite',
        sunlightExposure: 'West Roaring Fork Valley Alpenglow',
        acousticRating: 'STC-64 Hydro-Isolated Relaxation Sanctuary',
        materialSpec: 'Hinoki Cypress Soaking Tub & Heated Boot Lockers',
        svgRect: { x: 40, y: 250, width: 380, height: 110 },
        labelPos: { x: 230, y: 305 },
      },
      {
        id: 'ms-primary-sanctuary',
        name: 'Red Mountain Primary Suite & Oxygen Lounge',
        level: 'East Private Ridge Wing',
        dimensions: '40\' × 26\'',
        sqFt: 1040,
        ceilingHeight: '14.0 ft Sea-Level Oxygen-Enriched Suite',
        sunlightExposure: 'East Independence Pass Sunrise & South Peak View',
        acousticRating: 'STC-70 Whisper-Silent Altitude Oxygen System',
        materialSpec: 'Belgian Linen Plaster & Heated Travertine Slabs',
        svgRect: { x: 435, y: 250, width: 325, height: 110 },
        labelPos: { x: 597, y: 305 },
      },
    ],
  },
];

export const INITIAL_DOSSIERS: EscrowDossier[] = [
  {
    refId: 'APE-7710',
    buyerName: 'Lord Henrik Von Berg & Family Office',
    buyerEntity: 'Nordic Crown Holdings LLC (Delaware / Zurich)',
    buyerEmail: 'h.vonberg@nordiccrown.ch',
    buyerPhone: '+41 44 580 22 19',
    estateId: 'aurelia-penthouse',
    offerAmount: 14200000,
    earnestDeposit: 1420000,
    stage: 3,
    assignedBrokerId: 'broker-2',
    transportPreference: 'Sikorsky S-76 Helicopter Charter',
    requestedViewingDate: '2026-11-22 • 14:30 EST',
    ViewingStatus: 'Confirmed',
    selectedUpgrades: ['calacatta-viola', 'sub-zero-wine-vault'],
    createdAt: '2026-11-10',
    notes: 'Structural LiDAR inspection in progress on 82nd floor terrace parapet; family office counsel cleared preliminary title report.',
    documents: [
      {
        id: 'doc-101',
        title: 'Bilateral Letter of Intent & Sovereign NDA',
        category: 'Purchase Covenant',
        status: 'Verified & Countersigned',
        updatedAt: 'Nov 11, 2026',
        fileSize: '4.2 MB PDF',
      },
      {
        id: 'doc-102',
        title: 'UBS Zurich Proof of Liquidity ($25M Credit Line)',
        category: 'Financial Escrow',
        status: 'Verified & Countersigned',
        updatedAt: 'Nov 12, 2026',
        fileSize: '1.8 MB PDF',
      },
      {
        id: 'doc-103',
        title: 'Millimeter-Grade 3D LiDAR Structural Audit (LIDAR-NYC-7401-PH)',
        category: 'Architectural LiDAR',
        status: 'In Legal Review',
        updatedAt: 'Nov 16, 2026',
        fileSize: '28.4 MB DWG/PDF',
      },
      {
        id: 'doc-104',
        title: 'ALTA Extended Air-Rights & Condominium Title Policy',
        category: 'Title & Survey',
        status: 'Awaiting Buyer Signature',
        updatedAt: 'Nov 17, 2026',
        fileSize: '6.1 MB PDF',
      },
    ],
    messages: [
      {
        id: 'msg-1',
        senderRole: 'broker',
        senderName: 'Camille Laurent-Voss',
        timestamp: 'Nov 15, 2026 • 09:40 EST',
        content: 'Good morning Henrik. The 10% earnest deposit ($1,420,000) is locked in our segregated JP Morgan Private Escrow vault. Our structural engineer has uploaded the preliminary LiDAR scan of the 82nd-floor terrace.',
      },
      {
        id: 'msg-2',
        senderRole: 'client',
        senderName: 'Lord Henrik Von Berg',
        timestamp: 'Nov 16, 2026 • 16:15 EST',
        content: 'Thank you Camille. Please confirm if the Calacatta Viola marble slab reservation and the 1,800-bottle Sub-Zero wine vault can be integrated prior to the December 15 deed recording.',
      },
      {
        id: 'msg-3',
        senderRole: 'broker',
        senderName: 'Camille Laurent-Voss',
        timestamp: 'Nov 17, 2026 • 08:20 EST',
        content: 'Confirmed. Our Italian stone fabricator in Carrara has earmarked Block #CV-409 for your penthouse, and installation is scheduled immediately following Stage 4 Title Clearance.',
      },
    ],
  },
  {
    refId: 'APE-6420',
    buyerName: 'Elena Rostova-Chen',
    buyerEntity: 'Pacific Horizon Ventures LP',
    buyerEmail: 'elena@pacifichorizon.vc',
    buyerPhone: '+1 (310) 904-1182',
    estateId: 'villa-solana',
    offerAmount: 18500000,
    earnestDeposit: 1850000,
    stage: 2,
    assignedBrokerId: 'broker-1',
    transportPreference: 'Sikorsky S-76 Helicopter Charter',
    requestedViewingDate: '2026-11-20 • 16:00 PST (Sunset Axis)',
    ViewingStatus: 'Confirmed',
    selectedUpgrades: ['smoked-european-oak', 'rooftop-spa-deck'],
    createdAt: '2026-11-14',
    notes: 'Sunset helicopter approach approved for Malibu Promontory Pad. Offer accepted with bespoke Rooftop Spa Deck addendum.',
    documents: [
      {
        id: 'doc-201',
        title: 'Malibu Coastal Commission Helipad & Bluff Clearance',
        category: 'Title & Survey',
        status: 'Verified & Countersigned',
        updatedAt: 'Nov 14, 2026',
        fileSize: '9.4 MB PDF',
      },
      {
        id: 'doc-202',
        title: 'Executed Purchase Agreement & Escrow Instructions',
        category: 'Purchase Covenant',
        status: 'Verified & Countersigned',
        updatedAt: 'Nov 15, 2026',
        fileSize: '5.7 MB PDF',
      },
      {
        id: 'doc-203',
        title: 'Coastal Geotechnical Caisson & Infinity Pool LiDAR Report',
        category: 'Architectural LiDAR',
        status: 'Awaiting Buyer Signature',
        updatedAt: 'Nov 17, 2026',
        fileSize: '34.1 MB PDF',
      },
    ],
    messages: [
      {
        id: 'msg-201',
        senderRole: 'broker',
        senderName: 'Julian Vance-Sterling',
        timestamp: 'Nov 16, 2026 • 11:10 PST',
        content: 'Welcome to the Aurelia Private Escrow Portal, Elena. Your Stage 2 Offer Acceptance is complete for Villa Solana. Flight manifest for Friday’s sunset architectural walkthrough is confirmed from Van Nuys Hangar 4.',
      },
      {
        id: 'msg-202',
        senderRole: 'client',
        senderName: 'Elena Rostova-Chen',
        timestamp: 'Nov 16, 2026 • 18:05 PST',
        content: 'Wonderful, Julian. My coastal engineer will join us on the Sikorsky charter to inspect the cantilevered infinity pool caissons.',
      },
    ],
  },
];

export function calculateConfiguredEstatePrice(
  basePrice: number,
  selectedUpgradeIds: string[],
  upgrades: FinishUpgrade[] = FINISH_UPGRADES
): { basePrice: number; upgradesTotal: number; totalAcquisitionPrice: number; totalLeadTimeWeeks: number } {
  const chosen = upgrades.filter((u) => selectedUpgradeIds.includes(u.id));
  const upgradesTotal = chosen.reduce((acc, item) => acc + item.priceDelta, 0);
  const totalLeadTimeWeeks = chosen.reduce((max, item) => Math.max(max, item.leadTimeWeeks), 0);
  return {
    basePrice,
    upgradesTotal,
    totalAcquisitionPrice: basePrice + upgradesTotal,
    totalLeadTimeWeeks,
  };
}

export function calculateMortgageAndYield(
  purchasePrice: number,
  downPaymentPercent: number,
  interestRateAnnual: number = 5.25,
  annualAppreciationPercent: number = 6.8,
  monthlyLeaseEstimate: number = 125000
): MortgageYieldResult {
  const clampedDownPct = Math.min(100, Math.max(0, downPaymentPercent));
  const downPaymentAmount = Math.round(purchasePrice * (clampedDownPct / 100));
  const loanAmount = Math.max(0, purchasePrice - downPaymentAmount);

  const monthlyRate = interestRateAnnual / 100 / 12;
  const totalMonths = 360; // 30-year jumbo private banking facility

  let monthlyPrincipalAndInterest = 0;
  if (loanAmount > 0) {
    if (monthlyRate === 0) {
      monthlyPrincipalAndInterest = Math.round(loanAmount / totalMonths);
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      monthlyPrincipalAndInterest = Math.round((loanAmount * (monthlyRate * factor)) / (factor - 1));
    }
  }

  // Annual property tax (~1.15%) + private Chubb/Lloyd's estate insurance (~0.35%) = 1.5% annually
  const monthlyPropertyTaxAndIns = Math.round((purchasePrice * 0.015) / 12);
  const totalMonthlyCarryingCost = monthlyPrincipalAndInterest + monthlyPropertyTaxAndIns;

  const grossAnnualRentalIncome = Math.round(monthlyLeaseEstimate * 12);
  const projectedFiveYearValue = Math.round(
    purchasePrice * Math.pow(1 + annualAppreciationPercent / 100, 5)
  );
  const fiveYearEquityGain = projectedFiveYearValue - purchasePrice;

  // Net operating income after property tax/insurance & maintenance (~20% of gross lease)
  const netAnnualOperatingIncome = Math.max(0, grossAnnualRentalIncome * 0.8 - monthlyPropertyTaxAndIns * 12);
  const estimatedNetCapRate =
    purchasePrice > 0 ? Number(((netAnnualOperatingIncome / purchasePrice) * 100).toFixed(2)) : 0;

  return {
    loanAmount,
    downPaymentAmount,
    monthlyPrincipalAndInterest,
    monthlyPropertyTaxAndIns,
    totalMonthlyCarryingCost,
    grossAnnualRentalIncome,
    projectedFiveYearValue,
    fiveYearEquityGain,
    estimatedNetCapRate,
  };
}

export function filterEstates(
  estates: Estate[],
  locationFilter: EstateLocation | 'All',
  priceBandFilter: 'All' | 'Under $18M' | '$18M – $22M' | 'Over $22M',
  statusFilter: EstateStatus | 'All',
  searchQuery: string = ''
): Estate[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return estates.filter((estate) => {
    if (locationFilter !== 'All' && estate.location !== locationFilter) {
      return false;
    }
    if (statusFilter !== 'All' && estate.status !== statusFilter) {
      return false;
    }
    if (priceBandFilter === 'Under $18M' && estate.price >= 18000000) {
      return false;
    }
    if (priceBandFilter === '$18M – $22M' && (estate.price < 18000000 || estate.price > 22000000)) {
      return false;
    }
    if (priceBandFilter === 'Over $22M' && estate.price <= 22000000) {
      return false;
    }
    if (normalizedQuery) {
      const hay = `${estate.title} ${estate.location} ${estate.architect} ${estate.address}`.toLowerCase();
      if (!hay.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });
}

export function generatePortfolioRefId(existingIds: string[], explicitNumber?: number): string {
  const baseNum = explicitNumber ?? 7741 + existingIds.length * 17;
  let candidate = `APE-${baseNum}`;
  let offset = 1;
  while (existingIds.includes(candidate)) {
    candidate = `APE-${baseNum + offset}`;
    offset += 1;
  }
  return candidate;
}

export function advanceEscrowStage(
  dossier: EscrowDossier,
  targetStage: EscrowStageNumber
): EscrowDossier {
  const clamped = Math.min(6, Math.max(1, targetStage)) as EscrowStageNumber;
  return {
    ...dossier,
    stage: clamped,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
