const { authJwt } = require("../middlewares/");
const fixture = require("../controllers/fixture.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });

app.post("/fixture/create", authJwt.isAuthenticated, fixture.createFixture);

app.get("/fixture/all", authJwt.isAuthenticated, fixture.getAllFixture);

app.get("/fixture/:id", authJwt.isAuthenticated, fixture.getFixtureById);

app.post("/fixture/approve/:id", authJwt.isAuthenticated, fixture.updateFixture);

app.post("/fixture/update/:id", authJwt.isAuthenticated, fixture.updateFixture);

app.post("/fixture/delete/:id", authJwt.isAuthenticated, fixture.deleteFixture);

app.post("/fixture/delete/all", authJwt.isAuthenticated, fixture.deleteAllFixture);

};