const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { client } = require("../config/auth.config");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Methods', "OPTIONS, DELETE, POST, GET, PATCH, PUT");
    res.setHeader('Access-Control-Allow-Credentials', "true")
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Max-Age', 1728000);   
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);
};
