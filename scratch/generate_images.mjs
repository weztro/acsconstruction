import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('public/images');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Helper to generate architectural SVG
function createArchSvg({ title, styleTag, bgGradient, buildingElements, accentColor = "#C2593F" }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="100%" height="100%">
  <defs>
    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
      ${bgGradient}
    </linearGradient>
    <linearGradient id="terracotta" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C2593F"/>
      <stop offset="100%" stop-color="#803320"/>
    </linearGradient>
    <linearGradient id="sand" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EFE8DC"/>
      <stop offset="100%" stop-color="#D5CBB9"/>
    </linearGradient>
    <linearGradient id="teak" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#54311C"/>
      <stop offset="100%" stop-color="#2D1A0F"/>
    </linearGradient>
    <pattern id="jali" width="18" height="18" patternUnits="userSpaceOnUse">
      <rect width="18" height="18" fill="#993822"/>
      <circle cx="9" cy="9" r="3.5" fill="#FFE082" opacity="0.85"/>
      <circle cx="0" cy="0" r="2.5" fill="#3D1C13" opacity="0.5"/>
      <circle cx="18" cy="18" r="2.5" fill="#3D1C13" opacity="0.5"/>
    </pattern>
    <pattern id="brick" width="28" height="14" patternUnits="userSpaceOnUse">
      <rect width="28" height="14" fill="#B34B32"/>
      <line x1="0" y1="7" x2="28" y2="7" stroke="#7A2D1B" stroke-width="1.2"/>
      <line x1="0" y1="14" x2="28" y2="14" stroke="#7A2D1B" stroke-width="1.2"/>
      <line x1="14" y1="0" x2="14" y2="7" stroke="#7A2D1B" stroke-width="1.2"/>
      <line x1="0" y1="7" x2="0" y2="14" stroke="#7A2D1B" stroke-width="1.2"/>
    </pattern>
  </defs>

  <!-- Sky -->
  <rect width="900" height="600" fill="url(#sky)"/>

  <!-- Sun or Architectural Glow -->
  <circle cx="680" cy="190" r="90" fill="#FFC837" opacity="0.25"/>

  <!-- Distant Tropical Foliage -->
  <path d="M 0 440 Q 150 410 300 430 T 600 420 T 900 410 L 900 600 L 0 600 Z" fill="#18130E" opacity="0.65"/>
  
  <!-- Architectural Plinth & Ground -->
  <polygon points="50,510 850,510 890,600 10,600" fill="url(#sand)"/>
  <line x1="50" y1="510" x2="850" y2="510" stroke="#9E927C" stroke-width="2"/>

  <!-- Building Elements -->
  ${buildingElements}

  <!-- Water Reflection / Courtyard Element -->
  <rect x="250" y="540" width="400" height="45" rx="3" fill="#202A36" opacity="0.7"/>
  <ellipse cx="450" cy="550" rx="20" ry="8" fill="#D4AF37"/>

  <!-- Title Badge overlay -->
  <g transform="translate(40, 40)">
    <rect width="260" height="54" rx="3" fill="#141312" opacity="0.85"/>
    <text x="18" y="24" fill="${accentColor}" font-family="sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">${styleTag.toUpperCase()}</text>
    <text x="18" y="44" fill="#F5F2EB" font-family="serif" font-size="16" font-weight="600">${title}</text>
  </g>
</svg>`;
}

const stylesData = [
  {
    file: "architecture/modern-indian.svg",
    title: "Modern Indian Residence",
    styleTag: "Vernacular Contemporary",
    bgGradient: `<stop offset="0%" stop-color="#2D2118"/><stop offset="60%" stop-color="#6E3D29"/><stop offset="100%" stop-color="#B86C45"/>`,
    buildingElements: `
      <!-- Exposed Brick Massing -->
      <rect x="180" y="240" width="260" height="270" fill="url(#brick)"/>
      <rect x="220" y="270" width="100" height="120" fill="url(#jali)"/>
      <!-- Cantilever Upper Box -->
      <rect x="360" y="170" width="340" height="200" fill="#261E19"/>
      <g stroke="#9E5D34" stroke-width="4">
        <line x1="390" y1="190" x2="390" y2="350"/>
        <line x1="420" y1="190" x2="420" y2="350"/>
        <line x1="450" y1="190" x2="450" y2="350"/>
        <line x1="480" y1="190" x2="480" y2="350"/>
      </g>
      <!-- Glass Living Room with Warm Glow -->
      <rect x="440" y="370" width="280" height="140" fill="#FFEBB5" opacity="0.85"/>
      <line x1="580" y1="370" x2="580" y2="510" stroke="#33241A" stroke-width="3"/>
    `
  },
  {
    file: "architecture/traditional-heritage.svg",
    title: "Heritage Sloped Sanctuary",
    styleTag: "Ancestral Craft",
    bgGradient: `<stop offset="0%" stop-color="#221C16"/><stop offset="50%" stop-color="#523626"/><stop offset="100%" stop-color="#9C5938"/>`,
    buildingElements: `
      <!-- Clay Tile Sloped Roof -->
      <polygon points="120,320 780,320 450,150" fill="#A8432A"/>
      <g stroke="#612415" stroke-width="2">
        <line x1="450" y1="150" x2="200" y2="320"/>
        <line x1="450" y1="150" x2="300" y2="320"/>
        <line x1="450" y1="150" x2="400" y2="320"/>
        <line x1="450" y1="150" x2="500" y2="320"/>
        <line x1="450" y1="150" x2="600" y2="320"/>
        <line x1="450" y1="150" x2="700" y2="320"/>
      </g>
      <!-- Verandah with Turned Teak Columns -->
      <rect x="180" y="320" width="540" height="190" fill="url(#sand)"/>
      <rect x="220" y="320" width="16" height="190" fill="url(#teak)"/>
      <rect x="340" y="320" width="16" height="190" fill="url(#teak)"/>
      <rect x="460" y="320" width="16" height="190" fill="url(#teak)"/>
      <rect x="580" y="320" width="16" height="190" fill="url(#teak)"/>
      <rect x="680" y="320" width="16" height="190" fill="url(#teak)"/>
      <!-- Built-in Thinnai Wooden Seating -->
      <rect x="200" y="450" width="500" height="25" fill="#422513"/>
    `
  },
  {
    file: "architecture/contemporary-villa.svg",
    title: "Contemporary Light Villa",
    styleTag: "Modern Tropical",
    bgGradient: `<stop offset="0%" stop-color="#1B1E22"/><stop offset="50%" stop-color="#3A3833"/><stop offset="100%" stop-color="#7A6854"/>`,
    buildingElements: `
      <!-- Monolithic volumes & double height glass -->
      <rect x="150" y="200" width="300" height="310" fill="#D5CBB9"/>
      <rect x="400" y="160" width="360" height="350" fill="#201C18"/>
      <rect x="440" y="200" width="300" height="310" fill="#FFE5A3" opacity="0.75"/>
      <!-- Floor-to-Ceiling Slim Glazing -->
      <g stroke="#120F0D" stroke-width="3">
        <line x1="540" y1="200" x2="540" y2="510"/>
        <line x1="640" y1="200" x2="640" y2="510"/>
        <line x1="440" y1="350" x2="740" y2="350"/>
      </g>
      <!-- Floating Concrete Canopy -->
      <polygon points="120,200 780,160 760,180 100,220" fill="#EFE8DC"/>
    `
  },
  {
    file: "architecture/kerala-inspired.svg",
    title: "Nalukettu Courtyard Villa",
    styleTag: "Kerala Vernacular",
    bgGradient: `<stop offset="0%" stop-color="#1D2B24"/><stop offset="50%" stop-color="#3F4A39"/><stop offset="100%" stop-color="#8E7857"/>`,
    buildingElements: `
      <!-- Steep Kerala Gable Roofs with Wooden Charupadi -->
      <polygon points="160,300 480,300 320,160" fill="#B34B32"/>
      <polygon points="440,300 760,300 600,160" fill="#993822"/>
      <!-- Carved gables -->
      <polygon points="315,170 325,170 320,185" fill="#FFE082"/>
      <polygon points="595,170 605,170 600,185" fill="#FFE082"/>
      <!-- Laterite Stone Base -->
      <rect x="180" y="300" width="560" height="210" fill="#8F4832"/>
      <rect x="220" y="360" width="480" height="50" fill="#4D281C"/>
      <g stroke="#3D1C13" stroke-width="4">
        <line x1="240" y1="360" x2="240" y2="510"/>
        <line x1="360" y1="360" x2="360" y2="510"/>
        <line x1="560" y1="360" x2="560" y2="510"/>
        <line x1="680" y1="360" x2="680" y2="510"/>
      </g>
    `
  },
  {
    file: "architecture/south-indian.svg",
    title: "Chettinad Pillar Mansion",
    styleTag: "Classical Heritage",
    bgGradient: `<stop offset="0%" stop-color="#261E18"/><stop offset="50%" stop-color="#5E4331"/><stop offset="100%" stop-color="#B88656"/>`,
    buildingElements: `
      <!-- Grand Colonnade with Granite Pillars -->
      <rect x="140" y="240" width="620" height="270" fill="url(#sand)"/>
      <rect x="190" y="280" width="22" height="230" fill="#2E2822"/>
      <rect x="290" y="280" width="22" height="230" fill="#2E2822"/>
      <rect x="390" y="280" width="22" height="230" fill="#2E2822"/>
      <rect x="490" y="280" width="22" height="230" fill="#2E2822"/>
      <rect x="590" y="280" width="22" height="230" fill="#2E2822"/>
      <rect x="690" y="280" width="22" height="230" fill="#2E2822"/>
      <!-- Heavy Carved Wooden Doorway -->
      <rect x="420" y="340" width="60" height="170" fill="#4A2914"/>
      <circle cx="440" cy="420" r="3" fill="#D4AF37"/>
      <circle cx="460" cy="420" r="3" fill="#D4AF37"/>
    `
  },
  {
    file: "architecture/minimal-modern.svg",
    title: "Monolith Raw Concrete & Slate",
    styleTag: "Minimalist Indian",
    bgGradient: `<stop offset="0%" stop-color="#191B1C"/><stop offset="50%" stop-color="#36393B"/><stop offset="100%" stop-color="#696C6E"/>`,
    buildingElements: `
      <!-- Raw Concrete Interlocking Blocks -->
      <rect x="180" y="220" width="280" height="290" fill="#8C8881"/>
      <rect x="380" y="160" width="340" height="240" fill="#635F59"/>
      <!-- Board form texture lines -->
      <g stroke="#4F4B46" stroke-width="1.5">
        <line x1="180" y1="260" x2="460" y2="260"/>
        <line x1="180" y1="300" x2="460" y2="300"/>
        <line x1="180" y1="340" x2="460" y2="340"/>
        <line x1="180" y1="380" x2="460" y2="380"/>
        <line x1="380" y1="200" x2="720" y2="200"/>
        <line x1="380" y1="240" x2="720" y2="240"/>
        <line x1="380" y1="280" x2="720" y2="280"/>
      </g>
      <!-- Deep Recessed Window Slot -->
      <rect x="440" y="280" width="220" height="80" fill="#FFE5A3" opacity="0.6"/>
    `
  }
];

// Generate Architecture SVGs
stylesData.forEach(item => {
  const fullPath = path.join(baseDir, item.file);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, createArchSvg(item));
  console.log(`Generated: ${item.file}`);
});

// Generate Project SVGs
const projectsData = [
  {
    file: "projects/courtyard-residence.jpg",
    title: "The Courtyard Residence",
    styleTag: "Bangalore • 4,850 sq.ft.",
    bgGradient: `<stop offset="0%" stop-color="#2D1C13"/><stop offset="50%" stop-color="#733923"/><stop offset="100%" stop-color="#C2593F"/>`,
    buildingElements: `
      <!-- Central Open Nadumuttam with Frangipani Tree -->
      <rect x="160" y="220" width="580" height="290" fill="url(#brick)"/>
      <rect x="300" y="260" width="300" height="250" fill="#1F1A15"/>
      <!-- Open sky core -->
      <rect x="340" y="280" width="220" height="230" fill="#FFF2D6" opacity="0.85"/>
      <!-- Frangipani tree silhouette -->
      <path d="M 450 510 Q 445 420 430 380 Q 410 350 400 320 M 430 380 Q 470 340 480 300" stroke="#3D2619" stroke-width="6" fill="none"/>
      <circle cx="400" cy="315" r="14" fill="#65A30D"/>
      <circle cx="480" cy="295" r="16" fill="#65A30D"/>
      <circle cx="440" cy="340" r="18" fill="#65A30D"/>
      <!-- Brass Water Urli -->
      <ellipse cx="450" cy="500" rx="28" ry="10" fill="#D4AF37"/>
    `
  },
  {
    file: "projects/kerala-heritage.jpg",
    title: "Aayilyam Heritage Villa",
    styleTag: "Kochi • 5,400 sq.ft.",
    bgGradient: `<stop offset="0%" stop-color="#19241E"/><stop offset="50%" stop-color="#384333"/><stop offset="100%" stop-color="#806D50"/>`,
    buildingElements: `
      <polygon points="120,320 780,320 450,140" fill="#A8432A"/>
      <rect x="160" y="320" width="580" height="190" fill="#8F4832"/>
      <g stroke="#3D1C13" stroke-width="4">
        <line x1="200" y1="320" x2="200" y2="510"/>
        <line x1="320" y1="320" x2="320" y2="510"/>
        <line x1="450" y1="320" x2="450" y2="510"/>
        <line x1="580" y1="320" x2="580" y2="510"/>
        <line x1="700" y1="320" x2="700" y2="510"/>
      </g>
      <rect x="180" y="440" width="540" height="30" fill="#522C1A"/>
    `
  },
  {
    file: "projects/brick-villa.jpg",
    title: "The Terracotta Lattice House",
    styleTag: "Hyderabad • 6,200 sq.ft.",
    bgGradient: `<stop offset="0%" stop-color="#2D1A12"/><stop offset="50%" stop-color="#6E3420"/><stop offset="100%" stop-color="#B85132"/>`,
    buildingElements: `
      <rect x="180" y="180" width="540" height="330" fill="url(#brick)"/>
      <rect x="250" y="220" width="200" height="240" fill="url(#jali)"/>
      <rect x="490" y="240" width="180" height="270" fill="#221A15"/>
      <rect x="510" y="270" width="140" height="240" fill="#FFE5A3" opacity="0.8"/>
    `
  },
  {
    file: "projects/chettinad-residence.jpg",
    title: "Chettinad Pavilion Home",
    styleTag: "Chennai • 5,800 sq.ft.",
    bgGradient: `<stop offset="0%" stop-color="#231B15"/><stop offset="50%" stop-color="#573D2C"/><stop offset="100%" stop-color="#A87A4F"/>`,
    buildingElements: `
      <rect x="150" y="240" width="600" height="270" fill="url(#sand)"/>
      <rect x="200" y="270" width="24" height="240" fill="#241E19"/>
      <rect x="320" y="270" width="24" height="240" fill="#241E19"/>
      <rect x="440" y="270" width="24" height="240" fill="#241E19"/>
      <rect x="560" y="270" width="24" height="240" fill="#241E19"/>
      <rect x="670" y="270" width="24" height="240" fill="#241E19"/>
      <rect x="410" y="350" width="80" height="160" fill="#452714"/>
    `
  },
  {
    file: "projects/concrete-villa.jpg",
    title: "The Monolith Villa",
    styleTag: "Pune • 4,200 sq.ft.",
    bgGradient: `<stop offset="0%" stop-color="#1B1C1D"/><stop offset="50%" stop-color="#3D3E40"/><stop offset="100%" stop-color="#737475"/>`,
    buildingElements: `
      <rect x="160" y="200" width="340" height="310" fill="#78746E"/>
      <rect x="420" y="160" width="320" height="350" fill="#5E5A54"/>
      <rect x="460" y="280" width="220" height="90" fill="#FFEDB8" opacity="0.6"/>
    `
  },
  {
    file: "projects/terracotta-sanctuary.jpg",
    title: "Prithvi Villa",
    styleTag: "Bhopal • 5,100 sq.ft.",
    bgGradient: `<stop offset="0%" stop-color="#2B1D16"/><stop offset="50%" stop-color="#693C26"/><stop offset="100%" stop-color="#A85934"/>`,
    buildingElements: `
      <ellipse cx="450" cy="380" rx="260" ry="180" fill="#C2593F"/>
      <rect x="190" y="380" width="520" height="130" fill="url(#brick)"/>
      <circle cx="450" cy="340" r="45" fill="#FFE5A3" opacity="0.8"/>
    `
  },
  // Gallery and interior files
  {
    file: "projects/courtyard-detail-1.jpg",
    title: "Courtyard Water Spout & Granite",
    styleTag: "Detail View",
    bgGradient: `<stop offset="0%" stop-color="#241B15"/><stop offset="100%" stop-color="#5A3A26"/>`,
    buildingElements: `<rect x="200" y="200" width="500" height="310" fill="url(#sand)"/><rect x="350" y="300" width="200" height="120" fill="url(#jali)"/>`
  },
  {
    file: "projects/courtyard-detail-2.jpg",
    title: "Terracotta Louver Facade",
    styleTag: "Detail View",
    bgGradient: `<stop offset="0%" stop-color="#241B15"/><stop offset="100%" stop-color="#803320"/>`,
    buildingElements: `<rect x="150" y="150" width="600" height="360" fill="url(#brick)"/>`
  },
  {
    file: "projects/kerala-verandah.jpg",
    title: "Monsoon Charupadi Verandah",
    styleTag: "Detail View",
    bgGradient: `<stop offset="0%" stop-color="#1A241E"/><stop offset="100%" stop-color="#485A42"/>`,
    buildingElements: `<rect x="150" y="200" width="600" height="310" fill="#8F4832"/>`
  },
  {
    file: "projects/kerala-courtyard.jpg",
    title: "Nalukettu Water Drainage Basin",
    styleTag: "Detail View",
    bgGradient: `<stop offset="0%" stop-color="#1F2820"/><stop offset="100%" stop-color="#60503B"/>`,
    buildingElements: `<rect x="250" y="220" width="400" height="290" fill="url(#sand)"/>`
  },
  {
    file: "projects/brick-detail.jpg",
    title: "Twisted Brickwork Shadow Study",
    styleTag: "Detail View",
    bgGradient: `<stop offset="0%" stop-color="#2A160F"/><stop offset="100%" stop-color="#8C3822"/>`,
    buildingElements: `<rect x="180" y="160" width="540" height="350" fill="url(#jali)"/>`
  },
  {
    file: "projects/chettinad-pillars.jpg",
    title: "Single Stone Carved Pillars",
    styleTag: "Detail View",
    bgGradient: `<stop offset="0%" stop-color="#261E18"/><stop offset="100%" stop-color="#664C36"/>`,
    buildingElements: `<rect x="200" y="180" width="500" height="330" fill="url(#sand)"/>`
  },
  {
    file: "projects/concrete-interior.jpg",
    title: "Basalt & Cast Concrete Hearth",
    styleTag: "Detail View",
    bgGradient: `<stop offset="0%" stop-color="#1E1F21"/><stop offset="100%" stop-color="#4E5054"/>`,
    buildingElements: `<rect x="180" y="180" width="540" height="330" fill="#78746E"/>`
  },
  {
    file: "projects/terracotta-vault.jpg",
    title: "Handmade Clay Tile Ceiling Vault",
    styleTag: "Detail View",
    bgGradient: `<stop offset="0%" stop-color="#2B1A13"/><stop offset="100%" stop-color="#8F4024"/>`,
    buildingElements: `<ellipse cx="450" cy="350" rx="300" ry="180" fill="#C2593F"/>`
  },
  {
    file: "interiors/courtyard-living.jpg",
    title: "Warm Teak & Courtyard View",
    styleTag: "Interior Design",
    bgGradient: `<stop offset="0%" stop-color="#261A13"/><stop offset="100%" stop-color="#5C3B24"/>`,
    buildingElements: `<rect x="150" y="200" width="600" height="310" fill="#FFE5A3" opacity="0.6"/>`
  },
  {
    file: "interiors/brick-dining.jpg",
    title: "Dining Space with Dappled Brick Light",
    styleTag: "Interior Design",
    bgGradient: `<stop offset="0%" stop-color="#29150E"/><stop offset="100%" stop-color="#693320"/>`,
    buildingElements: `<rect x="150" y="200" width="600" height="310" fill="url(#brick)"/>`
  },
  {
    file: "interiors/chettinad-foyer.jpg",
    title: "Athangudi Tile Floor Foyer",
    styleTag: "Interior Design",
    bgGradient: `<stop offset="0%" stop-color="#241B16"/><stop offset="100%" stop-color="#6B4B32"/>`,
    buildingElements: `<rect x="150" y="200" width="600" height="310" fill="url(#sand)"/>`
  },
  {
    file: "construction/site-progress.svg",
    title: "Active Residential Site Execution",
    styleTag: "Civil Engineering",
    bgGradient: `<stop offset="0%" stop-color="#292019"/><stop offset="100%" stop-color="#634735"/>`,
    buildingElements: `<rect x="150" y="200" width="600" height="310" fill="url(#brick)"/>`
  }
];

projectsData.forEach(item => {
  const fullPath = path.join(baseDir, item.file);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, createArchSvg(item));
  console.log(`Generated: ${item.file}`);
});
console.log("All architectural assets generated successfully!");
