const mongoose = require('mongoose');
const clinicanSchema = new mongoose.Schema({ 

    
    firstName:{type: String,required: true, lowercase: true, trim: true}, 
    lastName:{type:String,required: true, lowercase: true, trim: true},
    email:{type: String, required: true, unique: true},
   
    password:{type:String, required:true},	
    yearOfBirth:{type: Number, required: true, min: 1900, max: 2022},
    patient: [{
        patientId: {type:mongoose.Schema.Types.ObjectId, ref: "Patient"}
    }], 
    clinicalNote:[{
        noteId: {type:mongoose.Schema.Types.ObjectId, ref: "ClinicalNote"}
    }],
    suportMessage: [{
        messageId: {type:mongoose.Schema.Types.ObjectId, ref:"SupportMessage"}
    }],
    
},
    {timestamps:{createdAt: "createTime",updatedAt:"updateTime"}
});
const Clinician = mongoose.model('Clinician', clinicanSchema); 
module.exports = Clinician; 


