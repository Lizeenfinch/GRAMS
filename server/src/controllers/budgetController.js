const Grievance = require('../models/Grievance');

/**
 * Get budget overview and utilization statistics
 */
exports.getBudgetOverview = async (req, res) => {
  try {
    // Get all resolved grievances with budget data
    const grievances = await Grievance.find({
      status: { $in: ['resolved', 'closed'] },
      'budget.allocated': { $gt: 0 },
    });

    // Calculate totals by category
    const budgetByCategory = {
      water: { allocated: 0, spent: 0, count: 0 },
      roads: { allocated: 0, spent: 0, count: 0 },
      electricity: { allocated: 0, spent: 0, count: 0 },
      waste: { allocated: 0, spent: 0, count: 0 },
      other: { allocated: 0, spent: 0, count: 0 },
    };

    let totalAllocated = 0;
    let totalSpent = 0;

    grievances.forEach(g => {
      const category = g.budget.category || 'other';
      budgetByCategory[category].allocated += g.budget.allocated || 0;
      budgetByCategory[category].spent += g.budget.spent || 0;
      budgetByCategory[category].count += 1;

      totalAllocated += g.budget.allocated || 0;
      totalSpent += g.budget.spent || 0;
    });

    // Calculate efficiency
    const efficiency = totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        total: {
          allocated: totalAllocated,
          spent: totalSpent,
          efficiency: parseFloat(efficiency),
        },
        byCategory: budgetByCategory,
        grievancesWithBudget: grievances.length,
      },
    });
  } catch (error) {
    console.error('Error fetching budget overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget overview',
    });
  }
};

/**
 * Update budget for a specific grievance
 */
exports.updateGrievanceBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { allocated, spent, category, description, expenseDetails } = req.body;

    const grievance = await Grievance.findById(id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found',
      });
    }

    // Update budget
    grievance.budget = {
      allocated: allocated || grievance.budget.allocated,
      spent: spent || grievance.budget.spent,
      category: category || grievance.budget.category,
      description: description || grievance.budget.description,
      expenseDetails: expenseDetails || grievance.budget.expenseDetails,
    };

    await grievance.save();

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: grievance,
    });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update budget',
    });
  }
};

/**
 * Add expense to grievance budget
 */
exports.addExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { item, cost } = req.body;

    const grievance = await Grievance.findById(id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found',
      });
    }

    // Add expense
    if (!grievance.budget.expenseDetails) {
      grievance.budget.expenseDetails = [];
    }

    grievance.budget.expenseDetails.push({
      item,
      cost,
      date: new Date(),
    });

    // Update total spent
    grievance.budget.spent = (grievance.budget.spent || 0) + cost;

    await grievance.save();

    res.status(200).json({
      success: true,
      message: 'Expense added successfully',
      data: grievance,
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add expense',
    });
  }
};

/**
 * Get budget utilization trends (monthly)
 */
exports.getBudgetTrends = async (req, res) => {
  try {
    const { months = 6 } = req.query;
    
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - parseInt(months));

    const grievances = await Grievance.find({
      resolutionDate: { $gte: monthsAgo },
      'budget.allocated': { $gt: 0 },
    }).sort({ resolutionDate: 1 });

    // Group by month
    const trends = {};

    grievances.forEach(g => {
      const month = g.resolutionDate.toISOString().slice(0, 7); // YYYY-MM
      if (!trends[month]) {
        trends[month] = { allocated: 0, spent: 0, count: 0 };
      }
      trends[month].allocated += g.budget.allocated || 0;
      trends[month].spent += g.budget.spent || 0;
      trends[month].count += 1;
    });

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    console.error('Error fetching budget trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget trends',
    });
  }
};
