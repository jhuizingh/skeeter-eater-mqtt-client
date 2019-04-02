import mqtt from 'mqtt';
import db from '../Database';

class ServerClient {
  constructor(server) {
    this.server = server;
  }
}

export default class MqttClient {
  init = async () => {
    await this._queryDatabaseAndCreateClients();
  };

  _queryDatabaseAndCreateClients = async () => {
    const serversPromise = db.getCollection('servers');
    const subscriptionsPromise = db.getCollection('subscriptions');
    const servers = await serversPromise;
    const subscriptions = await subscriptionsPromise;

    console.log(
      `servers=${JSON.stringify(
        servers
      )}, typeof servers=[${typeof servers}], Array.isArray(servers)=[${Array.isArray(servers)}]`
    );

    servers.forEach((server) => {
      const serverSubscriptions = subscriptions.filter(
        subscription => subscription.serverId === server.id
      );

      serverSubscriptions.forEach(subscription => this.addSubscription(server, subscription));
    });
  };

  ServerClients = [];

  addSubscription = (server, subscription) => {
    let serverClient = this.ServerClients.find(val => val.server.id === server.id);

    if (!serverClient) {
      serverClient = new ServerClient(server);
    }

    const clientOnConnect = () => {
      console.log(`connection to [${server.server}] succeeded`);
    };

    if (!serverClient.client) {
      serverClient.client = mqtt.connect(server.server);

      serverClient.client.on('connect', clientOnConnect);
    }

    serverClient.client.subscribe(subscription.topic, (err, granted) => {
      if (err) {
        console.log(`error subscribing to [${subscription.topic} on ${server.server}`);
      } else {
        console.log('granted=');
        console.log(granted);
      }
    });

    serverClient.client.on('message', (topic, message, packet) => {
      console.log(`packet=${JSON.stringify(packet, null, 2)}`);
      console.log(`message=[${message.toString()}]`);
      db.upsert('messages', {
        topic,
        content: message.toString(),
        qos: packet.qos,
        time: new Date().toString(),
        subscriptionId: subscription.id
      });
    });
  };
}
