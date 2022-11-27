const express = require('express')
const Student=require("../Models/Student");
const Admin=require("../Models/Admin");
const router=express.Router();
const {body,validationResult}=require("express-validator");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");


const fetchuser=require("../middleware/fetchuser");
const JWT_SECRET="Swaraj$andhale@19";

router.post("/getstudent",async(req,res)=>{ // Get the student by his name using post request
    let success=false;
    try {
        const {name}=req.body;
        let user= await Student.findOne({name: req.body.name})
        if(!user){
            return res.status(400).json({success,error:"Sorry detected Student doesn't exist"})
        }
        const status=await Student.findOneAndUpdate({name},{$set:{status:"Present"}},{new:true});
        success=true;
        res.json({status,success});

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error") 
    }
});
router.post("/addstudent",async(req,res)=>{// add a student to database
    try {
        
        let student=await Student.create({
            name:req.body.name,
            rollno:req.body.rollno,
            branch:req.body.branch,
            status:"Absent"
        })

        res.json(student);

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error") 
    }
});
router.get("/getallstudents",async(req,res)=>{// get all the sudents
    try {
        const status=await Student.find();
        res.json(status);

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error") 
    }
});
// Route : authenticate a  user using POST "api/create/login": no login required

router.post("/login",[
    body("email","Enter a Valid Email").exists(),
    body("password","Password cannot be blank").exists()
],async(req,res)=>{
    let success=false;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password}=req.body;

    try {
        let user=await Admin.findOne({email});
        if(!user){
            success=false;
            return res.status(400).json({success,error:"Please try to login with correct credentials"});
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({success,error:"Please try to login with correct password"});
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        success=true;
        res.json({success,authtoken});
           
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
});
router.post("/addadmin",async(req,res)=>{
    let success=false;

    try {
        let user= await Admin.findOne({email: req.body.email})
        if(user){
            return res.status(400).json({success,error:"Sorry user already exits with this email id"})
        }
        const salt=await bcrypt.genSalt(5);
        const secPass=await bcrypt.hash(req.body.password,salt);
        user=await Admin.create({
            email:req.body.email,
            password:secPass
        })
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        success=true;
        
        res.json({success,authtoken});


        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error") 
    }
});

router.get("/getadmin",fetchuser,async(req,res)=>{
    try {
        let success=false;
        let adminid=req.user.id;
        let admin=await Admin.findById(adminid);
        if(!admin){
            res.send({success}); 
        }
        else{
            success=true;
            res.send({success});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error") 
    }
})
module.exports=router;