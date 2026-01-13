import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const LogoutButton = () => {
  const { setAuthState } = useAuthContext();
  const navigate = useNavigate();

  const logout = () => {
    // Clear all tokens
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("adminAccessToken");
    sessionStorage.removeItem("shelterAccessToken");

    // Reset auth state
    setAuthState({
      username: "",
      id: 0,
      userType: "",
      status: false,
    });

    // Redirect to login or landing page
    navigate("/login");
  };

  return <button onClick={logout}>Logout</button>;
};

export default LogoutButton;
