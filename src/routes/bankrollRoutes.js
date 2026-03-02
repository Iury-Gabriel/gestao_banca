const express = require('express');
const router = express.Router();
const bankrollController = require('../controllers/bankrollController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', bankrollController.getBankroll);
router.post('/event', bankrollController.createEvent);
router.get('/history', bankrollController.getHistory);

module.exports = router;
