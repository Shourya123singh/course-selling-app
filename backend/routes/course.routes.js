import express from "express";
import {createCourse,updateCourse,deleteCourse,getCourse,courseDetails,buyCourses} from "../controller/course.controller.js";
import userMiddleware from "../middlewares/user.mid.js";
import adminMiddleware from "../middlewares/admin.mid.js";
const router=express.Router();
router.post("/create",adminMiddleware,createCourse)
router.put("/update/:courseId",adminMiddleware,updateCourse)
router.post("/delete/:courseId",adminMiddleware,deleteCourse)
router.get("/courses",getCourse)
router.get("/:courseId",courseDetails);
router.post("/buy/:courseId",userMiddleware,buyCourses);
export  default router;