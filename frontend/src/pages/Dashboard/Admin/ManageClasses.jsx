
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosFetch from '../../../hook/useAxiosFetch';
import useAxiosSecure from '../../../hook/useAxiosSecure';
import Swal from 'sweetalert2';

const ManageClasses = () => {
    const navigate = useNavigate();
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();
    const [classes, setClasses] = useState([]);
    const [page, setPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState([]);
    const itemsPerPage = 5;

    useEffect(() => {
        axiosFetch.get('/classes-manage')
            .then(res => {
                console.log("Fetched classes:", res.data);
                setClasses(res.data);
            })
            .catch(err => console.error("Error fetching classes:", err));
    }, []);

    const totalPage = Math.ceil(classes.length / itemsPerPage);

    const handleApprove = async (id) => {
        try {
            const res = await axiosSecure.patch(`/change-status/${id}`, { status: "approved" });
            if (res.data.modifiedCount > 0) {
                Swal.fire("Success!", "Course Approved Successfully!", "success");
                const updatedClasses = classes.map(cls => 
                    cls._id === id ? { ...cls, status: 'approved' } : cls
                );
                setClasses(updatedClasses);
            }
        } catch (err) {
            console.error("Error approving class:", err);
        }
    };

    const handleReject = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, reject it!"
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/change-status/${id}`, {
                    status: 'rejected', reason: "Rejected"
                });

                if (res.data.modifiedCount > 0) {
                    Swal.fire("Rejected!", "The course has been rejected.", "success");
                    const updatedClasses = classes.map(cls => 
                        cls._id === id ? { ...cls, status: 'rejected' } : cls
                    );
                    setClasses(updatedClasses);
                }
            } catch (err) {
                console.error("Error rejecting class:", err);
            }
        }
    };

    const handleFeedback = (id) => {
        Swal.fire({
            title: "Provide Feedback",
            input: "text",
            inputPlaceholder: "Enter your feedback",
            showCancelButton: true,
            confirmButtonText: "Send",
            showLoaderOnConfirm: true,
            preConfirm: async (feedback) => {
                try {
                    await axiosSecure.post(`/feedback/${id}`, { feedback });
                    Swal.fire("Sent!", "Your feedback has been sent.", "success");
                } catch (error) {
                    Swal.fire("Error", "Failed to send feedback.", "error");
                }
            }
        });
    };

    useEffect(() => {
        let lastIndex = page * itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        if (lastIndex > classes.length) {
            lastIndex = classes.length;
        }
        setPaginatedData(classes.slice(firstIndex, lastIndex));
    }, [page, classes]);

    return (
        <div>
            <h1 className='text-4xl text-secondary font-bold text-center my-10'>
                Manage <span className='text-black'>Classes</span>
            </h1>
            <div className='flex flex-col'>
                <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
                    <div className='inline-block min-w-full py-2 sm:px-6 lg:px-8'>
                        <div className='overflow-hidden'>
                            <table className='min-w-full text-left text-sm font-light'>
                                <thead className='border-b font-medium dark:border-neutral-500'>
                                    <tr>
                                        <th className='px-6 py-4'>PHOTO</th>
                                        <th className='px-6 py-4'>COURSE NAME</th>
                                        <th className='px-6 py-4'>INSTRUCTOR NAME</th>
                                        <th className='px-6 py-4'>STATUS</th>
                                        <th className='px-6 py-4'>DETAILS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes.length === 0 ? (
                                        <tr>
                                            <td colSpan='5' className='text-center text-2xl font-bold'>
                                                No Classes Found
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedData.map((cls) => (
                                            <tr
                                                key={cls._id}
                                                className='border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600'
                                            >
                                                <td className='whitespace-nowrap px-6 py-4'>
                                                    <img src={cls.image} className='h-[35px] w-[35px]' alt='' />
                                                </td>
                                                <td className='whitespace-pre-wrap px-6 py-4'>{cls.name}</td>
                                                <td className='whitespace-pre-wrap px-6 py-4'>{cls.instructorName}</td>
                                                <td className='whitespace-pre-wrap px-6 py-4'>
                                                    <span
                                                        className={`font-bold px-2 py-1 uppercase text-white rounded-xl
                                                            ${cls.status === 'pending' ? 'bg-orange-400' : 
                                                            cls.status === 'checking' ? 'bg-yellow-500' : 
                                                            cls.status === 'approved' ? 'bg-green-600' : 
                                                            'bg-red-600'}`}
                                                    >
                                                        {cls.status}
                                                    </span>
                                                </td>
                                                <td className='whitespace-nowrap px-6 py-4'>
                                                    <div className='flex gap-2'>
                                                        <button
                                                            onClick={() => handleApprove(cls._id)}
                                                            className='text-[12px] bg-green-500 py-1 rounded-md text-white px-2'
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            disabled={cls.status === 'rejected' || cls.status === 'checking'}
                                                            onClick={() => handleReject(cls._id)}
                                                            className='bg-red-600 py-1 rounded-md px-2 text-white'
                                                        >
                                                            Deny
                                                        </button>
                                    
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            <div className="flex justify-center space-x-3 mt-4">
                                <button 
                                    disabled={page === 1} 
                                    onClick={() => setPage(prev => prev - 1)} 
                                    className="bg-gray-500 text-white px-3 py-1 rounded-md"
                                >
                                    Previous
                                </button>
                                <span className="text-lg font-semibold">{page} / {totalPage}</span>
                                <button 
                                    disabled={page === totalPage} 
                                    onClick={() => setPage(prev => prev + 1)} 
                                    className="bg-gray-500 text-white px-3 py-1 rounded-md"
                                >
                                    Next
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageClasses;
