import QuestionAnswer from "../models/questionAnswer.model.js";
import asyncHandler from "../services/asyncHandler.js";

export const liveQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.body;

  const quiz = await QuestionAnswer.findById(quizId);
  quiz.impression += 1;
  await quiz.save();
  res.status(200).json({ success: true, data: quiz });
});

export const updateLiveQuiz = asyncHandler(async (req, res) => {
  const { quizId, questions } = req.body;

  const updatedQuiz = await QuestionAnswer.findByIdAndUpdate(
    quizId,
    { $set: { questionsAnswer: questions } },
    { new: true }
  );

  res.status(200).json({ success: true, data: updatedQuiz });
});
