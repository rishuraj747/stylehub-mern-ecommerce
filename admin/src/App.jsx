import React, { useEffect, useState, useCallback } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import {Routes,Route} from "react-router-dom"
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from './config';

const App = () => {

   const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

   const verifyToken = useCallback(async () => {
     if (!token) return false;
     try {
       // Try a simple API call to verify the token
       const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
       return response.data.success;
     } catch {
       return false;
     }
   }, [token]);

   useEffect(() => {
     const checkToken = async () => {
       if (token && !(await verifyToken())) {
         localStorage.removeItem('token');
         setToken('');
       }
     };
     checkToken();
   }, [token, verifyToken]);

   useEffect(()=>{
    localStorage.setItem("token",token)
   },[token])
 
   return (
    <div className='bg-gray-50 min-h-screen'>
        <ToastContainer/>
        {
          token === "" ?  <Login setToken={setToken}/>
          : <>
              <Navbar setToken={setToken}/>
                <hr />
              <div className='flex w-full' >
                <Sidebar/>
                  <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base ' >
                    <Routes>
                      <Route path='/' element={<List token={token}/>}/>
                      <Route path='/add' element={<Add token={token}/>}/>
                      <Route path='/list' element={<List token={token}/>} />
                      <Route path='/orders' element={<Orders token={token}/>}/>
                    </Routes>
                  </div>
              </div>
            </>

        }
    </div>
   )
  
}

export default App