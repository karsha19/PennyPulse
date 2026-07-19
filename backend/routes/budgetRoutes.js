const express = require('express');
const { body } = require('express-validator');
const { setBudget, getBudgets, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getBudgets)
  .post(
    [
      body('categoryId').isInt().withMessage('Category is required'),
      body('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive'),
      body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1-12'),
      body('year').isInt({ min: 2000 }).withMessage('Valid year required'),
    ],
    validate,
    setBudget
  );

router.delete('/:id', deleteBudget);

module.exports = router;
