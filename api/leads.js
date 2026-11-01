const fs = require('fs');
const path = require('path');

let leadsCache = null;

function getLocalLeads() {
  if (leadsCache) return leadsCache;
  try {
    const dataPath = path.resolve(__dirname, '../data/leads.json');
    if (fs.existsSync(dataPath)) {
      leadsCache = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return leadsCache;
    }
  } catch (err) {
    console.warn('Could not read ../data/leads.json, trying public fallback');
  }

  try {
    const publicPath = path.resolve(__dirname, '../public/data/leads.json');
    if (fs.existsSync(publicPath)) {
      leadsCache = JSON.parse(fs.readFileSync(publicPath, 'utf8'));
      return leadsCache;
    }
  } catch (err) {
    console.error('Fallback read error', err);
  }
  return [];
}

function sendResponse(res, statusCode, data) {
  if (typeof res.status === 'function') {
    return res.status(statusCode).json(data);
  } else {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(200).end();
    res.writeHead(200);
    return res.end();
  }

  try {
    const leads = getLocalLeads();

    // Query filters
    const query = req.query || {};
    const { city, category, search } = query;
    let filtered = leads;

    if (city && city.toLowerCase() !== 'all') {
      filtered = filtered.filter(l => (l.city || '').toLowerCase() === city.toLowerCase());
    }

    if (category && category.toLowerCase() !== 'all') {
      filtered = filtered.filter(l => (l.category || '').toLowerCase().includes(category.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(l =>
        (l.name || '').toLowerCase().includes(q) ||
        (l.what_firm_does || '').toLowerCase().includes(q) ||
        (l.address || '').toLowerCase().includes(q) ||
        (l.sub_category || '').toLowerCase().includes(q)
      );
    }

    // Calculate live summary stats
    const total = leads.length;
    const puneCount = leads.filter(l => l.city === 'Pune').length;
    const mumbaiCount = leads.filter(l => l.city === 'Mumbai').length;
    const commercialCount = leads.filter(l => l.category === 'Commercial Workspace').length;
    const hospitalityCount = leads.filter(l => l.category === 'Hospitality & Retail').length;
    const setDesignCount = leads.filter(l => l.category === 'Set & Production Design').length;
    const exhibitionCount = leads.filter(l => l.category === 'Exhibition & Experiential').length;
    const directHrCount = leads.filter(l => (l.confidence || '').includes('Direct HR')).length;

    sendResponse(res, 200, {
      success: true,
      leads: filtered,
      stats: {
        total,
        puneCount,
        mumbaiCount,
        commercialCount,
        hospitalityCount,
        setDesignCount,
        exhibitionCount,
        directHrCount
      }
    });

  } catch (error) {
    console.error('Error serving leads:', error);
    sendResponse(res, 500, { success: false, error: error.message });
  }
};
