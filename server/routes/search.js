const express = require('express');
const router = express.Router();
const https = require('https');

// Search route — powered by DuckDuckGo Instant Answer API (no API key needed)
router.get('/', (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;

  https.get(url, (response) => {
    let data = '';
    response.on('data', (chunk) => (data += chunk));
    response.on('end', () => {
      try {
        const parsed = JSON.parse(data);

        const results = (parsed.RelatedTopics || [])
          .slice(0, 10)
          .map((item) => ({
            title: item.Text || '',
            url: item.FirstURL || '',
          }))
          .filter((r) => r.title && r.url);

        res.json({
          query,
          abstract: parsed.Abstract || '',
          results,
        });
      } catch (err) {
        res.status(500).json({ error: 'Failed to parse search results' });
      }
    });
  }).on('error', () => {
    res.status(500).json({ error: 'Search request failed' });
  });
});

module.exports = router;
