const User = require('../models/User');
const Grievance = require('../models/Grievance');

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGrievances = await Grievance.countDocuments();
    const resolvedGrievances = await Grievance.countDocuments({ status: 'resolved' });
    const openGrievances = await Grievance.countDocuments({ status: 'open' });

    const grievancesByCategory = await Grievance.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const grievancesByStatus = await Grievance.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalGrievances,
        resolvedGrievances,
        openGrievances,
        grievancesByCategory,
        grievancesByStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all grievances (admin)
exports.getAllGrievancesAdmin = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const grievances = await Grievance.find(query)
      .populate('userId', 'name email phone')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: grievances.length,
      data: grievances,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign grievance
exports.assignGrievance = async (req, res) => {
  try {
    const { grievanceId, userId } = req.body;

    const grievance = await Grievance.findByIdAndUpdate(
      grievanceId,
      { assignedTo: userId, status: 'in-progress' },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
