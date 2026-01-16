import { Routes, Route } from "react-router-dom";

import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ProtectedRoutes from "./auth/ProtectedRoutes";

import HomeLayout from "./layout/HomeLayout";
import AdminLayout from "./layout/AdminLayout";
import ManagerLayout from "./layout/ManagerLayout";

import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import ManagerPage from "./pages/ManagerPage";
import Error from "./components/Error";
// import Error from "./pages/Error"; // ✅ IMPORT ERROR

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* User routes (user, manager, admin) */}
      <Route element={<ProtectedRoutes allowedRoles={["user", "manager", "admin"]} />}>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
        </Route>
      </Route>

      {/* Manager routes */}
      <Route element={<ProtectedRoutes allowedRoles={["manager", "admin"]} />}>
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerPage />} />
        </Route>
      </Route>

      {/* Error route (MUST be last) */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;
