import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../store/store";
import { readPendingInvite } from "@/utils/pendingInvite";

interface GuardedRouteProps {
  children: ReactNode;
}

const GuardedRoute = ({ children }: GuardedRouteProps) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuth);
  const location = useLocation();

  if (isAuthenticated !== "true") {
    return <Navigate to="/auth/email-login" replace state={{ from: location }} />;
  }

  return children;
};

export default GuardedRoute;

export const PublicOnlyRoute = ({ children }: GuardedRouteProps) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuth);

  if (isAuthenticated === "true") {
    // Con una invitación a medias, mandar al panel la perdería: quien ya tiene
    // sesión y abrió el enlace lo que quiere es aceptarla.
    const pendingInvite = readPendingInvite();
    return <Navigate to={pendingInvite?.path ?? "/panel/home"} replace />;
  }

  return children;
};
