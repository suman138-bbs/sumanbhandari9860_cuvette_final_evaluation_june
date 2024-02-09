import User from "../models/user.model.js";
import Poll from "../models/poll.model.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/CustomError.js";

export const createPoll = asyncHandler(async (req, res) => {
  const { name, quizForms } = req.body;
  console.log(name, quizForms);
  const data = { name, polls: quizForms };
  const userId = req.user._id;

  const qzName = await Poll.findOne({ name });
  if (qzName) {
    throw new CustomError("Poll name Already Exist", 400);
  }
  const newPoll = await Poll.create(data);
  console.log();
  await User.findByIdAndUpdate(userId, {
    $push: { polls: { poll_id: newPoll._id } },
  });
  res.status(200).json({ success: true, newPoll, id: newPoll._id });
});

export const getAllPoll = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const allPollsIds = await User.findById(userId, "polls");

  const pollIds = allPollsIds.polls.map((poll) => poll.poll_id);

  const polls = await Poll.find({ _id: { $in: pollIds } });

  res.status(200).json({ polls });
});

export const deletePoll = asyncHandler(async (req, res) => {
  const { pollId } = req.body;
  console.log(pollId);
  await Poll.findByIdAndDelete(pollId);

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { polls: { poll_id: pollId } },
  });

  res.status(200).json({ success: true, message: "Quiz Deleted Succesfully" });
});
