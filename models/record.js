const mongoose = require('mongoose');
const recordSchema = new mongoose.Schema({ 


    patientId: {type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true},
    recordDate: {type: String, required: true},
    data:{
        bgl:{	
            fullName:{type:String,default: "blood glocose level", immutable: true},	
            status:{type:String,enum: ["recorded", "unrecorded", "no need"], default: "unrecorded"},
            value:{type: Number, default: 0},	
            comment:{type:String,default:""},
            createdAt:{type:String,default:null},
        },
        weight:{	
            fullName:{type:String,default: "weight", immutable: true},	
            status:{type:String,enum: ["recorded", "unrecorded", "no need"], default: "unrecorded"},
            value:{type: Number, default: 0},	
            comment:{type:String,default:0},
            createdAt:{type:String,default:null},
        },
        doit:{	
            fullName:{type:String,default: "doses of insulin taken", immutable: true},	
            status:{type:String,enum: ["recorded", "unrecorded", "no need"], default: "unrecorded"},
            value:{type: Number, default: 0},	
            comment:{type:String,default:0},
            createdAt:{type:String,default:null},
        },
        exercise:{	
            fullName:{type:String,default: "exercise", immutable: true},	
            status:{type:String,enum: ["recorded", "unrecorded", "no need"], default: "unrecorded"},
            value:{type: Number, default: 0},	
            comment:{type:String,default:0},
            createdAt:{type:String,default:null},
        },
    }
}); 
const Record = mongoose.model('Record', recordSchema); 
module.exports = Record;


