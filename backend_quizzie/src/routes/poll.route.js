import { Router } from "express";
import {
  createPoll,
  deletePoll,
  getAllPoll,
} from "../controllers/poll.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
const pollRouter = Router();

pollRouter.post("/createPoll", isLoggedIn, createPoll);
pollRouter.get("/getAllPoll", isLoggedIn, getAllPoll);

pollRouter.put("/deletePoll", isLoggedIn, deletePoll);

export default pollRouter;
