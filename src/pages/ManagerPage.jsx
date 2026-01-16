import { useEffect, useState } from "react";
import {
  HandleFetchAllUsers,
  HandleUpdateUser,
  HandleCreateUser,
} from "../api/api.js";
import CreateUserModal from "../components/CreateUserModal";
import { useDispatch, useSelector } from "react-redux";
import { setAllUser } from "../redux/features/authSlice.js";
import { FiClock, FiCalendar } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ManagerPage = () => {
  const dispatch = useDispatch();
  const { allUser } = useSelector((state) => state.auth);

  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationTrendData, setRegistrationTrendData] = useState([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await HandleFetchAllUsers();
      dispatch(setAllUser(data.users));
      
      // Process registration trend data
      processRegistrationData(data.users);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [dispatch]);

  const processRegistrationData = (users) => {
    // Create last 6 months data
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear().toString().slice(-2);
      months.push({
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: `${monthName} '${year}`,
        users: 0
      });
    }
    
    // Count users per month
    users.forEach(user => {
      const userDate = new Date(user.createdAt);
      const userKey = `${userDate.getFullYear()}-${userDate.getMonth()}`;
      
      const monthData = months.find(m => m.key === userKey);
      if (monthData) {
        monthData.users++;
      }
    });
    
    setRegistrationTrendData(months);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (formData) => {
    setSubmitLoading(true);
    try {
      if (editingUser) {
        await HandleUpdateUser({
          id: editingUser._id,
          data: formData,
        });
      }

      handleCloseModal();
      await fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
        
      </div>

      {/* User Registration Timeline Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Registration Trend</h2>
            <p className="text-gray-600 text-sm mt-1">Last 6 months of signups</p>
          </div>
          <FiClock className="text-gray-400" size={20} />
        </div>
        <div className="h-64">
          {registrationTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280' }}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [value, 'New Users']}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#F59E0B' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FiCalendar size={32} className="mx-auto mb-2" />
                <p>No recent registration data</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Created At</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {allUser.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              allUser.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>
                  <td className="py-3 px-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <CreateUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        userToEdit={editingUser}
        loading={submitLoading}
        calss = "hidden"
      />
    </div>
  );
};

export default ManagerPage;