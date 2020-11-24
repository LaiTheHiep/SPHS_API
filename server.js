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

// int folder store images
// Utils.setupFolder();

// init database
// Utils.setupDatabase();

const role = require('./models/roles.model');
const role_link = `/${env.db_collection.roles}`;
Utils.get(app, role, role_link);
Utils.post(app, role, role_link);
Utils.put(app, role, role_link);
Utils.delete(app, role, role_link);
Utils.getTotal(app, role, `${role_link}-total`);

const user = require('./models/users.model');
const user_link = `/${env.db_collection.users}`;
const user_api = require('./api/users.api');
user_api.authentication(app, '/authentication');
user_api.register(app, '/register');
user_api.loginFacebook(app, '/login-facebook');
// Utils.get(app, user, user_link);
user_api.get(app);
Utils.post(app, user, user_link);
Utils.put(app, user, user_link);
Utils.delete(app, user, user_link);
Utils.getTotal(app, user, `${user_link}-total`);

const parkingTicket = require('./models/parkingTickets.model');
const parkingTicket_link = `/${env.db_collection.packingTickets}`;
Utils.get(app, parkingTicket, parkingTicket_link);
Utils.post(app, parkingTicket, parkingTicket_link);
Utils.put(app, parkingTicket, parkingTicket_link);
Utils.delete(app, parkingTicket, parkingTicket_link);
Utils.getTotal(app, parkingTicket, `${parkingTicket_link}-total`);

const company = require('./models/companies.model');
const company_link = `/${env.db_collection.companies}`;
Utils.get(app, company, company_link);
Utils.post(app, company, company_link);
Utils.put(app, company, company_link);
Utils.delete(app, company, company_link);
Utils.getTotal(app, company, `${company_link}-total`);

const transaction = require('./models/transactions.model');
const transaction_link = `/${env.db_collection.transactions}`;
Utils.get(app, transaction, transaction_link);
Utils.post(app, transaction, transaction_link);
Utils.put(app, transaction, transaction_link);
Utils.delete(app, transaction, transaction_link);
Utils.getTotal(app, transaction, `${transaction_link}-total`);

const vehicleType = require('./models/vehicleTypes.model');
const vehicleType_link = `/${env.db_collection.vehicleTypes}`;
Utils.get(app, vehicleType, vehicleType_link);
Utils.post(app, vehicleType, vehicleType_link);
Utils.put(app, vehicleType, vehicleType_link);
Utils.delete(app, vehicleType, vehicleType_link);
Utils.getTotal(app, vehicleType, `${vehicleType_link}-total`);

const feedBack = require('./models/feedBacks.model');
const feedBack_link = `/${env.db_collection.feedBacks}`;
Utils.get(app, feedBack, feedBack_link);
Utils.post(app, feedBack, feedBack_link);
Utils.getTotal(app, feedBack, `${feedBack_link}-total`);

const device = require('./models/devices.model');
const device_link = `/${env.db_collection.devices}`;
Utils.get(app, device, device_link);
Utils.post(app, device, device_link);
Utils.put(app, device, device_link);
Utils.delete(app, device, device_link);
Utils.getTotal(app, device, `${device_link}-total`);

const card = require('./models/cards.model');
const card_link = `/${env.db_collection.cards}`;
Utils.get(app, card, card_link);
Utils.post(app, card, card_link);
Utils.put(app, card, card_link);
Utils.delete(app, card, card_link);
Utils.getTotal(app, card, `${card_link}-total`);

// upload file
const parkingTicket_api = require('./api/parkingtickets.api');
parkingTicket_api.uploadImage(app);
parkingTicket_api.workDay(app);

// Start the server
const server = app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log('Server running...')
});
