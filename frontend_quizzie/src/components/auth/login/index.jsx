import { useState } from "react";
import axios from "../../../api/axios";
import style from "./style.module.css";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("DATA", data);
    if (!data.email && !data.password) {
      setErrors("Please provide email and password");
      return;
    } else if (!isValidEmail(data.email)) {
      setErrors("Please provide a valid email address");
      return;
    }
    try {
      const res = await axios.post("/auth/login", data);
      if (res?.data) {
        setAuth(res.data);
        navigate("/app/dashboard");
        if (auth?.user) {
          toast.success("User Logged In Successfully");
        }
      }
    } catch (error) {
      toast.error(error.response.data.message || "Invalid User");
    }
  };

  return (
    <form className={style.formContainer}>
      <div className={style.loginFormContainer}>
        <div className={style.labelContainer}>
          <label htmlFor="email">Email</label>
          <label htmlFor="email">Password</label>
        </div>
        <div className={style.inputContainer}>
          <input
            autoComplete="on"
            type="email"
            onChange={(e) => {
              setData({ ...data, email: e.target.value });
            }}
          />
          <input
            type="password"
            onChange={(e) => {
              setData({ ...data, password: e.target.value });
            }}
          />
        </div>
      </div>
      <div className={style.errorsContainer}>
        {errors && <span>{errors}</span>}
        <button type="submit" onClick={handleSubmit}>
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;
