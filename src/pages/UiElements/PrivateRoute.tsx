import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  let navigate = useNavigate();
  if (user == null) {
    navigate("/auth/signin");  
  }
  return children;
};

export default PrivateRoute;
