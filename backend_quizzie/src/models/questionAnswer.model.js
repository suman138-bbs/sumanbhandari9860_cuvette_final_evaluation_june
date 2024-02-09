import mongoose from "mongoose";

const questionAnswerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    impression: {
      type: Number,
      default: 0,
    },
    questionsAnswer: [
      {
        questionText: {
          type: String,
          required: true,
        },
        options: [
          {
            type: {
              type: String,
              required: true,
              enum: ["text", "image", "txtAndImg"],
            },
            option: {
              type: String,
            },

            isCorrect: {
              type: Boolean,
              required: true,
            },
            imageUrl: {
              type: String,
            },
          },
        ],
        totalAttempted: {
          type: Number,
          default: 0,
        },
        correctAttempted: {
          type: Number,
          default: 0,
        },
        incorrectAttempted: {
          type: Number,
          default: 0,
        },
        time: {
          type: Number,
        },
      },
    ],
  },
  { strict: false }
);

const QuestionAnswer = mongoose.model("QuestionAnswer", questionAnswerSchema);
export default QuestionAnswer;
