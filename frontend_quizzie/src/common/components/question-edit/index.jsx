import React, { useEffect, useState } from "react";

import axios from "../../../api/axios";
import style from "./style.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const EditQuestion = ({ analysisId }) => {
  const [quiz, setQuiz] = useState({});
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getQuizDetail = async () => {
      try {
        const res = await axios.put("/app/getQuizById", { quizId: analysisId });
        setQuiz(res.data.quiz);
        console.log("Response", res.data.quiz);
      } catch (error) {
        console.log(error);
      }
    };
    getQuizDetail();
  }, [analysisId]);

  const handleOptionChange = (optionIndex, newValue, field) => {
    setQuiz((prevQuiz) => {
      const updatedQuiz = { ...prevQuiz };
      updatedQuiz.questionsAnswer[current].options[optionIndex][field] =
        newValue;
      return updatedQuiz;
    });
  };

  const handleQuestionTextChange = (newValue) => {
    setQuiz((prevQuiz) => {
      const updatedQuiz = { ...prevQuiz };
      updatedQuiz.questionsAnswer[current].questionText = newValue;
      return updatedQuiz;
    });
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        name: quiz.name,
        quizForms: quiz.questionsAnswer,
      };

      const res = await axios.post("/app/updateQuiz", {
        quizId: quiz._id,
        updatedData: updatedData,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/app/analytics");
      }
    } catch (error) {
      console.log("Error updating quiz", error);
    }
  };

  console.log(quiz);
  if (!quiz?._id) {
    return <h1>Loading....</h1>;
  }

  return (
    <div className={style.qzAnalysisContainer}>
      <div>
        <div>
          <input
            type="text"
            value={quiz.questionsAnswer[current].questionText}
            className={style.quiestionInput}
            onChange={(e) => handleQuestionTextChange(e.target.value)}
          />
        </div>
        <div className={style.optionContainer}>
          <h4>Options</h4>
          <div>
            {quiz.questionsAnswer[current].options.map(
              ({ _id, option, imageUrl, type }, optionIndex) => {
                return (
                  <div key={_id} className={style.optionInput}>
                    {type === "text" && (
                      <div>
                        <p>Option Text</p>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              optionIndex,
                              e.target.value,
                              "option"
                            )
                          }
                        />
                      </div>
                    )}

                    {type === "txtAndImg" && (
                      <div>
                        <p>Option Text</p>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              optionIndex,
                              e.target.value,
                              "option"
                            )
                          }
                        />
                      </div>
                    )}
                    {type !== "text" && (
                      <div>
                        <p>Image Url</p>
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={(e) =>
                            handleOptionChange(
                              optionIndex,
                              e.target.value,
                              "imageUrl"
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div className={style.buttonContainer}>
          <button
            onClick={() => {
              setCurrent((prevCurrent) =>
                prevCurrent - 1 >= 0 ? prevCurrent - 1 : 0
              );
            }}
          >
            Previous
          </button>
          <button
            onClick={() => {
              setCurrent((prevCurrent) =>
                prevCurrent < quiz.questionsAnswer.length - 1
                  ? prevCurrent + 1
                  : prevCurrent
              );
            }}
          >
            Next
          </button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;
