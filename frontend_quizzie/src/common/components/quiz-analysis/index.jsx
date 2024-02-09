import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import style from "./style.module.css";

const QestionAnalysis = ({ analysisId }) => {
  const [quiz, setQuiz] = useState([]);
  useEffect(() => {
    const getQuzzDetail = async () => {
      try {
        const res = await axios.put("/app/getQuizById", { quizId: analysisId });
        setQuiz(res.data.quiz);
        console.log("Response", res.data.quiz);
      } catch (error) {
        console.log(error);
      }
    };
    getQuzzDetail();
  }, []);

  if (!quiz?._id) {
    return <h1>Loading....</h1>;
  }

  return (
    <div className={style.qzAnalysisContainer}>
      <div>
        <h4>{quiz.name} Analysis</h4>;
        <div>
          {quiz.questionsAnswer.map((questionAnswer, index) => {
            return (
              <div key={questionAnswer._id}>
                <h4>
                  Q.NO {index + 1} : {questionAnswer.questionText}
                </h4>
                <div className={style.detailContainer}>
                  <div>
                    <p>{questionAnswer.totalAttempted}</p>
                    <p>People Attempted the question</p>
                  </div>
                  <div>
                    <p>{questionAnswer.correctAttempted}</p>
                    <p>People Answered Correctly</p>
                  </div>
                  <div>
                    <p>{questionAnswer.incorrectAttempted}</p>
                    <p>people Answered Incorrectly</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QestionAnalysis;
