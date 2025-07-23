
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_51R81GqPTmiqJof6bha0V1DO7mZoXmwHlWKIxRnfWt8Nwcufr6grNCISI6Y2xzM7DSYKfbGkNKs1rgIavO77nGoif00GnuVCh9w");

createRoot(document.getElementById('root')).render(
 
  <Elements stripe={stripePromise}>
  <BrowserRouter>
  <App/>
  </BrowserRouter>
</Elements>
 
);
