const Record = require("../models/record.js");
const Patient = require("../models/Patient.js");
const Clinician = require("../models/clincian.js");


async function searchAndCreatePatient() {
  try {
    // find all document in Patient Collection to findout if it is empty
    const result = await Patient.find();
    // initiate patient pat if no records are found 
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
      searchAndCreateRecord(patient.id);

      return patient.id;
    } else {
      // find our target patient Pat
      const patient = await Patient.findOne({ firstName: "Pat" });
      //link records to target patient 
      searchAndCreateRecord(patient.id);
      return patient.id;
    }
  } catch (err) {
    console.log("error happens in patient initialisation: ", err);
  }
}

// initial record of patient by patientId
async function searchAndCreateRecord(patientId) {
  try {
    // find newest records for today 
    const result = await Record.findOne({patientId: patientId, recordDate: new Date().toDateString()});
    // create new record if no today's record
    if (!result) {
      const newRecord = new Record({
        patientId: patientId,
        recordDate: new Date().toDateString(),
      });

      // save data to database
      const record = await newRecord.save();
      // added to linked patient's collection
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


// render the record data from DataBase
const renderRecordData = async (req, res) => {
  try {
    // generalise patient 
    const patientId = await searchAndCreatePatient();
    // find today's record by using today's date
    const record = await Record.findOne({ patientId: patientId, recordDate: new Date().toDateString()})
      .populate({
        path: "patientId",
        options: { lean: true },
      })
      .lean();
    // parse the data records for handlebars to display in format
    res.render("record_health_data(patient).hbs", { record: record });
  } catch (err) {
    res.status(400);
    res.send("error happens when render record data");
  }
};


// update record to database
const updateRecordData = async (req, res) => {
  try {
    // find the today's data with target patient 
    const patientId = await searchAndCreatePatient();
    const record = await Record.findOne({ patientId: patientId, recordDate: new Date().toDateString() });
    const key = req.body.key;
    // update input data accordingly 
    record.data[key].value = req.body.value;
    record.data[key].comment = req.body.comment;
    record.data[key].status = "recorded";
    //setting up time in Melbourne time zone
    
    record.data[key].createdAt = new Date().toLocaleString("en-US", 
    {timeZone: "Australia/Melbourne", year: 'numeric', month: 'numeric', 
    day: 'numeric', hour: '2-digit', minute:'2-digit'}).replace(/\//g, "-");
    
    await record.save();
    // refresh page
    res.redirect("/home/record_health_data");
  } catch (err) {
    console.log("error happens in update record: ", err);
  }
};

//show patient dashboard
const renderPatientDashboard = async (req, res) => {
  try{
    const patientId = await searchAndCreatePatient();
    const patient = await Patient.findOne({_id:patientId}).lean();

    res.render("patient_dashboard.hbs", {patient: patient});
  } catch(err) {
    console.log("error happens in patient dashboard: ", err);
  }
};

//find patient by input of email
async function findAllPatient(email) {
  try{
    // find all patient with the same target clinician
    const patient = await Patient.find({clinician: email});
    // no patient then initalise patient pat
    if (patient.length == 0) {
      const newPatient = await searchAndCreatePatient();

      // find patient in the database
      const allPatient = await Patient.find({clinician: email});

      return allPatient;
    }else {
      //create record template for today's recor
      for(let i=0; i<patient.length; i++){
        await searchAndCreateRecord(patient[i].id);
      }
      return patient;
    }
  }catch(err) {
    console.log("error happens in finding all patient for clinican: ", err);
  }
};


// initial Clinician database
const initClinician = async (req, res) => {
  try{
    // generalise our target clinician 
    const result = await Clinician.find();
    // if no clinician found then initalise our target clinician chris
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
      // add patients to clinican's collection
      const allPatient = await findAllPatient(clinician.email);

      await Clinician.findOneAndUpdate(
        {_id: clinician.id}, 
        {$push: {patient: {$each: allPatient}}},
        
      );

      return clinician.id;
    } else {
      // find our target Clinician Chris
      const clinician = await Clinician.findOne({ firstName: "Chris" });
      const allPatient = await findAllPatient(clinician.email);
      return clinician.id;
    }

  } catch(err) {
    console.log("error happens in initalise clinician: ", err);
  }
};

const renderClinicianDashboard = async (req, res) => {
  try{
    // generalise clinician
    const clincianId = await initClinician();
    // find target clinician and prepare all linked paitent record
    const clinician = await Clinician.findOne({_id:clincianId}).populate({
      path: "patient",
      populate: {path:"records"},
      options: { lean: true } 
    }).lean();
 
    // parsse to handlebars for display patient records 
    const patient = clinician.patient;

    res.render("Dashboard_clinician.hbs", {patient: patient});

  }catch(err) {
    console.log("error happens in showing clinican dashboard: ", err);

  }

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
    const newPatient = new Patient({
      firstName: req.body.fname,
      lastName: req.body.lname,
      screenName: req.body.scrname,
      email: req.body.email,
      password: req.body.pwd,
      yearOfBirth: req.body.birthyear,
      textBio: req.body.biotext,
      clinician: req.body.clinician,
    });

    const patient = await newPatient.save()
    await Clinician.findOneAndUpdate(
      {email: patient.clinician},
      {$push: {patient: patient.id}},
    );
    await searchAndCreateRecord(patient.id)
    res.redirect("/home/clinician_dashboard");

  }catch(err){
    console.log("error happens in register patient: ", err);
  }
};

const renderCommentHistory = async(req, res)=>{
  try{
    const patientId = req.params.id;
    const patient = await Patient.findOne({_id:patientId, })
    .populate({
      path: "records",
      options: { lean: true },
    })
    .lean();
    res.render("clinician-comment.hbs", {patient:patient});
    
  }catch(err){
    console.log("error happens in render record history: ", err);
  }
};

module.exports = {
  getAllPatients,
  renderRecordData,
  updateRecordData,
  renderPatientDashboard,
  renderClinicianDashboard,
  registerPatient,
  addNewPatient,
  renderCommentHistory,
};
