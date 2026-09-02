const { Op, fn, col } = require('sequelize');
const { Budget, Category, Transaction } = require('../models');


const setBudget = async (req, res, next) => {
  try {
    const { categoryId, amount, month, year } = req.body;

    const [budget, created] = await Budget.findOrCreate({
      where: { userId: req.user.id, categoryId, month, year },
      defaults: { amount },
    });

    if (!created) {
      budget.amount = amount;
      await budget.save();
    }

    const full = await Budget.findByPk(budget.id, { include: Category });
    res.status(200).json({ success: true, message: 'Budget saved', budget: full });
  } catch (err) {
    next(err);
  }
};


const getBudgets = async (req, res, next) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    const budgets = await Budget.findAll({
      where: { userId: req.user.id, month, year },
      include: Category,
    });

    
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; 

    const spendRows = await Transaction.findAll({
      where: {
        userId: req.user.id,
        type: 'expense',
        date: { [Op.between]: [startDate, endDate] },
      },
      attributes: ['categoryId', [fn('SUM', col('amount')), 'spent']],
      group: ['categoryId'],
      raw: true,
    });

    const spendMap = {};
    spendRows.forEach((r) => {
      spendMap[r.categoryId] = parseFloat(r.spent);
    });

    const result = budgets.map((b) => {
      const spent = spendMap[b.categoryId] || 0;
      const limit = parseFloat(b.amount);
      const percentage = limit > 0 ? Math.min((spent / limit) * 100, 999) : 0;
      const exceeded = spent > limit;

      const today = new Date();
      const isCurrentMonth = month === today.getMonth() + 1 && year === today.getFullYear();
      const daysElapsed = isCurrentMonth ? today.getDate() : new Date(year, month, 0).getDate();
      const daysInMonth = new Date(year, month, 0).getDate();
      const projectedSpend = daysElapsed > 0 ? (spent / daysElapsed) * daysInMonth : 0;
      const projectedExceeded = projectedSpend > limit;
      const paceWarning = !exceeded && projectedExceeded && isCurrentMonth;

      return {
        id: b.id,
        category: b.Category,
        amount: limit,
        spent,
        remaining: limit - spent,
        percentage: Math.round(percentage * 10) / 10,
        exceeded: spent > limit,
        projectedSpend: Math.round(projectedSpend * 100) / 100,
        projectedExceeded,
        paceWarning,
        daysElapsed,
        daysInMonth,
        month,
        year,
      };
    });

    res.status(200).json({ success: true, budgets: result });
  } catch (err) {
    next(err);
  }
};


const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    await budget.destroy();
    res.status(200).json({ success: true, message: 'Budget deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { setBudget, getBudgets, deleteBudget };
