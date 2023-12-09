import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/login";
import Panel from "../pages/panel/panel";
import Home from "../pages/panel/home/home";
import GuardedRoute from "../guards/auth";
import Music from "../pages/panel/music/music";



const routes = [
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/panel",
    element: <GuardedRoute><Panel /></GuardedRoute>,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "music",
        element: <Music/>,
      },
      {
        path: "report",
        element: <h1>Report</h1>,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
