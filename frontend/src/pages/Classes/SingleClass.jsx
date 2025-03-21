import React, { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import useUser from '../../hook/useUser';
import useAxiosFetch from '../../hook/useAxiosFetch';
import useAxiosSecure from '../../hook/useAxiosSecure';

const SingleClass = () => {
    const courses = useLoaderData();
    // console.log(courses)
    const {currentUser} = useUser();
    // console.log(currentUser?.role);
    const role = currentUser?.role;
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();
  return (
      <>
      <div>
       </div></>
  )
}

export default SingleClass