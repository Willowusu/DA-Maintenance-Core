//a middleware function to check authentication and authorization
const jsonWebToken = require('jsonwebtoken');
const User = require('./models/user');

exports.authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Expecting Bearer token

    if (!token) {
        return res.json({
            code: 401,
            status: 'error',
            data: {},
            message: 'Authentication token missing'
        });
    }

    try {
        const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.json({
                code: 401,
                status: 'error',
                data: {},
                message: 'User not found'
            });
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.json({
            code: 401,
            status: 'error',
            data: {},
            message: 'Invalid authentication token'
        });
    }
};