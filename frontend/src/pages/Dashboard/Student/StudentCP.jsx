import React from 'react'
import WelcomeImg from "../../../assets/dashboard/urban-welcome.svg"; 
import useUser from "../../../hook/useUser";
import { Link } from 'react-router-dom'

const StudentCP = () => {
    const {currentUser} = useUser()
  return (
    <div className='h-screen flex justify-center items-center'>
        <div>
            <div>
                <div>
                    <img onContextMenu={e =>e.preventDefault()} src={WelcomeImg} alt="" className='h-[200px]' placeholder='blur'/>
                </div>
                <h1 className='text-4xl capitalize font-bold'>Hi, <span className='text-secondary items-stretch'>
                    {currentUser?.name}! </span> Welcome To Your DashBoard </h1>
                   
            </div>
        </div>
    </div>
  )
}

export default StudentCP