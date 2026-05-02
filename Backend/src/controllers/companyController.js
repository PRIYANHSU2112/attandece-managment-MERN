const asyncHandler = require('express-async-handler');
const Company = require('../models/companyModel');

const getCompanySettings = asyncHandler(async (req, res) => {
    let company = await Company.findOne();

    if (!company) {
        company = await Company.create({
            name: 'Company HQ',
            latitude: 18.5204,
            longitude: 73.8567,
            radius: 500
        });
    }

    res.json(company);
});

const updateCompanySettings = asyncHandler(async (req, res) => {
    const { latitude, longitude, radius, name } = req.body;

    let company = await Company.findOne();

    if (company) {
        company.name = name || company.name;
        company.latitude = latitude !== undefined ? latitude : company.latitude;
        company.longitude = longitude !== undefined ? longitude : company.longitude;
        company.radius = radius !== undefined ? radius : company.radius;

        const updatedCompany = await company.save();
        res.json(updatedCompany);
    } else {
        const newCompany = await Company.create({
            name: name || 'Company HQ',
            latitude: latitude || 18.5204,
            longitude: longitude || 73.8567,
            radius: radius || 500
        });
        res.status(201).json(newCompany);
    }
});

module.exports = {
    getCompanySettings,
    updateCompanySettings,
};
