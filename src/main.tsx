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
        domain="dev-w1johsr16u4a6vkv.us.auth0.com"
        clientId="bV1VypTEUbBXqUG9RTR2ABhiNvkarw9q"
        authorizationParams={{ redirect_uri: window.location.origin }}
      >
        <RouterProvider router={router} />
      </Auth0Provider>
    </Provider>
  </React.StrictMode>
);
