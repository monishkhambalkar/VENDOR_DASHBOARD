import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// const PrivateRoute = ({ children }) => {
//   const user = localStorage.getItem("user");

//   return user && user.refreshToken ? <Navigate to="/auth/signin" /> : children;
// };

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user);
  console.log(children);
  // return user ? children : <Navigate to="/auth/signin" />;
  return children;
};

export default PrivateRoute;
