const data = require("../models/demoPatient.js");

const getAllPatients = (req, res) => {
  res.send(data);
};

const getOnePatient = (req, res) => {
  const patient = data.find((one) => one.id == req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.send("patient not found");
  }
};

const addOnePatient = (req, res) => {
  // console.log(req.rawHeaders.toString());
  const newPatient = req.body;
  if (JSON.stringify(newPatient) != "{}") {
    // console.log(data.find(d => d.id == newPatient.id));
    if (!data.find(d => d.id == newPatient.id)) {
      data.push(newPatient);
    }
  }
  res.send(data);
};

module.exports = { getAllPatients, getOnePatient, addOnePatient };
