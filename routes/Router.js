const express = require("express");
const controller = require("../controllers/Controller.js");
const loginController = require("../controllers/authenController.js");
const passport = require("passport");
const loginChecker = require("./loginChecker.js");
const historyController = require("../controllers/historyController.js");
const { Route } = require("express");
require('../passport.js')(passport);



const Router = express.Router();

//patient part
Router.get("/patient_dashboard", loginChecker.loggedIn, controller.renderPatientDashboard);
Router.get("/record_health_data", loginChecker.loggedIn,controller.renderRecordData);
Router.post("/record_health_data", loginChecker.loggedIn, controller.updateRecordData);

//clinican part
Router.get("/clinician_dashboard", loginChecker.loggedIn, controller.renderClinicianDashboard);

Router.get("/all_comment/:id", loginChecker.loggedIn, historyController.renderCommentHistory);
//adding new patient to database
Router.get("/register", loginChecker.loggedIn, loginController.registerPatient);
Router.post("/register", loginChecker.loggedIn, loginController.addNewPatient);

Router.get("/patient_details/:id", loginChecker.loggedIn, historyController.renderPatientDetail);
Router.post("/patient_details/:id", loginChecker.loggedIn, historyController.addSuppMsgAndCliNote);



Router.get("/edit_details/:id", loginChecker.loggedIn, )
Router.get("/health_history/:id", loginChecker.loggedIn, )
Router.get("/note_history/:id", loginChecker.loggedIn, )






//login part
Router.get("/login_patient", loginChecker.notLoggedInPat, loginController.renderLoginPatient);
Router.get("/login_clinician", loginChecker.notLoggedInClin, loginController.renderLoginClinician);

//patient login and verify with database
Router.post("/login_patient",
  loginChecker.notLoggedInPat,
  passport.authenticate("patient_verify", {
    successRedirect: "/home/patient_dashboard",
    failureRedirect: "/home/login_patient",
    failureflash: true,
  })
);

//clinician login and verify with database
Router.post("/login_clinician",
  loginChecker.notLoggedInClin,
  passport.authenticate("clinician_verify", {
    successRedirect: "/home/clinician_dashboard",
    failureRedirect: "/home/login_clinician",
    failureflash: true,
  })
);
//log out 
Router.post("/logout", loginChecker.loggedIn, loginController.logout);

module.exports = Router;
