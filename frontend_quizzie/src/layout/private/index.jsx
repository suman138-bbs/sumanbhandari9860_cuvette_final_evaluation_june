import { NavLink, Outlet, useNavigate, useRoutes } from "react-router-dom";
import { Suspense } from "react";
import { SyncLoader } from "react-spinners";

import Dashboard from "../../components/dashboard";
import Analytics from "../../components/analytics";
import style from "./style.module.css";
import CreateQuiz from "../../components/create-quiz";
import axios from "../../api/axios";

const Layout = () => {
  const navigate = useNavigate();
  const navigation = [
    {
      name: "Dashboard",
      href: "dashboard",
    },
    {
      name: "Analytics",
      href: "analytics",
    },
    {
      name: "Create Quiz",
      href: "create-quiz",
    },
  ];
  const handleLogout = async () => {
    try {
      await axios.get("/auth/logout");
      navigate("/auth");
    } catch (error) {
      console.log("ERROR");
    }
  };
  return (
    <div className={style.layoutContainer}>
      <div className={style.navContainer}>
        <div className={style.logo}>
          <h1>QUIZZIE</h1>
        </div>
        <div className={style.nav}>
          {navigation.map((nav) => {
            return (
              <NavLink to={nav.href} key={nav.href} className={style.navLink}>
                <h4> {nav.name}</h4>
              </NavLink>
            );
          })}
        </div>
        <div className={style.logoutContainer}>
          <hr />
          <button
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <div className={style.outlet}>
        <Outlet />
      </div>
    </div>
  );
};

const PrivateLayout = () => {
  const routing = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "analytics",
          element: <Analytics />,
        },
        {
          path: "create-quiz",
          element: <CreateQuiz />,
        },
      ],
    },
  ]);

  return <Suspense fallback={<SyncLoader />}>{routing}</Suspense>;
};

export default PrivateLayout;
