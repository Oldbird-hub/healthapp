// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log('ECG WebSocket server listening on ws://0.0.0.0:8080');

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    let data;

    try {
      data = JSON.parse(message.toString());
    } catch (e) {
      console.error('Invalid JSON:', message.toString());
      return;
    }

    // Περιμένουμε κάτι σαν: { "type": "ecg", "value": 0.42 }
    if (
      data.type === 'ecg' || //απο τον αισθητήρα ECG
      data.type === 'vitals' //απο τον αισθητήρα MAX30102 typeof data.value === 'number'
    ) {
      // broadcast σε ΟΛΟΥΣ τους συνδεδεμένους clients (Angular κλπ)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
