import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { useParams } from "react-router-dom";

import axios from "../../api/axios";
import style from "./style.module.css";
import Shield from "../../assets/Shield.png";

const LivePoll = () => {
  const { pollId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQnIndex, setCurrentQnIndex] = useState(0);

  const [score, setScore] = useState(0);
  const [ShowScore, setShowScore] = useState(false);

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const res = await axios.post("/live-poll", { pollId });
        console.log("RES", res);
        setQuestions(res.data.data.polls);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    getQuiz();
  }, [pollId]);

  const handleNextQuestion = () => {
    if (currentQnIndex < questions.length - 1) {
      setCurrentQnIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleSubmit = async () => {
    setShowScore(true);
    try {
      await axios.put("/live-poll", { pollId, questions });
    } catch (error) {
      console.log("Error");
    }
  };

  if (questions.length === 0) {
    return (
      <div className={style.LiveQuizContainer}>
        <SyncLoader />
      </div>
    );
  }

  const handleSelectOption = (index) => {
    const selected = (questions[currentQnIndex].options[index].selected += 1);

    setQuestions((prev) => {
      const updated = [...prev];
      updated[currentQnIndex].selected = selected;
      return updated;
    });
  };

  console.log(questions);

  return (
    <div className={style.LiveQuizContainer}>
      {!ShowScore && (
        <div>
          <div className={style.timerAndNum}>
            <h3>
              Question {currentQnIndex + 1} / {questions.length}
            </h3>
          </div>
          <div className={style.quesAndOption}>
            <h3>{questions[currentQnIndex]?.pollText}</h3>
            <div className={style.optionContainer}>
              {questions[currentQnIndex]?.options.map((option, index) => {
                if (option.type === "text") {
                  return (
                    <div key={index}>
                      <button
                        className={style.optionBtn}
                        onClick={() => {
                          handleSelectOption(index);
                        }}
                      >
                        {option?.option}
                      </button>
                    </div>
                  );
                }
                if (option.type === "image") {
                  return (
                    <div key={index}>
                      <button
                        className={style.optionBtn}
                        onClick={() => {
                          handleSelectOption(index);
                        }}
                      >
                        <img
                          src={option.imageUrl}
                          alt=""
                          className="optionImage"
                        />
                      </button>
                    </div>
                  );
                }
                if (option.type === "txtAndImg") {
                  return (
                    <div key={index}>
                      <button
                        className={style.optionBtn}
                        onClick={() => {
                          handleSelectOption(index);
                        }}
                      >
                        {" "}
                        <span>{option.option}</span>
                        <img src={option.imageUrl} alt="" />
                      </button>
                    </div>
                  );
                }
              })}
            </div>
            <button
              onClick={
                currentQnIndex === questions.length - 1
                  ? handleSubmit
                  : handleNextQuestion
              }
              className={style.nextBtn}
            >
              {currentQnIndex === questions.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      )}
      {ShowScore && (
        <div className={style.scoreContainer}>
          <h1>Congrats Poll is completed</h1>
          <img src={Shield} alt="" />
        </div>
      )}
    </div>
  );
};

export default LivePoll;
