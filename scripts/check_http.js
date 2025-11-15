const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/borbotones/filtros/departamentos',
  method: 'GET',
  timeout: 5000,
};

const req = http.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('body:', data);
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error('error:', err.message);
  process.exit(1);
});
req.on('timeout', () => {
  console.error('timeout');
  req.destroy();
});
req.end();
