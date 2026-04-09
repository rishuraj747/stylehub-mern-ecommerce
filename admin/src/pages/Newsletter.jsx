import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../config'
import { toast } from 'react-toastify'

const Newsletter = ({ token }) => {
  const [subscribers, setSubscribers] = useState([])

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/newsletter/all', { headers: { token } })
      if (response.data.success) {
        setSubscribers(response.data.subscribers)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const deleteSubscriber = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/newsletter/delete', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchSubscribers()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  return (
    <div>
      <p className='mb-4 font-medium text-xl'>Newsletter Subscribers</p>
      
      <div className='flex flex-col gap-4'>
        {subscribers.length === 0 && <p className='text-gray-500'>No subscribers found.</p>}
        {subscribers.map((item, index) => (
          <div key={index} className='border rounded p-4 bg-white shadow-sm flex items-center justify-between'>
            <div>
              <p className='font-semibold text-lg text-gray-800'>{item.email}</p>
              <p className='text-xs text-gray-400 mt-1'>Subscribed on: {new Date(item.date).toLocaleString()}</p>
            </div>
            <button 
              onClick={() => deleteSubscriber(item._id)} 
              className='text-red-500 text-sm border border-red-500 rounded px-3 py-1 hover:bg-red-50 transition-all'
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Newsletter
