import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import style from "./style.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PollEdit = ({ analysisId }) => {
  const [poll, setPoll] = useState({});
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getPollDetail = async () => {
      try {
        const res = await axios.put("/app/getQuizById", { pollId: analysisId });
        setPoll(res.data.poll);
        console.log("Response", res.data.poll);
      } catch (error) {
        console.log(error);
      }
    };
    getPollDetail();
  }, [analysisId]);

  const handleOptionChange = (optionIndex, newValue, field) => {
    setPoll((prevPoll) => {
      const updatedPoll = { ...prevPoll };
      updatedPoll.polls[current].options[optionIndex][field] = newValue;
      return updatedPoll;
    });
  };

  const handlePollTextChange = (newValue) => {
    setPoll((prevPoll) => {
      const updatedPoll = { ...prevPoll };
      updatedPoll.polls[current].pollText = newValue;
      return updatedPoll;
    });
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        name: poll.name,
        pollForms: poll.polls,
      };

      const res = await axios.post("/app/updatePoll", {
        pollId: poll._id,
        updatedData: updatedData,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/app/analytics");
      }
    } catch (error) {
      console.log("Error updating poll", error);
    }
  };

  if (!poll?._id) {
    return <h1>Loading....</h1>;
  }

  return (
    <div className={style.qzAnalysisContainer}>
      <div>
        <div>
          <input
            type="text"
            value={poll.polls[current].pollText}
            className={style.pollInput}
            onChange={(e) => handlePollTextChange(e.target.value)}
          />
        </div>
        <div className={style.optionContainer}>
          <h4>Options</h4>
          <div>
            {poll.polls[current].options.map(
              ({ _id, option, imageUrl, type }, optionIndex) => (
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
              )
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
                prevCurrent < poll.polls.length - 1
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

export default PollEdit;
