import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const MyApproved = () => {
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    // Fetch only approved courses
    axiosSecure
      .get("/classes") // Ensure this endpoint returns all classes
      .then((res) => {
        // Filter only approved courses
        const approved = res.data.filter((course) => course.status === "approved");
        setApprovedCourses(approved);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching approved courses:", err);
        setLoading(false);
      });
  }, [axiosSecure]);

  if (loading) {
    return <div className="text-center text-xl font-bold my-10">Loading...</div>;
  }

  return (
    <div className="my-10 container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        My <span className="text-secondary">Approved Courses</span>
      </h1>

      {approvedCourses.length === 0 ? (
        <div className="text-center text-2xl font-bold mt-10">
          No Approved Courses Found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedCourses.map((course) => (
            <div key={course._id} className="p-4 border rounded-lg shadow-md">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h2 className="text-xl font-bold text-secondary mt-3">
                {course.name}
              </h2>
              <p className="text-gray-600 mt-2">
                <span className="font-bold">Instructor:</span> {course.instructorName}
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Price:</span> Rs.{course.price}
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Total Seats:</span> {course.availableSeats}
              </p>
              <p className="text-green-500 font-bold">Approved ✅</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApproved;
