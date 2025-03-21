
import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../hook/useAxiosFetch';
import { Transition } from '@headlessui/react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import useUser from '../../hook/useUser';
import useAxiosSecure from '../../hook/useAxiosSecure';

const Classes = () => {
    const [Classes, setClasses] = useState([]);
    const { currentUser } = useUser();
    const role = currentUser?.role;
    const [hoveredCard, setHoveredCard] = useState(null);
    
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    useEffect(() => {
        axiosFetch.get('/classes')
            .then(res => {
                // Only show approved classes
                const approvedClasses = res.data.filter(cls => cls.status === "approved");
                setClasses(approvedClasses);
            })
            .catch(err => console.log(err));
    }, []);

    // Handle hover effect
    const handleHover = (index) => {
        setHoveredCard(index);
    };

    // Handle class selection (Add to Cart)
    const handleSelect = async (id) => {
        if (!currentUser) {
            toast.warning("Please Login First");
            return navigate("/login");
        }

        try {
            const [enrolledRes, cartRes] = await Promise.all([
                axiosSecure.get(`/enrolled-classes/${currentUser.email}`),
                axiosSecure.get(`/cart-item/${id}?email=${currentUser.email}`)
            ]);

            const enrolledClasses = enrolledRes.data || [];
            const cartItem = cartRes.data || [];

            const alreadySelected = Array.isArray(cartItem)
                ? cartItem.some(item => item.classId === id)
                : cartItem?.classId === id;

            if (alreadySelected) {
                return toast.error("Already Selected");
            }

            if (enrolledClasses.some(item => item.classes?._id === id)) {
                return toast.error("Already Enrolled");
            }

            const data = {
                classId: id,
                userMail: currentUser.email,
                date: new Date(),
            };

            await axiosSecure.post('/add-to-cart', data);
            toast.success("Added to Cart Successfully!");
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <div className='mt-20 pt-3'>
                <h1 className='text-4xl font-bold text-center text-secondary'>Classes</h1>
            </div>

            <div className='my-16 w-[90%] mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {Classes.map((cls, index) => (
                    <div
                        onMouseLeave={() => handleHover(null)}
                        key={cls._id}
                        className={`relative hover:-translate-y-2 duration-150 hover:ring-[2px] hover:ring-secondary w-64 mx-auto 
                            ${cls.availableSeats < 1 ? 'bg-red-300' : 'bg-white'} dark:bg-slate-600 rounded-lg shadow-lg 
                            overflow-hidden cursor-pointer `}
                        onMouseEnter={() => handleHover(index)}
                    >
                        <div className='relative h-48'>
                            <div className={`absolute inset-0 bg-black opacity-0 transition-opacity duration-300
                            ${hoveredCard === index ? "opacity-60" : ""}`} />
                            <img src={cls.image} alt="" className='object-cover w-full h-full' />
                            
                            <Transition
                                show={hoveredCard === index}
                                enter="transition-opacity duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button 
                                        onClick={() => handleSelect(cls._id)}
                                        title={
                                            role === 'admin' || role === 'instructor'
                                                ? 'Instructor/Admin cannot select classes'
                                                : cls.availableSeats < 1
                                                ? 'No Seats Available'
                                                : 'You can select Classes'
                                        }
                                        disabled={role === 'admin' || role === 'instructor' || cls.availableSeats < 1}
                                        className="px-4 py-2 text-white disabled:bg-red-300 bg-secondary duration-300
                                            rounded hover:bg-red-700"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </Transition>
                        </div>

                        {/* Class Details */}
                        <div className="px-6 py-2">
                            <h3 className="font-semibold mb-1">{cls.name}</h3>
                            <p className="text-gray-500 text-xs">Instructor: {cls.instructorName}</p>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-gray-600 text-xs">Available Seats: {cls.availableSeats}</span>
                                <span className="text-green-500 font-semibold">${cls.price}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Classes;
