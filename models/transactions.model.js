const mongoose = require('mongoose');
const env = require('../const_env');

const transactionsSchema = mongoose.Schema({
  userId: { type: String, required: true }, // user
  author: { type: String, required: true }, // employee transaction user
  money: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model(env.db_collection.transactions, transactionsSchema);
