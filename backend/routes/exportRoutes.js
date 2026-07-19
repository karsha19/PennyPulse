const express = require('express');
const { exportCSV, exportPDF } = require('../controllers/exportController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/csv', exportCSV);
router.get('/pdf', exportPDF);

module.exports = router;
