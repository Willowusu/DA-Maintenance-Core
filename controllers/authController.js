const User = require('../models/user');
const NodeCache = require("node-cache");
const otpCache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // OTP valid for 5 minutes
const jsonWebToken = require('jsonwebtoken');

exports.requestOtp = async (req, res) => {
    const { phone_number } = req.body;

    //check if number is tied to a user
    const user = await User.findOne({ phone_number });
    if (!user || !user.is_active) {
        return res.json({
            code: 404,
            status: 'error',
            data: {},
            message: 'User not found or inactive'
        });
    }

    //Check cache for existing OTP
    const cachedOtp = otpCache.get(phone_number);
    if (cachedOtp) {
        return res.json({
            code: 200,
            status: 'success',
            data: { otp: cachedOtp }, // In production, do not send OTP back in response
            message: 'OTP already sent. Please wait before requesting a new one.'
        });
    }

    //for testing purposes let a specific number always return the same OTP
    if (phone_number === '233000000000') {
        const testOtp = '123456';
        otpCache.set(phone_number, testOtp);
        return res.json({
            code: 200,
            status: 'success',
            data: { otp: testOtp }, // In production, do not send OTP back in response
            message: 'OTP sent successfully'
        });
    }

    // Logic to generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Here you would typically save the OTP to the database or cache with an expiration time
    otpCache.set(phone_number, otp);

    // Simulate sending OTP via SMS (replace with actual SMS service)
    console.log(`Sending OTP ${otp} to phone number ${phone_number}`);

    res.json({
        code: 200,
        status: 'success',
        data: { otp }, // In production, do not send OTP back in response
        message: 'OTP sent successfully'
    });
}

exports.verifyOtp = async (req, res) => {
    const { phone_number, otp } = req.body;

    // Logic to verify OTP
    const cachedOtp = otpCache.get(phone_number);
    const isValidOtp = cachedOtp === otp;

    if (isValidOtp) {
        // OTP is valid, proceed with authentication
        otpCache.del(phone_number); // Invalidate OTP after successful verification

        // Logic to generate and return auth token can be added here
        //fetch user details
        const user = await User.findOne({ phone_number });
        const token = jsonWebToken.sign(
            { _id: user._id, full_name: user.full_name, phone_number: user.phone_number, role: user.role, business: user.business, is_active: user.is_active },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );


        res.json({
            code: 200,
            status: 'success',
            data: { token },
            message: 'OTP verified successfully'
        });
    } else {
        res.json({
            code: 400,
            status: 'error',
            message: 'Invalid OTP'
        });
    }
}

exports.getProfile = async (req, res) => {
    const user = req.user; // Retrieved from authentication middleware

    //retrieve user details from database to ensure we have the latest info
    const freshUser = await User.findById(user._id).populate('business'); // Populate business name if needed

    res.json({
        code: 200,
        status: 'success',
        data: freshUser,
        message: 'User profile retrieved successfully'
    });
}

exports.updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const { full_name, phone_number } = req.body; // Removed 'role' for security

        // Update only allowed fields
        if (full_name) user.full_name = full_name;
        if (phone_number) user.phone_number = phone_number;

        // Check if anything actually changed before saving
        if (user.isModified()) {
            await user.save();
        }

        res.status(200).json({
            code: 200,
            status: 'success',
            data: {
                id: user._id,
                full_name: user.full_name,
                phone_number: user.phone_number,
                role: user.role // Return it, but don't let them change it
            },
            message: 'User profile updated successfully'
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

