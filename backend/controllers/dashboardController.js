const { Op, fn, col, literal } = require('sequelize');
const { Transaction, Category, Budget } = require('../models');
const { calculatePulseScore } = require('../utils/pulseScore');

const getBudgetAdherence = async (userId) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  const budgets = await Budget.findAll({ where: { userId, month, year } });
  if (budgets.length === 0) return 1;

  const spendRows = await Transaction.findAll({
    where: { userId, type: 'expense', date: { [Op.between]: [startDate, endDate] } },
    attributes: ['categoryId', [fn('SUM', col('amount')), 'spent']],
    group: ['categoryId'],
    raw: true,
  });

  const spendMap = {};
  spendRows.forEach((r) => { spendMap[r.categoryId] = parseFloat(r.spent); });

  const underBudget = budgets.filter((b) => (spendMap[b.categoryId] || 0) <= parseFloat(b.amount)).length;
  return underBudget / budgets.length;
};

const getMonthlyExpenses = async (userId, months = 6) => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1)
    .toISOString().split('T')[0];

  const rows = await Transaction.findAll({
    where: { userId, type: 'expense', date: { [Op.gte]: startDate } },
    attributes: [
      [fn('DATE_FORMAT', col('date'), '%Y-%m'), 'ym'],
      [fn('SUM', col('amount')), 'total'],
    ],
    group: [literal("DATE_FORMAT(date, '%Y-%m')")],
    raw: true,
  });

  return rows.map((r) => parseFloat(r.total));
};


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

    const [budgetAdherence, monthlyExpenses] = await Promise.all([
      getBudgetAdherence(userId),
      getMonthlyExpenses(userId),
    ]);

    const pulseScore = calculatePulseScore({
      totalIncome,
      totalExpenses,
      budgetAdherence,
      monthlyExpenses,
    });

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
        pulseScore,
      },
      recentTransactions,
    });
  } catch (err) {
    next(err);
  }
};


const getChartData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const year = Number(req.query.year) || new Date().getFullYear();


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

    
    const monthsWithData = await Transaction.findAll({
      where: { userId, type: 'expense' },
      attributes: [[fn('DISTINCT', fn('DATE_FORMAT', col('date'), '%Y-%m')), 'ym']],
      raw: true,
    });
    const totalExpenseAgg = await Transaction.sum('amount', { where: { userId, type: 'expense' } });
    const monthCount = monthsWithData.length || 1;
    const avgMonthlySpending = (totalExpenseAgg || 0) / monthCount;

    const moodRows = await Transaction.findAll({
      where: { userId, type: 'expense', mood: { [Op.ne]: null } },
      attributes: ['mood', [fn('SUM', col('amount')), 'total'], [fn('COUNT', col('id')), 'count']],
      group: ['mood'],
      raw: true,
    });

    const moodBreakdown = moodRows.map((r) => ({
      mood: r.mood,
      total: parseFloat(r.total),
      count: parseInt(r.count, 10),
    }));

    const incomeTotal = await Transaction.sum('amount', { where: { userId, type: 'income' } }) || 0;
    const expenseTotal = totalExpenseAgg || 0;
    const [budgetAdherence, monthlyExpenses] = await Promise.all([
      getBudgetAdherence(userId),
      getMonthlyExpenses(userId),
    ]);
    const pulseScore = calculatePulseScore({
      totalIncome: incomeTotal,
      totalExpenses: expenseTotal,
      budgetAdherence,
      monthlyExpenses,
    });

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
        moodBreakdown,
        pulseScore,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getChartData, getAnalytics };
