const express = require('express');
const { body } = require('express-validator');
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
router.use(protect); // all transaction routes require auth

const transactionValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('categoryId').isInt().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
];

router.route('/')
  .get(getTransactions)
  .post(transactionValidation, validate, createTransaction);

router.route('/:id')
  .get(getTransactionById)
  .put(transactionValidation, validate, updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
