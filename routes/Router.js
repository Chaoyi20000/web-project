const express = require("express");
const controller = require("../controllers/Controller.js");

const Router = express.Router();
Router.get("/", controller.getAllPatients);

//patient part
Router.get("/patient_dashboard", controller.renderPatientDashboard);
Router.get("/record_health_data", controller.renderRecordData);
Router.post("/record_health_data", controller.updateRecord);

//clinican part
Router.get("/clinician_dashboard", controller.renderClinicianDashboard);

//Router.post("/login_patient", controller.verifyLogin);
// Router.get("/patient_dashboard");
/* Router.get("/", controller.getAllPatients);
Router.get("/:id", controller.getOnePatient);
Router.post("/addPatient", controller.addOnePatient); */


// Router.get("/login_patient", (req,res) => { 
//     res.render('login_portal_patient.hbs')
//   });
module.exports = Router;
