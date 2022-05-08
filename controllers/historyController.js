const Record = require("../models/record.js");
const Patient = require("../models/Patient.js");
const Clinician = require("../models/clincian.js");

const ClinicalNote = require("../models/clinicalNote.js");
const supportMessage = require("../models/supportMessage.js");

const bcrypt = require("bcryptjs");
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

const addSuppMsgAndCliNote = async(req, res) => {
    try{
        if (req.body.supportMsg){
            const message = req.body.supportMsg;
            const patientId = req.body.id;
            const patient = await Patient.findById(patientId);
            patient.supportMessage = message;

            const clinician = await Clinician.findOne({email:patient.clinician});
            const newMessage = new supportMessage({
                patientId: patientId,
                clinicianId: clinician.id,
                message: message,
                createdAt: new Date(),
            });

            const supportM = await newMessage.save();
            await Clinician.findOneAndUpdate(
                {_id: clinician.id}, 
                {$push: {supportMessage: supportM}},
                
            );    
        } 
        if (req.body.note) {
            const note = req.body.note;
            const patientId = req.body.id;
            const patient = await Patient.findById(patientId);

            const clinician = await Clinician.findOne({email:patient.clinician});
            const newNote = new ClinicalNote({
                patientId: patientId,
                clinicianId: clinician.id,
                note: note,
                noteDate: new Date().toLocaleString("en-US", 
                {timeZone: "Australia/Melbourne", year: 'numeric', month: 'numeric', 
                day: 'numeric', hour: '2-digit', minute:'2-digit'}).replace(/\//g, "-"),
                createdAt: new Date(),
            });

            const clinNote = await newNote.save();
            await Clinician.findOneAndUpdate(
                {_id: clinician.id}, 
                {$push: {clinicalNote: clinNote}},
            );    
        }
        res.redirect("/home/patient_details");
        
    }catch(err){

    }
};





const renderPatientDetail = async(req, res) => {
    try{
        const patientId = req.params.id;
        const msg = await SupportMessage.find({patientId: patientId}).sort({createdAt:-1})[0];
        const notes = await ClinicalNote.find({patientId: patientId}).sort({createdAt:-1})[0];
        const patient = await Patient.findById(patientId);
        await Controller.searchAndCreateRecord(patientId);
        const record = await Record.findOne({patientId:patientId, recordDate: new Date().toDateString()});


        res.render("patient_details(clinican).hbs", {patient:patient, message:msg, notes: notes, record: record});

    }catch(err){
        console.log("error happens in render patient detail: ", err);

    }
};
  module.exports= {
      renderCommentHistory,
      renderPatientDetail,
      addSuppMsgAndCliNote,
    
  };