const FaultReport = require('../models/faultReport');
const Business = require('../models/business');
const User = require('../models/user');
const Service = require('../models/service');



exports.getAnalyticsReport = async (req, res) => {
    const { from, to, category, granularity } = req.query;

    // 1. Map category to the correct Mongoose Model
    const models = {
        faults: FaultReport,
        businesses: Business,
        users: User,
        services: Service
    };

    const TargetModel = models[category];
    
    // 2. Set date grouping format
    let format = "%Y-%m-%d"; 
    if (granularity === 'weekly') format = "%Y-W%U";
    if (granularity === 'monthly') format = "%Y-%m";

    try {
        const report = await TargetModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(from), $lte: new Date(to) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: format, date: "$createdAt" } },
                    total: { $sum: 1 },
                    // Conditional: only calculate resolution if it's the Faults category
                    ...(category === 'faults' && {
                        resolved: { $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] } }
                    })
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.status(200).json({ success: true, data: report });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};