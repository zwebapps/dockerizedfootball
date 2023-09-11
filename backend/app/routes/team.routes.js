const { authJwt } = require("../middlewares/");
const team = require("../controllers/team.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });
app.post("/team/create", authJwt.isAuthenticated, team.createTeam);

app.get("/team/all", authJwt.isAuthenticated, team.getAllTeams);

app.get("/team/:id", authJwt.isAuthenticated, team.getTeamById);

app.get("/team/foracademy/:id", authJwt.isAuthenticated, team.getTeamByAcademyId);

app.post("/team/update/:id", authJwt.isAuthenticated, team.updateTeam);

app.post("/team/delete/:id", authJwt.isAuthenticated, team.deleteTeam);

app.post("/team/delete/all", authJwt.isAuthenticated, team.deleteAllTeams);

};
