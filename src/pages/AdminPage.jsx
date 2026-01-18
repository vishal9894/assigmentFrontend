import { useEffect, useState } from "react";
import {
  HandleFetchAllUsers,
  HandleUpdateUser,
  HandleCreateUser,
  HandleDeleteUser,
} from "../api/api.js";
import CreateUserModal from "../components/CreateUserModal";
import { useDispatch, useSelector } from "react-redux";
import { setAllUser } from "../redux/features/authSlice.js";

// Icons
import {
  FiUsers,
  FiUserPlus,
  FiTrash2,
  FiEdit2,
  FiTrendingUp,
  FiDownload,
  FiSearch,
  FiCalendar,
  FiMail,
  FiAward,
  FiUserCheck,
  FiFilter,
  FiClock,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

const AdminPage = () => {
  const dispatch = useDispatch();
  const { allUser } = useSelector((state) => state.auth);

  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    managers: 0,
    users: 0,
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await HandleFetchAllUsers();
      dispatch(setAllUser(data.users));

      // Calculate statistics
      calculateStats(data.users);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setPageLoading(false);
    }
  };

  const calculateStats = (users) => {
    const admins = users.filter((user) => user.role === "admin").length;
    const managers = users.filter((user) => user.role === "manager").length;
    const regularUsers = users.filter((user) => user.role === "user").length;

    setStats({
      totalUsers: users.length,
      admins,
      managers,
      users: regularUsers,
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [dispatch]);

  // Prepare chart data
  const roleDistributionData = [
    { name: "Admins", value: stats.admins, color: "#8B5CF6" },
    { name: "Managers", value: stats.managers, color: "#10B981" },
    { name: "Users", value: stats.users, color: "#F59E0B" },
  ];

  const monthlyGrowthData = [
    { month: "Jan", users: 40 },
    { month: "Feb", users: 68 },
    { month: "Mar", users: 86 },
    { month: "Apr", users: 112 },
    { month: "May", users: 145 },
    { month: "Jun", users: 180 },
    { month: "Jul", users: 210 },
  ];

  // NEW: Get user registration trend from real data
  const getUserRegistrationTrend = () => {
    if (!allUser || allUser.length === 0) return [];

    // Group users by creation date (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const usersLast6Months = allUser?.filter((user) => {
      const userDate = new Date(user.createdAt);
      return userDate >= sixMonthsAgo;
    });

    // Create monthly buckets
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString("en-US", { month: "short" });
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      months.push({ month: monthName, fullDate: yearMonth, count: 0 });
    }

    // Count users per month
    usersLast6Months.forEach((user) => {
      const userDate = new Date(user.createdAt);
      const yearMonth = `${userDate.getFullYear()}-${String(userDate.getMonth() + 1).padStart(2, "0")}`;
      const monthIndex = months.findIndex((m) => m.fullDate === yearMonth);
      if (monthIndex !== -1) {
        months[monthIndex].count++;
      }
    });

    return months.map(({ month, count }) => ({ month, users: count }));
  };

  const registrationTrendData = getUserRegistrationTrend();

  // Filter users based on role and search
  const filteredUsers = allUser?.filter((user) => {
    const matchesRole =
      selectedRoleFilter === "all" || user.role === selectedRoleFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });
  

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
      } else {
        await HandleCreateUser(formData);
      }

      handleCloseModal();
      await fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setSubmitLoading(true);
      await HandleDeleteUser(id);
      await fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          border: "border-purple-200",
        };
      case "manager":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          border: "border-emerald-200",
        };
      default:
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-200",
        };
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUsers size={24} className="text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchUsers}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200 w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage users, roles, and permissions
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <FiDownload size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-all duration-200"
            >
              <FiUserPlus size={18} />
              <span className="hidden sm:inline">Add User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Role Distribution Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Role Distribution
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Breakdown of user roles
              </p>
            </div>
            <FiFilter className="text-gray-400" size={20} />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {roleDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value, "Users"]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                User Growth
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Monthly user acquisition
              </p>
            </div>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              +24% this quarter
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyGrowthData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value) => [value, "Users"]}
                />
                <Bar dataKey="users" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* NEW: User Registration Timeline Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Registration Trend
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Last 6 months of signups
              </p>
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
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value) => [value, "New Users"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#F59E0B" }}
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
      </div>

      {/* Users Table Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                User Directory
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Manage and monitor user accounts
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 w-full sm:w-64"
                />
              </div>

              {/* Role Filter */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                {["all", "admin", "manager", "user"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRoleFilter(role)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedRoleFilter === role
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {role === "all"
                      ? "All"
                      : role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <FiUsers size={48} className="text-gray-300 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        No users found
                      </h4>
                      <p className="text-gray-600 max-w-md mb-4">
                        {searchQuery || selectedRoleFilter !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "Get started by adding your first user"}
                      </p>
                      {!searchQuery && selectedRoleFilter === "all" && (
                        <button
                          onClick={openCreateModal}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors duration-200"
                        >
                          Add First User
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleColors = getRoleColor(user.role);
                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-xl overflow-hidden bg-gray-200">
                            {user.image ? (
                              <img
                                src={`${user.image}`}
                                alt={user.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-indigo-500 text-white font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiMail size={14} className="mr-2 text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${roleColors.bg} ${roleColors.text}`}
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiCalendar
                            size={14}
                            className="mr-2 text-gray-400"
                          />
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                            title="Edit user"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete user"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <CreateUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        userToEdit={editingUser}
        loading={submitLoading}
      />
    </div>
  );
};

export default AdminPage;
