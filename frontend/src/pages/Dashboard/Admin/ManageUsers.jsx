
// import React, { useEffect, useState } from 'react';
// import useAxiosFetch from '../../../hook/useAxiosFetch';
// import useAxiosSecure from '../../../hook/useAxiosSecure';
// import { useNavigate } from 'react-router-dom';
// import { FcDeleteDatabase } from 'react-icons/fc';
// import { GrUpdate } from 'react-icons/gr';

// const ManageUsers = () => {
//     const axiosFetch = useAxiosFetch();
//     const axiosSecure = useAxiosSecure();
//     const navigate = useNavigate();
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         axiosFetch.get('/users')
//             .then(res => {
//                 setUsers(res.data);
//                 setLoading(false);
//             })
//             .catch(err => {
//                 console.error("Error fetching users:", err);
//                 setLoading(false);
//             });
//     }, []);

//     const handleDelete = async (id) => {
//         const confirmDelete = window.confirm("Are you sure you want to delete this user?");
//         if (!confirmDelete) return;

//         try {
//             await axiosSecure.delete(`/delete-user/${id}`);
//             setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
//             alert("User deleted successfully!");
//         } catch (error) {
//             console.error("Error deleting user:", error);
//             alert("Failed to delete user.");
//         }
//     };

//     if (loading) return <p className="text-center text-xl">Loading users...</p>;

//     return (
//         <div>
//             <h1 className='text-center text-4xl font-bold my-7'>Manage <span className='text-secondary'>Users</span></h1>
//             <div className='overflow-x-auto'>
//                 <table className='min-w-full text-left text-sm font-light'>
//                     <thead className='border-b font-medium dark:border-neutral-500'>
//                         <tr>
//                             <th className='px-6 py-4'>#</th>
//                             <th className='px-6 py-4'>PHOTO</th>
//                             <th className='px-6 py-4'>NAME</th>
//                             <th className='px-6 py-4'>ROLE</th>
//                             <th className='px-6 py-4'>UPDATE</th>
//                             <th className='px-6 py-4'>DELETE</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {users.length > 0 ? users.map((user, idx) => (
//                             <tr key={user._id} className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
//                                 <td className='whitespace-nowrap px-6 py-4 font-medium'>{idx + 1}</td>
//                                 <td className='whitespace-nowrap px-6 py-4'>
//                                     <img src={users.photoURL} className='h-[35px] w-[35px]' alt="Users" />
//                                 </td>
//                                 <td className='whitespace-nowrap px-6 py-4'>{user.name}</td>
//                                 <td className='whitespace-nowrap px-6 py-4'>{user.role}</td>
//                                 <td className='whitespace-nowrap px-6 py-4'>
//                                     <button onClick={() => navigate(`/dashboard/update-user/${user._id}`)} 
//                                         className='flex items-center gap-2 bg-green-500 py-1 rounded-md px-2 text-white'>
//                                         Update <GrUpdate />
//                                     </button>
//                                 </td>
//                                 <td className="whitespace-nowrap px-6 py-4"> 
//                                     <button onClick={() => handleDelete(user._id)} 
//                                         className='flex items-center gap-2 bg-red-600 py-1 rounded-md px-2 text-white'>
//                                         Delete <FcDeleteDatabase />
//                                     </button>
//                                 </td>
//                             </tr>
//                         )) : (
//                             <tr>
//                                 <td colSpan="6" className="text-center text-xl py-4">No Users Found</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default ManageUsers;
import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../../hook/useAxiosFetch';
import useAxiosSecure from '../../../hook/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { FcDeleteDatabase } from 'react-icons/fc';
import { GrUpdate } from 'react-icons/gr';

const ManageUsers = () => {
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosFetch.get('/users')
            .then(res => {
                console.log("Fetched Users:", res.data); // Debugging: Check API response
                setUsers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await axiosSecure.delete(`/delete-user/${id}`);
            setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
            alert("User deleted successfully!");
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    };

    if (loading) {
        return (
            <div className="text-center text-xl py-10">
                <p>Loading users...</p>
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin mt-2 border-gray-500"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className='text-center text-4xl font-bold my-7'>
                Manage <span className='text-secondary'>Users</span>
            </h1>
            <div className='overflow-x-auto'>
                <table className='min-w-full text-left text-sm font-light'>
                    <thead className='border-b font-medium dark:border-neutral-500'>
                        <tr>
                            <th className='px-6 py-4'>#</th>
                            <th className='px-6 py-4'>PHOTO</th>
                            <th className='px-6 py-4'>NAME</th>
                            <th className='px-6 py-4'>ROLE</th>
                            <th className='px-6 py-4'>UPDATE</th>
                            <th className='px-6 py-4'>DELETE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, idx) => (
                                <tr key={user._id} className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                                    <td className='whitespace-nowrap px-6 py-4 font-medium'>{idx + 1}</td>
                                    <td className='whitespace-nowrap px-6 py-4'>
                                        <img 
                                            src={user.photoURL || 'https://via.placeholder.com/35'} 
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/35'} 
                                            className='h-[35px] w-[35px] rounded-full border' 
                                            alt={user.name || "User"} 
                                        />
                                    </td>
                                    <td className='whitespace-nowrap px-6 py-4'>{user.name}</td>
                                    <td className='whitespace-nowrap px-6 py-4'>{user.role}</td>
                                    <td className='whitespace-nowrap px-6 py-4'>
                                        <button 
                                            onClick={() => navigate(`/dashboard/update-user/${user._id}`)} 
                                            className='flex items-center gap-2 bg-green-500 py-1 rounded-md px-2 text-white'>
                                            Update <GrUpdate />
                                        </button>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4"> 
                                        <button 
                                            onClick={() => handleDelete(user._id)} 
                                            className='flex items-center gap-2 bg-red-600 py-1 rounded-md px-2 text-white'>
                                            Delete <FcDeleteDatabase />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-xl py-4">No Users Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
