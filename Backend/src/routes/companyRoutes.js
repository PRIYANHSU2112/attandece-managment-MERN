const express = require('express');
const router = express.Router();
const { getCompanySettings, updateCompanySettings } = require('../controllers/companyController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router
    .route('/')
    .get(protect, getCompanySettings)
    .put(protect, authorize('Admin'), updateCompanySettings);

module.exports = router;