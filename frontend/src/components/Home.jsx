import React ,{useEffect}from "react"
import {useState} from "react";
import logo  from "../../public/logo1.png";
import {Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
const Home = () => {
    const [courses,setCourses]=useState([]);
    const[isLoggedIn,setIsLoggedIn]=useState(false);

    useEffect(()=>{
      const user=localStorage.getItem("user");
      if(user){
        setIsLoggedIn(true);
      }else{
        setIsLoggedIn(false);
      }
    },[]);
 

    useEffect(()=>{
      const fetchCourses=async()=>{
          try {
      const response= await axios.get("http://localhost:3001/api/v1/course/courses",{
          withCredentials:true,
          
      })  ;
      console.log(response.data.course);
      setCourses(response.data.course);
          } catch (error) {
              console.log("Error in pgm",error)
          }
      };
      fetchCourses();
  },[])

    const handlelogout= async ()=>{
try {
const response=await axios.get("http://localhost:3001/api/v1/user/logout",{
  withCredentials:true,
});
toast.success( response.data.message);
localStorage.removeItem("user");
setIsLoggedIn(false);
  
} catch (error) {
  console.log("error in logout",error);
  toast.error( error.resposne.data.errors||"error in logging out")
}




    };

  


var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    autoplay:true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        },
      },
    ],
  };



   
  return (
    <div className="bg-gradient-to-r from-black to-blue-950 ">
     <div  className="h-screen text-white container mx-auto">
<header className="flex items-center justify-between p-6 ">
<div className="flex items-center space-x-2">
    
    <img src={logo} alt="" className="w-10 h-10 rounded-full" />
<h1 className="text-2xl text-orange-500 font-bold">CourseHeaven</h1> 

</div>

<div className="space-x-4">

{isLoggedIn?(

  <button onClick={handlelogout}
   className="bg-transparent text-white py-2 px-4 border-white rounded"
  > LogOut </button>
):(<>

<Link to={"/login"}  className="bg-transparent text-white py-2 px-4 border border-white rounded "> Login</Link>
<Link to={"/signup"} className="bg-transparent text-white py-2 px-4 border border-white rounded ">Signup </Link>






</>



)}
</div>

</header>


<section className="text-center">
     <h1 className="text-4xl text-orange-500 font-semibold"> CourseHeaven</h1>  
     
     <br />
    <p className=" text-gray-500">Sharpen Your skills with courses crafted by experts</p>
    <div className="space-x-4 mt-8">
        <Link to={"/courses"} className="bg-green-500 text-white py-3 px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black" >Explore Courses</Link>
        <Link  to={"https://www.youtube.com/channel/UCV7cZwHMX_0vk8DSYrS7GCg"}className="bg-white text-black py-3 px-6 rounded font-semibold hover:bg-green-500 duration-300 hover:text-white" >Courses Videos</Link>
    </div>
    </section>


<section> 
 <Slider {...settings}>
        {
 courses.map((course)=>(

<div key={course._id} className="p-4">
    <div className="relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105">
        <div className="bg-gray-900 rounded-lg overflow-hidden">
        <img  className="h-32 w-full object-contain" src={course.image.url} alt="" />
        <div p-6 text-center>
        <h2 className="text-xl font-bold text-white">{course.title}</h2>
        <button className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300">Enroll Now</button>
       </div> 
        </div>
    </div>
</div>
))
}


        


      </Slider>

</section>

<hr />

<footer className="my-8">
<div className="grid grid-cols-1 md:grid-cols-3">
<div className="flex flex-col items-center md:items-start">
    <div className="flex items-center space-x-2">
   

    <img src={logo} alt="" className="w-10 h-10 rounded-full" />
<h1 className="text-2xl text-orange-500 font-bold">CourseHeaven</h1> 

</div>


<div className="mt-3 ml-2 md:ml-8">
    <p className="mb-2">Follow Us</p>
    <div className="flex space-x-4">
        <a href="">
            <FaFacebook className=" text-2xl hover:text-blue-400" /></a>
    <a href=""><FaInstagram className= "hover:text-pink-600 text-2xl" /></a>
    <a href=""><FaTwitter className="hover:text-blue-600 text-2xl" /></a>
    </div>
</div>
</div>

    <div className="items-center flex flex-col">
        
        <h3 className="text-lg font-semibold mb-4">connects</h3>
    <ul className=" space-y-2 text-gray-400">
        <li className="hover:text-white">youtube-learn coding</li>
        <li className="hover:text-white">telegram-learn coding</li>
        <li className="hover:text-white">Github-learn coding</li>
    </ul>
    
    </div>


    <div className="items-center flex flex-col">
  
    <h3 className="text-lg font-semibold mb-4">copyrights &#169; 2024</h3>
    <ul className=" space-y-2 text-gray-400">
        <li className="hover:text-white">Terms & Conditions</li>
        <li className="hover:text-white">Privacy Policy</li>
        <li className="hover:text-white">Refund & Cancellation</li>
    </ul>

    </div>
</div>

</footer>
     </div>
    </div>
  )
}

export default Home
 