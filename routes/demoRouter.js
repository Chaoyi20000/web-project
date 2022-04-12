const express = require("express");
const controller = require("../controllers/demoController.js");

const demoRouter = express.Router();

demoRouter.get("/", controller.getAllPatients);
demoRouter.get("/:id", controller.getOnePatient);
demoRouter.post("/addPatient", controller.addOnePatient);

module.exports = demoRouter;
