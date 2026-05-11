import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{ redirect_uri: window.location.origin }}
      >
        <RouterProvider router={router} />
      </Auth0Provider>
    </Provider>
  </React.StrictMode>
);
