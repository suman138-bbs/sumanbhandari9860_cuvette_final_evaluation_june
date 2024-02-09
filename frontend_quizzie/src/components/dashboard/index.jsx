import { useEffect, useState } from "react";

import style from "./style.module.css";
import axios from "../../api/axios";
import EyeIcon from "../../assets/eyeIcon.svg";

const Dashboard = () => {
  const [quiz, setQuiz] = useState(0);
  const [poll, setPoll] = useState(0);
  const [impression, setImpression] = useState(0);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    const getTotal = async () => {
      try {
        const res = await axios.get("/app/getTotal");
        setQuiz(res.data.totalQuizzes);
        setPoll(res.data.totalPolls);
        setImpression(
          res.data.totalQuizImpressions + res.data.totalPollImpressions
        );
      } catch (error) {
        console.log("ERROR", error);
      }
    };
    getTotal();
  }, []);

  useEffect(() => {
    const getTreanding = async () => {
      try {
        const res = await axios.get("/app/getTrending");
        setTrends([...res.data.trendingQuizzes, ...res.data.trendingPolls]);
      } catch (error) {
        console.log(error);
      }
    };
    getTreanding();
  }, []);

  return (
    <div className={style.main}>
      <div className={style.quizAndtred}>
        <div className={style.total}>
          <div>
            <div>
              <h1>{quiz}</h1>
              <h3>Quizs</h3>
            </div>
            <h3>Created</h3>
          </div>
          <div>
            <div>
              <h1>{poll}</h1>
              <h3>Polls</h3>
            </div>
            <h3>Created</h3>
          </div>
          <div>
            <div>
              <h1>{impression}</h1>
              <h3>Total</h3>
            </div>
            <h3>Impressions</h3>
          </div>
        </div>
        <div className={style.quizContainer}>
          <h1>Trending Quizs</h1>
          <div>
            {trends.length > 0 ? (
              trends.map((trend) => {
                return (
                  <div key={trend?.id} className={style.trendingContainer}>
                    <div>
                      <h4>{trend.name}</h4>
                      <div>
                        <p>{trend.impression}</p>
                        <img src={EyeIcon} alt="" />
                      </div>
                    </div>
                    <div>
                      <p>Created on : {trend.createdDate.split("T")[0]}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No Treading Quiz</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
