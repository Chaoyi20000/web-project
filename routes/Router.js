const express = require("express");
const controller = require("../controllers/Controller.js");

const demoRouter = express.Router();

/* demoRouter.get("/", controller.getAllPatients);
demoRouter.get("/:id", controller.getOnePatient);
demoRouter.post("/addPatient", controller.addOnePatient); */


// demoRouter.get("/login_patient", (req,res) => { 
//     res.render('login_portal_patient.hbs')
//   });
module.exports = demoRouter;
