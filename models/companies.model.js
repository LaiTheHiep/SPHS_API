const mongoose = require('mongoose');
const env = require('../const_env');

const companySchema = mongoose.Schema({
  name: { type: String, unique: true, required: true },
  address: { type: String, required: true },
  ports: { type: [String], default: [] }, // ports = [] - building
  parent: { type: String },
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


module.exports = mongoose.model(env.db_collection.companies, companySchema);
