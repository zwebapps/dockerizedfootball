const { authJwt } = require("../middlewares/");
const league = require("../controllers/league.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });

app.post("/league/create", authJwt.isAuthenticated, league.createLeague);

app.get("/league/all", authJwt.isAuthenticated, league.getLeagues);

app.get("/league/:id", authJwt.isAuthenticated, league.getLeagueById);

app.post("/league/update/:id", authJwt.isAuthenticated, league.updateLeague);

app.post("/league/delete/:id", authJwt.isAuthenticated, league.deleteLeague);

app.post("/league/delete/all", authJwt.isAuthenticated, league.deleteAllLeagues);

};