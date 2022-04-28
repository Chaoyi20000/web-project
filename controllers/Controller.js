const Record = require("../models/record.js");
const Patient = require("../models/Patient.js");
const Clinician = require("../models/clincian.js");


async function initPatient() {
  try {
    // find all document in Patient Collection to findout if it is empty
    const result = await Patient.find();
    if (result.length == 0) {
      const newPatient = new Patient({
        firstName: "Pat",
        lastName: "Walter",
        screenName: "Pat",
        email: "pat@gmail.com",
        password: "111111",
        yearOfBirth: "1997",
        textBio: "i'm Pat",
        supportMessage: "hello",
        clinician:  "chris@gmail.com",
      });

      // save new patient Pat to database
      const patient = await newPatient.save();
      initRecord(patient.id);

      return patient.id;
    } else {
      // find our target patient Pat
      const patient = await Patient.findOne({ firstName: "Pat" });
      initRecord(patient.id);
      return patient.id;
    }
  } catch (err) {
    console.log("error happens in patient initialisation: ", err);
  }
}

// initial record of pation by input patientID
async function initRecord(patientId) {
  try {
    const result = await Record.findOne({patientId: patientId, recordDate: new Date().toDateString()});
    if (!result) {
      const newRecord = new Record({
        patientId: patientId,
        recordDate: new Date().toDateString(),
      });

      // save data to database
      const record = await newRecord.save();

      await Patient.findOneAndUpdate(
        {_id: patientId},
        {$push: {records: record}},
      );
      
      
    } 
  } catch (err) {
    console.log("error happens in record initialisation: ", err);
  }
}

// function to get all patients
const getAllPatients = (req, res) => {
  res.render();
};


// render the data from DataBase
const renderRecordData = async (req, res) => {
  try {
    const patientId = await initPatient();
    const record = await Record.findOne({ patientId: patientId, recordDate: new Date().toDateString()})
      .populate({
        path: "patientId",
        options: { lean: true },
      })
      .lean();

    res.render("record_health_data(patient).hbs", { record: record });
  } catch (err) {
    res.status(400);
    res.send("error happens when render record data");
  }
};


// update record to database
const updateRecord = async (req, res) => {
  console.log("-- req form to update record -- ", req.body);
  try {
    const patientId = await initPatient();
    const record = await Record.findOne({ patientId: patientId, recordDate: new Date().toDateString() });
    const key = req.body.key;
  
    record.data[key].value = req.body.value;
    record.data[key].comment = req.body.comment;
    record.data[key].status = "recorded";
    //setting up time in Melbourne time zone
    
    record.data[key].createdAt = new Date().toLocaleString("en-US", 
    {timeZone: "Australia/Melbourne", year: 'numeric', month: 'numeric', 
    day: 'numeric', hour: '2-digit', minute:'2-digit'}).replace(/\//g, "-");
    
    await record.save();
    
    res.redirect("/home/record_health_data");
  } catch (err) {
    console.log("error happens in update record: ", err);
  }
};

//show patient dashboard
const renderPatientDashboard = async (req, res) => {
  try{
    const patientId = await initPatient();
    const patient = await Patient.findOne({_id:patientId}).lean();

    res.render("patient_dashboard.hbs", {patient: patient});
  } catch(err) {
    console.log("error happens in patient dashboard: ", err);
  }
};

//find patient by input of email
async function findAllPatient(email) {
  try{
   
    const patient = await Patient.find({clinician: email});
    if (patient.length == 0) {
      const newPatient = await initPatient();

      // find patient in the database
      const allPatient = await Patient.find({clinician: email});

      return allPatient;
    }else {
      return patient;
    }
  }catch(err) {
    console.log("error happens in finding all patient for clinican: ", err);
  }
};


// initial Clinician database
const initClinician = async (req, res) => {
  try{
    const result = await Clinician.find();
    if (result.length == 0) {
      const newClinician = new Clinician({
        firstName: "Chris",
        lastName: "Evans",
        email: "chris@gmail.com",
        password: "12345678",
        yearOfBirth: "1987",
      });


      // save new Clincian Chris to database
      const clinician = await newClinician.save();
      console.log("----checking clinican saved", clinician);

      const allPatient = await findAllPatient(clinician.email);

      await Clinician.findOneAndUpdate(
        {_id: clinician.id}, 
        {$push: {patient: {$each: allPatient}}},
        
      );
      console.log("-- patietn in chris dashboard is: ", clinician.patient);

      return clinician.id;
    } else {
      // find our target Clinician Chris
      const clinician = await Clinician.findOne({ firstName: "Chris" });
      return clinician.id;
    }

  } catch(err) {
    console.log("error happens in initalise clinician: ", err);
  }
};

const renderClinicianDashboard = async (req, res) => {
  try{
    const clincianId = await initClinician();
    
    const clinician = await Clinician.findOne({_id:clincianId}).populate({
      path: "patient",
      populate: {path:"records"},
      options: { lean: true } 
    }).lean();
 
    console.log(clinician);
    /* const patient1 = await Patient.findOne({screenName:"Pat"});
    console.log(patient1); */
    const patient = clinician.patient;

    console.log("-- record info when display -- ",patient);
    res.render("Dashboard_clinician.hbs", {patient: patient});

  }catch(err) {
    console.log("error happens in showing clinican dashboard: ", err);

  }

};


module.exports = {
  getAllPatients,
  renderRecordData,
  updateRecord,
  renderPatientDashboard,
  renderClinicianDashboard,
};
