import fs from 'fs';
import path from 'path';

// Curated high quality authentic architectural photography URLs (Unsplash CDN direct JPEG endpoints)
// We request 1600x1000 or 1200x800 with auto=format&fit=crop for optimal web performance
const PHOTO_MAP = [
  // Hero Villa (Modern tropical/Indian villa with warm evening light, stone, teak wood and warm windows)
  {
    target: 'public/images/hero/hero-villa.jpg',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&h=1000&q=80'
  },
  // Architecture Styles (Modern, Heritage, Contemporary, Kerala, Chettinad, Minimal)
  {
    target: 'public/images/architecture/modern-indian.jpg',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/architecture/traditional-heritage.jpg',
    url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/architecture/contemporary-villa.jpg',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/architecture/kerala-inspired.jpg',
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/architecture/south-indian.jpg',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/architecture/minimal-modern.jpg',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  // Worker & Craftsman Section (Authentic construction worker / craftsman on residential site)
  {
    target: 'public/images/workers/craftsman.jpg',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&h=900&q=80'
  },
  // Construction Progress
  {
    target: 'public/images/construction/site-progress.jpg',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  // Projects
  {
    target: 'public/images/projects/courtyard-residence.jpg',
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/projects/courtyard-detail-1.jpg',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/projects/courtyard-detail-2.jpg',
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/projects/kerala-heritage.jpg',
    url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/projects/kerala-verandah.jpg',
    url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/projects/kerala-courtyard.jpg',
    url: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/projects/brick-villa.jpg',
    url: 'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/projects/brick-detail.jpg',
    url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/projects/chettinad-residence.jpg',
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/projects/chettinad-pillars.jpg',
    url: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/projects/concrete-villa.jpg',
    url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/projects/concrete-interior.jpg',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/projects/terracotta-sanctuary.jpg',
    url: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/projects/terracotta-vault.jpg',
    url: 'https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  // Interiors
  {
    target: 'public/images/interiors/courtyard-living.jpg',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/interiors/brick-dining.jpg',
    url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&h=800&q=80'
  },
  {
    target: 'public/images/interiors/chettinad-foyer.jpg',
    url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&h=800&q=80'
  }
];

async function downloadFile(item) {
  const destPath = path.resolve(item.target);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  console.log(`Downloading ${item.target}...`);
  try {
    const res = await fetch(item.url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    // Verify magic bytes for JPEG (FF D8 FF)
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      fs.writeFileSync(destPath, buffer);
      console.log(`✔ Success: ${item.target} (${(buffer.length / 1024).toFixed(1)} KB) - Valid JPEG`);
    } else {
      console.warn(`⚠ Warning: File from ${item.url} is not standard JPEG, saving anyway.`);
      fs.writeFileSync(destPath, buffer);
    }
  } catch (err) {
    console.error(`❌ Failed to download ${item.target}:`, err.message);
  }
}

async function run() {
  console.log(`Starting download of ${PHOTO_MAP.length} authentic architectural photography assets...`);
  for (const item of PHOTO_MAP) {
    await downloadFile(item);
  }
  console.log("All downloads finished!");
}

run();
