import express from 'express';
import servers from './servers';
import subscriptions from './subscriptions';
import messages from './messages';

const router = express.Router();

router.use('/servers', servers);
router.use(subscriptions);
router.use(messages);

module.exports = router;
