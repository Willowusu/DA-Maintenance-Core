const User = require('../models/user');
const Business = require('../models/business');

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

exports.getAppUsers = async (req, res) => {
    // Logic to fetch all user
    //users can be business_admin or reporter
    const users = await User.find({ role: { $in: ['business_admin', 'reporter'] } }).populate('business', 'name');

    res.json({
        code: 200,
        status: 'success',
        data: users,
        message: 'Users retrieved successfully'
    });
}

exports.getAdminUsers = async (req, res) => {
    // Logic to fetch all user
    //users can be business_admin or reporter
    const users = await User.find({ role: 'super_admin' });

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

exports.deleteUserAccount = async (req, res) => {
    try {

        const user = req.user; // Retrieved from authentication middleware

        // Update user fields
        user.is_active = false; // Soft delete by marking as inactive

        await user.save();

        res.json({
            code: 200,
            status: 'success',
            data: user,
            message: 'User profile deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: 'error',
            message: 'Internal server error',
            details: error.message
        });
    }
}

exports.inviteUser = async (req, res) => {
    try {
        const { name, phone_number, role, business_id } = req.body;

        // 1. Basic Validation
        if (!name || !phone_number || !role || !business_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide all required fields (Name, Phone, Role, Business)." 
            });
        }

        // 2. Check if Business exists
        const business = await Business.findById(business_id);
        if (!business) {
            return res.status(404).json({ 
                success: false, 
                message: "The selected business does not exist." 
            });
        }

        // 3. Check if user is already registered or invited
        const existingUser = await User.findOne({ phone_number });
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: "A user with this phone number already exists in the system." 
            });
        }

        // 4. Create the User record (status defaults to pending/inactive)
        const newUser = await User.create({
            full_name: name,
            phone_number: phone_number,
            role: role,
            business: business_id,
            is_active: false // They are inactive until they set up their account
        });

        /** * 5. Integration Point: Send SMS 
         * This is where you'd call your SMS gateway (e.g., Hubtel, Twilio, Arkesel)
         * to send the invitation link.
         */
        // await smsService.sendInvite(phone_number, name, business.name);

        res.status(201).json({
            success: true,
            message: "Invitation processed successfully",
            data: newUser
        });

    } catch (error) {
        console.error("Invite Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error while processing invitation." 
        });
    }
};


exports.toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        // 1. Find the user
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // 2. Security Check: Prevent self-deactivation
        // Assuming your auth middleware attaches the logged-in admin to req.user
        if (req.user && req.user._id.toString() === id && is_active === false) {
            return res.status(403).json({
                success: false,
                message: "Security Alert: You cannot deactivate your own administrative account."
            });
        }

        // 3. Update the status
        user.is_active = is_active;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User has been ${is_active ? 'activated' : 'deactivated'} successfully.`,
            data: {
                id: user._id,
                is_active: user.is_active
            }
        });

    } catch (error) {
        console.error("Toggle Status Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while updating user status."
        });
    }
};