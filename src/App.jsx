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

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          element={
            <ProtectedRoutes allowedRoles={["user", "manager", "admin"]} />
          }
        >
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<HomePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminPage />} />
          </Route>
        </Route>

        <Route
          element={<ProtectedRoutes allowedRoles={["manager", "admin"]} />}
        >
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
