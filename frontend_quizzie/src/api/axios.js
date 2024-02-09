import axios from "axios";

export default axios.create({
  baseURL: "https://quizzieb.onrender.com/",
  withCredentials: true,
});
