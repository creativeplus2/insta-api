const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const username = 'colorasialive';
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });

  const data = await page.evaluate(async (username) => {
    const res = await fetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      headers: {
        'User-Agent': 'Instagram 155.0.0.37.107',
        'X-IG-App-ID': '936619743392459'
      }
    });
    return await res.json();
  }, username);

  const edges = data?.data?.user?.edge_owner_to_timeline_media?.edges || [];

  const feed = edges.map(edge => {
    const node = edge.node;
    return {
      image: node.display_url,
      caption: node.edge_media_to_caption?.edges[0]?.node?.text || '',
      permalink: 'https://www.instagram.com/p/' + node.shortcode,
      timestamp: new Date(node.taken_at_timestamp * 1000).toISOString()
    };
  });

  fs.writeFileSync('instagram.json', JSON.stringify(feed, null, 2));
  console.log('✅ Feed berhasil disimpan');

  await browser.close();
})();