 
 import {Course} from "../model/course.model.js";
 import { Purchase } from "../model/purchase.model.js";
 import { v2 as cloudinary } from 'cloudinary';
 import jwt from "jsonwebtoken";
 import config from "../config.js";
 export const createCourse= async (req,res)=>{
    const adminId=req.adminId;
    const{title,description,price} =req.body;

    try {
        if(!title||!description||!price){
            return res.status(400).json({errors:"All fields are required"})
        }
        const {image}=req.files
        if(!req.files || Object.keys(req.files).length===0){
            return res.status(400).json({errors:"No files uploaded"}) ;
        }
        const allowedFormat=["image/png", "image/jpeg"];
        if(!allowedFormat.includes(image.mimetype)){
            return res.status(400).json({errors:"Invalid file format only PNG and JPG format are allowed"})
        }
        const cloud_response=await cloudinary.uploader.upload(image.tempFilePath )
        if(!cloud_response || cloud_response.error){
            return res.status(400).json({error:"Error uploading file to cloudinary"})
        }
        const courseData={ 
            title,
            description,price,image:{
                public_id:cloud_response.public_id,
                url:cloud_response.url,
            },
            creatorId:adminId
        }
   const course=   await  Course.create(courseData);
   res.json({
    message:"course created sucessfully",course,
   });
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Error creating course"})
    }

};
export const updateCourse=async(req,res)=>{
    const adminId=req.adminId;
    const {courseId}=req.params;
    const{title,description,price,image}=req.body;
    try {
      const course=await Course.findOneAndUpdate({
_id:courseId,
creatorId:adminId,
      },{
title,description,price,image:{
    public_id:image?.public_id,
    url:image?.url,
},


      }) ;
      if(!course){
        res.status(404).json({errors:"course created by other admin"});
      }
      res.status(201).json({message:"Course updated suceessfully",course})
        
    } catch (error) {
        res.status(500).json({message:"Error in updating course"})
          console.log("Error in course updating",error)  ;
        
    }
}

export const  deleteCourse=async(req,res)=>{
    const adminId=req.adminId;
 const   {courseId}=req.params;
 try{
 const course= await Course.findOneAndDelete({
    _id:courseId,
    creatorId:adminId,

    });
    if(!course){
       return  res.status(404).json({error:"cannot delete created by other admin"})
    }
    res.status(200) .json({errors:"Error in course deleting"});
 }catch(error){
res.status(500).json({errors:"Error in deleting the course"});
console.log("Error in course deleting",error);
 }
}


export const getCourse=async(req,res)=>{
    try {
        const course=await Course.find({});
        res.status(201).json({course})



    } catch (error) {
        res.status(500).json({errors:"error in getting the course"})
    }
}


export const courseDetails=async(req,res)=>{
const {courseId}=req.params;
try {
    const course=await Course.findById(courseId);
    if(!course){
        res.status(404).json({error:"course not found"})
    }
    res.status(200).json({course});
    



} catch (error) {
    res.status(500).json({error:"error in finding the course or its details"})



}


}
import Stripe from "stripe";

const stripe= new Stripe( config.STRIPE_SECRET_KEY);

export const buyCourses=async(req,res,next)=>{
    const { userId } = req;
    const { courseId } = req.params;
  
    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ errors: "Course not found" });
      }
      const existingPurchase = await Purchase.findOne({ userId, courseId });
      if (existingPurchase) {
        return res
          .status(400)
          .json({ errors: "User has already purchased this course" });
      }

const amount=course.price;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
          
        
      });
    
      
      res.status(201).json({message:"Course Purchased successfully",course,clientSecret: paymentIntent.client_secret,});
  

    } catch (error) {
      res.status(500).json({ errors: "Error in course buying" });
      console.log("error in course buying ", error);

    }
  
 
 
}
