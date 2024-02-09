import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import style from "../login/style.module.css";
import { toast } from "react-toastify";
import axios from "../../../api/axios";

const SignUp = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name) {
      setErrors("Please provide Valid Name");
      return;
    } else if (!data.email && !data.password) {
      setErrors("Please provide email and password");
      return;
    } else if (!isValidEmail(data.email)) {
      setErrors("Please provide a valid email address");
      return;
    } else if (data.password !== data.confirmPassword) {
      setErrors(
        "Password and Confirm Password do not match. Please make sure they are the same"
      );
      return;
    }
    try {
      const { name, email, password } = data;
      const res = await axios.post("/auth/signup", { name, email, password });
      if (res?.data) {
        setAuth(res.data);
        navigate("/app/dashboard");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Invalid User");
    }
  };
  return (
    <form className={style.formContainer}>
      <div className={style.loginFormContainer}>
        <div className={style.labelContainer}>
          <label htmlFor="name">Name</label>
          <label htmlFor="email">Email</label>
          <label htmlFor="password">Password</label>
          <label htmlFor="conpassword">Confirm Password</label>
        </div>
        <div className={style.inputContainer}>
          <input
            id="name"
            type="text"
            onChange={(e) => {
              setData({ ...data, name: e.target.value });
            }}
          />
          <input
            id="email"
            type="email"
            onChange={(e) => {
              setData({ ...data, email: e.target.value });
            }}
          />
          <input
            id="password"
            type="password"
            onChange={(e) => {
              setData({ ...data, confirmPassword: e.target.value });
            }}
          />
          <input
            id="conpassword"
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
          Signup
        </button>
      </div>
    </form>
  );
};

export default SignUp;
