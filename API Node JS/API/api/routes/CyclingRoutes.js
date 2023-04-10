module.exports = function (app) {
  var Cycling = require("../controllers/CyclingController");

 
  app.route("/Cycling/login").get(Cycling.Login);
  app.route("/Cycling/signup").post(Cycling.Register);
  
  app.route("/Cycling/addData").post(Cycling.addData);

  app.route("/Cycling/getData").get(Cycling.getAllData);

};
