import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import Instructors from "../pages/Instructors/Instructors";
import Classes from "../pages/Classes/Classes";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import SingleClass from "../pages/Classes/SingleClass";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import StudentCP from "../pages/Dashboard/Student/StudentCP";
import SelectedClass from "../pages/Dashboard/Student/SelectedClass";
import EnrolledClasses from "../pages/Dashboard/Student/Enroll/EnrolledClasses";
import MyPaymentHistory from "../pages/Dashboard/Student/Payment/History/MyPaymentHistory";
import AsInstructor from "../pages/Dashboard/Student/Apply/AsInstructor";
import Payment from "../pages/Dashboard/Student/Payment/History/Payment";
import CourseDetails from "../pages/Dashboard/Student/Enroll/CourseDetails";
import InstructorCP from "../pages/Dashboard/Instructor/InstructorCP";
import AddClass from "../pages/Dashboard/Instructor/AddClass";
import MyClasses from "../pages/Dashboard/Instructor/MyClasses";
import AdminHome from "../pages/Dashboard/Admin/AdminHome";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageClasses from "../pages/Dashboard/Admin/ManageClasses";
import UpdateUser from "../pages/Dashboard/Admin/UpdateUser";
import ManageApplications from "../pages/Dashboard/Admin/ManageApplications";
import PendingCourse from "../pages/Dashboard/Instructor/PendingCourse";
import MyApproved from "../pages/Dashboard/Instructor/MyApproved";
export const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout/>,
      children:[
        {
            path:"/",
            element:<Home/>
        },
        {
          path:"/instructors",
          element:<Instructors/>  
        },
        {
          path:"classes",
          element:<Classes/>  
        },
         {
          path:"/login",
          element:<Login/>  
        },
         {
          path:"/register",
          element:<Register/>
         },

         {
          path:"/class/:id",
          element:<SingleClass/>,
          loader: ({params}) => fetch(`http://localhost:5000/class/${params.id}`)
         }

      ]
    },
    {
      path: "/dashboard",
      element: <DashboardLayout/>,
      children: [
        {
          index: true,
          element: <Dashboard/>        
         },
         
         // student Routes
         {
          path:"students-cp",
          element: <StudentCP/>
         },
         {
          path:"student-cp",
          element: <StudentCP/>
         },
        
         {
          path:"enrolled-class",
          element: <EnrolledClasses/>
         },
         {
          path: "my-selected",
          element: <SelectedClass/>
        },
        {
          path: "my-payments",
          element: <MyPaymentHistory/>
        },
        {
          path: "apply-instructor",
          element: <AsInstructor/>
        },
        {
          path:"my-selected/dashboard/user/payment",
          element:<Payment/>
        },
        {
          path:"course-details",
          element:<CourseDetails/>
        },
      
        //Instructor Route
          
            {
              path:"instructors-cp",
              element:<InstructorCP/>
            },
            {
              path:"add-class",
              element:<AddClass/>
            },{
              path: 'my-classes',
              element: <MyClasses/>
            },
            {
              path:'my-pending',
              element:<PendingCourse/>
            },
            {
              path:'my-approved',
              element:<MyApproved/>
            },
            //admin routes
            {
              path:'admin-home',
              element:<AdminHome/>
            },
            {
              path: 'manage-class',
              element:<ManageClasses/>
            },{
              path: 'manage-users',
              element: <ManageUsers/>
            },
           {
              path:'update-user/:id',
              element:<UpdateUser/>,
              loader:({params})=> fetch(`http://localhost:5000/users/${params.id}`)
            },
            {
              path:'manage-applications',
              element:<ManageApplications/>
            }
        
      ]
    }
  ]);
