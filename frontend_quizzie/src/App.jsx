import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { Suspense, useEffect } from "react";

import AuthLayout from "./layout/auth";
import PrivateLayout from "./layout/private";

import useAuth from "./hooks/useAuth";
import useRefToken from "./hooks/useRefToken";
import LiveQuiz from "./layout/live-quiz";
import LivePoll from "./layout/live-poll";

function App() {
  const { auth } = useAuth();
  const refresh = useRefToken();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const handleAuth = async () => {
      const currentRoute = window.location.pathname;

      console.log("Auth", auth);
      if (!auth.name) {
        const path = pathname.split("/").includes("auth");

        if (currentRoute.startsWith("/live-quiz")) {
          navigate(currentRoute);
          return;
        }
        if (currentRoute.startsWith("/live-poll")) {
          navigate(currentRoute);
          return;
        }

        if (path) {
          navigate("/auth");
          return;
        }
        const token = await refresh();
        if (!token) {
          navigate("auth");
          return;
        }
        if (currentRoute.startsWith("/app")) {
          navigate(currentRoute);
        } else {
          navigate("/app/dashboard");
        }
      } else {
        navigate("/auth");
      }
    };
    handleAuth();
  }, []);
  const routing = useRoutes([
    {
      path: "/auth/*",
      element: <AuthLayout />,
    },
    {
      path: "/app/*",
      element: <PrivateLayout />,
    },
    {
      path: "/live-quiz/:quizId",
      element: <LiveQuiz />,
    },
    {
      path: "/live-poll/:pollId",
      element: <LivePoll />,
    },
  ]);

  return <Suspense fallback={"Loading....."}>{routing}</Suspense>;
}

export default App;
