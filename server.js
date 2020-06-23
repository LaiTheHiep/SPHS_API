const Utils = require("./Utils");
const env = require('./const_env');
const express = require('express');
const port = env.port;
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();

// Use Node.js body parsing middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// init database
Utils.setupDatabase();

const role = require('./models/roles.model');
const role_link = `/${env.db_collection.roles}`;
Utils.get(app, role, role_link);
Utils.post(app, role, role_link);
Utils.put(app, role, role_link);
Utils.delete(app, role, role_link);

const user = require('./models/users.model');
const user_link = `/${env.db_collection.users}`;
const user_api = require('./api/users.api');
user_api.authentication(app, '/authentication');
// Utils.get(app, user, user_link);
user_api.get(app);
Utils.post(app, user, user_link);
Utils.put(app, user, user_link);
Utils.delete(app, user, user_link);

const parkingTicket = require('./models/parkingTickets.model');
const parkingTicket_link = `/${env.db_collection.packingTickets}`;
Utils.get(app, parkingTicket, parkingTicket_link);
Utils.post(app, parkingTicket, parkingTicket_link);
Utils.put(app, parkingTicket, parkingTicket_link);
Utils.delete(app, parkingTicket, parkingTicket_link);

const company = require('./models/companies.model');
const company_link = `/${env.db_collection.companies}`;
Utils.get(app, company, company_link);
Utils.post(app, company, company_link);
Utils.put(app, company, company_link);
Utils.delete(app, company, company_link);

const transaction = require('./models/transactions.model');
const transaction_link = `/${env.db_collection.transactions}`;
Utils.get(app, transaction, transaction_link);
Utils.post(app, transaction, transaction_link);
Utils.put(app, transaction, transaction_link);
Utils.delete(app, transaction, transaction_link);

const vehicleType = require('./models/vehicleTypes.model');
const vehicleType_link = `/${env.db_collection.vehicleTypes}`;
Utils.get(app, vehicleType, vehicleType_link);
Utils.post(app, vehicleType, vehicleType_link);
Utils.put(app, vehicleType, vehicleType_link);
Utils.delete(app, vehicleType, vehicleType_link);

// Start the server
const server = app.listen(port, (error) => {
  if (error) {
    throw error;
  }
});
