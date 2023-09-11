
const { authJwt } = require("../middlewares/");
const academy = require("../controllers/academy.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });

app.post("/academy/create", authJwt.isAuthenticated, academy.createAcademy);

app.get("/academy/all", authJwt.isAuthenticated, academy.getAllAcademys);

app.get("/academy/:id", authJwt.isAuthenticated, academy.getAcademyById);

app.post("/academy/update/:id", authJwt.isAuthenticated, academy.updateAcademy);

app.post("/academy/updatecoach/:id", authJwt.isAuthenticated, academy.updateAcademyCoach);

app.post("/academy/delete/:id", authJwt.isAuthenticated, academy.deleteAcademy);

app.post("/academy/delete/all", authJwt.isAuthenticated, academy.deleteAllAcademys);

app.post("/academy/academybyname", authJwt.isAuthenticated, academy.getAcademyByName);

app.get("/academy/academybycoach/:id", authJwt.isAuthenticated, academy.getAcademyByCoach);

};

