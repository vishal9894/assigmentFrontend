import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { HandlefetchUser } from "../api/api";
import { useEffect, useState } from "react";
import { setUser } from "../redux/features/authSlice";

const ProtectedRoutes = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // always loading first

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await HandlefetchUser(); // cookies sent automatically
        dispatch(setUser(userData));
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // no token in localStorage anymore
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  // While fetching user
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
