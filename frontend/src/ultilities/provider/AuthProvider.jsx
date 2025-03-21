// import React, { createContext, useEffect, useState } from 'react'
// import { app } from '../../config/firebase.init';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut,
//   GoogleAuthProvider, signInWithPopup,onAuthStateChanged } from "firebase/auth";
// import axios from 'axios';
// export const AuthContext = createContext()

//  const AuthProvider = ({children}) => {
//  const [user, setUser] = useState(null);
//  const [loader, setLoader] = useState(true);
//  const [error, setError] = useState('');
//  const auth = getAuth(app);

//  // signup new user
// const signUp = async (email, password) => {  // Accept email and password
//   try {
//       setLoader(true);
//       return await createUserWithEmailAndPassword(auth, email, password);
//   } catch (error) {
//       setError(error.code);
//       throw error;
//   }
// };
//  // login user
//  const login = async (email, password) =>
//  {
//   try {
//     setLoader(true);
//     return await signInWithEmailAndPassword(auth, email,password)

    
//   } catch ({error}) {
//       setError(error.code);
//         throw error;
//   }
//  }
//   // LogOut user
//   const logout = async () =>
//   {
//     try {
//       return await signOut(auth)

//     } catch (error) {
//       setError(error.code);
//       throw error;
//     }
//   }
//   // update user profile
//   const updateUser = async (name, photo) =>{
//     try {
//       await updateProfile(auth.currentUser,{
//          displayName: name, photoURL: photo
//       })
//       setUser(auth.currentUser)
//     } catch (error) {
//       setError(error.code);
//       throw error;
//     }
//   }
//   //google login
//   const googleProvider = new GoogleAuthProvider();
//   const googleLogin = async () =>{
//     try {
//       setLoader(true)
//       return await signInWithPopup(auth, googleProvider)
     
//     } catch (error) {
//       setError(error.code);
//       throw error;
//     }
//   }
//  // observer for users
//  useEffect(() =>
// {
//   const unsubscribe = auth.onAuthStateChanged((user)=>{
//    setUser(user)

//    if(user)
//    {
//     axios.post('http://localhost:5000/api/set/token', {email: user.email, name: user.displayName})
//     .then((data) =>{
//      if(data.data.token)
//      {
//       localStorage.setItem('token',data.data.token);
//       setLoader(false)
//      }
//     })
//    }else{
//       localStorage.removeItem('token');
//       setLoader(false)
//    }
//   })
//   return() =>{
//     unsubscribe()
//   }
//   },[])
//     const contextValue ={user, signUp, login, logout, updateUser, googleLogin, error, setError,loader,setLoader}
//     return (
//     <AuthContext.Provider value={contextValue}>
//         {children}
//     </AuthContext.Provider>
    
//   )
// }
// export default AuthProvider



import React, { createContext, useEffect, useState } from 'react';
import { app } from '../../config/firebase.init';
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,
  signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged
} from "firebase/auth";
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState('');
  const auth = getAuth(app);

  // Signup new user
  const signUp = async (email, password) => {
    try {
      setLoader(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setLoader(false);
      return result;
    } catch (error) {
      setLoader(false);
      setError(error.code);
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoader(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setLoader(false);
      return result;
    } catch (error) {  // Fix error handling
      setLoader(false);
      setError(error.code);
      throw error;
    }
  };

  // Log out user
  const logout = async () => {
    try {
      await signOut(auth);  // Added `await`
      setUser(null);
      localStorage.removeItem('token');
    } catch (error) {
      setError(error.code);
      throw error;
    }
  };

  // Update user profile
  const updateUser = async (name, photo) => {
    try {
      await updateProfile(auth.currentUser, { displayName: name, photoURL: photo });
      setUser({ ...auth.currentUser }); // Update state with new user info
    } catch (error) {
      setError(error.code);
      throw error;
    }
  };

  // Google login
  const googleProvider = new GoogleAuthProvider();
  const googleLogin = async () => {
    try {
      setLoader(true);
      const result = await signInWithPopup(auth, googleProvider);
      setLoader(false);
      return result;
    } catch (error) {
      setLoader(false);
      setError(error.code);
      throw error;
    }
  };

  // Observer for users
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const { data } = await axios.post('http://localhost:5000/api/set/token', {
            email: user.email,
            name: user.displayName
          });

          if (data.token) {
            localStorage.setItem('token', data.token);
          }
        } catch (err) {
          console.error("Token setting error:", err);
        }
      } else {
        localStorage.removeItem('token');
      }
      setLoader(false);
    });

    return () => unsubscribe();
  }, []);

  const contextValue = { user, signUp, login, logout, updateUser, googleLogin, error, setError, loader, setLoader };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
