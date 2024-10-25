import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/login";
import Panel from "../pages/panel/panel";
import Home from "../pages/panel/home/home";
import Music from "../pages/panel/music/music";
import Last from "../pages/panel/last/last";
import Collaborators from "../pages/panel/collaborators/collaborators";
import Dealers from "../pages/panel/dealers/dealers";
import Song from "../pages/panel/music/song/song";
import Collaborator from "../pages/panel/collaborators/pages/collaborator";
import Payments from "../pages/panel/payments/payments";
import Album from "../pages/panel/music/album/album";



const routes = [
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/panel",
    element: <Panel />,
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
        path: "song/:id",
        element: <Song />,
      },
      {
        path: "album/:id",
        element: <Album />
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
      },
      {
        path: "collaborators/:id",
        element: <Collaborator />
      },
      {
        path: "pagos",
        element: <Payments />
      }
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
