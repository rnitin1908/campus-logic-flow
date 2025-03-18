
const Staff = require('../models/Staff');

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private
const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find({});
    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get staff by ID
// @route   GET /api/staff/:id
// @access  Private
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
      res.json(staff);
    } else {
      res.status(404).json({ message: 'Staff not found' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Staff not found' });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// @desc    Create a staff
// @route   POST /api/staff
// @access  Private/Admin
const createStaff = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      department,
      position,
      dateOfBirth,
      gender,
      contactNumber,
      address,
      qualification,
      status
    } = req.body;

    const staffExists = await Staff.findOne({ email });

    if (staffExists) {
      return res.status(400).json({ message: 'Staff already exists' });
    }

    const staff = await Staff.create({
      name,
      email,
      employeeId,
      department,
      position,
      dateOfBirth,
      gender,
      contactNumber,
      address,
      qualification,
      status
    });

    if (staff) {
      res.status(201).json(staff);
    } else {
      res.status(400).json({ message: 'Invalid staff data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a staff
// @route   PUT /api/staff/:id
// @access  Private/Admin
const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
      staff.name = req.body.name || staff.name;
      staff.email = req.body.email || staff.email;
      staff.employeeId = req.body.employeeId || staff.employeeId;
      staff.department = req.body.department || staff.department;
      staff.position = req.body.position || staff.position;
      staff.dateOfBirth = req.body.dateOfBirth || staff.dateOfBirth;
      staff.gender = req.body.gender || staff.gender;
      staff.contactNumber = req.body.contactNumber || staff.contactNumber;
      staff.address = req.body.address || staff.address;
      staff.qualification = req.body.qualification || staff.qualification;
      staff.status = req.body.status || staff.status;

      const updatedStaff = await staff.save();
      res.json(updatedStaff);
    } else {
      res.status(404).json({ message: 'Staff not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a staff
// @route   DELETE /api/staff/:id
// @access  Private/Admin
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
      await Staff.deleteOne({ _id: staff._id });
      res.json({ message: 'Staff removed' });
    } else {
      res.status(404).json({ message: 'Staff not found' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Staff not found' });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

module.exports = {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
