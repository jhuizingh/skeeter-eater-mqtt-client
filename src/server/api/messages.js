import express from 'express';
import db from '../Database';

const router = express.Router();
const collectionName = 'messages';

router.get('/subscriptions/:subscriptionId/messages', (req, res) => {
  db.getCollection(collectionName).then((messages) => {
    const subscriptionmessages = messages.filter(
      val => req.params.subscriptionId === val.subscriptionId
    );
    res.send(subscriptionmessages);
  });
});

router.delete('/subscriptions/:id/messages/delete-all', async (req, res) => {
  console.log('delete request');
  console.log(req.params);
  await db.delete(collectionName, req.params.id);

  res.json('OK');
});

export default router;
