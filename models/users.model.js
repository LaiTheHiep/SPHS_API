const mongoose = require('mongoose');
const env = require('../const_env');

const userSchema = mongoose.Schema({
  account: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  companyId: { type: String, required: true },
  cmt: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  email: { type: String, unique: true },
  role: { type: String, required: true },
  numberPlate: { type: String, unique: true, required: true },
  balance: { type: Number, default: 0 },
  description: { type: String },
  vehicleColor: { type: String, required: true },
  vehicleBranch: { type: String, required: true },
  vehicleType: { type: String, required: true },
  facebookId: {type: String, unique: true},
  facebook: {type: Object},
  cardIds: { type: [String], default: [] },
  devicesAccess: {type: Object},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 1000
  }
});


module.exports = mongoose.model(env.db_collection.users, userSchema);
