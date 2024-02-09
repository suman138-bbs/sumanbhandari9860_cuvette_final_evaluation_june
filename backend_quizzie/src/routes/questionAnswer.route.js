import { Router } from "express";
import {
  createQuestionAnswer,
  getAllQuestionAnswer,
  deleteQuiz,
  getTotal,
  getTrending,
  getQuizById,
  updateQuiz,
  updatePoll,
} from "../controllers/questionAnswer.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
const quesAnsRouter = Router();

quesAnsRouter.post("/craeteQNA", isLoggedIn, createQuestionAnswer);
quesAnsRouter.get("/getAllQNA", isLoggedIn, getAllQuestionAnswer);
quesAnsRouter.get("/getTotal", isLoggedIn, getTotal);
quesAnsRouter.get("/getTrending", isLoggedIn, getTrending);
quesAnsRouter.put("/deleteQuiz", isLoggedIn, deleteQuiz);
quesAnsRouter.put("/getQuizById", isLoggedIn, getQuizById);
quesAnsRouter.post("/updateQuiz", isLoggedIn, updateQuiz);
quesAnsRouter.post("/updatePoll", isLoggedIn, updatePoll);

export default quesAnsRouter;
