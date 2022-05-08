const Record = require("../models/record.js");
const Patient = require("../models/Patient.js");
const Clinician = require("../models/clincian.js");
const bcrypt = require("bcryptjs");
const Controller = require("../controllers/Controller.js");


const logout = (req, res) => {
    req.logout();
    res.redirect("/");
  };
  
  const renderLoginPatient = (req, res) => {
    res.render("login_portal_patient.hbs", req.session.flash);
  
  };
  
  
  const renderLoginClinician= (req, res) => {
    res.render("login_portal_clinician.hbs", req.session.flash);
  };

  module.exports = {
    renderLoginPatient,
    renderLoginClinician,
    logout,
  }