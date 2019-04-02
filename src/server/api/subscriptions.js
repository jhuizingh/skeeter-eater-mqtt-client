import express from 'express';
import db from '../Database';

const router = express.Router();
const collectionName = 'subscriptions';

router.get('/servers/:serverId/subscriptions', (req, res) => {
  db.getCollection(collectionName).then((subscriptions) => {
    const serverSubscriptions = subscriptions.filter(val => req.params.serverId === val.serverId);
    res.send(serverSubscriptions);
  });
});

router.post('/servers/:serverId/subscriptions', async (req, res) => {
  console.log('req.body=');
  console.log(req.body);

  const toSave = req.body;
  toSave.serverId = req.params.serverId;
  console.log(`toSave=${JSON.stringify(toSave)}`);
  await db.upsert(collectionName, toSave);
  res.json('OK');
});

router.delete('/subscriptions/:id', async (req, res) => {
  console.log('delete request');
  console.log(req.params);
  await db.delete(collectionName, req.params.id);

  res.json('OK');
});

export default router;
