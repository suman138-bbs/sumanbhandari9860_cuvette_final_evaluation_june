import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { useParams } from "react-router-dom";

import axios from "../../api/axios";
import style from "./style.module.css";
import Shield from "../../assets/Shield.png";

const LiveQuiz = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQnIndex, setCurrentQnIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [autoNextEnabled, setAutoNextEnabled] = useState(true);
  const [score, setScore] = useState(0);
  const [ShowScore, setShowScore] = useState(false);

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const res = await axios.post("/live-quiz", { quizId });
        setQuestions(res.data.data.questionsAnswer);
        setTimer(res.data.data.questionsAnswer[0].time); // Set the timer for the first question
        setAutoNextEnabled(res.data.data.questionsAnswer[0].time > 0); // Enable auto transition if the first question has a non-zero timer
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    getQuiz();
  }, [quizId]);

  useEffect(() => {
    let timerId;

    if (timer > 0 && autoNextEnabled) {
      timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (
      timer === 0 &&
      autoNextEnabled &&
      currentQnIndex < questions.length - 1
    ) {
      setCurrentQnIndex((prevIndex) => prevIndex + 1);

      if (currentQnIndex < questions.length - 1) {
        setTimer(questions[currentQnIndex + 1].time);
        setAutoNextEnabled(questions[currentQnIndex + 1].time > 0); // Enable auto transition if the next question has a non-zero timer
      }
    }

    return () => {
      clearInterval(timerId);
    };
  }, [timer, currentQnIndex, questions, autoNextEnabled]);

  const handleNextQuestion = () => {
    if (currentQnIndex < questions.length - 1) {
      setCurrentQnIndex((prevIndex) => prevIndex + 1);

      if (currentQnIndex < questions.length - 1) {
        setTimer(questions[currentQnIndex + 1].time);
        setAutoNextEnabled(questions[currentQnIndex + 1].time > 0); // Enable auto transition if the next question has a non-zero timer
      }
    }
  };

  const handleSubmit = async () => {
    setShowScore(true);
    try {
      await axios.put("/live-quiz", { quizId, questions });
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

  const handleSelectOption = (correct) => {
    const totalAttempted = (questions[currentQnIndex].totalAttempted += 1);

    setQuestions((prev) => {
      const updated = [...prev];
      updated[currentQnIndex].totalAttempted = totalAttempted;
      return updated;
    });

    if (correct) {
      setScore(score + 1);
      const correctAttempted = (questions[
        currentQnIndex
      ].correctAttempted += 1);

      setQuestions((prev) => {
        const updated = [...prev];
        updated[currentQnIndex].correctAttempted = correctAttempted;
        return updated;
      });
    } else {
      const incorrectAttempted = (questions[
        currentQnIndex
      ].incorrectAttempted += 1);

      setQuestions((prev) => {
        const updated = [...prev];
        updated[currentQnIndex].incorrectAttempted = incorrectAttempted;
        return updated;
      });
    }
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
            <h3>{timer}S</h3>
          </div>
          <div className={style.quesAndOption}>
            <h3>{questions[currentQnIndex]?.questionText}</h3>
            <div className={style.optionContainer}>
              {questions[currentQnIndex]?.options.map((option, index) => {
                if (option.type === "text") {
                  return (
                    <div key={index}>
                      <button
                        className={style.optionBtn}
                        onClick={() => {
                          handleSelectOption(option.isCorrect);
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
                          handleSelectOption(option.isCorrect);
                        }}
                      >
                        <img src={option.imageUrl} alt="" />
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
                          handleSelectOption(option.isCorrect);
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
          <h1>Congrats Quiz is completed</h1>
          <img src={Shield} alt="" />
          <h1>
            Your Score is{" "}
            <span>
              0{score}/0{questions.length}
            </span>
          </h1>
        </div>
      )}
    </div>
  );
};

export default LiveQuiz;
