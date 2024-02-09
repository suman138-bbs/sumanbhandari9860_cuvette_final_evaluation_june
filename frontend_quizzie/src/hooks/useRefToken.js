import axios from "../api/axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const useRefToken = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true,
      });
      setAuth((prev) => {
        return { ...prev, accessToken: response.data.accessToken };
      });
      return response.data.accessToken;
    } catch (error) {
      if (!error?.data?.success) {
        console.log("Error", error);
        navigate("/auth");
      }
    }
  };
  return refresh;
};

export default useRefToken;
