import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

// import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import "./css/style.css";
import "./css/satoshi.css";
import "flatpickr/dist/flatpickr.min.css";
import "./pages/Authentication/RefreshToken";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <Auth0Provider
      domain="dev-ligg65amrrelkx67.us.auth0.com"
      clientId="L8uWjWnhnioJ1MDJCqxxYK9iMw2Gv7s6"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    > */}
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
    {/* </Auth0Provider> */}
  </React.StrictMode>
);
