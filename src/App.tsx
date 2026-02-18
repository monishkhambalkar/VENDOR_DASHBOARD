import { useEffect, useState, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "react-notifications/lib/notifications.css";
const Loader = lazy(()=> import('./common/Loader'));
const PageTitle = lazy(()=> import('./components/PageTitle'));
const SignIn = lazy(()=> import('./pages/Authentication/SignIn'));
const SignUp = lazy(()=> import('./pages/Authentication/SignUp'));
const Calendar = lazy(()=> import('./pages/Calendar'));
const Chart = lazy(()=> import('./pages/Chart'));
const ECommerce = lazy(()=> import('./pages/Dashboard/ECommerce'));
const FormElements = lazy(()=> import('./pages/Form/FormElements'));
const FormLayout = lazy(()=> import('./pages/Form/FormLayout'));
const Profile = lazy(()=> import('./pages/Profile'));
const ProfileEdit = lazy(()=> import('./pages/EditProfile'));
const Products = lazy(()=> import('./pages/Tables'));
const Alerts = lazy(()=> import('./pages/UiElements/Alerts'));
const Buttons = lazy(()=> import('./pages/UiElements/Buttons'));
const AccountSetting = lazy(()=> import('./pages/AccountSetting'));
const AddProduct = lazy(()=> import('./components/Tables/AddProduct'));
const UpdateProduct = lazy(()=> import('./components/Tables/UpdateProduct'));
const Category = lazy(()=> import('./pages/Category'));
const ViewProduct = lazy(()=> import('./components/Tables/ViewProduct'));
const PrivateRoute = lazy(()=> import('./pages/UiElements/PrivateRoute'));
const ChatUI = lazy(()=> import('./chat_app/ChatApp'));

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
    <Suspense fallback={<Loader/>}>
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
      </Suspense>
    </>
  );
}

export default App;
