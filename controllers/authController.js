const User = require('../models/user');
const NodeCache = require("node-cache");
const otpCache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // OTP valid for 5 minutes
const jsonWebToken = require('jsonwebtoken');

exports.requestOtp = async (req, res) => {
    const { phone_number } = req.body;

    //check if number is tied to a user
    const user = await User.findOne({ phone_number });
    if (!user) {
        return res.json({
            code: 404,
            status: 'error',
            data: {},
            message: 'User not found'
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

    res.json({
        code: 200,
        status: 'success',
        data: user,
        message: 'User profile retrieved successfully'
    });
}

exports.updateProfile = async (req, res) => {
    const user = req.user; // Retrieved from authentication middleware
    const { full_name, phone_number, role } = req.body;

    // Update user fields
    if (full_name) user.full_name = full_name;
    if (phone_number) user.phone_number = phone_number;
    if (role) user.role = role;

    await user.save();

    res.json({
        code: 200,
        status: 'success',
        data: user,
        message: 'User profile updated successfully'
    });
}