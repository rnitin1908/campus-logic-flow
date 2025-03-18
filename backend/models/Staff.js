
const mongoose = require('mongoose');

const staffSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    contactNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    qualification: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on leave', 'terminated'],
      default: 'active',
    }
  },
  {
    timestamps: true,
  }
);

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
