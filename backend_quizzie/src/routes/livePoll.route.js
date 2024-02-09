import { Router } from "express";
import {
  livePoll,
  updateLivePoll,
} from "../controllers/livePoll.controller.js";

const livePollRouter = Router();
livePollRouter.post("/", livePoll);
livePollRouter.put("/", updateLivePoll);

export default livePollRouter;
