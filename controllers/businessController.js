const Business = require('../models/business');

exports.createBusiness = async (req, res) => {
    const { name, address, contact_person, phone, email } = req.body;

    let business = new Business({
        name,
        address,
        contact_person,
        phone,
        email
    });

    await business.save();
    // Logic to create a business
    res.json({
        code: 201,
        status: 'success',
        data: business,
        message: 'Business created successfully'
    });
}

exports.getBusinesses = async (req, res) => {
    // Logic to fetch all businesses
    const businesses = await Business.find();

    res.json({
        code: 200,
        status: 'success',
        data: businesses,
        message: 'Businesses retrieved successfully'
    });
}

exports.getBusinessById = async (req, res) => {
    const { id } = req.params;
    // Logic to fetch a business by ID
    const business = await Business.findById(id);

    if (!business) {
        return res.json({
            code: 404,
            status: 'error',
            data: {},
            message: 'Business not found'
        });
    }

    res.json({
        code: 200,
        status: 'success',
        data: business,
        message: 'Business retrieved successfully'
    });
}