import uuid from 'uuid';

const servers = [{ id: uuid.v4(), name: 'Server 1' }, { id: uuid.v4(), name: 'Server 2' }];

const subscriptions = [
  {
    id: uuid.v4(),
    topic: 'octoprint/ender3/event',
    messages: [
      {
        id: uuid.v4(),
        time: new Date().toISOString(),
        topic: 'octoprint/ender3/event',
        qos: 1,
        content: '{\n"_timestamp": 1553701091,\n"actual": 214.8,\n"target": 215\n}'
      },
      {
        id: uuid.v4(),
        time: new Date().toISOString(),
        topic: 'octoprint/ender3/event',
        qos: 0,
        content: '{\n"_timestamp": 1553701091,\n"actual": 214.8,\n"target": 215\n}'
      },
      {
        id: uuid.v4(),
        time: new Date().toISOString(),
        topic: 'octoprint/ender3/event',
        qos: 1,
        content: '{\n"_timestamp": 1553701091,\n"actual": 214.8,\n"target": 215\n}'
      },
      {
        id: uuid.v4(),
        time: new Date().toISOString(),
        topic: 'octoprint/ender3/event',
        qos: 0,
        content: '{\n"_timestamp": 1553701091,\n"actual": 214.8,\n"target": 215\n}'
      },
      {
        id: uuid.v4(),
        time: new Date().toISOString(),
        topic: 'octoprint/ender3/event',
        qos: 2,
        content: '{\n"_timestamp": 1553701091,\n"actual": 214.8,\n"target": 215\n}'
      }
    ]
  },
  {
    id: uuid.v4(),
    topic: 'openhab/outgoing/#',
    messages: [
      {
        id: uuid.v4(),
        time: new Date().toISOString(),
        topic: 'openhab/outgoing/sub/subsub',
        qos: 0,
        content: '97.3'
      }
    ]
  },
  {
    id: uuid.v4(),
    topic: 'tasmota/mario/state',
    messages: [
      {
        id: uuid.v4(),
        time: new Date().toISOString(),
        topic: 'tasmota/mario/state',
        qos: 0,
        content: 'a message'
      }
    ]
  }
];

export { servers, subscriptions };
