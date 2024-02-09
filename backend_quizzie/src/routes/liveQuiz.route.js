import { Router } from "express";
import {
  liveQuiz,
  updateLiveQuiz,
} from "../controllers/liveQuiz.controller.js";

const liveQuizRouter = Router();
liveQuizRouter.post("/", liveQuiz);
liveQuizRouter.put("/", updateLiveQuiz);

export default liveQuizRouter;
