const http = require('http');
const fs = require('fs');
const path = require('path');

const leadsHandler = require('./api/leads.js');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  if (url.pathname === '/api/leads') {
    req.query = Object.fromEntries(url.searchParams);
    return leadsHandler(req, res);
  }

  let filePath = path.join(__dirname, 'public', url.pathname === '/' ? 'index.html' : url.pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    let contentType = 'text/html';
    if (filePath.endsWith('.css')) contentType = 'text/css';
    if (filePath.endsWith('.js')) contentType = 'application/javascript';
    if (filePath.endsWith('.json')) contentType = 'application/json';
    if (filePath.endsWith('.csv')) contentType = 'text/csv';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(4123, () => {
  console.log('Test server listening on port 4123');
  
  // Test /api/leads
  http.get('http://localhost:4123/api/leads', (apiRes) => {
    let raw = '';
    apiRes.on('data', chunk => raw += chunk);
    apiRes.on('end', () => {
      const data = JSON.parse(raw);
      console.log('API test successful! Leads returned:', data.leads.length, 'Stats:', data.stats);
      server.close(() => console.log('Test server closed.'));
    });
  });
});
