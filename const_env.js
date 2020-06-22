exports.hostname = '127.0.0.1';
exports.port = '8080';

// Mongo
const url = 'mongodb://localhost:27017/';
const db_name = 'SPHS_DB';
const url_db = url + db_name;

exports.url = url;
exports.db_name = db_name;
exports.url_db = url_db;

// collection name
exports.db_collection = {
  roles: 'roles',
  users: 'users',
  transactions: 'transactions',
  companies: 'companies',
  packingTickets: 'parkingtickets',
  vehicleTypes: 'vehicletypes'
};

// limit get list data
const skip = 0;
const limit = 200;

exports.skip = skip;
exports.limit = limit;