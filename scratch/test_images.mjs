async function checkServer() {
  try {
    const res = await fetch('http://localhost:3001/');
    console.log('GET http://localhost:3001/ -> Status:', res.status);
    const html = await res.text();
    
    // Find all img tags
    const re = /<img[^>]+src="([^">]+)"/g;
    let match;
    const sources = [];
    while ((match = re.exec(html)) !== null) {
      sources.push(match[1]);
    }
    console.log('Found', sources.length, 'img sources in HTML:');
    for (const src of sources) {
      const decoded = src.replace(/&amp;/g, '&');
      const url = decoded.startsWith('http') ? decoded : 'http://localhost:3001' + decoded;
      const imgRes = await fetch(url);
      console.log('Status', imgRes.status, ':', decoded.slice(0, 80));
    }
  } catch (err) {
    console.error('Check server error:', err);
  }
}
checkServer();
