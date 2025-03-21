// import React from 'react'
// import { loadStripe } from "@stripe/stripe-js";
// import { Navigate, useLocation } from 'react-router-dom';
// // const stripePromise = loadStripe(import.meta.env.VITE_STRIPE);
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE);
// import { Elements } from "@stripe/react-stripe-js";
// import '../Payment.css'
// import CheckOutPayment from '../../Payment/CheckOutPayment';
// const Payment = () => {
//   const location = useLocation();
//   // console.log("Stripe Key:", import.meta.env.VITE_STRIPE);
//   // console.log(location);
//   const price = location?.state?.price;
//   const cartItm = location.state?.itemId;
//   if(!price){
//     return <Navigate to="/dashboard/my-selected"/>
//   }
//   return (
//     <div className='my-40 stripe-custom-class'>
//     <Elements stripe={stripePromise}>
//      <CheckOutPayment price={price} cartItm={cartItm}/>
//     </Elements>
//     </div>
//   )
// }

// export default Payment
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Navigate, useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import "../Payment.css";
import CheckOutPayment from "../../Payment/CheckOutPayment";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE);

const Payment = () => {
  const location = useLocation();

  // Fallback check to avoid accessing undefined state
  const price = location?.state?.price ?? null;
  const cartItm = location?.state?.itemId ?? null;

  if (!price) {
    return <Navigate to="/dashboard/my-selected" />;
  }

  return (
    <div className="my-40 stripe-custom-class">
      <Elements stripe={stripePromise}>
        <CheckOutPayment price={price} cartItm={cartItm} />
      </Elements>
    </div>
  );
};

export default Payment;
