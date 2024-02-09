import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import style from "./style.module.css";
import axios from "../../api/axios";
import DeleteIcon from "../../assets/deleteIcon.svg";
import EditIcon from "../../assets/EditIcon.svg";
import ShareIcon from "../../assets/shareIcon.svg";
import PollAnalysis from "../../common/components/poll-Analysis";
import QestionAnalysis from "../../common/components/quiz-analysis";
import EditQuestion from "../../common/components/question-edit";
import EditPoll from "../../common/components/poll-edit";

const Analytics = () => {
  const [quizCounter, setQuizCounter] = useState(0);
  const [pollCounter, setPollCounter] = useState(0);
  const [quizes, setQuizes] = useState([]);
  const [polls, setPolls] = useState([]);
  const [dlt, setDlt] = useState({ id: "", type: "" });
  const [analysisType, setAnalysisType] = useState("");
  const [analysisId, setAnalysisId] = useState("");
  const [edit, setEdit] = useState("");

  useEffect(() => {
    const getAllQuiz = async () => {
      try {
        const res = await axios.get("/app/getAllQNA");
        console.log(res.data);
        setQuizes(res.data.quizzes);
        setQuizCounter(res.data.quizzes.length);
      } catch (error) {
        console.log("ERROR");
      }
    };
    getAllQuiz();
  }, []);
  useEffect(() => {
    const getAllPoll = async () => {
      try {
        const res = await axios.get("/poll/getAllPoll");
        setPolls(res.data.polls);
        setPollCounter(res.data.polls.length);
      } catch (error) {
        console.log("ERROR", error);
      }
    };
    getAllPoll();
  }, []);

  const handleShare = (id, type) => {
    const url = type === "quiz" ? "live-quiz" : "live-poll";
    const itemURL = `${`https://quizzie123.netlify.app/`}${url}/${id}`;
    navigator.clipboard
      .writeText(itemURL)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch((error) => {
        toast.error("Error copying to clipboard");
      });
  };

  const handleDelete = (id, type) => {
    setDlt({ id, type });
  };

  const handleConfirmDelete = async () => {
    try {
      if (dlt.type === "quiz") {
        const res = await axios.put("app/deleteQuiz", { quizId: dlt.id });
        toast.success(res.data.message);
      } else if (dlt.type === "poll") {
        const res = await axios.put("poll/deletePoll", { pollId: dlt.id });
        toast.success(res.data.message);
      }

      if (dlt.type === "quiz") {
        setQuizes((prevQuizes) =>
          prevQuizes.filter((quiz) => quiz._id !== dlt.id)
        );
        setQuizCounter((prevCounter) => prevCounter - 1);
      } else if (dlt.type === "poll") {
        setPolls((prevPolls) =>
          prevPolls.filter((poll) => poll._id !== dlt.id)
        );
        setPollCounter((prevCounter) => prevCounter - 1);
      }
      setDlt({ id: "", type: "" });
    } catch (error) {
      console.log("ERROR");
    }
  };

  const handleCancel = () => {
    setDlt({ id: "", type: "" });
  };

  const handleAnalysis = (id, type) => {
    setAnalysisType(type);
    setAnalysisId(id);
  };
  const handleEdit = (id, type) => {
    console.log(id, type);

    setEdit(type);
    setAnalysisId(id);
  };
  return (
    <>
      {edit === "quiz" && <EditQuestion analysisId={analysisId} />}
      {edit === "poll" && <EditPoll analysisId={analysisId} />}
      {analysisType === "poll" && <PollAnalysis analysisId={analysisId} />}
      {analysisType === "quiz" && <QestionAnalysis analysisId={analysisId} />}
      {analysisType !== "poll" &&
        analysisType !== "quiz" &&
        edit !== "quiz" &&
        edit !== "poll" && (
          <div className={style.analyticsContainer}>
            <h1>Quiz Analysis</h1>
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Created on</th>
                  <th>Impression</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {quizes.map((quiz, index) => (
                  <tr key={quiz._id}>
                    <td>{index + 1}</td>
                    <td>{quiz.name}</td>
                    <td>{quiz.createdDate.split("T")[0]}</td>
                    <td>{quiz.impression}</td>
                    <td>
                      <img
                        src={EditIcon}
                        alt=""
                        onClick={() => {
                          handleEdit(quiz._id, "quiz");
                        }}
                      />
                      <img
                        src={DeleteIcon}
                        alt=""
                        onClick={() => {
                          handleDelete(quiz._id, "quiz");
                        }}
                      />
                      <img
                        src={ShareIcon}
                        alt=""
                        onClick={() => {
                          handleShare(quiz._id, "quiz");
                        }}
                      />
                    </td>
                    <td
                      onClick={() => {
                        handleAnalysis(quiz._id, "quiz");
                      }}
                    >
                      Question Wise Analysis
                    </td>
                  </tr>
                ))}
                {polls.map((poll, index) => (
                  <tr key={poll._id}>
                    <td>{quizCounter + index + 1}</td>
                    <td>{poll.name}</td>
                    <td>{poll.createdDate.split("T")[0]}</td>
                    <td>{poll.impression}</td>
                    <td>
                      <img
                        src={EditIcon}
                        alt=""
                        onClick={() => {
                          handleEdit(poll._id, "poll");
                        }}
                      />
                      <img
                        src={DeleteIcon}
                        alt=""
                        onClick={() => {
                          handleDelete(poll._id, "poll");
                        }}
                      />
                      <img
                        src={ShareIcon}
                        alt=""
                        onClick={() => {
                          handleShare(poll._id, "poll");
                        }}
                      />
                    </td>
                    <td
                      onClick={() => {
                        handleAnalysis(poll._id, "poll");
                      }}
                    >
                      Question Wise Analysis
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {dlt.id && (
              <div className={style.createDeleteContainer}>
                <div>
                  <h1>Are you confirm you want to delete ?</h1>
                  <div>
                    <button onClick={handleConfirmDelete}>
                      Confirm Delete
                    </button>
                    <button onClick={handleCancel}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
    </>
  );
};

export default Analytics;
