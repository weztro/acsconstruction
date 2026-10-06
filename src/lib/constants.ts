export interface BrandConfig {
  name: string;
  tagline: string;
  siteUrl: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  workingHours: string;
  socials: {
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
  };
  builtBy?: {
    name: string;
    url?: string;
  };
}

export const BRAND: BrandConfig = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "ACS Construction",
  tagline:
    process.env.NEXT_PUBLIC_BRAND_TAGLINE ||
    "Building Homes. Creating Legacies.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://acsconstruction.vercel.app",
  phone: process.env.COMPANY_PHONE || "+91 94869 43652",
  email: process.env.COMPANY_EMAIL || "contact@acsconstruction.in",
  address:
    process.env.COMPANY_ADDRESS ||
    "No.7/114, Sankarankovil Main Road, Pandiyapuram, Tenkasi, Tamil Nadu 627857",
  whatsappNumber: process.env.WHATSAPP_NUMBER || "916382995103",
  workingHours: "Monday – Saturday: 9:30 AM – 6:30 PM (IST)",
  socials: {
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
      "https://instagram.com/sthapatidesign",
    facebook:
      process.env.NEXT_PUBLIC_FACEBOOK_URL ||
      "https://facebook.com/sthapatidesign",
    youtube:
      process.env.NEXT_PUBLIC_YOUTUBE_URL ||
      "https://youtube.com/@sthapatidesign",
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_URL ||
      "https://linkedin.com/company/sthapatidesign",
  },
  builtBy: {
    name: process.env.NEXT_PUBLIC_BUILT_BY_NAME || "Weztro",
    url: process.env.NEXT_PUBLIC_BUILT_BY_URL || "",
  },
};

export const NAVIGATION_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Process", href: "/process" },
  { name: "Contact", href: "/contact" },
];

export const TRUST_STATS = [
  {
    value: "100%",
    label: "Architectural Focus",
    description: "Bespoke residential designs crafted for Indian family lifestyles.",
  },
  {
    value: "45-Pt",
    label: "Quality Audit",
    description: "Rigorous structural checks, soil analysis, and grade testing.",
  },
  {
    value: "10-Yr",
    label: "Structural Stability",
    description: "Engineered with primary steel and high-grade certified concrete.",
  },
  {
    value: "Fixed",
    label: "Timeline Guarantee",
    description: "Milestone-backed schedules with transparent BOQ accounting.",
  },
];

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  features: string[];
  deliverables: string[];
}

export const SERVICES: ServiceItem[] = [
  {
    id: "architectural-design",
    title: "Architectural Design",
    shortDesc: "House plans, elevations, 3D visualizations, and climate-responsive concepts.",
    fullDesc:
      "Crafting bespoke residential blueprints rooted in Indian family lifestyle, natural light orientation, cross-ventilation, and Vastu principles harmonized with modern aesthetics.",
    iconName: "Compass",
    features: [
      "Custom 2D/3D floor layouts & structural drawings",
      "Elevation treatments with terracotta, stone, and jali details",
      "Vastu-compliant spatial zoning",
      "Sun-path and wind analysis for natural passive cooling",
    ],
    deliverables: ["Architectural CAD Sets", "3D Photorealistic Renders", "Structural Drawings", "Material Specifications"],
  },
  {
    id: "house-construction",
    title: "House Construction",
    shortDesc: "Complete residential construction with uncompromising engineering integrity.",
    fullDesc:
      "Full-cycle civil construction from deep foundation excavation to RCC frame and solid masonry, supervised on-site daily by qualified structural engineers.",
    iconName: "Hammer",
    features: [
      "Tata Tiscon Fe 550D TMT steel and Ultratech 53-grade cement",
      "Anti-termite treatment with 10-year warranty",
      "Curing protocols with automated pressure systems",
      "Seismic zone resistance compliance",
    ],
    deliverables: ["Civil RCC Structure", "Solid Masonry Walls", "Waterproofing Certificates", "Quality Inspection Reports"],
  },
  {
    id: "turnkey-construction",
    title: "Turnkey Construction",
    shortDesc: "End-to-end project execution from soil testing to the key handover.",
    fullDesc:
      "Our hallmark stress-free model. We manage government approvals, architectural blueprints, procurement, civil construction, interior joinery, electricals, plumbing, and deep cleaning.",
    iconName: "KeyRound",
    features: [
      "Single point of contact and guaranteed timeline commitment",
      "Fixed-price contract with transparent bill of quantities (BOQ)",
      "Dedicated mobile milestone tracking for homeowners",
      "Comprehensive handover file with as-built drawings and warranties",
    ],
    deliverables: ["Turnkey Move-in Ready Home", "All Sanctions & Permissions", "Appliance & Fixture Warranties", "Handover Certificate"],
  },
  {
    id: "interior-design",
    title: "Interior Design",
    shortDesc: "Functional, warm, and tactile interior spaces inspired by Indian craft.",
    fullDesc:
      "Warm wooden elements, brass hardware, bespoke pooja room sanctuaries, modular kitchens designed for rigorous Indian cooking, and serene courtyard seating.",
    iconName: "Armchair",
    features: [
      "Solid teak, rosewood, and marine-grade BWR plywood cabinetry",
      "Handcrafted brass and bronze hardware detailing",
      "Heavy-duty chimney ventilation and wet kitchen layouts",
      "Custom lighting schemes highlighting textured stone walls",
    ],
    deliverables: ["Interior Layout Drawings", "Custom Carpentry & Wardrobes", "Modular Kitchen Setup", "Lighting & Ceiling Design"],
  },
  {
    id: "renovation-remodeling",
    title: "Renovation & Remodeling",
    shortDesc: "Transform existing structures into vibrant, contemporary living spaces.",
    fullDesc:
      "Preserving the soul of ancestral homes while reinforcing structural foundations, retrofitting modern plumbing and electrical conduits, and opening up dark floor plans.",
    iconName: "Sparkles",
    features: [
      "Structural retrofitting and load-bearing wall modifications",
      "Restoration of heritage woodwork, Mangalore tiles, and columns",
      "Energy-efficient modern window systems and waterproofing",
      "Expansion of living areas and vertical floor additions",
    ],
    deliverables: ["Retrofitting Blueprints", "Restored Structural Components", "Modernized MEP Systems", "Modernized Living Zones"],
  },
  {
    id: "structural-engineering",
    title: "Structural & Engineering",
    shortDesc: "Structural analysis, foundation design, and civil engineering verification.",
    fullDesc:
      "Deep soil stratigraphy testing, pile/raft foundation calculations, load distribution simulations, and RCC detailing for structures built to withstand generations.",
    iconName: "ShieldCheck",
    features: [
      "Standard Penetration Test (SPT) and soil bearing capacity profiling",
      "ETABS structural modeling and earthquake load analysis",
      "Precision bar bending schedules (BBS)",
      "Strict slump and cube compressive strength testing at 7, 14, 28 days",
    ],
    deliverables: ["Soil Investigation Report", "Structural Stability Certificate", "RCC Detailing Drawings", "Cube Test Records"],
  },
];

export interface DesignStyle {
  id: string;
  title: string;
  tagline: string;
  description: string;
  keyElements: string[];
  imageUrl: string;
}

export const INDIAN_DESIGN_STYLES: DesignStyle[] = [
  {
    id: "modern-indian",
    title: "Modern Indian",
    tagline: "Contemporary aesthetics infused with vernacular warmth.",
    description:
      "Clean geometric lines balanced by warm terracotta louvers, exposed brickwork, and brass accents tailored for the modern Indian family.",
    keyElements: ["Exposed Brick Jali", "Cantilevered Balconies", "Teak Louvers", "Open Family Living"],
    imageUrl: "/images/architecture/modern-indian.jpg",
  },
  {
    id: "traditional-heritage",
    title: "Traditional Heritage",
    tagline: "Timeless craftsmanship inspired by ancestral homes.",
    description:
      "Sloped roofs with clay Mangalore tiles, hand-carved solid timber pillars, Athangudi floor tiles, and shaded thinnai verandahs.",
    keyElements: ["Carved Wood Pillars", "Mangalore Clay Tiles", "Athangudi Tiles", "Thinnai Verandah"],
    imageUrl: "/images/architecture/traditional-heritage.jpg",
  },
  {
    id: "contemporary-villa",
    title: "Contemporary Villa",
    tagline: "Expansive luxury designed for light and private greenery.",
    description:
      "Double-height living spaces, floor-to-ceiling glass connecting to landscaped perimeter courts, polished granite floors, and floating staircases.",
    keyElements: ["Double Height Ceilings", "Pocket Courtyards", "Rough-cut Granite", "Floor-to-Ceiling Glazing"],
    imageUrl: "/images/architecture/contemporary-villa.jpg",
  },
  {
    id: "kerala-inspired",
    title: "Kerala Inspired",
    tagline: "Rain-responsive architecture with central Nalukettu courtyards.",
    description:
      "Steep gable roofs designed for tropical monsoon showers, wooden Charupadi seating benches, exposed laterite stone masonry, and natural passive ventilation.",
    keyElements: ["Nalukettu Courtyard", "Charupadi Benches", "Laterite Stone", "Steep Gables"],
    imageUrl: "/images/architecture/kerala-inspired.jpg",
  },
  {
    id: "south-indian",
    title: "Chettinad & South Indian",
    tagline: "Gracious proportions and monumental pillared corridors.",
    description:
      "Symmetrical axial planning, Burma teak doors with heavy brass studs, cool lime-plastered walls, and expansive dining verandahs.",
    keyElements: ["Carved Teak Doorways", "Brass Fixture Studs", "Granite Thresholds", "Symmetrical Corridors"],
    imageUrl: "/images/architecture/south-indian.jpg",
  },
  {
    id: "minimal-modern",
    title: "Minimal Modern",
    tagline: "Raw materials, meditative silence, and purposeful simplicity.",
    description:
      "Honest expression of cast concrete, local Kadappa slate, internal bamboo light wells, and uncluttered monolithic volumes.",
    keyElements: ["Board-formed Concrete", "Kadappa Stone Floors", "Zen Water Courts", "Frameless Windows"],
    imageUrl: "/images/architecture/minimal-modern.jpg",
  },
];

export interface Project {
  slug: string;
  name: string;
  style: string;
  category: string;
  location: string;
  builtUpArea: string;
  plotSize: string;
  year: string;
  timeline: string;
  headline: string;
  description: string;
  featured: boolean;
  heroImage: string;
  gallery: string[];
  clientBrief: string;
  materials: string[];
  highlights: string[];
  floorPlanConcept: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "courtyard-residence",
    name: "The Courtyard Residence",
    style: "Modern Indian with Central Nadumuttam",
    category: "Courtyard Homes",
    location: "Kanakapura Road, Bengaluru",
    builtUpArea: "4,850 sq.ft.",
    plotSize: "60 x 80 ft (East Facing)",
    year: "2025",
    timeline: "14 Months (Turnkey)",
    headline: "Modern architecture inspired by traditional Indian courtyard homes.",
    description:
      "Built for three generations under one roof, The Courtyard Residence wraps around a central open-to-sky courtyard featuring a brass water spout, frangipani tree, and perimeter corridors lined with Sadahalli granite.",
    featured: true,
    heroImage: "/images/projects/courtyard-residence.jpg",
    gallery: [
      "/images/projects/courtyard-residence.jpg",
      "/images/projects/courtyard-detail-1.jpg",
      "/images/projects/courtyard-detail-2.jpg",
      "/images/interiors/courtyard-living.jpg",
    ],
    clientBrief:
      "The clients sought a home that keeps their elderly parents connected to sunlight and nature without losing privacy from adjacent suburban plots.",
    materials: [
      "Exposed Wire-Cut Red Bricks",
      "Sadahalli Rough & Flamed Granite",
      "Reclaimed Teak Wood Joinery",
      "Perforated Terracotta Jali Screens",
      "Kota Stone Bedroom Flooring",
    ],
    highlights: [
      "Passive cooling courtyard drops indoor temperature by 4°C during peak summer",
      "Automated rainwater harvesting tank of 15,000 litres capacity integrated beneath the courtyard",
      "Rooftop terrace garden with native flowering climbers and terracotta seating",
      "Custom brass pooja unit aligned to Northeast Ishanya corner",
    ],
    floorPlanConcept:
      "A classical square-donut footprint. Ground floor holds informal living, dining, grandparents' suite, and traditional kitchen. Upper level houses master suites and reading lounge overlooking the courtyard.",
  },
  {
    slug: "traditional-kerala-heritage-villa",
    name: "Aayilyam Heritage Villa",
    style: "Kerala Nalukettu Architecture",
    category: "Kerala Traditional",
    location: "Aluva, Kochi, Kerala",
    builtUpArea: "5,400 sq.ft.",
    plotSize: "32 Cents (River-adjacent)",
    year: "2024",
    timeline: "16 Months (Turnkey)",
    headline: "Rain-kissed timber craftsmanship honoring classic Malabar heritage.",
    description:
      "Positioned along the Periyar riverbank, this residence utilizes exposed laterite stone, intricate timber Charupadi verandahs, and soaring sloping roofs with Mangalore tiles.",
    featured: false,
    heroImage: "/images/projects/kerala-heritage.jpg",
    gallery: [
      "/images/projects/kerala-heritage.jpg",
      "/images/projects/kerala-verandah.jpg",
      "/images/projects/kerala-courtyard.jpg",
    ],
    clientBrief:
      "A returning NRI family wanted an authentic Kerala homestead capable of handling extreme monsoon rains while providing state-of-the-art thermal comfort.",
    materials: [
      "Exposed Natural Laterite Stone",
      "Seasoned Anjili & Teak Wood",
      "Eco-friendly Terracotta Clay Tiles",
      "Athangudi Handmade Cement Tiles",
    ],
    highlights: [
      "Deep 7-foot overhanging eaves protect walls against torrential southwestern monsoons",
      "Continuous wooden Charupadi seating bench surrounding the wrap-around veranda",
      "Natural brass rainwater drainage chains feeding peripheral bio-swales",
    ],
    floorPlanConcept:
      "Sprawling ground-oriented plan featuring a central open-to-sky Nalukettu courtyard, detached guest cottage, and modern wet/dry kitchens.",
  },
  {
    slug: "modern-tropical-brick-villa",
    name: "The Terracotta Lattice House",
    style: "Contemporary Tropical Brick",
    category: "Modern Brick",
    location: "Jubilee Hills, Hyderabad",
    builtUpArea: "6,200 sq.ft.",
    plotSize: "50 x 90 ft (Corner Plot)",
    year: "2025",
    timeline: "15 Months",
    headline: "A striking sculptural facade of twisted terracotta brick lattices.",
    description:
      "Engineered to shield the home from harsh western Deccan sun while allowing constant breeze, the facade features over 12,000 individually angled burnt-clay bricks.",
    featured: false,
    heroImage: "/images/projects/brick-villa.jpg",
    gallery: [
      "/images/projects/brick-villa.jpg",
      "/images/projects/brick-detail.jpg",
      "/images/interiors/brick-dining.jpg",
    ],
    clientBrief:
      "A software entrepreneur asked for a bold sculptural house with zero visible exterior air-conditioning units and exceptional acoustic isolation from city traffic.",
    materials: [
      "High-Density Kiln-Fired Bricks",
      "Polished Grey Kadappa Stone",
      "Slimline Thermal Break Aluminium Windows",
      "Natural Oak & Brass Joinery",
    ],
    highlights: [
      "Parametric brick jali reduces solar thermal heat gain by 32%",
      "Double height formal living with 22-ft high custom acoustic wooden panels",
      "Cantilevered swimming pool on the first level shaded by cedar louvers",
    ],
    floorPlanConcept:
      "Zoned along North-South axis with solid service cores blocking the western radiation and family living opening to the sheltered eastern garden.",
  },
  {
    slug: "contemporary-chettinad-residence",
    name: "Chettinad Pavilion Home",
    style: "Chettinad Neo-Vernacular",
    category: "South Indian",
    location: "ECR, Chennai, Tamil Nadu",
    builtUpArea: "5,800 sq.ft.",
    plotSize: "8,000 sq.ft. Coastal Plot",
    year: "2024",
    timeline: "18 Months",
    headline: "Grand colonnades and polished egg-white plaster overlooking coastal palms.",
    description:
      "Drawing inspiration from Karaikudi mansions, this coastal home features towering pillars carved from single granite blocks and walls finished with traditional egg-white lime plaster.",
    featured: false,
    heroImage: "/images/projects/chettinad-residence.jpg",
    gallery: [
      "/images/projects/chettinad-residence.jpg",
      "/images/projects/chettinad-pillars.jpg",
      "/images/interiors/chettinad-foyer.jpg",
    ],
    clientBrief:
      "A multi-generational family wanted a house capable of hosting 60+ guests during Pongal and Diwali, maintaining coolness without perpetual HVAC.",
    materials: [
      "Monolithic Black Granite Pillars",
      "Traditional Lime Plaster Finish (Chunam)",
      "Handcrafted Athangudi Geometric Tiles",
      "Reclaimed Brass Door Studs & Knockers",
    ],
    highlights: [
      "Hand-polished lime plaster retains cool touch even in 42°C Chennai coastal summers",
      "Grand central hall capable of expanding into the dining courtyard via folding teak portals",
      "Rooftop solar PV installation of 12kW completely powering daytime loads",
    ],
    floorPlanConcept:
      "Linear ceremonial axis stretching from the front Thinnai through the pillared Pattalai hall, into the private family dining court.",
  },
  {
    slug: "minimalist-stone-and-concrete-house",
    name: "The Monolith Villa",
    style: "Minimalist Stone & Concrete",
    category: "Minimalist",
    location: "Koregaon Park, Pune",
    builtUpArea: "4,200 sq.ft.",
    plotSize: "45 x 75 ft",
    year: "2025",
    timeline: "13 Months",
    headline: "Unvarnished honesty of board-marked concrete and Indian basalt stone.",
    description:
      "A quiet sanctuary amidst Pune's canopy trees. The building employs textured cast-in-place concrete, black basalt stone masonry, and internal water bodies.",
    featured: false,
    heroImage: "/images/projects/concrete-villa.jpg",
    gallery: [
      "/images/projects/concrete-villa.jpg",
      "/images/projects/concrete-interior.jpg",
    ],
    clientBrief:
      "A designer couple requested a minimalist home with strict material honesty, no superficial false ceilings, and abundant natural skylights.",
    materials: [
      "Board-formed Concrete",
      "Deccan Basalt Stone",
      "Polished Kota Stone",
      "Corten Steel Planter Boxes",
    ],
    highlights: [
      "Sunken living pavilion looking directly into an internal lily pond",
      "Seamless terrazzo floors hand-poured with river pebbles",
      "Zero paint used throughout: all wall textures are intrinsic to the masonry and concrete",
    ],
    floorPlanConcept:
      "Split-level configuration following natural site contours with an elevated bridge connecting master bedroom wing to the private library.",
  },
  {
    slug: "terracotta-courtyard-sanctuary",
    name: "Prithvi Villa",
    style: "Earth Architecture & Clay",
    category: "Courtyard Homes",
    location: "Bhopal / Indore Outskirts",
    builtUpArea: "5,100 sq.ft.",
    plotSize: "1 Acre Farm Plot",
    year: "2024",
    timeline: "15 Months",
    headline: "Earthen vaults, terracotta tubes, and handcrafted sanctuary.",
    description:
      "Designed with compressed stabilized earth blocks (CSEB) and terracotta filler slab roofs, Prithvi Villa demonstrates sustainable luxury rooted in the heart of India.",
    featured: false,
    heroImage: "/images/projects/terracotta-sanctuary.jpg",
    gallery: [
      "/images/projects/terracotta-sanctuary.jpg",
      "/images/projects/terracotta-vault.jpg",
    ],
    clientBrief:
      "Eco-conscious doctors requested an organic farmhouse that minimizes cement footprint and integrates organic fruit orchards right up to the bedroom sills.",
    materials: [
      "Compressed Stabilized Earth Blocks (CSEB)",
      "Terracotta Filler Slabs",
      "Local Yellow Sandstone",
      "Neem Wood Fenestrations",
    ],
    highlights: [
      "Thermal mass of earth walls keeps indoor temperatures 7°C cooler than dry summer heat",
      "Clay pot filler slab roof reduces steel and concrete volume by 35%",
      "Greywater biological filtration wetland irrigates surrounding 200 fruit trees",
    ],
    floorPlanConcept:
      "Clustered pavilions connected by semi-open colonnades centered around a shaded stepwell-inspired rainwater reservoir.",
  },
];

export const WHY_CHOOSE_US = [
  {
    iconName: "ShieldCheck",
    title: "Quality Materials",
    description:
      "We strictly procure 53-grade certified cement, Fe 550D primary steel, seasoned A-grade teak wood, and laboratory-tested aggregates.",
  },
  {
    iconName: "UserCheck",
    title: "Skilled Workmanship",
    description:
      "Our sthapatis, master masons, carpenters, and civil engineers bring decades of generational mastery in Indian residential crafts.",
  },
  {
    iconName: "Eye",
    title: "Transparent Process",
    description:
      "No hidden bills or ambiguous extras. Itemized BOQs with live digital progress photo logs shared weekly with your family.",
  },
  {
    iconName: "Compass",
    title: "Thoughtful Design",
    description:
      "Homes shaped around how Indian families cook, gather, celebrate festivals, and care for elders, balanced with contemporary minimalism.",
  },
  {
    iconName: "Clock",
    title: "Timely Execution",
    description:
      "Milestone-locked contracts backed by strict critical path schedules ensuring on-time Griha Pravesh without stress.",
  },
  {
    iconName: "HeartHandshake",
    title: "Customer First",
    description:
      "Over 120 families trust us because we don't just build walls; we stand by our work with post-handover maintenance and warranty.",
  },
];

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Consultation",
    duration: "Week 1",
    description:
      "We meet with your family to understand lifestyle aspirations, budget expectations, generational needs, and Vastu requirements.",
    highlights: ["Family requirement mapping", "Budget & schedule alignment", "Vastu orientation assessment"],
  },
  {
    step: "02",
    title: "Site Evaluation",
    duration: "Week 2",
    description:
      "Our geotechnical engineers conduct topographic laser surveys, soil bearing tests, and evaluate road access and municipal guidelines.",
    highlights: ["Geotechnical soil bore testing", "Microclimate & wind analysis", "Local building bye-law checks"],
  },
  {
    step: "03",
    title: "Design & Planning",
    duration: "Weeks 3–6",
    description:
      "Development of custom floor plans, 3D exterior elevations, structural CAD drawings, electrical/plumbing schemes, and material boards.",
    highlights: ["Detailed 2D & 3D visualizations", "Municipal approval coordination", "Engineering load calculations"],
  },
  {
    step: "04",
    title: "Cost Estimation",
    duration: "Weeks 7–8",
    description:
      "Transparent bill of quantities (BOQ) with item-by-item material grades, brands, labor costs, payment schedules, and zero hidden contingencies.",
    highlights: ["Itemized BOQ breakdown", "Milestone payment schedule", "Guaranteed fixed-price contract"],
  },
  {
    step: "05",
    title: "Construction",
    duration: "Months 3–14",
    description:
      "Disciplined on-site civil execution: excavation, RCC footings, columns, brickwork, slab casting, MEP conduits, plastering, and finishes.",
    highlights: ["Dedicated site engineer daily", "Weekly photo & video progress log", "Standardized curing protocol"],
  },
  {
    step: "06",
    title: "Quality Inspection",
    duration: "Month 14–15",
    description:
      "Rigorous 45-point checklist covering waterproofing pond tests, plumbing pressure tests, electrical loads, and joinery alignments.",
    highlights: ["72-hour terrace pond testing", "MEP pressure & earth resistance", "Window air/water infiltration tests"],
  },
  {
    step: "07",
    title: "Handover",
    duration: "Final Milestone",
    description:
      "Deep cleaning of your home, key handover celebration, and delivery of the comprehensive homeowner dossier with warranties and as-built drawings.",
    highlights: ["Griha Pravesh ready cleaning", "Comprehensive warranty folder", "10-year structural warranty card"],
  },
];

export const INDIAN_ARCH_PHILOSOPHY = [
  {
    feature: "The Courtyard (Nadumuttam / Aangan)",
    description:
      "The spiritual and thermal heart of the home. Draws natural light, creates convective cooling air currents, and gathers all family generations.",
  },
  {
    feature: "The Shaded Verandah (Thinnai / Charupadi)",
    description:
      "A welcoming transition between outdoors and indoors. Built with built-in wooden or stone seating to welcome neighbors and enjoy evening rain.",
  },
  {
    feature: "Jali Screens (Latticework)",
    description:
      "Perforated brick, stone, or terracotta screens that break harsh afternoon solar glare into dappled light while keeping air flowing through.",
  },
  {
    feature: "Authentic Local Materials",
    description:
      "Terracotta clay tiles, Sadahalli granite, Kadappa slate, exposed wire-cut red bricks, and seasoned timber that age with grace over decades.",
  },
  {
    feature: "Rain & Sun Responsive Roofs",
    description:
      "Carefully calculated roof overhangs and slopes tailored to regional rainfall and sunlight angles, eliminating wall dampness.",
  },
  {
    feature: "Harmonious Vastu Integration",
    description:
      "Scientific spatial alignment prioritizing morning solar energy in the East, quiet master sanctuaries in the Southwest, and water in the Northeast.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Finding a team that truly understood our wish for a traditional Kerala Nalukettu courtyard while incorporating modern smart lighting and concealed AC was rare. Sthapati delivered on time with impeccable craftsmanship.",
    clientName: "Dr. Arvind & Maya Nambiar",
    homeType: "Courtyard Heritage Villa (5,400 sq.ft.)",
    city: "Bengaluru, Karnataka",
    year: "2024",
  },
  {
    quote:
      "The transparency of their BOQ won our trust right away. Every bag of cement and every metric ton of steel was accounted for. Our home in Jubilee Hills is both a sanctuary and an architectural statement.",
    clientName: "Siddharth & Ananya Reddy",
    homeType: "The Terracotta Lattice House (6,200 sq.ft.)",
    city: "Hyderabad, Telangana",
    year: "2025",
  },
  {
    quote:
      "As elderly parents living with our children and grandchildren, accessibility and quietness were paramount. The natural stone floors, shaded verandah, and central courtyard make this home a joy to wake up to every day.",
    clientName: "S. Ramanathan & Family",
    homeType: "Chettinad Pavilion Home (5,800 sq.ft.)",
    city: "Chennai, Tamil Nadu",
    year: "2024",
  },
];

export const PROJECT_TYPES = [
  "New House Construction",
  "House Design & Architecture",
  "Turnkey Construction (End-to-End)",
  "Renovation & Remodeling",
  "Interior Design",
  "Consultation & Planning",
];

export const BUDGET_RANGES = [
  "Under ₹25 Lakhs",
  "₹25 Lakhs – ₹50 Lakhs",
  "₹50 Lakhs – ₹1 Crore",
  "₹1 Crore – ₹2.5 Crores",
  "₹2.5 Crores+",
  "Not Decided Yet",
];
