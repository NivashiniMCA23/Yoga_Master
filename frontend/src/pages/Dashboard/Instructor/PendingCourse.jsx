import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const PendingCourse = () => {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure
      .get("/classes")
      .then((res) => {
        console.log("API Response:", res.data); // ✅ Debugging API response

        // ✅ Ensure case-insensitive filtering
        const pending = res.data.filter(
          (course) => course.status?.toLowerCase() === "rejected"
        );

        setPendingCourses(pending);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pending courses:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center text-xl font-bold my-10">
        <p>Loading pending courses...</p>
        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin mt-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="my-10 container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Pending <span className="text-secondary">Courses</span>
      </h1>

      {pendingCourses.length === 0 ? (
        <div className="text-center text-2xl font-bold mt-10">
          No Pending Courses Found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingCourses.map((course) => (
            <div key={course._id} className="p-4 border rounded-lg shadow-md">
              <img
                src={course.image || "https://via.placeholder.com/300"}
                onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
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
              <p className="text-yellow-500 font-bold">Pending ⏳</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingCourse;
