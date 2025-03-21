import React, { useEffect, useState } from "react";
import useAxiosFetch from "../../../hook/useAxiosFetch";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const axiosFetch = useAxiosFetch();

  useEffect(() => {
    axiosFetch.get("/pending-instructors")
      .then(res => setApplications(res.data))
      .catch(err => console.error(err));
  }, []);

  const approveInstructor = (id) => {
    axiosFetch.patch(`/approve-instructor/${id}`)
      .then(() => {
        alert("Instructor approved!");
        setApplications(applications.filter(app => app._id !== id)); // Remove approved application from UI
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="my-10 p-5 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Pending Instructor Applications</h2>
      {applications.length > 0 ? (
        <ul>
          {applications.map(app => (
            <li key={app._id} className="mb-3 flex justify-between items-center">
              <span>{app.name} ({app.email})</span>
              <button
                onClick={() => approveInstructor(app._id)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending applications.</p>
      )}
    </div>
  );
};

export default ManageApplications;
