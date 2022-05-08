const express = require("express");
const controller = require("../controllers/Controller.js");
const loginController = require("../controllers/loginController.js");
const passport = require("passport");
const loginChecker = require("./loginChecker.js");
require('../passport.js')(passport);



const Router = express.Router();

//patient part
Router.get("/patient_dashboard", loginChecker.loggedIn, controller.renderPatientDashboard);
Router.get("/record_health_data", loginChecker.loggedIn,controller.renderRecordData);
Router.post("/record_health_data", loginChecker.loggedIn, controller.updateRecordData);

//clinican part
Router.get("/clinician_dashboard", loginChecker.loggedIn, controller.renderClinicianDashboard);

Router.get("/all_comment/:id", loginChecker.loggedIn,controller.renderCommentHistory);

Router.get("/register", loginChecker.loggedIn, controller.registerPatient);
Router.post("/register", loginChecker.loggedIn, controller.addNewPatient);

//login part
Router.get("/login_patient", loginChecker.notLoggedInPat, loginController.renderLoginPatient);
Router.get("/login_clinician", loginChecker.notLoggedInClin, loginController.renderLoginClinician);

Router.post("/login_patient",
  loginChecker.notLoggedInPat,
  passport.authenticate("patient_verify", {
    successRedirect: "/home/patient_dashboard",
    failureRedirect: "/home/login_patient",
    failureflash: true,
  })
);

Router.post("/login_clinician",
  loginChecker.notLoggedInClin,
  passport.authenticate("clinician_verify", {
    successRedirect: "/home/clinician_dashboard",
    failureRedirect: "/home/login_clinician",
    failureflash: true,
  })
);

Router.post("/logout", loginChecker.loggedIn, loginController.logout);

module.exports = Router;
