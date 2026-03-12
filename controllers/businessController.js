const Business = require('../models/business');
const User = require('../models/user');
const Fault = require('../models/faultReport');

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
    try {
        const businesses = await Business.aggregate([
            {
                $lookup: {
                    from: 'users', // The collection name for Users
                    localField: '_id',
                    foreignField: 'business',
                    as: 'staff'
                }
            },
            {
                $lookup: {
                    from: 'faults', // The collection name for Faults
                    localField: '_id',
                    foreignField: 'business',
                    as: 'faults'
                }
            },
            {
                $project: {
                    name: 1, // Add other business fields you need here
                    address: 1,
                    contact_person: 1,
                    phone: 1,
                    email: 1,
                    staff_count: { $size: '$staff' },
                    pending_faults: {
                        $size: {
                            $filter: {
                                input: '$faults',
                                as: 'fault',
                                cond: { $in: ['$$fault.status', ['reported', 'approved', 'in_progress']] }
                            }
                        }
                    }
                }
            }
        ]);

        res.json({
            code: 200,
            status: 'success',
            data: businesses,
            message: 'Businesses retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
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