import { Suspense, useState } from "react";
import { useRoutes } from "react-router-dom";
import { SyncLoader } from "react-spinners";

import style from "./style.module.css";
import SignUp from "../../components/auth/sign-up";
import Login from "../../components/auth/login";

const Layout = () => {
  const [selected, setSelected] = useState("login");
  const handleButtonClick = (buttonType) => {
    setSelected(buttonType);
  };

  return (
    <div className={style.authContainer}>
      <div className={style.userInputContainer}>
        <h1>QUIZZIE</h1>
        <div className={style.formContainer}>
          <div className={style.buttonContainer}>
            <button
              onClick={() => handleButtonClick("signup")}
              className={selected === "signup" ? style.selectedButton : ""}
            >
              Sign Up
            </button>
            <button
              onClick={() => handleButtonClick("login")}
              className={selected === "login" ? style.selectedButton : ""}
            >
              Log In
            </button>
          </div>
          <div>
            {selected === "signup" && <SignUp />}
            {selected === "login" && <Login />}
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthLayout = () => {
  const routing = useRoutes([
    {
      path: "/",
      element: <Layout />,
    },
  ]);
  return <Suspense fallback={<SyncLoader />}>{routing}</Suspense>;
};

export default AuthLayout;
