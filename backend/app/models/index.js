const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.academy = require("./academy.model");
db.fixture = require("./fixture.model");
db.league = require("./league.model");
db.player = require("./player.model");
db.team = require("./team.model");
db.increment = require("./increment.model");
db.contact = require("./contact.model");


db.ROLES = ["user", "admin", "coach", "referee"];

module.exports = db;