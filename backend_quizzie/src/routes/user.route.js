import { Router } from "express";
import {
  signUp,
  login,
  refresh,
  logout,
} from "../controllers/auth.controller.js";

const userRouter = Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.get("/refresh", refresh);
export default userRouter;
