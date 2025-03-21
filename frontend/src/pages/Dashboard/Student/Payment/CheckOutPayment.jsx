import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useAxiosSecure from '../../../../hook/useAxiosSecure';
import useUser from '../../../../hook/useUser';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const CheckOutPayment = ({ price, cartItm }) => {
  const URL = `http://localhost:5000/payment-info${cartItm ? `?classId=${cartItm}` : ''}`;
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { currentUser, isLoading } = useUser();
  const [clientSecret, setClientSecret] = useState('');
  const [succeeded, setSucceeded] = useState('');
  const [message, setMessage] = useState('');
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  if (price < 0 || !price) {
    return <Navigate to="/dashboard/my-selected" replace />;
  }

  useEffect(() => {
    if (currentUser?.email) {
      axiosSecure
        .get(`/cart/${currentUser.email}`)
        .then((res) => {
          const classesId = res.data.map((item) => item._id);
          setCart(classesId);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [axiosSecure, currentUser?.email]);

  useEffect(() => {
    if (price) {
      axiosSecure.post('/create-payment-intent', { price: price }).then((res) => {
        setClientSecret(res.data.clientSecret);
      });
    }
  }, [axiosSecure, price]);
  

  const handleSubmit = async (event) => {
    setMessage('');
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('[error]', error);
      setMessage(error.message);
      return; // Exit if payment method creation fails
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card, // Use the card object directly
          billing_details: {
            name: currentUser?.name || 'Unknown',
            email: currentUser?.email || 'Unknown',
          },
        },
      }
    );

    if (confirmError) {
      console.log('[confirm Error]', confirmError);
      setMessage(confirmError.message);
    } else {
      console.log('[Payment Intent]', paymentIntent);
      if (paymentIntent.status === 'succeeded') {
        const transactionId = paymentIntent.id;
        const paymentMethod = paymentIntent.payment_method;
        const amount = paymentIntent.amount / 100;
        const currency = paymentIntent.currency;
        const paymentStatus = paymentIntent.status;
        const userName = currentUser?.name;
        const userEmail = currentUser?.email;

        const data = {
          transactionId,
          paymentMethod,
          amount,
          currency,
          paymentStatus,
          userName,
          userEmail,
          classesId: cartItm ? [cartItm] : cart,
          date: new Date(),
        };

        fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (
              res.deleteResult.deleteCount > 0 &&
              res.paymentResult.insertedId &&
              res.updatedResult.modifiedCount > 0
            ) {
              setSucceeded('Payment Successful. You can now access your classes.');
              navigate('/dashboard/enrolled-class');
            } else {
              setSucceeded('Payment Failed. Please try again...');
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">
          Payment Amount: <span className="text-secondary">{price}$</span>
        </h1>
      </div>
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          }}
        />

        <button
          type="submit"
          disabled={isLoading || !stripe || !clientSecret}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 mt-4"
        >
          Pay
        </button>
      </form>
      {message && <div className="mt-4 text-center">{message}</div>}
    </>
  );
};

export default CheckOutPayment;
