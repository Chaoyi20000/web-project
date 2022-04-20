const express = require("express");
const controller = require("../controllers/Controller.js");

const Router = express.Router();
Router.get("/", controller.getAllPatients);
Router.get("/recordData", controller.renderRecordData);
Router.post("/recordData", controller.updateRecord);

Router.post("/login_patient", controller.verifyLogin);
// Router.get("/patient_dashboard");
/* Router.get("/", controller.getAllPatients);
Router.get("/:id", controller.getOnePatient);
Router.post("/addPatient", controller.addOnePatient); */


// Router.get("/login_patient", (req,res) => { 
//     res.render('login_portal_patient.hbs')
//   });
module.exports = Router;
