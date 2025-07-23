import {User} from "../model/user.model.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import  jwt from "jsonwebtoken";
import config from "../config.js"
import { Purchase } from "../model/purchase.model.js";
import { Course } from "../model/course.model.js";

export const signup=async(req,res)=>{
    const{firstname,lastname,email,password}=req.body
    const userSchema = z.object({
        firstname: z.string().min(3,{message:"FirstName should be more than 3 characters long"}),
        lastname:z.string().min(3,{message:"lastName should be more than 3 characters long"}),
        email:z.string().email({message:"invalid email"}),
        password:z.string().min(6,{message:"password must be 6 characters long"}),

      });
      
      const validateData=userSchema.safeParse(req.body);
      if(!validateData.success){

        return res.status(400).json({errors:validateData.error.issues.map((err)=>err.message)});
      }
    const hashedpassword= await bcrypt.hash(password,10);

try {

    const existinguser=await User.findOne({
        email:email
    });
    if(existinguser){
       return  res.status(400).json({errors:"User is already existing "})
    }
   const newUser=new User({firstname,lastname,email,password:hashedpassword,});
   await newUser.save();
   res.status(201).json({message:"sign up successfull",newUser});
    
} catch (error) {
    res.status(500).json({errors:"error in signup"})
}
};




export const login=async(req,res)=>{
    const {email,password}=req.body;
    

    try {
        const user= await User.findOne({email:email});
        
        const isPasswordCorrect= await bcrypt.compare(password,user.password);
    if(!user || !isPasswordCorrect){
return res.status(403).json({errors:"Invalid credentials"});
    }

    const token =jwt.sign({id:user._id,},config.JWT_USER_PASSWORD,
        {expiresIn:"1d"}
    
    );
    const cookieOptions={
        expires:new Date(Date.now()+24*60*1000),
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        samesite:"Strict"
    }
    res.cookie("jwt",token,cookieOptions);
    res.status(201).json({message:"Login sucessfull",user,token});
    
        
    } catch (error) {
        console.error("Error in login:",error);
        res.status(500).json({errors:"Error invalid login"})
    }
}

export const logout=(req,res)=>{

    try {
        if(!req.cookies.jwt){
            return res.status(401).json({errors:"Kindly login first"})
        }
        res.clearCookie("jwt");
        res.status(200).json({message:"Logged Out sucessfully"});
        
    } catch (error) {
        console.log("Error in logout",error);
    }



}

export const purchases=async (req,res)=>{
const userId=req.userId;
try {
    const purchases=await Purchase.find({userId});
    const purchased=[];
    for(let i=0;i<purchases.length;i++){
purchased.push(purchases[i].courseId);
    }
const courseData=await Course.find({
    _id:{$in:purchased},
});
res.status(200).json({purchases,courseData});

} catch (error) {
    res.status(500).json({errors:"Error in purchases"});
    console.log("Error in purchase",error);
}



}