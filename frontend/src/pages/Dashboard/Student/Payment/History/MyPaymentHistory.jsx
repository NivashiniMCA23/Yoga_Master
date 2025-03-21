// import { useEffect, useState } from "react";
// import useAxiosFetch from "../../../../../hook/useAxiosFetch"
// import useAxiosSecure from "../../../../../hook/useAxiosSecure";

// const MyPaymentHistory = () => {
//   const axiosFetch = useAxiosFetch();
//   const axiosSecure = useAxiosSecure();
//   const {currentUser} = useUser();
//   const [payments, setPayment] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [paginatedPayments, setPaginatedPayments] = useState([]);
//   const totalItem = payments.length;
//   const [page, setPage] = useState(1);
//   let totalPage = Math.ceil(totalItem / 5);
//   let itemsPerPage = 5;
//   const handleChange = (event, value)=>{
//     setPage(value);
//   }
//   useEffect(()=>{
//    const lastIndex = page * itemsPerPage;
//    const firstIndex = lastIndex - itemsPerPage;
//    const currentItems = payments.slice(firstIndex,lastIndex);
//    setPaginatedPayments(currentItems)
//   },[page, payments])

//   useEffect(() =>{
//     axiosFetch.get(`//payment-history/${currentUser?.email}`).then(res=>{
//        setPayments(res.data)
//        setLoading(false)
//     }).catch(err =>console.log(err))
//   },[currentUser.email]);


//   const totalPaidAmount = payments.reduce((acc, curr)=> acc + curr.amount, 0);
  
//   if(loading){
//     return <p>Loading...</p>
//   }
//   return (
//     <div>MyPaymentHistory</div>
//   )
// }

// export default MyPaymentHistory

import { useEffect, useState } from "react";
import useAxiosFetch from "../../../../../hook/useAxiosFetch";
import useAxiosSecure from "../../../../../hook/useAxiosSecure";
import useUser from "../../../../../hook/useUser"; 

const MyPaymentHistory = () => {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const { currentUser } = useUser(); 
  const [payments, setPayments] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [paginatedPayments, setPaginatedPayments] = useState([]);
  const totalItem = payments.length;
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const totalPage = Math.ceil(totalItem / itemsPerPage);

  useEffect(() => {
    if (currentUser?.email) { 
      axiosFetch.get(`/payment-history/${currentUser.email}`)
        .then(res => {
          setPayments(res.data);
          setLoading(false);
        })
        .catch(err => console.log(err));
    }
  }, [currentUser]);

  useEffect(() => {
    const lastIndex = page * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    setPaginatedPayments(payments.slice(firstIndex, lastIndex));
  }, [page, payments]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const totalPaidAmount = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0); 

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="text-center mt-6 mb-16">
        <p className="text-gray-400">Hey, <span className="text-secondary font-bold">{currentUser.name}</span> Welcome...!</p>
        <h1 className="text-4xl font-bold">My Paym<span className="text-secondary">ent Hist</span>ory</h1>
        <p className="text-gray-500 text-sm my-3">You can see your Payment History here</p>
      </div>
     {/* {} */}
     <div>
     <div>
      <p className="font-bold">Total payments : {payments.length}</p>
      <p className="font-bold">Total Paid : {totalPaidAmount}</p>
      </div>
      <div>
        <div>
          {
            paginatedPayments.map((payment,idx)=> 
            (
              <tr>
                <td>{idx + 1}</td>
                <td className="whitespace-nowrap px-6 py-4">{payment.amount}</td>
                 <td className="whitespace-nowrap px-6 py-4">{payment.classesId.length}</td>
              </tr>
            ))
          }
        </div>
      </div>
      </div>
    </div>
  );
};

export default MyPaymentHistory;
