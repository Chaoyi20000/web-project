const Record = require("../models/record.js");
const Patient = require("../models/Patient.js");
const Clinician = require("../models/clincian.js");
const bcrypt = require("bcryptjs");

const SALT_FACTOR = 10;

async function searchAndCreatePatient(patientId) {
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
        password: await bcrypt.hash("12345678", SALT_FACTOR), 
        yearOfBirth: "1997",
        textBio: "i'm Pat",
        clinician:  "chris@gmail.com",
      });

      // save new patient Pat to database
      const patient = await newPatient.save();
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
      //update changes in need of record this data 
      const required = await Patient.findById(patientId).requireData;
      if (required["bgl"]==false) {
        newRecord.data["bgl"].status = "unrequired";
      }
      if (required["doit"]==false) {
        newRecord.data["doit"].status = "unrequired";
      }
      if (required["weight"]==false) {
        newRecord.data["weight"].status = "unrequired";
      }
      if (required["exercise"]==false) {
        newRecord.data["exercise"].status = "unrequired";
      }

      
      
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


// render the record data from DataBase
const renderRecordData = async (req, res) => {
  try {
    if (req.user) {
      const patientId = req.user.id;
      await searchAndCreateRecord(patientId);
      const record = await Record.findOne({ patientId: patientId, recordDate: new Date().toDateString()})
      .populate({
        path: "patientId",
        options: { lean: true },
      })
      .lean();
      // parse the data records for handlebars to display in format
      res.render("record_health_data(patient).hbs", { record: record });
    } else {
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
    }
    
  } catch (err) {
    res.status(400);
    res.send("error happens when render record data");
  }
};


// update record to database
const updateRecordData = async (req, res) => {
  try {
    if (req.user) {
      const patientId=req.user.id;
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

    }
  } catch (err) {
    console.log("error happens in update record: ", err);
  }
};

//show patient dashboard
const renderPatientDashboard = async (req, res) => {
  try{
    if (req.user) {
      const patientId = req.user.id;
      searchAndCreateRecord(patientId);
      const patient = await Patient.findOne({_id:patientId}).lean();
      res.render("patient_dashboard.hbs", {patient: patient});
    } else {
      const patientId = await searchAndCreatePatient();
      const patient = await Patient.findOne({_id:patientId}).lean();

      res.render("patient_dashboard.hbs", {patient: patient});
    }
   
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
        password: await bcrypt.hash("12345678", SALT_FACTOR), 
        yearOfBirth: "1987",
      });

      const secondClinician = new Clinician({
        firstName: "Sam",
        lastName: "Mills",
        email: "sam@gmail.com",
        password: await bcrypt.hash("12345678", SALT_FACTOR), 
        yearOfBirth: "1977",
      });


      // save new Clincian Chris to database
      const clinician = await newClinician.save();
      const second = await secondClinician.save();
      // add patients to clinican's collection
      const allPatient = await findAllPatient(clinician.email);
      const secAllPatient = await findAllPatient(second.email);

      await Clinician.findOneAndUpdate(
        {_id: clinician.id}, 
        {$push: {patient: {$each: allPatient}}},
        
      );

      await Clinician.findOneAndUpdate(
        {_id: second.id},
        {$push: {patient: {$each: secAllPatient}}},
      )

      return clinician.id;
    } 
  } catch(err) {
    console.log("error happens in initalise clinician: ", err);
  }
};

const renderClinicianDashboard = async (req, res) => {
  try{
    if (req.user){
      const cEmail = req.user.email;
      await findAllPatient(cEmail);
      // find target clinician and prepare all linked paitent record
      const clinician = await Clinician.findOne({_id:req.user.id}).populate({
        path: "patient",
        populate: {path:"records"},
        options: { lean: true } 
      }).lean();
       // parsse to handlebars for display patient records 
      const patient = clinician.patient;

      res.render("Dashboard_clinician.hbs", {patient: patient});

    } else {
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
      }

  }catch(err) {
    console.log("error happens in showing clinican dashboard: ", err);

  }

};








module.exports = {
  renderRecordData,
  updateRecordData,
  initClinician,
  searchAndCreateRecord,
  renderPatientDashboard,
  renderClinicianDashboard,
  
};
