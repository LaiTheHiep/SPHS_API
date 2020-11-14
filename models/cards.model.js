const mongoose = require('mongoose');
const env = require('../const_env');

const deviceSchema = mongoose.Schema({
  name: { type: String, unique: true, required: true },
  deviceId: { type: String, required: true },
  expired: { type: Date },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 1000
  }
});


module.exports = mongoose.model(env.db_collection.devices, deviceSchema);
