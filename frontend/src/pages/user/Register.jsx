// import React, { useContext } from 'react'
// import { useForm } from "react-hook-form"
// import { AiOutlineLock, AiOutlineMail, AiOutlinePhone, AiOutlinePicture, AiOutlineUser} from "react-icons/ai";
// import { MdOutlineLocationOn } from "react-icons/md";
// import {Link, useNavigate} from "react-router-dom"
// import GoogleLogin from '../../components/Social/GoogleLogin';
// import { AuthContext } from '../../ultilities/provider/AuthProvider';
// import axios from 'axios';

// const Register = () => {
//   const navigate = useNavigate();
//   const {signUp,updateUser, setError} = useContext(AuthContext)
//     const {register,handleSubmit,watch, formState: { errors } } = useForm();
//     const onSubmit = (data) => {
//       setError("");
//       signUp(data.email, data.password).then((result)=> {
//         const user = result.user;
//         if(user){
//         return updateUser(data.name, data.photoUrl).then(()=>{
//           const userImp = {
//             name: user?.displayName,
//             email: user?.email,
//             photoURL: user?.photoURL,
//             role: 'user',
//             gender: data.gender,
//             phone: data.phone,
//             address: data.address
//           }
//           }).catch((err)=>{
//             setError(err.code);

            
//           if(user.email && user.displayName){
//             return axios.post('http://localhost:5000/new-user', userImp).then(()=>{
//               setError("");
//               navigate('/');

//               return "Registration Successful!"
//             }).catch((err)=>{
//               throw new Error(err);
//             })
//           }
//         })
//         }
//       })
//     };
//     const password = watch('password','')
//   return (
//     <div className='flex justify-center items-center pt-14 bg-gray-100'>
//         <div className='bg-white p-8 rounded-lg shadow-md'>
//             <h2 className='text-3xl font-bold text-center mb-6'>Please Register</h2>


//             {/* {form data} */}
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className='flex items-center gap-5'>

//                     {/* {name} */}
//                     <div className='mb-4'>
//                       <label htmlFor="name" className='block text-gray-700 font-bold mb-2'>
//                       <AiOutlineUser className='inline-block mr-2 mb-1 text-lg'/>
//                       Name
//                       </label>
//                       <input type="text" placeholder='Enter Your Name'{...register("name", { required:
//                          true })} className='w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring
//                          focus:border-blue-300'/>
//                     </div>

//                     {/* {email} */}
//                     <div className='mb-4'>
//                       <label htmlFor="email" className='block text-gray-700 font-bold mb-2'>
//                       <AiOutlineMail className='inline-block mr-2 mb-1 text-lg'/>
//                       Email
//                       </label>
//                       <input type="email" name="email" placeholder='Enter Your Email' {...register("email", { required: true })} 
//                       className='w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring
//                          focus:border-blue-300'/>
//                     </div>
//                     </div>

//                     {/* {password} */}
//                     <div className='flex items-center gap-5'>
//                     <div className="mb-4">
//                       <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
//                         <AiOutlineLock className="inline-block mr-2 mb-1 text-lg" />
//                         Password
//                       </label>
//                       <input
//                         type="password"
//                         placeholder="Enter Your Password"
//                         {...register("password", { required: true })}
//                         className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
//                       />
//                     </div>


//                     {/* {confirm Password} */}
//                     <div className='mb-4'>
//                       <label htmlFor="confirmpassword" className='block text-gray-700 font-bold mb-2'>
//                       <AiOutlineLock className='inline-block mr-2 mb-1 text-lg'/>
//                       Confirm Password
//                       </label>
//                       <input type="password" placeholder='Confirm Password'{...register("confirmPassword", { required:
//                          true, validate: (value)=> value === password || "password not match"})} className='w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring
//                          focus:border-blue-300'/>
//                     </div>
//                       </div>
 
//                      {/* {phone} */}
//                       <div className='flex items-center gap-5'>
//                       <div className='mb-4'>
//                       <label htmlFor="phone" className='block text-gray-700 font-bold mb-2'>
//                       <AiOutlinePhone className='inline-block mr-2 mb-1 text-lg'/>
//                       PhoneNumber
//                       </label>
//                       <input type="tel" placeholder='Enter Your Phone Number'{...register("phonenumber", { required:
//                          true })} className='w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none 
//                          focus:ring focus:border-blue-300'/>
//                     </div>

//                     {/* {Photo Url} */}
//                     <div className='mb-4'>
//                       <label htmlFor="photoUrl" className='block text-gray-700 font-bold mb-2'>
//                       <AiOutlinePicture className='inline-block mr-2 mb-1 text-lg'/>
//                       Photo URL
//                       </label>
//                       <input type="text" placeholder='Photo URL'{...register("photoUrl")}
//                        className='w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring
//                          focus:border-blue-300'/>
//                       </div>
//                       </div>

//               {/* { Gender} */}
//                   <div>
//                     <div className='mb-4'>
//                       <label htmlFor="gender" className='block text-gray-700 font-bold mb-2'>
//                       <AiOutlineUser className='inline-block mr-2 mb-1 text-lg'/>
//                       Gender
//                       </label>
//                  <select {...register("gender",{required: true})} className="w-full border border-gray-300 rounded-md py-2 
//                  px-4 focus:outline-none focus:ring focus:border-blue-400">
//                    <option value="">Select Gender</option>
//                    <option value="Female">Female</option>
//                    <option value="Male">Male</option>
//                    <option value="Other">other</option>
//                    </select>
//                     </div>


//                        {/* {Address} */}
                    
                   
//                     <div className="mb-4">
//                     <label htmlFor="address" className="block text-gray-700 font-bold mb-2">
//                      <MdOutlineLocationOn className="inline-block mr-2 mb-1 text-lg" />
//                      Address
//                     </label>
//                     <textarea
//                       {...register("address", { required: true })}
//                       rows="3"
//                       className="w-full border border-gray-300 rounded-md py-2 px-4 focus:
//                       outline-none focus:ring focus:border-blue-400"
//                       placeholder="Enter Address"/>
//                   </div>
//                   </div>
                 

//                  <div className='text-center'>
//                   <button type="submit" className='bg-secondary hover:bg-red-500 text-white py-2 px-4 
//                   rounded-md'>Register</button>
//                {
//                     errors && (<div className='text-red-600 text-sm w-full mt-1'>
//                       <p>Incorrect Password!</p>
//                       </div>)
//                   }
//                  </div>
                
//             </form>

//             <p className='text-center mt-4'>
//               Already have an account?{""} 
//               <Link to="/login" className='underline text-secondary ml-1'>
//               {""}Login</Link>
//             </p>

//             <GoogleLogin/>
//         </div>
//     </div>
//   )
// }

// export default Register

import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLock, AiOutlineMail, AiOutlinePhone, AiOutlinePicture, AiOutlineUser } from "react-icons/ai";
import { MdOutlineLocationOn } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import GoogleLogin from "../../components/Social/GoogleLogin";
import { AuthContext } from "../../ultilities/provider/AuthProvider";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setError("");
    try {
      const result = await signUp(data.email, data.password);
      const user = result.user;

      if (user) {
        await updateUser(data.name, data.photoUrl);

        const userImp = {
          name: data.name,
          email: data.email,
          photoURL: data.photoUrl,
          role: "user",
          gender: data.gender,
          phone: data.phone,
          address: data.address,
        };

        await axios.post("http://localhost:5000/new-user", userImp);
        setError("");
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center pt-14 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Please Register</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name & Email */}
          <div className="flex flex-col md:flex-row md:gap-5">
            <div className="mb-4 w-full">
              <label className="block text-gray-700 font-bold mb-2">
                <AiOutlineUser className="inline-block mr-2 mb-1 text-lg" />
                Name
              </label>
              <input
                type="text"
                placeholder="Enter Your Name"
                {...register("name", { required: "Name is required" })}
                className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="mb-4 w-full">
              <label className="block text-gray-700 font-bold mb-2">
                <AiOutlineMail className="inline-block mr-2 mb-1 text-lg" />
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Your Email"
                {...register("email", { required: "Email is required" })}
                className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="flex flex-col md:flex-row md:gap-5">
            <div className="mb-4 w-full">
              <label className="block text-gray-700 font-bold mb-2">
                <AiOutlineLock className="inline-block mr-2 mb-1 text-lg" />
                Password
              </label>
              <input
                type="password"
                placeholder="Enter Your Password"
                {...register("password", { required: "Password is required" })}
                className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div className="mb-4 w-full">
              <label className="block text-gray-700 font-bold mb-2">
                <AiOutlineLock className="inline-block mr-2 mb-1 text-lg" />
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Phone & Photo URL */}
          <div className="flex flex-col md:flex-row md:gap-5">
            <div className="mb-4 w-full">
              <label className="block text-gray-700 font-bold mb-2">
                <AiOutlinePhone className="inline-block mr-2 mb-1 text-lg" />
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter Your Phone Number"
                {...register("phone", { required: "Phone number is required" })}
                className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            <div className="mb-4 w-full">
              <label className="block text-gray-700 font-bold mb-2">
                <AiOutlinePicture className="inline-block mr-2 mb-1 text-lg" />
                Photo URL
              </label>
              <input
                type="text"
                placeholder="Photo URL"
                {...register("photoUrl")}
                className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>

          {/* Gender & Address */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              <AiOutlineUser className="inline-block mr-2 mb-1 text-lg" />
              Gender
            </label>
            <select
              {...register("gender", { required: "Gender is required" })}
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-400"
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              <MdOutlineLocationOn className="inline-block mr-2 mb-1 text-lg" />
              Address
            </label>
            <textarea
              {...register("address", { required: "Address is required" })}
              rows="3"
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Enter Address"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className="bg-secondary hover:bg-red-500 text-white py-2 px-4 rounded-md">
              Register
            </button>
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="underline text-secondary ml-1">
            Login
          </Link>
        </p>

        <GoogleLogin />
      </div>
    </div>
  );
};

export default Register;
