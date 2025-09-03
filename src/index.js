import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
//router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//store
import { Provider } from "react-redux";
//reducer
import { store } from "./store";
import { IndexRouters } from "./router";
import { SimpleRouter } from "./router/simple-router";
import { DefaultRouter } from "./router/default-router";
import { ToastContainer } from "react-toastify";
const token = sessionStorage.getItem("solarpix_token");
const router = createBrowserRouter(
  [
    ...(token === null ? SimpleRouter : []),
    ...(token !== null ? DefaultRouter : []),
    ...IndexRouters,
  ],
  { basename: process.env.PUBLIC_URL }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App>
        <RouterProvider router={router}></RouterProvider>
        <ToastContainer />
      </App>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
