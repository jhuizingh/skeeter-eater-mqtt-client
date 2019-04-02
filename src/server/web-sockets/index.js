import express from 'express';
import expressWs from 'express-ws';
import WebSocket from 'ws';

class WebSocketHandler {
  expressApp = null;

  wsInstance = null;

  constructor() {
    console.log('WebSocketHandler constructor');
  }

  setupRoutes = (expressApp, urlPath) => {
    this.expressApp = expressApp;
    this.wsInstance = expressWs(expressApp);
    const router = express.Router();

    router.ws('/ws', (ws) => {
      ws.on('message', (msg) => {
        console.log(`Got websocket message. msg=[${msg}]`);
        ws.send(`message back [${msg}]`);
      });
    });

    expressApp.use(urlPath, router);
  };

  send = (collection, action, data) => {
    const { clients } = this.wsInstance.getWss();
    console.log(`clients.length=${JSON.stringify(clients, null, 2)}`);
    clients.forEach((item) => {
      console.log(`readyState=${item.readyState} (WebSocket.OPEN=[${WebSocket.OPEN}])`);
      if (item.readyState === WebSocket.OPEN) {
        const payload = {
          collection,
          action,
          data
        };
        const json = JSON.stringify(payload, null, 2);
        item.send(json);
      }
    });
  };
}

const handler = new WebSocketHandler();
// handler.setupRoutes(null);

console.log(`handler = ${JSON.stringify(handler, null, 2)}`);
export default handler;
