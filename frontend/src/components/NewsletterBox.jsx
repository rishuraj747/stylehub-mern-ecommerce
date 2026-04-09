import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const NewsletterBox = () => {
    const { backendUrl } = useContext(ShopContext)
    const [email, setEmail] = useState('')

    const onSubmitHandler = async (event)=>{
        event.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/newsletter/subscribe`, { email })
            if (response.data.success) {
                toast.success(response.data.message)
                setEmail('')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
      <p className='text-gray-400 mt-3'>Subscribe now and unlock an instant 20% discount, exclusive deals, and early access to new arrivals delivered straight to you.</p>
      <form onSubmit={onSubmitHandler} className='w-ful sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input 
          className='w-full sm:flex-1 outline-none' 
          type="email" 
          placeholder='Enter your email' 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type='submit' className='bg-black text-white text-xs px-10 py-4 hover:bg-gray-800 transition-all'>SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsletterBox
