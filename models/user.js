const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  full_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  role: { type: String, enum: ['super_admin','business_admin', 'reporter'], required: true },
  is_active: { type: Boolean, default: true, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);