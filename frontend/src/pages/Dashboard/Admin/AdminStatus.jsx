import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hook/useAxiosSecure';
import { FaRegCopy } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";




const AdminStatus = ({ users }) => {
    const [data, setData] = useState(null);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        axiosSecure.get('/admin-status')
            .then(res => setData(res.data))
            .catch(err => console.error("Error fetching admin stats:", err));
    }, []);
    console.log(data);

    return (
    <div>
        <div className='grid grid-cols-1 gap-4 px-4 mt-8 sm:grid-cols-3 sm:px-8'>
        {/* Total Members */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
            {/* Icon Section */}
            <div className="p-4 bg-blue-500 text-white rounded-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M16 21v-2a4 4 0 00-8 0v2m8-10a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </div>

            {/* Info Section */}
            <div>
                <h3 className="text-gray-600 text-lg font-semibold">Total Members</h3>
                <p className="text-3xl"> {users?.length}</p>
            </div>
        </div>
        {/* Approved Class */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
            {/* Icon Section */}
            <div className="p-4 bg-blue-500 text-white rounded-full">
            <FaRegCopy className='h-12 w-12 text-white'/>
            </div>

            {/* Info Section */}
            <div>
                <h3 className="text-gray-600 text-lg font-semibold">Approved Class</h3>
                <p className="text-3xl"> {data?.approvedClasses}</p>
            </div>
        </div>
            {/* Instructors */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
            {/* Icon Section */}
            <div className="p-4 bg-blue-500 text-white rounded-full">
            <FaChalkboardTeacher className='h-12 w-12 text-white'/>
            </div>

            {/* Info Section */}
            <div>
                <h3 className="text-gray-600 text-lg font-semibold">Instructors</h3>
                <p className="text-3xl"> {data?.instructor}</p>
            </div>
        </div>
    
        </div>
        </div>
 
    );
};

export default AdminStatus;

