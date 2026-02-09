const FaultReport = require('../models/faultReport');

exports.createFaultReport = async (req, res) => {
    try {
        const { service_id, description, location_detail } = req.body;

        // 1. Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.json({ code: 400, status: 'error', data: {}, message: "Please upload at least one image." });
        }

        // 2. Extract all URLs into an array
        // If using Cloudinary: file.path | If using S3: file.location
        const urls = req.files.map(file => file.path);

        // 3. Create the report
        let faultReport = new FaultReport({
            reporter_id: req.user._id,
            business_id: req.user.business,
            service_id,
            description,
            location_detail,
            image_urls: urls, // Saving the array of strings
            status: 'reported',
            status_history: [{
                status: 'reported',
                updated_at: new Date()
            }],
        });

        await faultReport.save();

        res.json({
            code: 200,
            status: 'success',
            data: faultReport,
            message: 'Fault report created successfully'
        });
    } catch (error) {
        res.json({ code: 500, status: 'error', data: {}, message: error.message });
    }
}

exports.getFaultReports = async (req, res) => {
    try {
        let query = {};

        // 1. Logic for Super Admin: See absolutely everything across all businesses
        if (req.user.role === 'super_admin') {
            query = {};
        }
        // 2. Logic for Business Admin: See all reports for their specific company
        else if (req.user.role === 'business_admin') {
            query = { business_id: req.user.business };
        }
        // 3. Logic for Reporter: See only what they personally reported
        else {
            query = { reporter_id: req.user._id };
        }

        // Fetch reports with pagination (optional) and sort by newest first
        const faultReports = await FaultReport.find(query)
            .populate('service_id') // Shows category name instead of just ID
            .populate('reporter_id') // Shows who reported it
            .populate('business_id') // Shows business name instead of just ID
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: faultReports.length,
            data: faultReports,
            message: 'Fault reports retrieved successfully'
        });
    } catch (error) {
        // Use res.status(500) to ensure the HTTP layer reflects the error
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

exports.getFaultReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const faultReport = await FaultReport.findOne({ _id: id, reporter_id: req.user._id })
            .populate('service_id', 'name') // Shows category name instead of just ID
            .populate('reporter_id', 'full_name') // Shows who reported it

        if (!faultReport) {
            return res.json({
                code: 404,
                status: 'error',
                data: {},
                message: 'Fault report not found'
            });
        }

        res.json({
            code: 200,
            status: 'success',
            data: faultReport,
            message: 'Fault report retrieved successfully'
        });
    } catch (error) {
        res.json({ code: 500, status: 'error', data: {}, message: error.message });
    }
}

exports.updateFaultReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const faultReport = await FaultReport.findById(id);
        if (!faultReport) {
            return res.json({
                code: 404,
                status: 'error',
                data: {},
                message: 'Fault report not found'
            });
        }

        // Update status and add to status history
        faultReport.status = status;
        faultReport.status_history.push({ status, updated_at: new Date() });

        await faultReport.save();

        res.json({
            code: 200,
            status: 'success',
            data: faultReport,
            message: 'Fault report status updated successfully'
        });
    } catch (error) {
        res.json({ code: 500, status: 'error', data: {}, message: error.message });
    }
}