const mongoose = require('mongoose');
const { Schema } = mongoose;

const businessSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact_person: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);