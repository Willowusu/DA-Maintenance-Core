const FaultReport = require('../models/faultReport');
const Business = require('../models/business');

exports.getDashboard = async (req, res) => {
  try {
        // 1. Calculate Stats
        const totalBusinesses = await Business.countDocuments();
        const activeFaults = await FaultReport.countDocuments({
            status: { $in: ['reported', 'approved', 'in_progress'] }
        });

        const totalRevenue = 12450.00;
        const successRate = 98.2;

        // 2. Fetch Recent Faults
        const recentFaults = await FaultReport.find()
            .populate('business_id service_id')
            .sort({ createdAt: -1 })
            .limit(5);

        // 3. Prepare Chart Data (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const monthlyStats = await FaultReport.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    reported: { $sum: 1 },
                    resolved: {
                        $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] }
                    }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const labels = [];
        const reportedData = [];
        const resolvedData = [];

        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            const m = d.getMonth() + 1; 
            const y = d.getFullYear();

            const monthData = monthlyStats.find(s => s._id.month === m && s._id.year === y);

            labels.push(monthNames[d.getMonth()]);
            reportedData.push(monthData ? monthData.reported : 0);
            resolvedData.push(monthData ? monthData.resolved : 0);
        }

        // --- RENDER INSIDE THE TRY BLOCK ---
        res.render('admin/summary', {
            layout: 'layouts/admin/main', 
            title: 'Admin Summary', 
            activePage: 'summary', 
            stats: {
                totalRevenue,
                activeFaults,
                totalBusinesses,
                successRate
            },
            recentFaults,
            chartData: {
                labels: labels, // Fixed variable name
                reported: reportedData,
                resolved: resolvedData
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Dashboard Error: " + error.message);
    }
};