import jwt from "jsonwebtoken";
import config from "../config.js";

 function adminMiddleware(req,res,next){
    
    
     const authHeader=req.headers.authorization;
    
     if(!authHeader || !authHeader.startsWith("Bearer")){
         return res.status(401).json({errors:"No token provided"});
     }
     const token=authHeader.split(" ")[1];
     
     try{
    
     const decoded=jwt.verify(token,config.JWT_ADMIN_PASSWORD);
     console.log(decoded);
     req.adminId=decoded.id;
     
     next();
    
     }catch(error){
     res.status(401).json({errors:"Invalid Token or expired"}) ;
     console.log("Invalid token or expired token:",error); 
 }
     
    
 
 }





export default adminMiddleware;