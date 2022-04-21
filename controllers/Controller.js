const Record = require("../models/record.js");
const Patient = require("../models/patient.js");

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}


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
        password: "12345678",
        yearOfBirth: "1997",
        textBio: "im Pat",
        supportMessage: "hello",
        clinician: "Chris"
      });

      // save new patient Pat to database
      const patient = await newPatient.save();
      console.log("-- id is: ", patient._id);

      return patient.id;
    } else {
      // find our target patient Pat
      const patient = await Patient.findOne({ firstName: "Pat" });
      // console.log("-- id is: ", patient.id);
      return patient.id;
    }
  } catch (err) {
    console.log("error happens in patient initialisation: ", err);
  }
}

async function initRecord(patientId) {
  try {
    const result = await Record.findOne({
      patientId: patientId,
      recordDate: formatDate(new Date()),
    });
    if (!result) {
      const newRecord = new Record({
        patientId: patientId,
        recordDate: formatDate(new Date()),
      });

      const record = await newRecord.save();
      return record.id;
    } else {
      return result.id;
    }
  } catch (err) {
    console.log("error happens in record initialisation: ", err);
  }
}

const getAllPatients = (req, res) => {
  res.render();
};

// const getOnePatient = (req, res) => {
//   const patient = data.find((one) => one.id == req.params.id);

//   if (patient) {
//     res.send(patient);
//   } else {
//     res.send("patient not found");
//   }
// };

// const addOnePatient = (req, res) => {
//   // console.log(req.rawHeaders.toString());
//   const newPatient = req.body;
//   if (JSON.stringify(newPatient) != "{}") {
//     // console.log(data.find(d => d.id == newPatient.id));
//     if (!data.find((d) => d.id == newPatient.id)) {
//       data.push(newPatient);
//     }
//   }
//   res.send(data);
// };

const renderRecordData = async (req, res) => {
  try {
    const patientId = await initPatient();
    const recordId = await initRecord(patientId);
    // const patient = await Patient.findOne({ _id: patientId }).lean();
    const record = await Record.findOne({ _id: recordId })
      .populate({
        path: "patientId",
        options: { lean: true },
      })
      .lean();
    console.log(record);

    // console.log("-- record info when display -- ", record);
    res.render("record_health_data(patient).hbs", { record: record });
  } catch (err) {
    res.status(400);
    res.send("error happens when render record data");
  }
};

const updateRecord = async (req, res) => {
  console.log("-- req form to update record -- ", req.body);
  try {
    const patientId = await initPatient();
    const recordId = await initRecord(patientId);
    const record = await Record.findOne({ _id: recordId });
    const key = req.body.key;
  
    record.data[key].value = req.body.value;
    record.data[key].comment = req.body.comment;
    record.data[key].status = "recorded";
    record.data[key].createdAt = new Date().toDateString();
    
    await record.save();
    //findOneAndUpdate({}, {})
    
    console.log(record);
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

    console.log("checking: ", patient.screenName);
    res.render("patient_dashboard.hbs", {patient: patient});
  } catch(err) {
    console.log("error happens in patient dashboard: ", err);
  }
};

const initClinician = async (req, res) => {
  try{
    const result = await Clinican.find();
    if (result.length == 0) {
      const newClinician = new Patient({
        firstName: "Chris",
        lastName: "Evans",
        email: "chris@gmail.com",
        password: "12345678",
        yearOfBirth: "1987",
      });

      // save new patient Pat to database
      const clinician = await newClinician.save();
      //console.log("-- id is: ", clinican._id);

      return clinician;
    } else {
      // find our target patient Pat
      const clinician = await Clinician.findOne({ firstName: "Chris" });
      // console.log("-- id is: ", patient.id);
      return clinician.id;
    }

  } catch(err) {
    console.log("error happens in initalise clinican: ", err);
  }
};

const renderClinican = async (req, res) => {
  try{
    const clincian = await initClinician();
   // const clinician = await 

  }catch(err) {
    console.log("error happens in shoing clinican dashboard: ", err);

  }

};


/* const verifyLogin = async(req,res)=>{
  try{
    let username = req.body.user_id;
    let password = req.body.password;
    
    
    // Ensure the input fields exists and are not empty
    if (username && password) {
      // Execute SQL query that'll select the account from the database based on the specified username and password
     
      const user = await Patient.findOne({email:username}).lean();
  
      if( (user!=null)){
        
        if(user.password != password){
          res.send('Incorrect Username and/or Password!');
        }else{
          console.log(user);
          res.redirect('/patient-dashboard.hbs');
          
          // res.render('patient-dashboard.hbs',{patient:user})
          
        }
      }else{
        
        res.send('cannot find the Username and/or Password!');
      }
      res.end();
    
    } else {
      res.send('Please enter Username and Password!');
      res.end();
    }

  }catch(err){
    console.log("error happens in login : ", err);
  }
  
}
 */

module.exports = {
  getAllPatients,
  // getOnePatient,
  // addOnePatient,
  renderRecordData,
  updateRecord,
  verifyLogin,
  renderPatientDashboard,
};
