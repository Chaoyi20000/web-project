const Record = require("../models/record.js");
const Patient = require("../models/Patient.js");
const Clinician = require("../models/clincian.js");

const ClinicalNote = require("../models/clinicalNote.js");
const supportMessage = require("../models/supportMessage.js");

const Controller = require("./Controller.js");
const SupportMessage = require("../models/supportMessage.js");


const renderCommentHistory = async(req, res)=>{
    try{
      const patientId = req.params.id;
      const patient = await Patient.findOne({_id:patientId })
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

//adding support message to database
async function addSupportMessage(message, patient, clinician) {
    try {
        // update new support message to patient
        patient.supportMessage = message;
        await patient.save();
        // create new support message in database
        const newMessage = new supportMessage({
            patientId: patient.id,
            clinicianId: clinician.id,
            message: message,
            createdAt: new Date(),
        });
        
        const supportM = await newMessage.save();
        //update support message in clinican database
        await Clinician.findOneAndUpdate(
            {_id: clinician.id}, 
            {$push: {supportMessage: supportM}},
            
        );    
        return supportM.id;

    }catch(err) {
        console.log("error occurs in add support message: ", err);

    }
};

async function addClinicalNote(note, patient, clinician) {
    try {
        //create new clinical notes
        const newNote = new ClinicalNote({
            patientId: patient.id,
            clinicianId: clinician.id,
            note: note,
            noteDate: new Date().toLocaleString("en-US", 
            {timeZone: "Australia/Melbourne", year: 'numeric', month: 'numeric', 
            day: 'numeric', hour: '2-digit', minute:'2-digit'}).replace(/\//g, "-"),
            createdAt: new Date(),
        });

        const clinNote = await newNote.save();
        //add clinical note to matching clinician database
        await Clinician.findOneAndUpdate(
            {_id: clinician.id}, 
            {$push: {clinicalNote: clinNote}},
        );    
        return clinNote.id;
            
    }catch(err) {
        console.log("error occurs in add clinical notes: ", err);

    }
};

 



const addSuppMsgAndCliNote = async(req, res) => {
    try{
        // inatlise all data available in database
        const patientId = req.params.id;
        const patient = await Patient.findById(patientId);
        const patientDoc = await Patient.findById(patientId).lean()

        const clinician = await Clinician.findOne({email:patient.clinician});
        const message = req.body.supportMsg;
        const note = req.body.note;
        const record = await Record.findOne({patientId:patientId, recordDate: new Date().toDateString()}).lean();
        // check exisiting support message and clinical notes
        if (message && note) {
            // add to database 
            const newMessageId = await addSupportMessage(message, patient, clinician);
            const newNoteId = await addClinicalNote(note, patient, clinician);

            const newMessage = await SupportMessage.findById(newMessageId).lean();
            const newNote = await ClinicalNote.findById(newNoteId).lean();
            console.log(newMessage);
            return res.render("patient_details(clinican).hbs", {patient:patientDoc, message:newMessage, notes: newNote, record: record});

        }
        //only support message exist
        else if (message){
            // add to database 

            const newMessageId = await addSupportMessage(message, patient, clinician);

            const newMessage = await SupportMessage.findById(newMessageId).lean();
            return res.render("patient_details(clinican).hbs", {patient:patientDoc, message:newMessage, record: record});

         
        } 
        //only clinical notes exist
        else if (note) {
            // add to database 

            const newNoteId = await addClinicalNote(note, patient, clinician);

            const newNote = await ClinicalNote.findById(newNoteId).lean();        
            return res.render("patient_details(clinican).hbs", {patient:patientDoc, notes: newNote, record: record});

        }        

        
    }catch(err){
        console.log("error occurs in add support message or clinical notes: ", err);


    }
};





const renderPatientDetail = async(req, res) => {
    try{
        // find all most recent data for support message and clinical note
        const patientId = req.params.id;
        const allMsg = await SupportMessage.find({patientId: patientId}).sort({createdAt:-1}).lean();
        const msg = allMsg[0];
        const allNotes = await ClinicalNote.find({patientId: patientId}).sort({createdAt:-1}).lean();
        const notes = allNotes[0];

        const patient = await Patient.findById(patientId).lean();
        //today's patient record 
        await Controller.searchAndCreateRecord(patientId);
        const record = await Record.findOne({patientId:patientId, recordDate: new Date().toDateString()}).lean();
        //render patient detail with or without support message or clincial notes 
        if (msg && notes){
            return res.render("patient_details(clinican).hbs", {patient:patient, message:msg, notes: notes, record: record});
        }
        else if (notes) {
            return res.render("patient_details(clinican).hbs", {patient:patient, notes: notes, record: record});
        } else if (msg) {
            return res.render("patient_details(clinican).hbs", {patient:patient, message: msg, record: record});
        } else{
            return res.render("patient_details(clinican).hbs", {patient:patient, record: record});
        }

    }catch(err){
        console.log("error happens in render patient detail: ", err);

    }
};
  module.exports= {
      renderCommentHistory,
      renderPatientDetail,
      addSuppMsgAndCliNote,
    
  };