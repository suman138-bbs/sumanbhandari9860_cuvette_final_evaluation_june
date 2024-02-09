import { useNavigate } from "react-router-dom";
import style from "./style.module.css";
import { useState } from "react";
import { toast } from "react-toastify";

import QuestionAnsForm from "../../common/components/question-Answer-form";
import PollForm from "../../common/components/poll-form";

const CreateQuiz = () => {
  const [step, setStep] = useState(1);
  const [quizType, setQuizType] = useState("");
  const [quizName, setQuizName] = useState("");

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/app/dashboard");
    /**I may change in future */
  };

  const handleQuizType = (type) => {
    setQuizType(type);
  };

  const handleNextStep = () => {
    if (!quizName) {
      toast.error("Please Provide Quiz Name");
      return;
    }
    if (!quizType) {
      toast.error("Please Provide Quiz Type Also");
      return;
    }
    if (quizName !== 2) {
      setStep(step + 1);
    }
  };

  return (
    <div className={style.createQuizContainer}>
      {step === 1 && (
        <div>
          <div className={style.quizInput}>
            <input
              type="text"
              name=""
              id=""
              placeholder="Quiz name"
              onChange={(e) => {
                setQuizName(e.target.value);
              }}
            />
          </div>
          <div>
            <h4>Quiz Type</h4>
            {["Q&A", "poll"].map((type) => (
              <button
                key={type}
                className={quizType === type ? style.selected : ""}
                onClick={() => handleQuizType(type)}
              >
                {type}
              </button>
            ))}
          </div>
          <div>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleNextStep}>Continue</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          {quizType === "Q&A" && <QuestionAnsForm name={quizName} />}
          {quizType === "poll" && <PollForm name={quizName} />}
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
