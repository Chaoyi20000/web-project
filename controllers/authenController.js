const Record = require("../models/record.js");
const Patient = require("../models/Patient.js");
const Clinician = require("../models/clincian.js");
const bcrypt = require("bcryptjs");
const Controller = require("./Controller.js");

const SALT_FACTOR = 10;

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

  const registerPatient = async(req, res)=>{
    try{
      res.render("register_detail.hbs");
  
    }catch(err){
      console.log("error happens in render registering patient: ", err);
    }
  }

  const addNewPatient = async(req, res)=>{
    try{
      if (req.body.pwd == req.body.confirm) {
        const newPatient = new Patient({
          firstName: req.body.fname,
          lastName: req.body.lname,
          screenName: req.body.scrname,
          email: req.body.email,
          password: await bcrypt.hash(req.body.confirm, SALT_FACTOR), 
          yearOfBirth: req.body.birthyear,
          textBio: req.body.biotext,
          clinician: req.body.clinician,
        });
    
        const patient = await newPatient.save()
        await Clinician.findOneAndUpdate(
          {email: patient.clinician},
          {$push: {patient: patient.id}},
        );
        await Controller.searchAndCreateRecord(patient.id)
        res.redirect("/home/clinician_dashboard");
      }
      
    }catch(err){
      console.log("error happens in register patient: ", err);
    }
  };


  const changePassword = async (req, res) => {
    try {
      const patient = await Patient.findOne({_id: req.user._id});

      if (!(await bcrypt.compare(req.body.old, patient.password))) {
        return res.render("patient_dashboard.hbs", {
          message: "Wrong password! please try again",
        });
      }
      
      if (!(req.body.new == req.body.confirm)) {
        return res.render("patient_dashboard.hbs", {
          message: "New password is different to new confirm password, try again",
        });
      }

      if (req.body.old == req.body.new) {
        return res.render("patient_dashboard.hbs", {
          message: "New password can not be the same as old password!",
        });
      }
      patient.password = await bcrypt.hash(req.body.confirm, SALT_FACTOR);
      await patient.save();
      res.render("patient_dashboard.hbs", {
        message: "Password update Successful!" });

    } catch (err) {
      console.log("error occurs in update password: ", err);
      res.send("error occurs in update password");
    }
  };


  module.exports = {
    renderLoginPatient,
    renderLoginClinician,
    logout,
    addNewPatient,
    registerPatient, 
    changePassword,
  }