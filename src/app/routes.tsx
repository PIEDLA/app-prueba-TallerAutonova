import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { DashboardLayout } from "./components/DashboardLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { MechanicDashboard } from "./pages/MechanicDashboard";
import { ReceptionistDashboard } from "./pages/ReceptionistDashboard";
import { Inventory } from "./pages/Inventory";
import { Vehicles } from "./pages/Vehicles";
import { VehicleHistory } from "./pages/VehicleHistory";
import { UserManagement } from "./pages/UserManagement";
import { Alerts } from "./pages/Alerts";
import { Appointments } from "./pages/Appointments";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "admin", element: <AdminDashboard /> },
      { path: "mechanic", element: <MechanicDashboard /> },
      { path: "receptionist", element: <ReceptionistDashboard /> },
      { path: "inventory", element: <Inventory /> },
      { path: "vehicles", element: <Vehicles /> },
      { path: "vehicles/:id", element: <VehicleHistory /> },
      { path: "users", element: <UserManagement /> },
      { path: "alerts", element: <Alerts /> },
      { path: "appointments", element: <Appointments /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
