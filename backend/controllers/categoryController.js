const { Category } = require('../models');

// @route  GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.status(200).json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories };
