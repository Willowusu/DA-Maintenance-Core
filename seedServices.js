const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/service'); // Adjust path to your model

dotenv.config();

const services = [
    {
        name: "Plumbing Repairs",
        description: "Leak detection, pipe repairs, tap replacements",
        response_time: "Within 4–6 hours",
        price: "From GHS 130/hour",
        icon:{
            outlined: "https://www.svgrepo.com/show/382975/cleaning-clean-plunger.svg",
            filled: "https://www.svgrepo.com/show/385042/cleaning-clean-plunger.svg"
        }
    },
    {
        name: "Electrical Repairs",
        description: "Fault finding, socket/switch repairs, lighting issues",
        response_time: "Within 4–6 hours",
        price: "From GHS 140/hour",
        icon:{
            outlined: "https://www.svgrepo.com/show/512410/lightning-1262.svg",
            filled: "https://www.svgrepo.com/show/510043/lightning.svg"
        }
    },
    {
        name: "HVAC Maintenance",
        description: "Heating and cooling system repair, filter replacement",
        response_time: "Same day (if emergency)",
        price: "From GHS 150/visit",
        icon:{
            outlined: "https://www.svgrepo.com/show/433253/airconditioning-o.svg",
            filled: "https://www.svgrepo.com/show/433250/airconditioning-sf.svg"
        }
    },
    {
        name: "Carpentry Repairs",
        description: "Door/frame repair, cabinet fixing, floorboard issues",
        response_time: "Within 24 hours",
        price: "From GHS 100/hour",
        icon:{
            outlined: "https://www.svgrepo.com/show/437004/hammer.svg",
            filled: "https://www.svgrepo.com/show/344894/hammer.svg"
        }
    },
    {
        name: "Roofing Repairs",
        description: "Minor leak patching, tile replacement, gutter issues",
        response_time: "Within 24–48 hours",
        price: "From GHS 130/job",
        icon:{
            outlined: "https://www.svgrepo.com/show/283395/roof.svg",
            filled: "https://www.svgrepo.com/show/283229/roof.svg"
        }
    },
    {
        name: "Emergency Call-Outs",
        description: "For urgent repairs outside regular working hours",
        response_time: "Within 2–3 hours",
        price: "GHS 155 flat call-out + labor",
        icon:{
            outlined: "https://www.svgrepo.com/show/404153/sos-button.svg",
            filled: "https://www.svgrepo.com/show/435154/sos.svg"
        }
    },
    {
        name: "Appliance Repairs",
        description: "Washer, dryer, oven repair diagnostics and minor fixes",
        response_time: "Within 24 hours",
        price: "From GHS 100/hour",
        icon:{
            outlined: "https://www.svgrepo.com/show/527325/plug-circle.svg",
            filled: "https://www.svgrepo.com/show/526111/plug-circle.svg"
        }
    },
    {
        name: "Painting & Touch-Ups",
        description: "Small paint jobs, wall patching, surface refinishing",
        response_time: "Within 2–3 days",
        price: "From GHS 100/hour",
        icon:{
            outlined: "https://www.svgrepo.com/show/347250/paint-brush.svg",
            filled: "https://www.svgrepo.com/show/346176/paint-brush-fill.svg"
        }
    },
    {
        name: "Locksmith Services",
        description: "Lockout assistance, lock repair/replacement",
        response_time: "Within 2 hours (emergency)",
        price: "From GHS 100 flat fee",
        icon:{
            outlined: "https://www.svgrepo.com/show/526562/key-minimalistic-square-3.svg",
            filled: "https://www.svgrepo.com/show/525392/key-minimalistic-square-3.svg"
        }
    },
    {
        name: "General Handyman",
        description: "Minor tasks like shelf fixing, curtain hanging, etc.",
        response_time: "Within 24 hours",
        price: "From GHS 150/hour",
        icon:{
            outlined: "https://www.svgrepo.com/show/252580/hammer-spanner.svg",
            filled: "https://www.svgrepo.com/show/252476/hammer-spanner.svg"
        }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database...");

        // Clear existing services to avoid duplicates
        await Service.deleteMany({});
        console.log("Cleared existing services.");

        // Insert the new list
        await Service.insertMany(services);
        console.log("Services seeded successfully!");

        process.exit();
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
};

seedDB();