import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import liveQuizRouter from "./routes/liveQuiz.route.js";
import quesAnsRouter from "./routes/questionAnswer.route.js";
import pollRouter from "./routes/poll.route.js";
import livePollRouter from "./routes/livePoll.route.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "https://quizzie123.netlify.app",
      "https://frontend-quizzie.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/auth", userRouter);
app.use("/app", quesAnsRouter);
app.use("/poll", pollRouter);
app.use("/live-quiz", liveQuizRouter);
app.use("/live-poll", livePollRouter);

app.all("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
