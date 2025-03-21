import React from 'react'
import useUser from '../../hook/useUser';
import {PulseLoader} from "react-spinners";
import DashboardNavigate from '../../routes/DashboardNavigate';

const Dashboard = () => {
  const {currentUser, isLoading} = useUser();
  const role = currentUser?.role;

  if(isLoading){
    return <div className='flex justify-center items-center h-screen'><PulseLoader size={12}/></div>
  }
  return (
    <DashboardNavigate/>
  )
}

export default Dashboard