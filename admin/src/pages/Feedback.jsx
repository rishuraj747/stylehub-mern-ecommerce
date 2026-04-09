import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../config'
import { toast } from 'react-toastify'

const Feedback = ({ token }) => {
  const [feedbacks, setFeedbacks] = useState([])
  const [filterDays, setFilterDays] = useState('All')
  const [filterDate, setFilterDate] = useState('')

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/contact/all', { headers: { token } })
      if (response.data.success) {
        setFeedbacks(response.data.forms)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const deleteFeedback = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/contact/delete', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchFeedbacks()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const filteredFeedbacks = feedbacks.filter((item) => {
    const itemDateObj = new Date(item.date);
    
    // Apply exact Date filter if selected
    if (filterDate) {
      const selected = new Date(filterDate);
      if (
        itemDateObj.getFullYear() !== selected.getFullYear() ||
        itemDateObj.getMonth() !== selected.getMonth() ||
        itemDateObj.getDate() !== selected.getDate()
      ) {
        return false;
      }
    }

    // Apply Days filter if selected
    if (filterDays !== 'All') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const itemDay = new Date(item.date);
      itemDay.setHours(0, 0, 0, 0);
      
      const diffTime = today - itemDay;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (filterDays === 'Today' && diffDays !== 0) return false;
      if (filterDays === 'Yesterday' && diffDays !== 1) return false;
      if (filterDays === 'Last 7 Days' && diffDays > 7) return false;
      if (filterDays === 'Last 30 Days' && diffDays > 30) return false;
    }

    return true;
  });

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
        <p className='font-medium text-xl'>User Feedbacks & Issues</p>
        <div className='flex items-center gap-3'>
            <input 
              type="date" 
              value={filterDate} 
              onChange={(e) => setFilterDate(e.target.value)} 
              className='border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-black'
            />
            <select onChange={(e) => setFilterDays(e.target.value)} value={filterDays} className='border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none'>
              <option value="All">All Days</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
            {(filterDays !== 'All' || filterDate !== '') && (
               <button onClick={() => {setFilterDays('All'); setFilterDate('');}} className='text-sm text-gray-500 underline'>Clear</button>
            )}
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {filteredFeedbacks.length === 0 && <p className='text-gray-500'>No feedbacks match your filters.</p>}
        {filteredFeedbacks.map((item, index) => (
          <div key={index} className='border rounded p-4 bg-white shadow-sm flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
                <p className='font-semibold text-lg'>{item.name}</p>
                <button onClick={() => deleteFeedback(item._id)} className='text-red-500 text-sm border border-red-500 rounded px-2 py-1 hover:bg-red-50'>Delete</button>
            </div>
            <p className='text-gray-600 text-sm'>{item.email}</p>
            <div className='mt-2 text-gray-800 bg-gray-50 p-3 rounded border'>
              {item.message}
            </div>
            <p className='text-xs text-gray-400 mt-2'>{new Date(item.date).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Feedback
