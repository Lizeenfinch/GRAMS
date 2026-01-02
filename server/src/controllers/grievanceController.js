const Grievance = require('../models/Grievance');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

function safeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function toDays(ms) {
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

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
    const { title, description, category, priority, location } = req.body;
    
    // Fetch user to get email
    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Handle file uploads
    const attachments = [];
    
    if (req.files && req.files.length > 0) {
      // Upload each file to Cloudinary
      for (const file of req.files) {
        const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'video';
        
        try {
          const uploadResult = await uploadToCloudinary(
            file.buffer,
            'grams/grievances',
            resourceType
          );
          
          attachments.push({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            type: resourceType,
          });
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          // Continue with other files even if one fails
        }
      }
    }

    const grievance = new Grievance({
      title,
      description,
      category: category.toLowerCase(),
      priority: priority || 'medium',
      location,
      attachments,
      userId: req.user.id,
      userEmail: user.email,
    });

    await grievance.save();
    await grievance.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    console.error('Create grievance error:', error);
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

    const prevStatus = grievance.status;
    const prevAssignedTo = grievance.assignedTo ? String(grievance.assignedTo) : null;

    Object.assign(grievance, req.body);

    const nextStatus = grievance.status;
    if (['resolved', 'closed'].includes(prevStatus) && ['open', 'in-progress'].includes(nextStatus)) {
      grievance.reopenedCount = safeNumber(grievance.reopenedCount, 0) + 1;
    }

    if (nextStatus === 'resolved' && !grievance.resolutionDate) {
      grievance.resolutionDate = new Date();
    }

    const nextAssignedTo = grievance.assignedTo ? String(grievance.assignedTo) : null;
    if (nextAssignedTo && nextAssignedTo !== prevAssignedTo) {
      const now = new Date();
      grievance.assignedAt = now;
      if (!grievance.firstAssignedAt) {
        grievance.firstAssignedAt = now;
      }
    }

    await grievance.save({ validateModifiedOnly: true });

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
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Delete all attachments from Cloudinary
    if (grievance.attachments && grievance.attachments.length > 0) {
      for (const attachment of grievance.attachments) {
        try {
          await deleteFromCloudinary(attachment.publicId, attachment.type);
        } catch (deleteError) {
          console.error('Failed to delete attachment:', deleteError);
          // Continue deletion even if some attachments fail
        }
      }
    }

    await Grievance.findByIdAndDelete(req.params.id);

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

// Upvote a grievance (any user can upvote any issue once)
exports.upvoteGrievance = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'You must be logged in to upvote',
      });
    }

    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found',
      });
    }

    if (['resolved', 'closed', 'rejected'].includes(grievance.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot upvote resolved, closed, or rejected issues',
      });
    }

    // Initialize upvotedBy if it doesn't exist
    if (!grievance.upvotedBy) {
      grievance.upvotedBy = [];
    }

    // Check if user has already upvoted
    const hasAlreadyUpvoted = grievance.upvotedBy.some(
      (voterId) => voterId.toString() === userId.toString()
    );

    if (hasAlreadyUpvoted) {
      return res.status(400).json({
        success: false,
        message: 'You have already upvoted this issue',
        alreadyUpvoted: true,
      });
    }

    // Add user to upvotedBy array and increment count
    grievance.upvotedBy.push(userId);
    grievance.upvotes = safeNumber(grievance.upvotes, 0) + 1;
    await grievance.save();

    // Auto-escalation based on upvotes
    if (grievance.upvotes >= 50 && grievance.priority !== 'critical') {
      grievance.priority = 'critical';
      await grievance.save();
    } else if (grievance.upvotes >= 25 && !['high', 'critical'].includes(grievance.priority)) {
      grievance.priority = 'high';
      await grievance.save();
    }

    res.status(200).json({
      success: true,
      data: {
        _id: grievance._id,
        upvotes: grievance.upvotes,
        priority: grievance.priority,
        upvotedBy: grievance.upvotedBy,
      },
      message: 'Upvote recorded successfully',
    });
  } catch (error) {
    console.error('Upvote Grievance Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upvote issue',
      error: error.message,
    });
  }
};

// Public transparency report stats
exports.getTransparencyReport = async (req, res) => {
  try {
    const grievances = await Grievance.find()
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    const totalGrievances = grievances.length;
    const resolvedGrievances = grievances.filter((g) => g.status === 'resolved');
    const resolvedCount = resolvedGrievances.length;
    const pendingCount = grievances.filter((g) => ['open', 'in-progress'].includes(g.status)).length;
    const resolutionRate = totalGrievances > 0 ? Math.round((resolvedCount / totalGrievances) * 100) : 0;

    const resolutionDays = resolvedGrievances
      .map((g) => {
        const created = new Date(g.createdAt);
        const resolvedAt = new Date(g.resolutionDate || g.updatedAt);
        return toDays(resolvedAt - created);
      })
      .filter((d) => Number.isFinite(d) && d >= 0);

    const avgResolutionDays = resolutionDays.length
      ? resolutionDays.reduce((sum, d) => sum + d, 0) / resolutionDays.length
      : 0;

    const slaCompliant = resolutionDays.filter((d) => d <= 7).length;
    const slaComplianceRate = resolutionDays.length ? Math.round((slaCompliant / resolutionDays.length) * 100) : 0;

    const activeOfficersCount = new Set(
      grievances.filter((g) => g.assignedTo).map((g) => String(g.assignedTo._id || g.assignedTo))
    ).size;

    const ratingValues = grievances
      .map((g) => safeNumber(g.citizenRating, null))
      .filter((r) => r !== null && r >= 1 && r <= 5);
    const satisfactionAvg = ratingValues.length
      ? Math.round((ratingValues.reduce((sum, r) => sum + r, 0) / ratingValues.length) * 10) / 10
      : 0;

    const now = Date.now();
    const overdueIssues = grievances
      .filter((g) => !['resolved', 'closed', 'rejected'].includes(g.status))
      .map((g) => {
        const daysOpen = toDays(now - new Date(g.createdAt).getTime());
        const upvotes = Number.isFinite(g.upvotes) ? g.upvotes : (g.comments?.length || 0);
        return {
          _id: g._id,
          title: g.title,
          description: g.description,
          category: g.category,
          priority: g.priority,
          status: g.status,
          createdAt: g.createdAt,
          user: g.userId ? { name: g.userId.name, email: g.userId.email } : null,
          assignedTo: g.assignedTo ? { name: g.assignedTo.name, email: g.assignedTo.email } : null,
          upvotes,
          daysOpen,
        };
      })
      .filter((g) => g.daysOpen > 7)
      .sort((a, b) => b.daysOpen - a.daysOpen)
      .slice(0, 6);

    const categoryKeys = ['infrastructure', 'health', 'academic', 'administrative', 'other'];
    const categoryCounts = categoryKeys.reduce((acc, key) => {
      acc[key] = grievances.filter((g) => g.category === key).length;
      return acc;
    }, {});

    const categoryBreakdown = categoryKeys.map((key) => {
      const count = categoryCounts[key] || 0;
      const percentage = totalGrievances > 0 ? Math.round((count / totalGrievances) * 100) : 0;
      return { key, count, percentage };
    });

    const budgetKeys = ['water', 'roads', 'electricity', 'other'];
    const budgetTotals = budgetKeys.reduce(
      (acc, key) => {
        acc[key] = { amount: 0, items: 0 };
        return acc;
      },
      {}
    );

    for (const g of grievances) {
      const category = g.budget?.category;
      const amount = safeNumber(g.budget?.amount, 0);
      if (!category || !budgetTotals[category] || amount <= 0) continue;
      budgetTotals[category].amount += amount;
      budgetTotals[category].items += 1;
    }

    const totalBudgetUsed = Object.values(budgetTotals).reduce((sum, v) => sum + safeNumber(v.amount, 0), 0);
    const budgetBreakdown = budgetKeys.map((key) => {
      const amount = safeNumber(budgetTotals[key].amount, 0);
      const percentage = totalBudgetUsed > 0 ? Math.round((amount / totalBudgetUsed) * 100) : 0;
      return { key, amount, percentage, items: budgetTotals[key].items };
    });

    const assignmentDiffHours = grievances
      .filter((g) => g.firstAssignedAt)
      .map((g) => (new Date(g.firstAssignedAt) - new Date(g.createdAt)) / (1000 * 60 * 60))
      .filter((h) => Number.isFinite(h) && h >= 0);

    const firstResponseHoursAvg = assignmentDiffHours.length
      ? Math.round((assignmentDiffHours.reduce((sum, h) => sum + h, 0) / assignmentDiffHours.length) * 10) / 10
      : 0;

    const repeatIssuesCount = grievances.reduce((sum, g) => sum + safeNumber(g.reopenedCount, 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totals: {
          totalGrievances,
          resolvedCount,
          pendingCount,
          resolutionRate,
          avgResolutionDays: Math.round(avgResolutionDays * 10) / 10,
          activeOfficersCount,
          totalBudgetUsed,
        },
        satisfaction: {
          avg: satisfactionAvg,
          count: ratingValues.length,
        },
        charts: {
          categoryBreakdown,
        },
        overdueIssues,
        budget: {
          totalBudgetUsed,
          breakdown: budgetBreakdown,
        },
        performance: {
          slaComplianceRate,
          firstResponseHoursAvg,
          repeatIssuesCount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request Grievance Cancellation
exports.requestCancellation = async (req, res) => {
  try {
    const { grievanceId, reason } = req.body;
    const userId = req.user.id;

    if (!grievanceId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Grievance ID and reason are required'
      });
    }

    // Find the grievance
    const grievance = await Grievance.findById(grievanceId);
    
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    // Check if the user owns this grievance
    if (grievance.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own grievances'
      });
    }

    // Check if grievance can be cancelled
    if (['resolved', 'rejected', 'cancelled'].includes(grievance.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${grievance.status} grievance`
      });
    }

    // Add cancellation request to the grievance
    if (!grievance.cancellationRequest) {
      grievance.cancellationRequest = {};
    }

    grievance.cancellationRequest = {
      requested: true,
      reason: reason,
      requestedAt: new Date(),
      status: 'pending' // pending, approved, rejected
    };

    await grievance.save();

    res.status(200).json({
      success: true,
      message: 'Cancellation request submitted successfully. It will be reviewed by an administrator.',
      data: grievance
    });
  } catch (error) {
    console.error('Request Cancellation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit cancellation request',
      error: error.message
    });
  }
};
