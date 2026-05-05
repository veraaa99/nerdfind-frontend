import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AuthContextProvider from "./contexts/authContext";
import UserLayout from "./layouts/UserLayout";
import HostLayout from "./layouts/HostLayout";
import CreateListing from "./pages/CreateListing";
import AllListings from "./pages/AllListings";
import ListingDetails from "./pages/ListingDetails";
import SearchResult from "./pages/SearchResult";
import ListingContextProvider from "./contexts/listingContext";
import Modal from "react-modal";

Modal.setAppElement("#root");

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "listings",
        element: <AllListings />,
      },
      {
        path: "listings/:id",
        element: <ListingDetails />,
      },
      {
        path: "search",
        element: <SearchResult />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
        ],
      },
      {
        element: <UserLayout />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "host",
            element: <HostLayout />,
            children: [
              {
                path: "createlisting",
                element: <CreateListing />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <ListingContextProvider>
        <RouterProvider router={router} />
      </ListingContextProvider>
    </AuthContextProvider>
  </StrictMode>,
);
