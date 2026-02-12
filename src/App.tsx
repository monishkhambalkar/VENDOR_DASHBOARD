import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import Calendar from "./pages/Calendar";
import Chart from "./pages/Chart";
import ECommerce from "./pages/Dashboard/ECommerce";
import FormElements from "./pages/Form/FormElements";
import FormLayout from "./pages/Form/FormLayout";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/EditProfile";
import Products from "./pages/Tables";
import Alerts from "./pages/UiElements/Alerts";
import Buttons from "./pages/UiElements/Buttons";
import AccountSetting from "./pages/AccountSetting";
import AddProduct from "./components/Tables/AddProduct";
import UpdateProduct from "./components/Tables/UpdateProduct";
import Category from "./pages/Category";
import ViewProduct from "./components/Tables/ViewProduct";
import PrivateRoute from "./pages/UiElements/PrivateRoute";
import "react-notifications/lib/notifications.css";
import ChatUI from "./chat_app/ChatApp";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <PrivateRoute>
              <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ECommerce />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Calendar />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <PrivateRoute>
              <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </PrivateRoute>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <PrivateRoute>
              <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormLayout />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/Category"
          element={
            <PrivateRoute>
              <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Category />
            </PrivateRoute>
          }
        />
        <Route
          path="/Profile-edit/:id"
          element={
            <PrivateRoute>
              <PageTitle title="Edit Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ProfileEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="/chart"
          element={
            <PrivateRoute>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Chart />
            </PrivateRoute>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <PrivateRoute>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </PrivateRoute>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <PrivateRoute>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
            </PrivateRoute>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <PrivateRoute>
              <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignIn />
            </PrivateRoute>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <PrivateRoute>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </PrivateRoute>
          }
        />
        <Route
          path="/Account-Setting"
          element={
            <PrivateRoute>
              <PageTitle title="Account Setting | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <AccountSetting />
            </PrivateRoute>
          }
        />
        <Route
          path="/Add-Product"
          element={
            <PrivateRoute>
              <PageTitle title="Add Product | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <AddProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/Update-Product/:id"
          element={
            <PrivateRoute>
              <PageTitle title="Add Product | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <UpdateProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/View-Product/:id"
          element={
            <PrivateRoute>
              <PageTitle title="Add Product | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ViewProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <PageTitle title="Add Product | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ChatUI />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
