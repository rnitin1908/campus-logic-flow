const express = require('express');
const { checkSchema } = require('express-validator');
const { validateRequest, commonValidations } = require('../middleware/validate');

const router = express.Router();

// Get users with pagination
router.get('/',
  checkSchema(commonValidations.paginationValidation),
  validateRequest,
  (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Your user fetching logic here
    res.json({ page, limit, data: [] });
  }
);

// Get user by ID
router.get('/:id',
  checkSchema(commonValidations.idValidation),
  validateRequest,
  (req, res) => {
    const { id } = req.params;
    // Your user fetching logic here
    res.json({ id });
  }
);

// Create new user
router.post('/',
  checkSchema(commonValidations.userValidation),
  validateRequest,
  (req, res) => {
    const userData = req.body;
    // Your user creation logic here
    res.status(201).json(userData);
  }
);

module.exports = router;
