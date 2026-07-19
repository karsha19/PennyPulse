const { Op, fn, col, literal } = require('sequelize');
const { Transaction, Category } = require('../models');

// @route  GET /api/dashboard/summary
const getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totals = await Transaction.findAll({
      where: { userId },
      attributes: ['type', [fn('SUM', col('amount')), 'total']],
      group: ['type'],
      raw: true,
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    totals.forEach((t) => {
      if (t.type === 'income') totalIncome = parseFloat(t.total) || 0;
      if (t.type === 'expense') totalExpenses = parseFloat(t.total) || 0;
    });

    const balance = totalIncome - totalExpenses;
    const savings = balance;

    const recentTransactions = await Transaction.findAll({
      where: { userId },
      include: Category,
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      limit: 5,
    });

    res.status(200).json({
      success: true,
      summary: {
        totalBalance: balance,
        totalIncome,
        totalExpenses,
        savings,
      },
      recentTransactions,
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/dashboard/charts  (category breakdown + monthly bar data for current year)
const getChartData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const year = Number(req.query.year) || new Date().getFullYear();

    // Pie: spending by category (current month)
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const categoryBreakdown = await Transaction.findAll({
      where: { userId, type: 'expense', date: { [Op.between]: [startDate, endDate] } },
      include: [{ model: Category, attributes: ['name', 'color'] }],
      attributes: ['categoryId', [fn('SUM', col('amount')), 'total']],
      group: ['categoryId', 'Category.id'],
      raw: true,
      nest: true,
    });

    const pieData = categoryBreakdown.map((c) => ({
      name: c.Category.name,
      value: parseFloat(c.total),
      color: c.Category.color,
    }));

    // Bar: income vs expense per month for the year
    const monthlyRaw = await Transaction.findAll({
      where: { userId, date: { [Op.between]: [`${year}-01-01`, `${year}-12-31`] } },
      attributes: [
        [fn('MONTH', col('date')), 'month'],
        'type',
        [fn('SUM', col('amount')), 'total'],
      ],
      group: [literal('MONTH(date)'), 'type'],
      raw: true,
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const barData = monthNames.map((name, idx) => ({ month: name, income: 0, expense: 0 }));

    monthlyRaw.forEach((row) => {
      const idx = row.month - 1;
      if (row.type === 'income') barData[idx].income = parseFloat(row.total);
      if (row.type === 'expense') barData[idx].expense = parseFloat(row.total);
    });

    res.status(200).json({ success: true, pieData, barData });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/dashboard/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const categoryTotals = await Transaction.findAll({
      where: { userId, type: 'expense' },
      include: [{ model: Category, attributes: ['name', 'color'] }],
      attributes: ['categoryId', [fn('SUM', col('amount')), 'total']],
      group: ['categoryId', 'Category.id'],
      order: [[literal('total'), 'DESC']],
      raw: true,
      nest: true,
    });

    const highestCategory = categoryTotals.length > 0 ? categoryTotals[0] : null;

    const totalTransactions = await Transaction.count({ where: { userId } });

    // Average monthly spending: total expenses / number of distinct months with data
    const monthsWithData = await Transaction.findAll({
      where: { userId, type: 'expense' },
      attributes: [[fn('DISTINCT', fn('DATE_FORMAT', col('date'), '%Y-%m')), 'ym']],
      raw: true,
    });
    const totalExpenseAgg = await Transaction.sum('amount', { where: { userId, type: 'expense' } });
    const monthCount = monthsWithData.length || 1;
    const avgMonthlySpending = (totalExpenseAgg || 0) / monthCount;

    res.status(200).json({
      success: true,
      analytics: {
        highestSpendingCategory: highestCategory
          ? { name: highestCategory.Category.name, total: parseFloat(highestCategory.total), color: highestCategory.Category.color }
          : null,
        totalTransactions,
        averageMonthlySpending: Math.round(avgMonthlySpending * 100) / 100,
        categoryBreakdown: categoryTotals.map((c) => ({
          name: c.Category.name,
          total: parseFloat(c.total),
          color: c.Category.color,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getChartData, getAnalytics };
