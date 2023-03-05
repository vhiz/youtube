import { useContext } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AuthContext } from "./context/authCOntext";
import { DarkModeContext } from "./context/darkmode";
import Home from "./pages/Home/Home";
import Login from "./pages/login/Login";
import Search from "./pages/Search/Search";
import Video from "./pages/video/Video";

export default function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home type={"random"} />,
    },
    {
      path: "/:id",
      element: <Video />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/trends",
      element: <Home type={"trend"} />,
    },
    {
      path: "/subcriptions",
      element: currentUser ? <Home type={"sub"} /> : <Navigate to={"/login"} />,
    },
    {
      path: "/search",
      element: <Search />,
    },
  ]);
  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <RouterProvider router={router} />
    </div>
  );
}
