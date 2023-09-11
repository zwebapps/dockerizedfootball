const dotenv = require('dotenv');
if(!process.env.DB_USERNAME){
  dotenv.config();
}
const  ObjectId = require('mongodb').ObjectId;
const express = require("express");
const bcrypt = require("bcryptjs");

const cors = require("cors");
const cookieSession = require("cookie-session");
const environment = require("./app/config/db.config");
const morgan  = require('morgan');
const bodyParser = require('body-parser')
const app = express();
const path = require('path')
global.__basedir = __dirname;
const {secret, client } = require("./app/config/auth.config");

app.use(morgan('tiny'));

/* for Angular Client (withCredentials) */
app.use(function (req, res, next) {
     // Website you wish to allow to connect
     res.setHeader('Access-Control-Allow-Origin', "*");

     // Request methods you wish to allow
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
   
     // Set to true if you need the website to include cookies in the requests sent
     // to the API (e.g. in case you use sessions)
     res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

// app.use( '*', 
//   cors({
//     'Access-Control-Allow-Credentials': true,
//     origin: client,
//   })
// );

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));



app.use(
  cookieSession({
    name: "football-session",
    keys: [secret],
    httpOnly: true
  })
);

const db = require("./app/models");
const Role = db.role;
const User = db.user;
const Increment  = db.increment;

console.log(environment.mongodb.uri,"<<<<<<<<<<<<")
db.mongoose
  .connect(environment.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to football management application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/academy.routes")(app);
require("./app/routes/fixture.routes")(app);
require("./app/routes/league.routes")(app);
require("./app/routes/player.routes")(app);
require("./app/routes/team.routes")(app);
require("./app/routes/roles.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;


app.use('/static', express.static(path.join(__basedir, 'public/resources/assets')))
app.use('/csv', express.static(path.join(__basedir, 'public/resources/csv')))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });

      new Role({
        name: "coach"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'coach' to roles collection");
      });

      new Role({
        name: "referee"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'referee' to roles collection");
      });
    }
  });

  Increment.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Increment({ name: "item_id" , sequence_value : 0 }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'Counter for sequence' to increment collection");
      });     
    }
  });

  User.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      Role.findOne({ name: 'admin' }).then((role)=> {
        new User({
          firstname: 'yfl',
          lastname: 'admin',
          username: 'yfladmin',
          contact: '+971553762217',
          password: bcrypt.hashSync('Admin@yfl', 8),
          email: 'admin@yfl.com',
          roles: [ObjectId(role._id)]
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'admin' to users collection");
        })
      });
    }
  })
}
