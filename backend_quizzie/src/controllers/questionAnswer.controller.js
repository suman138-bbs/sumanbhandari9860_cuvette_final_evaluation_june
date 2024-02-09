import QuestionAnswer from "../models/questionAnswer.model.js";
import User from "../models/user.model.js";
import Poll from "../models/poll.model.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/CustomError.js";

export const createQuestionAnswer = asyncHandler(async (req, res) => {
  const { name, quizForms } = req.body;

  const data = { name, questionsAnswer: quizForms };
  const userId = req.user._id;

  const qzName = await QuestionAnswer.findOne({ name });
  if (qzName) {
    throw new CustomError("Quiz name Already Exist", 400);
  }
  const newQuestionAnswer = await QuestionAnswer.create(data);
  await User.findByIdAndUpdate(userId, {
    $push: { quizes: { quiz_id: newQuestionAnswer._id } },
  });
  res
    .status(200)
    .json({ success: true, newQuestionAnswer, id: newQuestionAnswer._id });
});
export const getAllQuestionAnswer = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const allQuizesIds = await User.findById(userId, "quizes");

  const quizIds = allQuizesIds.quizes.map((quiz) => quiz.quiz_id);

  const quizzes = await QuestionAnswer.find({ _id: { $in: quizIds } });

  res.status(200).json({ quizzes });
});

/**GET TOTAL */
export const getTotal = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    const totalQuizzes = user.quizes.length;
    const totalPolls = user.polls.length;

    const quizzes = await QuestionAnswer.find({
      _id: { $in: user.quizes.map((quiz) => quiz.quiz_id) },
    });
    const totalQuizImpressions = quizzes.reduce(
      (sum, quiz) => sum + quiz.impression,
      0
    );

    const polls = await Poll.find({
      _id: { $in: user.polls.map((poll) => poll.poll_id) },
    });
    const totalPollImpressions = polls.reduce(
      (sum, poll) => sum + poll.impression,
      0
    );

    res.status(200).json({
      totalQuizzes,
      totalPolls,
      totalQuizImpressions,
      totalPollImpressions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export const getTrending = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  const userQuizzes = await QuestionAnswer.find({
    _id: { $in: user.quizes.map((quiz) => quiz.quiz_id) },
  });

  const trendingQuizzes = userQuizzes.filter((quiz) => quiz.impression > 10);

  const userPolls = await Poll.find({
    _id: { $in: user.polls.map((poll) => poll.poll_id) },
  });

  const trendingPolls = userPolls.filter((poll) => poll.impression > 10);

  res.status(200).json({
    trendingQuizzes,
    trendingPolls,
  });
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.body;
  console.log(quizId);
  await QuestionAnswer.findByIdAndDelete(quizId);
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { quizes: { quiz_id: quizId } },
  });
  res.status(200).json({ success: true, message: "Quiz Deleted Succesfully" });
});

export const getQuizById = asyncHandler(async (req, res) => {
  const { quizId, pollId } = req.body;
  if (quizId) {
    const quiz = await QuestionAnswer.findById(quizId);
    res.status(200).json({ success: true, quiz });
  } else if (pollId) {
    const poll = await Poll.findById(pollId);
    res.status(200).json({ success: true, poll });
  }
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const { quizId, updatedData } = req.body;

  if (!quizId || !updatedData) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid input data" });
  }

  const updatedQuiz = await QuestionAnswer.findByIdAndUpdate(
    quizId,
    { $set: { ...updatedData, questionsAnswer: updatedData.quizForms } },
    { new: true }
  );

  if (!updatedQuiz) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }

  res
    .status(200)
    .json({ success: true, updatedQuiz, message: "Quiz Updated SuccessFully" });
});

export const updatePoll = asyncHandler(async (req, res) => {
  const { pollId, updatedData } = req.body;

  if (!pollId || !updatedData) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid input data" });
  }

  const updatedPoll = await Poll.findByIdAndUpdate(
    pollId,
    { $set: { ...updatedData, polls: updatedData.pollForms } },
    { new: true }
  );

  if (!updatedPoll) {
    return res.status(404).json({ success: false, message: "Poll not found" });
  }

  res
    .status(200)
    .json({ success: true, updatedPoll, message: "Poll Updated SuccessFully" });
});
