import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
firstname:{
    type:String,
    reqired:true,
},
lastname:{
    type:String,
    required:true,
},
email:{
    type:String,
    reqired:true,
    union:true,
},
password:{
    type:String,
    required:true,
},
});
 export const User=new mongoose.model("User",userSchema);








