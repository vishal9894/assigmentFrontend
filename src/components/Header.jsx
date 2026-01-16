import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser, setUser } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import { HandleLogout } from "../api/api";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (user?.refreshToken) {
        await HandleLogout(user.refreshToken);
      }
    } catch (error) {
      console.error("Logout failed, continuing anyway");
    } finally {
      // Remove user from Redux
      dispatch(clearUser());
      // Remove tokens
      localStorage.removeItem("accessToken");
      // Redirect to login
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="flex justify-between items-center bg-gray-100 px-6 py-4 shadow-md">
      <div className="text-lg font-semibold">
        Role: <span className="text-indigo-600">{user?.role || "Guest"}</span>
      </div>
      {user && (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
