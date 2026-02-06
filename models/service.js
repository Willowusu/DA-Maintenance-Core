const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  response_time: { type: String, required: true },
  price: { type: String, required: true },
  icon: {
    filled:{
      type: String,
      required: false,
    },
    outlined:{
      type: String,
      required: false,
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);