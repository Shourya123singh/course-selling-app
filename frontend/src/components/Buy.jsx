import React ,{useEffect, useState}from "react";
import {useFetcher, useNavigate, useParams} from "react-router-dom";
import  {} from "@stripe/react-stripe-js"
import toast from "react-hot-toast";
import axios from "axios";
import {Link } from "react-router-dom";
import {CardElement,useElements,useStripe} from  "@stripe/react-stripe-js";

function Buy() {
  
  const navigate=useNavigate();
const {courseId}=useParams();
  const [loading,setLoading]=useState(false);
const[course,setCourse]=useState([]);
const [clientSecret,setClientSecret]=useState("");
const [error,setError]=useState("");

const user=JSON.parse(localStorage.getItem("user"));

const token=user.token;
const stripe = useStripe();
const elements = useElements();
const [cardError,setCardError]=useState("");

useEffect(()=>{
const fetchBuyCourseData=async()=>{
  if(!token){
    setError("plz login first");
  }

  try {
    
   
    const response=await axios.post(`http://localhost:3001/api/v1/course/buy/${courseId}`,{},{
      headers:{
Authorization:`Bearer ${token}`
      },
      withCredentials:true,
    }
  )
  console.log(response.data);
setCourse(response.data.course);
setClientSecret(response.data.clientSecret)
  
setLoading(false);
    
  } catch (error) { 
    setLoading(false);
    if(error?.response?.status===400){
      setError("You have already purchased this course");
      navigate("/purchases");
    }else{
      toast.error(error?.response?.data?.errors)
    }
  }
}

fetchBuyCourseData();

},[courseId])
const handlePurchase=async(event)=>{
  event.preventDefault();

  if (!stripe || !elements) {
    console.log("Stripe or Element not found")
    return;
  }

 setLoading(true);
  const card = elements.getElement(CardElement);

  if (card == null) {
    console.log("card element not found")
    setLoading(false);
    return;
  }

  
  const {error, paymentMethod} = await stripe.createPaymentMethod({
    type: 'card',
    card,
  });

  if (error) {
    console.log('Stripe payment method error:', error);
    setLoading(false);
    setCardError(error.message);
  } else {
    console.log('PaymentMethod Created', paymentMethod);
  }
  if(!clientSecret){
    console.log("No client secret Found");
    setLoading(false);
    return;
  }
  const {paymentIntent,error:confirmError}=await stripe
  .confirmCardPayment(clientSecret, {
    payment_method: {
      card: card,
      billing_details: {
        name: user?.user?.firstName,
      },
    },
  },);
  
 if(confirmError){
  setCardError(confirmError.message);
 } else if(paymentIntent.status==="succeeded"){
  console.log("payment succeeded:",paymentIntent)
  setCardError("your payment id:",paymentIntent.id)
  const paymentInfo={
    email:user?.user?.email,
    userId:user.user._id,
    courseId:course._id,
    paymentId:paymentIntent.id,
    amount:paymentIntent.amount,
    status:paymentIntent.status,
  }
  console.log("Payment info:",paymentInfo);
  await axios.post(`http://localhost:3001/api/v1/order`,paymentInfo,{   
     headers:{
    Authorization:`Bearer ${token}`,
          },
withCredentials:true,
  }).then((response) =>{

    console.log(response.data)
  }).catch((error)=>{
    console.log(error)
    toast.error("Error in making payment");
  })
  
  toast.success("Payment successfull");
  navigate("/purchases");
 }
 setLoading(false);

};


return (
  <>
      {error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
              to={"/purchases"}
            >
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        
        
      
        <div  className="flex flex-col sm:flex-row my-40 container mx-auto">
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-600 text-sm">Total Price</h2>
              <p className="text-red-500 font-bold">${course.price}</p>
            </div>
            <div className="flex items-center text-center space-x-2">
              <h1 className="text-gray-600 text-sm">Course name</h1>
              <p className="text-red-500 font-bold">{course.title}</p>
            </div>
          </div>
      
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Process your Payment!
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2"
                  htmlFor="card-number"
                >
                  
                  Credit/Debit Card
                </label>
                <form onSubmit={handlePurchase}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!stripe || loading} // Disable button when loading
                    className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                  >
                    {loading ? "Processing..." : "Pay"}
                  </button>
                </form>
                {cardError && (
                  <p className="text-red-500 font-semibold text-xs">
                    {cardError}
                  </p>
                )}
              </div>

              <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                <span className="mr-2">🅿️</span> Other Payments Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
    
  );


}


export default Buy;
