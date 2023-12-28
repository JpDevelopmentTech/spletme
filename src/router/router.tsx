import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/login";
import Panel from "../pages/panel/panel";
import Home from "../pages/panel/home/home";
import GuardedRoute from "../guards/auth";
import Music from "../pages/panel/music/music";
import Last from "../pages/panel/last/last";
import Collaborators from "../pages/panel/collaborators/collaborators";
import Dealers from "../pages/panel/dealers/dealers";



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
      {
        path: "last",
        element: <Last />,
      },
      {
        path: "collaborators",
        element: <Collaborators />
      },
      {
        path: "dealers",
        element: <Dealers />,
      }
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
