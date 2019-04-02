import express from 'express';
import db from '../Database';

const router = express.Router();
const collectionName = 'servers';

router.get('/', (req, res) => {
  db.getCollection(collectionName).then((servers) => {
    // console.log('servers=');
    // console.log(servers);
    res.send(servers);
  });
});

router.post('/', async (req, res) => {
  console.log('req.body=');
  console.log(req.body);
  await db.upsert(collectionName, req.body);
  res.json('OK');
});

router.delete('/:id', async (req, res) => {
  console.log('delete request');
  console.log(req.params);
  await db.delete(collectionName, req.params.id);

  res.json('OK');
});

export default router;
