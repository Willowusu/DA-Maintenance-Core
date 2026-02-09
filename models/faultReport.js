const mongoose = require('mongoose');
const { Schema } = mongoose;

const faultReportSchema = new Schema({
  reporter_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  business_id: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  service_id: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  description: { type: String, required: true },
  location_detail: { type: String, required: true },
  image_urls: { type: [String], required: false },
  status: { type: String, required: true, enum: ['reported', 'approved', 'in_progress', 'resolved'], default: 'reported' },
  status_history: [{
    status: { type: String, required: true, enum: ['reported', 'approved', 'in_progress', 'resolved'] },
    updated_at: { type: Date, required: true, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('FaultReport', faultReportSchema);