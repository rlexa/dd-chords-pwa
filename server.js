const express = require('express');
const fs = require('fs');
const https = require('https');

try {
  const app = new express();

  const rootDir = 'dist/dd-chords-pwa';
  const port = '4200';
  const host = '127.0.0.1';

  app.use(express.static(rootDir));
  app.all('*', (req, res) => res.sendFile('index.html', {root: rootDir}));

  // app.listen(port);
  const key = fs.readFileSync('key.pem');
  const cert = fs.readFileSync('cert.pem');
  https.createServer({key, cert}, app).listen(port, host);

  console.log(`Serving https://${host}:${port}`);
} catch (ex) {
  console.error(`Failed to start server.`, ex);
}
