import { createBrowserRouter, Navigate } from "react-router-dom";
import GuardedRoute, { PublicOnlyRoute } from "../guards/auth";
import Login from "../pages/auth/login";
import Panel from "../pages/panel/panel";
import Home from "../pages/panel/home/home";
import Music from "../pages/panel/music/music";
import Last from "../pages/panel/last/last";
import Collaborators from "../pages/panel/collaborators/collaborators";
import Dealers from "../pages/panel/dealers/dealers";
import Song from "../pages/panel/music/song/song";
import Collaborator from "../pages/panel/collaborators/pages/collaborator";
import Album from "../pages/panel/music/album/album";
import AlbumDetail from "../pages/panel/music/album/AlbumDetail";
import Onboarding from "../pages/auth/onboarding";
import EmailLogin from "../pages/auth/email-login";
import Register from "../pages/auth/register";
import PasswordRecoveryRequest from "../pages/auth/password-recoveryRequest";
import PasswordRecoveryReset from "../pages/auth/password-recovery-reset";
import Balance from "../pages/panel/balance/balance";
import WalletPage from "../pages/panel/wallet/wallet";
import Profile from "../pages/panel/profile/profile";
import AcceptCollaboration from "../pages/collabotarion/acceptCollaboration";
import AcceptLabelCollaboration from "../pages/collabotarion/acceptLabelCollaboration";
import LabelsTable from "../pages/panel/labels/labelsTable";
import LabelDetail from "../pages/panel/labels/labelDetail";
import CustomLabelDetail from "../pages/panel/labels/customLabelDetail";
import ChangePasswordPage from "@/pages/panel/profile/change-password";
import Analytics from "../pages/panel/analytics/analytics";
import DistributorDetail from "../pages/panel/dealers/DistributorDetail";

const routes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/auth/email-login",
    element: (
      <PublicOnlyRoute>
        <EmailLogin />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/auth/register",
    element: (
      <PublicOnlyRoute>
        <Register />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/auth/password-recovery",
    element: <PasswordRecoveryRequest />,
  },
  {
    path: "/auth/password-recovery/reset",
    element: <PasswordRecoveryReset />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/collaboration/accept",
    element: <AcceptCollaboration />,
  },
  {
    path: "/collaboration/accept-label",
    element: <AcceptLabelCollaboration />,
  },

  {
    path: "/panel",
    element: (
      <GuardedRoute>
        <Panel />
      </GuardedRoute>
    ),
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "music",
        element: <Music />,
      },
      // Las dos rutas antiguas se conservan como redirección: los enlaces ya
      // repartidos siguen funcionando y caen en la agrupación correspondiente.
      {
        path: "music/songs",
        element: <Navigate to="/panel/music?view=songs" replace />,
      },
      {
        path: "music/albums",
        element: <Navigate to="/panel/music?view=albums" replace />,
      },
      {
        path: "song/:id",
        element: <Song />,
      },
      {
        path: "album/:id",
        element: <Album />,
      },
      {
        path: "album/upc/:upc",
        element: <AlbumDetail />,
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
        element: <Collaborators />,
      },
      {
        path: "dealers",
        element: <Dealers />,
      },
      {
        path: "dealers/:id",
        element: <DistributorDetail />,
      },
      {
        path: "collaborators/:id",
        element: <Collaborator />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "balance",
        element: <Balance />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "wallet",
        element: <WalletPage />,
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
      },
      {
        path: "labels",
        element: <LabelsTable />,
      },
      {
        path: "labels/custom/:label",
        element: <CustomLabelDetail />,
      },
      {
        path: "labels/:label",
        element: <LabelDetail />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
