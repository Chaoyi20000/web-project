const mongoose = require('mongoose');
const recordSchema = new mongoose.Schema({ 


    patientID:{type: String,required: true, lowercase: true, trim: true}, 
    data:{
        bgl:{	
            fullName:{type:String,default: "blood glocose level", immutable: true},	
            status:{type:String,enum: ["recorded", "unrecorded", "no need"], default: "unrecorded"},
            value:{type: Number, default: 0},	
            comment:{type:String,default:""},
            createdAt:{type:Date,default:null},
        },
        weight:{	
            fullName:{type:String,default: "weight", immutable: true},	
            status:{type:String,enum: ["recorded", "unrecorded", "no need"], default: "unrecorded"},
            value:{type: Number, default: 0},	
            comment:{type:String,default:0},
            createdAt:{type:Date,default:null},
        },
        doit:{	
            fullName:{type:String,default: "doses of insulin taken", immutable: true},	
            status:{type:String,enum: ["recorded", "unrecorded", "no need"], default: "unrecorded"},
            value:{type: Number, default: 0},	
            comment:{type:String,default:0},
            createdAt:{type:Date,default:null},
        },
        exercise:{	
            fullName:{type:String,default: "exercise", immutable: true},	
            status:{type:String,enum: ["recorded", "unrecorded", "no need"], default: "unrecorded"},
            value:{type: Number, default: 0},	
            comment:{type:String,default:0},
            createdAt:{type:Date,default:null},
        },
    }
}) 
const Record = mongoose.model('record', recordSchema) 
module.exports = Record 


