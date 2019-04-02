import WebSocketHandler from './web-sockets';
import api from './api';
import MqttClient from './mqtt-client';

const express = require('express');

const app = express();

console.log(`WebSocketHandler=${JSON.stringify(WebSocketHandler, null, 2)}`);
WebSocketHandler.setupRoutes(app, '/api/web-sockets/');

app.use(express.json());
app.use('/api', api);

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

const mqttClient = new MqttClient();
mqttClient.init();

function listRoutes(routes, stack, parent) {
  parent = parent || '';
  if (stack) {
    stack.forEach((r) => {
      if (r.route && r.route.path) {
        let method = '';

        for (method in r.route.methods) {
          if (r.route.methods[method]) {
            routes.push({ method: method.toUpperCase(), path: parent + r.route.path });
          }
        }
      } else if (r.handle && r.handle.name == 'router') {
        const routerName = r.regexp.source.replace('^\\', '').replace('\\/?(?=\\/|$)', '');
        return listRoutes(routes, r.handle.stack, parent + routerName);
      }
    });
    return routes;
  }
  return listRoutes([], app._router.stack);
}

// Usage on app.js
const routes = listRoutes(); // array: ["method: path", "..."]

console.log(routes);
