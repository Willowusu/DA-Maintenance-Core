const User = require('../models/user');

exports.createUser = async (req, res) => {
    const { business, full_name, phone_number, role} = req.body;

    let user = new User({
        business,
        full_name,
        phone_number, 
        role
    });

    await user.save();
  
    // Logic to create a user
    res.json({
        code: 201,
        status: 'success',
        data: user,
        message: 'User created successfully'
    });
}

exports.getUsers = async (req, res) => {
    // Logic to fetch all users
    const users = await User.find();

    res.json({
        code: 200,
        status: 'success',
        data: users,
        message: 'Users retrieved successfully'
    });
}

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    // Logic to fetch a user by ID
    const user = await User.findById(id);

    if (!user) {
        return res.json({
            code: 404,
            status: 'error',
            data: {},
            message: 'User not found'
        });
    }

    res.json({
        code: 200,
        status: 'success',
        data: user,
        message: 'User retrieved successfully'
    });
}

//get users by business
exports.getUsersByBusiness = async (req, res) => {
    const { businessId } = req.params;
    // Logic to fetch users by business ID
    const users = await User.find({ business: businessId });

    res.json({
        code: 200,
        status: 'success',
        data: users,
        message: 'Users retrieved successfully'
    });
}   