const mongoose = require('mongoose');
const env = require('../const_env');

const feedBackSchema = mongoose.Schema({
  email: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 1000
  }
});


module.exports = mongoose.model(env.db_collection.feedBacks, feedBackSchema);
