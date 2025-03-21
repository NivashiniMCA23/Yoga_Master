import React, { useState } from 'react';
import { HiOutlineMail } from "react-icons/hi";
import { FiEye } from "react-icons/fi";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import GoogleLogin from '../../components/Social/GoogleLogin';
import useAuth from '../../hook/useAuth';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    
    const location = useLocation();
    const { login, error, setError, loader, setLoader } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');
        setGeneralError('');
        setError('');

        const data = new FormData(e.target);
        const formDataObject = Object.fromEntries(data);

        const email = formDataObject.email;
        const password = formDataObject.password;

        if (!email) {
            setEmailError('Email is required!');
            return;
        }
        if (!password) {
            setPasswordError('Password is required!');
            return;
        }

        try {
            await login(email, password);
            alert("Login Successful!");
            navigate(location.state?.from || '/dashboard');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                setGeneralError("No account found with this email!");
                alert("Incorrect Email! No user found.");
            } else if (err.code === 'auth/wrong-password') {
                setGeneralError("Incorrect password!");
                alert("Incorrect Password! Please try again.");
            } else {
                setGeneralError("Login failed. Please try again.");
                alert("Login Failed! Please check your credentials.");
            }
            setLoader(false);
        }
    };

    return (
        <div className='mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8'>
            <h1 className='text-2xl font-bold text-secondary sm:text-3xl text-center'>Get Started Today</h1>
            <p className='mx-auto mt-4 max-w-md text-center text-gray-500'>
                Explore our comprehensive library of courses, meticulously crafted to cater to all levels of expertise.
            </p>
            <div className='mx-auto max-w-lg mb-0 mt-6 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8'>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <p className='text-center text-red-600 text-lg font-medium'>Sign in to your account</p>

                    {generalError && <p className="text-red-500 text-center">{generalError}</p>}

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className='sr-only'>Email</label>
                        <div className='relative'>
                            <input 
                                type="email" 
                                name='email' 
                                placeholder='Enter the Email' 
                                className={`w-full border outline-none rounded-lg p-4 pe-12 text-sm shadow-sm 
                                ${emailError ? 'border-red-500' : 'border-gray-200'}`}
                            />
                            <span className='absolute inset-y-0 end-0 grid place-items-center px-4'>
                                <HiOutlineMail className='h-4 w-4 text-gray-400' />
                            </span>
                        </div>
                        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className='sr-only'>Password</label>
                        <div className='relative'>
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                name='password' 
                                placeholder='Enter the Password' 
                                className={`w-full border outline-none rounded-lg p-4 pe-12 text-sm shadow-sm 
                                ${passwordError ? 'border-red-500' : 'border-gray-200'}`}
                            />
                            <span 
                                onClick={() => setShowPassword(!showPassword)} 
                                className='absolute inset-y-0 end-0 grid place-items-center px-4 cursor-pointer'
                            >
                                <FiEye className='h-4 w-4 text-gray-400' />
                            </span>
                        </div>
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>

                    <button type='submit' className='block w-full rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-white'>
                        Sign in
                    </button>
                    
                    <p className='text-center text-sm text-gray-500'>
                        No Account? <Link className='underline' to="/register">Sign Up</Link>
                    </p>
                </form>
                <GoogleLogin />
            </div>
        </div>
    )
}

export default Login;
