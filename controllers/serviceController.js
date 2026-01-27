const Service = require('../models/service');

exports.createService = async (req, res) => {
    const { name, description, response_time, price } = req.body;

    let service = new Service({
        name,
        description,
        response_time,
        price
    });

    await service.save();
    // Logic to create a service
    res.json({
        code: 201,
        status: 'success',
        data: service,
        message: 'Service created successfully'
    });
}

exports.getServices = async (req, res) => {
    // Logic to fetch all services
    const services = await Service.find();

    res.json({
        code: 200,
        status: 'success',
        data: services,
        message: 'Services retrieved successfully'
    });
}

exports.getServiceById = async (req, res) => {
    const { id } = req.params;
    // Logic to fetch a service by ID
    const service = await Service.findById(id);

    if (!service) {
        return res.json({
            code: 404,
            status: 'error',
            data: {},
            message: 'Service not found'
        });
    }

    res.json({
        code: 200,
        status: 'success',
        data: service,
        message: 'Service retrieved successfully'
    });
}