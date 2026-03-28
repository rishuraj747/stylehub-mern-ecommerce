import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../config';
import { toast } from 'react-toastify';

const Dashboard = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const displayedOrders = orders.filter((order) => {
    if (!filterDate) return true;
    const orderDate = new Date(order.date).toLocaleDateString('en-CA');
    return orderDate === filterDate;
  });

  const totalAmount = displayedOrders.reduce((sum, order) => sum + order.amount, 0);
  const totalItems = displayedOrders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 mt-2 gap-4">
        <h3 className="text-xl font-medium">Dashboard Overview</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter Stats by Date:</span>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 border border-gray-300 font-medium text-sm rounded outline-none"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-gray-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Orders</div>
          <div className="text-3xl font-bold text-gray-800">{displayedOrders.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Revenue</div>
          <div className="text-3xl font-bold text-gray-800">{currency}{totalAmount}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium mb-1">Items Sold</div>
          <div className="text-3xl font-bold text-gray-800">{totalItems}</div>
        </div>
      </div>

      <h3 className="mb-4 text-lg font-medium text-gray-700">Recent Orders</h3>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-sm font-medium text-gray-500">Order ID</th>
              <th className="p-4 text-sm font-medium text-gray-500">Date</th>
              <th className="p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="p-4 text-sm font-medium text-gray-500">Amount</th>
            </tr>
          </thead>
          <tbody>
            {[...displayedOrders]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map((order, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-700 font-mono text-xs">{order._id.substring(order._id.length - 8)}</td>
                  <td className="p-4 text-sm text-gray-700">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-800">{currency}{order.amount}</td>
                </tr>
              ))}
            {displayedOrders.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">No recent orders.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
