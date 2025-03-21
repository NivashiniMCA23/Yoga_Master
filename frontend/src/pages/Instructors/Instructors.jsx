import React, { useState, useEffect } from 'react';
import useAxiosFetch from '../../hook/useAxiosFetch';
import img from "../../../src/assets/home/girl.jpg";

const PopularTeacher = () => {
  const [instructors, setInstructors] = useState([]);
  const axiosFetch = useAxiosFetch();

  useEffect(() => {
    axiosFetch.get('/instructors')
      .then((res) => {
        console.log("API Response:", res.data); // ✅ Debugging Step
        setInstructors(res.data);
      })
      .catch((err) => {
        console.error("Error fetching instructors:", err);
      });
  }, []);

  return (
    <div className='md:w-[80%] mx-auto my-36'>
      <h1 className='text-5xl font-bold text-center'>
        Our <span className='text-secondary'>Best</span> Instructors
      </h1>
      <div className='w-[40%] text-center mx-auto my-4'>
        <p className='text-gray-500'>
          Explore our Popular Instructors based on student enrollment.
        </p>
      </div>

      {instructors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((instructor, i) => (
            <div key={i} className="border p-6 rounded-lg shadow-lg text-center bg-white">
              <img 
                src={instructors?.photoURL || img}  // ✅ Changed path
                alt="Instructor" 
                className="w-32 h-32 rounded-full mx-auto border"
              />
              <h3 className="mt-4 font-semibold text-lg">
                {instructor?.name || "Unknown Instructor"}  {/* ✅ Changed path */}
              </h3>
              <p className="text-gray-500 text-sm">
                <strong>Email:</strong> {instructor?.email || "N/A"}  {/* ✅ Changed path */}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">No instructors found.</p>
      )}
    </div>
  );
};

export default PopularTeacher;
