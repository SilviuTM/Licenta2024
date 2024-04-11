import { MantineProvider } from '@mantine/core';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainLayout from './components/shared/MainLayout';
import ErrorPage from './components/shared/ErrorPage';
import Login from './components/auth/Login';
import { AuthProvider } from './components/auth/AuthContext';
import Home from './components/Home';


const router = createBrowserRouter([
  {
    path: "",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  }
]);



export default function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <AuthProvider>
      <RouterProvider router={router} />
      </AuthProvider>
    </MantineProvider>
  )
} 