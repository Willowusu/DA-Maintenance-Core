const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user'); // Adjust path to your User model

dotenv.config();

const businessId = "6978e2a121a88dfc9fc50d83";

const users = [
    {
        business: businessId,
        full_name: "Joseph Danquah",
        phone_number: "233557079838",
        role: "reporter"
    },
    {
        business: businessId,
        full_name: "Admin User",
        phone_number: "233240000001",
        role: "business_admin"
    },
    {
        business: businessId,
        full_name: "Assistant Reporter",
        phone_number: "233240000002",
        role: "reporter"
    }
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database...");

        // Note: Using insertMany with { ordered: false } will continue 
        // even if one phone number already exists (if you have a unique index)
        await User.insertMany(users, { ordered: false });
        
        console.log(`${users.length} users seeded successfully for business ${businessId}!`);
        process.exit();
    } catch (err) {
        if (err.code === 11000) {
            console.warn("Note: Some users were already in the database (duplicate phone numbers skipped).");
            process.exit(0);
        } else {
            console.error("Error seeding users:", err);
            process.exit(1);
        }
    }
};

seedUsers();