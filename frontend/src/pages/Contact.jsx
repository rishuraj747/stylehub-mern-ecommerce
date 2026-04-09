import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const Contact = () => {
  const { backendUrl } = useContext(ShopContext)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setFormData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post(`${backendUrl}/api/contact/submit`, formData)
      if (response.data.success) {
        toast.success(response.data.message)
        setFormData({ name: '', email: '', message: '' })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-120' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6 w-full md:w-1/2'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>Patliputra Industrial Area Rajiv Nagar<br /> Patna, Bihar 800013, India</p>
          <p className='text-gray-500'>Tel: +91 9876543210 <br />Email: admin@stylehub.com</p>

          <p className='font-semibold text-xl text-gray-600 mt-6'>Send us your Feedback / Issues</p>
          <form onSubmit={onSubmitHandler} className='flex flex-col gap-4 w-full'>
            <input required onChange={onChangeHandler} name='name' value={formData.name} type="text" placeholder='Your Name' className='border border-gray-300 rounded py-2 px-4 w-full outline-none focus:border-black' />
            <input required onChange={onChangeHandler} name='email' value={formData.email} type="email" placeholder='Your Email' className='border border-gray-300 rounded py-2 px-4 w-full outline-none focus:border-black' />
            <textarea required onChange={onChangeHandler} name='message' value={formData.message} rows="4" placeholder='Your Message / Issue' className='border border-gray-300 rounded py-2 px-4 w-full outline-none focus:border-black'></textarea>
            <button type='submit' className='bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition-all duration-300 w-fit'>Submit Message</button>
          </form>
        </div>
      </div>
      <NewsletterBox/>
    </div>
  )
}

export default Contact
