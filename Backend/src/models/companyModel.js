const mongoose = require('mongoose');

const companySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            default: 'Default Company'
        },
        latitude: {
            type: Number,
            required: true,
            default: 18.5204
        },
        longitude: {
            type: Number,
            required: true,
            default: 73.8567
        },
        radius: {
            type: Number,
            required: true,
            default: 500 // meters
        }
    },
    {
        timestamps: true,
    }
);

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
