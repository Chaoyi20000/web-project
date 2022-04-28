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


module.exports = Router;
