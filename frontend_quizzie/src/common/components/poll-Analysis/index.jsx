import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import style from "./style.module.css";

const PollAnalysis = ({ analysisId }) => {
  const [quiz, setQuiz] = useState([]);
  useEffect(() => {
    const getQuzzDetail = async () => {
      try {
        const res = await axios.put("/app/getQuizById", { pollId: analysisId });
        setQuiz(res.data.poll);
        console.log("Response", res.data.poll);
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
          {quiz.polls.map((questionAnswer, index) => {
            return (
              <div key={questionAnswer._id}>
                <h4>
                  Q.NO {index + 1} : {questionAnswer.pollText}
                </h4>
                <div className={style.detailContainer}>
                  {questionAnswer.options.map((option) => {
                    return (
                      <div key={option._id}>
                        <p>{option.selected}</p>
                        <p>{option.option}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PollAnalysis;
