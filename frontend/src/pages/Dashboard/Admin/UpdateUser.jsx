import React from "react";
import useAuth from "../../../hook/useAuth";
import { useLoaderData } from "react-router-dom";
import useAxiosFetch from "../../../hook/useAxiosFetch";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const UpdateUser = () => {
  const { user } = useAuth();
  const userCredentials = useLoaderData();
  console.log(userCredentials);
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData);

    axiosSecure.patch(`/update-user/${userCredentials?.id}`, updatedData)
      .then(res => { 
        if(res.data.modifiedCount > 0){
          alert("User updated Successfuly")
        }
        console.log(res.data)
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1 className="text-center text-4xl font-bold mt-5">
        Update : <span className="text-secondary">{user?.displayName}</span>
      </h1>
      <p className="text-center my-5">
        Change details about <span className="text-red-400 font-bold">{user?.displayName}</span>
      </p>

      <section>
        <div className="mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-8 shadow-lg lg:p-12">
            <form 
              className="space-y-4 w-full max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-lg"
              onSubmit={handleFormSubmit}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="ml-2 pb-2" htmlFor="name">Name</label>
                  <input className="w-full rounded-lg mt-3 border outline-none border-secondary p-3 text-sm"
                    placeholder="Your Name"
                    type="text"
                    required
                    defaultValue={userCredentials?.name || ""}
                    id="name"
                    name="name"
                  />
                </div>
                <div>
                  <label className="ml-2 pb-2" htmlFor="phone">Phone</label>
                  <input className="w-full rounded-lg mt-3 border outline-none border-secondary p-3 text-sm"
                    placeholder="Phone Number"
                    type="tel"
                    required
                    defaultValue={userCredentials?.phone || ""}
                    id="phone"
                    name="phone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="ml-2 pb-2" htmlFor="email">Email</label>
                  <p className="text-[12px] ml-2 text-red-400">
                    Updating email is not recommended. Please leave it default.
                  </p>
                  <input className="w-full rounded-lg mt-3 border outline-none border-secondary p-3 text-sm"
                    placeholder="Email Address"
                    type="email"
                    required
                    defaultValue={userCredentials?.email}
                    id="email"
                    name="email"
                  />
                </div>
                <div>
                  <label className="ml-2 pb-2" htmlFor="skills">Skills</label>
                  <p className="text-[12px] ml-2 text-red-400">
                    If the user is an instructor, set skills. Otherwise, leave it empty.
                  </p>
                  <input className="w-full rounded-lg mt-3 border outline-none border-secondary p-3 text-sm"
                    placeholder="Skills"
                    type="text"
                    defaultValue={userCredentials?.skills || ""}
                    name="skills"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="ml-2 pb-2" htmlFor="address">Address</label>
                  <input className="w-full rounded-lg mt-3 border outline-none border-secondary p-3 text-sm"
                    placeholder="Address"
                    type="text"
                    required
                    defaultValue={userCredentials?.address}
                    name="address"
                  />
                </div>

                <div>
                  <label className="ml-2 pb-2" htmlFor="photoUrl">Photo URL</label>
                  <input className="w-full rounded-lg mt-3 border outline-none border-secondary p-3 text-sm"
                    placeholder="Photo URL"
                    type="text"
                    required
                    defaultValue={userCredentials?.photoUrl}
                    name="photoUrl"
                  />
                </div>
              </div>

              <h1>Please select a role</h1>
              <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                {["user", "admin", "instructor"].map((role) => (
                  <div key={role}>
                    <input className="peer sr-only"
                      id={role}
                      type="radio"
                      value={role}
                      defaultChecked={userCredentials?.role === role}
                      name="role"
                    />
                    <label htmlFor={role} className="block w-full rounded-lg border border-secondary p-3 peer-checked:border-secondary peer-checked:bg-secondary peer-checked:text-white">
                      <span className="text-sm font-medium">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                    </label>
                  </div>
                ))}
              </div>

              <div>
                <label className="sr-only" htmlFor="about">About</label>
                <textarea className="w-full resize-none rounded-lg border-secondary border outline-none p-3 text-sm"
                  placeholder="About User"
                  rows="4"
                  defaultValue={userCredentials?.about || ""}
                  name="about"
                  id="about"
                ></textarea>
              </div>

              <div className="mt-4">
                <button type="submit"
                  className="inline-block w-full rounded-lg bg-secondary px-5 py-3 font-medium text-white sm:w-auto"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpdateUser;
