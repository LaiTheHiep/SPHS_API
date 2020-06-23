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

const PRIVATE_KEY = 'Hat Dau Nho - Manchester United';
exports.PRIVATE_KEY = PRIVATE_KEY;

const EXPIRY_TOKEN = 86400000; // 1day (milliseconds)
exports.EXPIRY_TOKEN = EXPIRY_TOKEN;

exports.FORBIDDEN = {
  get: {
    admin: [],
    manager: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`],
    employee: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`],
    user: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`]
  },
  post: {
    admin: [],
    manager: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`],
    employee: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`],
    user: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`, `/${this.db_collection.packingTickets}`]
  },
  put: {
    admin: [],
    manager: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`],
    employee: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`, `/${this.db_collection.transactions}`],
    user: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`, `/${this.db_collection.transactions}`, `/${this.db_collection.packingTickets}`]
  },
  delete: {
    admin: [],
    manager: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`],
    employee: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`],
    user: [`/${this.db_collection.roles}`, `/${this.db_collection.companies}`, `/${this.db_collection.vehicleTypes}`, `/${this.db_collection.packingTickets}`, `/${this.db_collection.users}`, `/${this.db_collection.transactions}`]
  }
};