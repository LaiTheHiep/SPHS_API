const mongoose = require('mongoose');
const env = require('../const_env');

const parkingTicketsSchema = mongoose.Schema({
  port: { type: String, required: true },
  companyId: { type: String, required: true },
  description: { type: String },
  timeIn: { type: Date },
  timeOut: { type: Date },
  imageIn: { type: String },
  imageOut: { type: String },
  author: { type: String, required: true }, // employee
  userId: { type: String, required: true }, // vehicle parked
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 1000
  }
});


module.exports = mongoose.model(env.db_collection.packingTickets, parkingTicketsSchema);
