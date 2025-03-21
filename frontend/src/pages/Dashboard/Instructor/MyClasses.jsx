import moment from 'moment';
import React, { useEffect, useState } from 'react';
import useUser from '../../../hook/useUser';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hook/useAxiosSecure';

const MyClasses = () => {
    const [classes, setClasses] = useState([]); 
    const { currentUser } = useUser();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        if (currentUser?.email) {
            axiosSecure.get(`/classes/${currentUser.email}`)
                .then(res => setClasses(res.data))
                .catch(err => console.log(err));
        }
    }, [currentUser?.email, axiosSecure]);

    const handleFeedback = (id) => {
        navigate(`/feedback/${id}`);
    };

    return (
        <div className="container mx-auto px-4">
            {/* Title Section */}
            <div className='my-9 text-center'>
                <h1 className='text-4xl font-bold'>
                    My <span className='text-secondary'>Classes</span>
                </h1>
                <p className='text-[12px] my-2'>
                    Here you can see how many classes you have added and their statuses.
                </p>
            </div>

            <div>
                {classes.length === 0 ? (
                    <div className='text-center text-2xl font-bold mt-10'>
                        You have not added any classes yet
                    </div>
                ) : (
                    <div>
                        {classes.map((cls, index) => (
                            <div key={index} className="mb-6 p-4 border rounded-lg shadow-md flex gap-6">
                                {/* Left Section - Image & Class Info */}
                                <div className="w-2/3 flex gap-4">
                                    {/* Image */}
                                    <div className="w-1/3">
                                        <img 
                                            src={cls.image} 
                                            alt={`Class ${cls.name}`} 
                                            className='w-full h-auto rounded-lg'
                                        />
                                    </div>

                                    {/* Class Details */}
                                    <div className='w-2/3'>
                                        <h2 className='text-[21px] font-bold text-secondary border-b pb-2 mb-2'>
                                            {cls.name}
                                        </h2>

                                        <div>
                                            <h1 className='font-bold mb-3'>Some Info:</h1>
                                            <h1 className='text-secondary my-2'>
                                                <span className='text-black'>Total Students:</span> {cls.totalEnrolled || 0}
                                            </h1>
                                            <h1 className='text-secondary'>
                                                <span className='text-black'>Total Seats:</span> {cls.availableSeats}
                                            </h1>
                                            <h1 className='text-secondary my-2'>
                                                <span className='text-black'>Status:</span>
                                                <span className="font-bold"> {cls.status}</span>
                                            </h1>
                                        </div>

                                        <div>
                                            <h1 className='text-secondary my-2'>
                                                <span className='text-black'>Price:</span> Rs.{cls.price}
                                            </h1>
                                            <h1 className='text-secondary my-2'>
                                                <span className='text-black'>Submitted:</span>{" "}
                                                {cls.submitted ? moment(cls.submitted).format("MMMM Do YYYY") : "Not Available"}
                                            </h1>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section - Buttons */}
                                <div className="w-1/3 flex flex-col justify-center items-end gap-3">
                                    <button
                                        onClick={() => handleFeedback(cls._id)}
                                        className='px-3 bg-orange-400 font-bold py-2 text-white w-full rounded-lg'
                                    >
                                        View Feedback
                                    </button>
                                    
                                    <button 
                                        className='px-3 bg-green-500 font-bold py-2 text-white w-full rounded-lg'
                                    >
                                        View Details
                                    </button>

                                    <button
                                        className='px-3 bg-secondary font-bold py-2 text-white w-full rounded-lg'
                                        onClick={() => navigate(`/dashboard/update/${cls._id}`)}
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyClasses;

