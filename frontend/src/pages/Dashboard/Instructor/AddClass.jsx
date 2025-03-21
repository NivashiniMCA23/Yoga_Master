import React, { useState } from 'react'
import useAxiosSecure from '../../../hook/useAxiosSecure'
import useUser from '../../../hook/useUser';




const KEY = import.meta.env.VITE_IMG_TOKEN;
const AddClass = () => {
  const API_URL = `https://api.imgbb.com/1/upload?key=${KEY}&name=`
    const axiosSecure = useAxiosSecure();
    const {currentUser, isLoading} = useUser();
    const [image, setImage] = useState(null);


    
    const handleFormSubmit = (e) =>{
      e.preventDefault();
      const formData = new FormData(e.target);
      // console.log(formData);
      const newData = Object.fromEntries(formData);
      formData.append('file', image)
      // console.log(newData);
 

      fetch(API_URL ,{
        method: "POST",
        body: formData,
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if(data.success === true){
          console.log(data.data.display_url);
          newData.image = data.data.display_url;
          newData.instructorName = currentUser?.name;
          newData.instructorEmail = currentUser?.email;
          newData.status = 'pending';
          newData.submitted = new Date();
          newData.totalEnrolled = 0;
          axiosSecure.post('/new-class', newData)
          .then(res => {
            alert("Successfully added class!")
            console.log(res.data);  
          })
        }
      })
    }

    const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    }
     if(isLoading){
      return <div>Loading....</div>
     }
  return (
    <div>
    <div className='my-10'>
        <h1 className='text-center text-3xl font-bold'>Add Your Course</h1>
    </div>
    {/* <form className='mx-auto p-7 bg-white rounded shadow'> */}
    <form onSubmit={handleFormSubmit} className="mx-auto p-0.5 bg-white rounded shadow w-[900px] text-lg">
        <div className='grid grid-cols-2 w-full gap-3 items-center'>
            <div className='mb-6'>
              <label className='block text-gray-700 font-bold mb-2' htmlFor="name">Course Name</label>
              <input type="text" required placeholder='Your Class Name' name='name' id='name' className='w-full px-4 py-2 border 
              border-secondary rounded-md focus:outline-none focus:ring-blue-500'/>
            </div>


            <div className='mb-6'>
            <label className='block text-gray-700 font-bold mb-2' htmlFor="image">Course Thumbnail</label>
            <input type='file' required name='image' onChange={handleImageChange} className='block mt-[5px] w-full border border-secondary shadow-sm rounded-md
            text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 file:border-0 file:bg-secondary file:text-white
            file:mr-4 file:py-3 file:px-4' />
            </div>

        </div>
        
        <div>
            <h1 className='text-[12px] my-2 ml-2 text-secondary'>You can not change your name or email</h1>
            <div className='grid gap-3 grid-cols-2'>
             <div className='mb-6'>
             <label className='block text-gray-700 font-bold mb-2' htmlFor="InstructorName">Instructor Name</label>
             <input className='w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-blue-500'
             type="text"
             value={currentUser?.name}
             readOnly
             disabled
             placeholder='Instructors Name'
             name='instructors Name'/>
             </div>
             <div className='mb-6'>
             <label className='block text-gray-700 font-bold mb-2' htmlFor="InstructorEmail">Instructor Email</label>
             <input className='w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-blue-500'
             type="text"
             value={currentUser?.email}
             readOnly
             disabled
             placeholder='Instructor Email'
             name='instructor Email'/>
             </div>

            </div>
        </div>


        <div className='grid grid-cols-2 w-full gap-3 items-center' > 
             <div className='mb-6'>
             <label className='block text-gray-700 font-bold mb-2' htmlFor="availableSeats">Available Seats</label>
             <input className='w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-blue-500'
             type="number"
             required
             placeholder='How Many Seats are Available?'
             name='availableSeats'/>
             </div>

             
             <div className='mb-6'>
             <label className='block text-gray-700 font-bold mb-2' htmlFor="price">Price</label>
             <input className='w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-blue-500'
             type="number"
             required
             placeholder='price'
             name='price'/>
            </div>
            </div>

            <div className='mb-6'>
             <label className='block text-gray-700 font-bold mb-2' htmlFor="youtube">YouTube Link</label>
             <p className='text-[12px] my-2 mt-2 text-secondary'>Only youtube videos are support</p>
             <input 
              required
              className='w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-blue-500'
              type="text"
             placeholder='Your course intro video link'
             name='videoLink'/>
            </div>


            <div className='mb-6'>
             <label className='block text-gray-700 font-bold mb-2' htmlFor="decription">Description About your course
             </label>
             <textarea
              placeholder='Description about your course'
              name='decription'
              className='resize-none border w-full p-2 rounded-lg border-secondary outline-none'
              rows="4"
              >
             </textarea>
            </div>
          <div className='text-center w-full'>
            <button className='bg-secondary w-full hover:bg-red-400 duration-200 text-white font-bold py-2 px-4 rounded'
            type='submit'
            >
              Add New Course
            </button>
            </div>  

    </form>
    </div>
    
  )
}

export default AddClass