const mongoose = require('mongoose');
const env = require('../const_env');

const userSchema = mongoose.Schema({
  account: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, unique: true, required: true },
  companyId: { type: String, unique: true },
  cmt: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  email: { type: String, unique: true },
  role: { type: String, required: true },
  numberPlate: { type: String, unique: true, required: true },
  balance: { type: Number, default: 0 },
  description: { type: String },
  vehicleColor: { type: String, unique: true },
  vehicleBranch: { type: String, unique: true },
  vehicleType: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model(env.db_collection.users, userSchema);
