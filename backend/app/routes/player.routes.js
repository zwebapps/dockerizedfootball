const { authJwt } = require("../middlewares/");
const player = require("../controllers/player.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });

app.post("/player/create", authJwt.isAuthenticated, player.createPlayer);

app.get("/player/all", authJwt.isAuthenticated, player.getAllPlayers);

app.post("/player/approve/:id", authJwt.isAuthenticated, player.approvePlayer);

app.post("/player/update/:id", authJwt.isAuthenticated, player.updatePlayer);

app.post("/player/delete/:id", authJwt.isAuthenticated, player.deletePlayer);

app.post("/player/delete/all", authJwt.isAuthenticated, player.deleteAllPlayers);

app.get("/player/academy/:id", authJwt.isAuthenticated, player.playerByAcademy);

app.post("/player/bulkuploads", authJwt.isAuthenticated, player.bulkUploadPlayers);

app.post("/player/upload", authJwt.isAuthenticated, player.upload);

app.get("/player/getuploads", authJwt.isAuthenticated, player.getListFiles);

app.get("/player/:id", authJwt.isAuthenticated, player.playerByIdOrEID);

app.get("/player/team/:id", authJwt.isAuthenticated, player.playerByTeam);

app.get("/player/getuploads/:id", authJwt.isAuthenticated, player.download);

app.post("/player/multiupload", authJwt.isAuthenticated, player.multiUpload);


};
