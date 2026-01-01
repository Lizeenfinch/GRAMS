const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['water', 'waste', 'roads', 'electric', 'other'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed', 'rejected', 'blocked'],
      default: 'open',
    },
    isEscalated: {
      type: Boolean,
      default: false,
    },
    escalatedAt: {
      type: Date,
      required: false,
    },
    daysOpen: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    firstAssignedAt: {
      type: Date,
      required: false,
    },
    assignedAt: {
      type: Date,
      required: false,
    },
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['image', 'video'],
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    upvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    upvotedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    reopenedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    resolution: {
      type: String,
      required: false,
    },
    resolutionDate: {
      type: Date,
      required: false,
    },
    citizenRating: {
      type: Number,
      required: false,
      min: 1,
      max: 5,
    },
    budget: {
      allocated: {
        type: Number,
        default: 0,
        min: 0,
      },
      spent: {
        type: Number,
        default: 0,
        min: 0,
      },
      category: {
        type: String,
        enum: ['water', 'roads', 'electricity', 'waste', 'other'],
        required: false,
      },
      description: {
        type: String,
        required: false,
      },
      expenseDetails: [{
        item: String,
        cost: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      }],
    },
    location: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Grievance', grievanceSchema);
