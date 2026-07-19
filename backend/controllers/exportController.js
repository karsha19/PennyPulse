const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const { Transaction, Category } = require('../models');

// @route  GET /api/export/csv
const exportCSV = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      include: Category,
      order: [['date', 'DESC']],
      raw: true,
      nest: true,
    });

    const rows = transactions.map((t) => ({
      Date: t.date,
      Title: t.title,
      Category: t.Category.name,
      Type: t.type,
      Amount: t.amount,
      Notes: t.notes || '',
    }));

    const parser = new Parser({ fields: ['Date', 'Title', 'Category', 'Type', 'Amount', 'Notes'] });
    const csv = parser.parse(rows);

    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/export/pdf
const exportPDF = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      include: Category,
      order: [['date', 'DESC']],
    });

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.header('Content-Type', 'application/pdf');
    res.attachment('transactions.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Expense Tracker - Transaction History', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).fillColor('gray').text(`Generated for ${req.user.name} on ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(1.5);

    const tableTop = doc.y;
    const colWidths = { date: 70, title: 130, category: 90, type: 60, amount: 80 };

    doc.fontSize(10).fillColor('black');
    doc.text('Date', 40, tableTop, { width: colWidths.date, bold: true });
    doc.text('Title', 110, tableTop, { width: colWidths.title });
    doc.text('Category', 240, tableTop, { width: colWidths.category });
    doc.text('Type', 330, tableTop, { width: colWidths.type });
    doc.text('Amount', 390, tableTop, { width: colWidths.amount });
    doc.moveDown();
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();

    transactions.forEach((t) => {
      const y = doc.y + 6;
      if (y > 750) doc.addPage();
      doc.fontSize(9).fillColor('black');
      doc.text(t.date, 40, y, { width: colWidths.date });
      doc.text(t.title, 110, y, { width: colWidths.title });
      doc.text(t.Category ? t.Category.name : '-', 240, y, { width: colWidths.category });
      doc.text(t.type, 330, y, { width: colWidths.type });
      doc.fillColor(t.type === 'income' ? 'green' : 'red')
        .text(`${t.type === 'income' ? '+' : '-'}${t.amount}`, 390, y, { width: colWidths.amount });
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    next(err);
  }
};

module.exports = { exportCSV, exportPDF };
