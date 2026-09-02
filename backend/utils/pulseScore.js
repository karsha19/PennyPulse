
const calculatePulseScore = ({ totalIncome, totalExpenses, budgetAdherence = 1, monthlyExpenses = [] }) => {
  
  let savingsScore = 0;
  if (totalIncome > 0) {
    const savingsRate = Math.max(0, ((totalIncome - totalExpenses) / totalIncome) * 100);
    savingsScore = Math.min((savingsRate / 30) * 40, 40);
  } else if (totalExpenses === 0) {
    savingsScore = 40;
  }

  
  const budgetScore = Math.min(Math.max(budgetAdherence, 0), 1) * 35;

  
  let consistencyScore = 12; 
  if (monthlyExpenses.length >= 2) {
    const mean = monthlyExpenses.reduce((a, b) => a + b, 0) / monthlyExpenses.length;
    if (mean > 0) {
      const variance = monthlyExpenses.reduce((sum, v) => sum + (v - mean) ** 2, 0) / monthlyExpenses.length;
      const cv = Math.sqrt(variance) / mean; 
      consistencyScore = Math.max(0, Math.min(25, 25 - cv * 25));
    } else {
      consistencyScore = 25;
    }
  } else if (monthlyExpenses.length === 1) {
    consistencyScore = 20;
  }

  const score = Math.round(savingsScore + budgetScore + consistencyScore);

  let label = 'Needs Attention';
  let color = '#ef4444';
  if (score >= 80) { label = 'Excellent'; color = '#10b981'; }
  else if (score >= 60) { label = 'Good'; color = '#6366f1'; }
  else if (score >= 40) { label = 'Fair'; color = '#f59e0b'; }

  return {
    score: Math.min(100, Math.max(0, score)),
    label,
    color,
    breakdown: {
      savings: Math.round(savingsScore),
      budgetAdherence: Math.round(budgetScore),
      consistency: Math.round(consistencyScore),
    },
  };
};

module.exports = { calculatePulseScore };
