import React, { useEffect, useState } from "react";
import useUser from "../../../../hook/useUser";
import useAxiosFetch from "../../../../hook/useAxiosFetch";
import { FiBriefcase, FiMail, FiSend, FiUser } from "react-icons/fi";
import Swal from "sweetalert2";
import { PulseLoader } from "react-spinners";

const AsInstructor = () => {
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useUser();
  const axiosFetch = useAxiosFetch();

  // Fetch applied instructor data
  useEffect(() => {
    if (!currentUser?.email) return; // Avoid unnecessary API calls

    axiosFetch
      .get(`/applied-instructors/${currentUser.email}`)
      .then((res) => {
        setSubmittedData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [currentUser?.email]);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const experience = e.target.experience.value;
    const data = {
      name: currentUser?.name,
      email: currentUser?.email,
      experience,
    };

    axiosFetch
      .post(`/ass-instructor`, data)
      .then((res) => {
        Swal.fire("Success!", "Successfully Applied!", "success");
        setSubmittedData(data); // Update UI after submission
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error!", "Something went wrong!", "error");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="my-20 flex justify-center">
      {loading ? (
        <PulseLoader size={10} color="#FF5733" />
      ) : !submittedData?.name ? (
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-center mb-4">Apply as Instructor</h2>
          <form onSubmit={onSubmit}>
            {/* Name & Email Fields */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-gray-700">Name</label>
                <div className="flex items-center mt-1 border-b border-gray-300">
                  <FiUser className="text-gray-500" />
                  <input
                    defaultValue={currentUser?.name}
                    disabled
                    readOnly
                    className="ml-2 w-full bg-transparent outline-none"
                    type="text"
                    name="name"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label className="text-gray-700">Email</label>
                <div className="flex items-center mt-1 border-b border-gray-300">
                  <FiMail className="text-gray-500" />
                  <input
                    defaultValue={currentUser?.email}
                    disabled
                    readOnly
                    className="ml-2 w-full bg-transparent outline-none"
                    type="email"
                    name="email"
                  />
                </div>
              </div>
            </div>

            {/* Experience Field */}
            <div className="mt-4">
              <label className="text-gray-700">Experience</label>
              <div className="flex items-center mt-1 border border-gray-300 rounded-lg px-2 py-1">
                <FiBriefcase className="text-gray-500" />
                <textarea
                  placeholder="Tell us about your experience..."
                  className="ml-2 w-full bg-transparent outline-none resize-none"
                  name="experience"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 text-center">
              <button
                type="submit"
                className={`flex items-center px-6 py-3 bg-secondary text-white rounded-md ${
                  submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={submitting}
              >
                <FiSend className="mr-2" />
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center text-lg font-semibold text-gray-700">
          ✅ You have already applied as an instructor!
        </div>
      )}
    </div>
  );
};

export default AsInstructor;
