import Poll from "../models/poll.model.js";
import asyncHandler from "../services/asyncHandler.js";

export const livePoll = asyncHandler(async (req, res) => {
  const { pollId } = req.body;

  const quiz = await Poll.findById(pollId);
  quiz.impression += 1;
  await quiz.save();
  res.status(200).json({ success: true, data: quiz });
});

export const updateLivePoll = asyncHandler(async (req, res) => {
  const { pollId, questions } = req.body;

  const updatedQuiz = await Poll.findByIdAndUpdate(
    pollId,
    { $set: { polls: questions } },
    { new: true }
  );

  res.status(200).json({ success: true, data: updatedQuiz });
});
