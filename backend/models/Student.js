
const mongoose = require('mongoose');

const studentSchema = mongoose.Schema(
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
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
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
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    admissionDate: {
      type: Date,
    },
    class: {
      type: String,
    },
    section: {
      type: String,
    },
    academicYear: {
      type: String,
    },
    previousSchool: {
      type: String,
    },
    parentInfo: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      relation: { type: String }
    },
    emergencyContacts: [
      {
        name: { type: String },
        phone: { type: String },
        relation: { type: String }
      }
    ],
    healthInfo: {
      bloodGroup: { type: String },
      allergies: [{ type: String }],
      medicalConditions: [{ type: String }]
    },
    documents: [
      {
        type: { type: String },
        name: { type: String },
        url: { type: String },
        uploadDate: { type: Date, default: Date.now }
      }
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'suspended', 'pending'],
      default: 'active',
    }
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
