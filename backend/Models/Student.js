const mongoose=require('mongoose');

const Studentschema=new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    rollno:{
        type:String,
        unique:true,
        required: true
    },
    branch:{
        type:String,
        required: true
    },
    status:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model("Student",Studentschema);