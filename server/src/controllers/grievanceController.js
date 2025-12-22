const Grievance = require('../models/Grievance');

// Get all grievances
exports.getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find()
      .populate('userId', 'name email')
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

// Get user's grievances
exports.getUserGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ userId: req.user.id })
      .populate('userId', 'name email')
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

// Get single grievance
exports.getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email');

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    res.status(200).json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create grievance
exports.createGrievance = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const grievance = new Grievance({
      title,
      description,
      category,
      priority,
      userId: req.user.id,
    });

    await grievance.save();
    await grievance.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update grievance
exports.updateGrievance = async (req, res) => {
  try {
    let grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    grievance = await Grievance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete grievance
exports.deleteGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findByIdAndDelete(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Grievance deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment to grievance
exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;

    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            userId: req.user.id,
            comment,
          },
        },
      },
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
