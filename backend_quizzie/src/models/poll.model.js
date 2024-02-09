import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
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

    polls: [
      {
        pollText: {
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
            selected: {
              type: Number,
              default: 0,
            },
            imageUrl: {
              type: String,
            },
          },
        ],
      },
    ],
  },
  { strict: false }
);

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;
