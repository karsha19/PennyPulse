const { Op } = require('sequelize');
const { Transaction, Category } = require('../models');

// @route  POST /api/transactions
const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, categoryId, date, notes } = req.body;

    const transaction = await Transaction.create({
      userId: req.user.id,
      title,
      amount,
      type,
      categoryId,
      date,
      notes: notes || null,
    });

    const full = await Transaction.findByPk(transaction.id, { include: Category });
    res.status(201).json({ success: true, message: 'Transaction added', transaction: full });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/transactions  (supports search, filter, sort, pagination)
const getTransactions = async (req, res, next) => {
  try {
    const {
      search = '',
      type,
      categoryId,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'DESC',
      page = 1,
      limit = 10,
    } = req.query;

    const where = { userId: req.user.id };

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (type && type !== 'all') {
      where.type = type;
    }
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }
    if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    }

    const allowedSort = ['date', 'amount', 'title', 'createdAt'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'date';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await Transaction.findAndCountAll({
      where,
      include: Category,
      order: [[sortField, order]],
      limit: Number(limit),
      offset,
    });

    res.status(200).json({
      success: true,
      transactions: rows,
      pagination: {
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/transactions/:id
const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: Category,
    });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.status(200).json({ success: true, transaction });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/transactions/:id
const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const { title, amount, type, categoryId, date, notes } = req.body;
    await transaction.update({
      title: title ?? transaction.title,
      amount: amount ?? transaction.amount,
      type: type ?? transaction.type,
      categoryId: categoryId ?? transaction.categoryId,
      date: date ?? transaction.date,
      notes: notes ?? transaction.notes,
    });

    const full = await Transaction.findByPk(transaction.id, { include: Category });
    res.status(200).json({ success: true, message: 'Transaction updated', transaction: full });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/transactions/:id
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    await transaction.destroy();
    res.status(200).json({ success: true, message: 'Transaction deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
