class WebSocketClient {
  // todo, update this to use env value
  socket = new WebSocket('ws://localhost:8080/api/web-sockets/ws/');

  listeners = {};

  init = () => {
    window.socket = this.socket;
    this.socket.addEventListener('open', () => {
      this.socket.send('Hello World!');
    });
    this.socket.addEventListener('message', (event) => {
      console.log(`Message from server: ${event.data}`);
      try {
        const message = JSON.parse(event.data);

        console.log('Parsed message = ');
        console.log(message);

        if (message.collection) {
          const collectionListeners = this.listeners[message.collection] || [];
          console.log(`collectionListeners = [${collectionListeners}`);
          console.log(collectionListeners);
          collectionListeners.forEach((func) => {
            func(message.action, message.data);
          });
        } else {
          console.log(`Got a websocket message with no collection [${message}]`);
        }
      } catch (err) {
        console.log(`got an error parsing websocket message into json. data=[${event.data}}`);
        console.log(err);
      }
    });
  };

  addListener = (collection, func) => {
    console.log(`addListener received listener for [${collection}]`);
    if (!this.listeners[collection]) {
      this.listeners[collection] = [];
    }

    this.listeners[collection].push(func);
  };
}

const ws = new WebSocketClient();

export default ws;
