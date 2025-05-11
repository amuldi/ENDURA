import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [today, setToday] = useState("");
  const [lastOneRM, setLastOneRM] = useState(null);
  const [goalRate, setGoalRate] = useState(0);
  const [bestPR, setBestPR] = useState(null);
  const [bestPRsByExercise, setBestPRsByExercise] = useState([]);
  const [rmGoals, setRmGoals] = useState({});
  const [rmHistory, setRmHistory] = useState([]);

  const exerciseMap = {
    "벤치프레스": "Bench Press",
    "벤치 프레스": "Bench Press",
    "스쿼트": "Squat",
    "바벨로우": "Barbell Row",
    "데드리프트": "Deadlift",
    "오버헤드프레스": "Overhead Press",
    "오버헤드 프레스": "Overhead Press",
  };

  useEffect(() => {
    const dateObj = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    setToday(dateObj.toLocaleDateString("en-US", options));

    const rmHistoryData = JSON.parse(localStorage.getItem("rmHistory")) || [];
    const rmGoalsData = JSON.parse(localStorage.getItem("rmGoals")) || {};

        // Insert latest calculated 1RM if present and not already in history
    const latestOneRM = JSON.parse(localStorage.getItem("latestOneRM"));
    if (
      latestOneRM &&
      (!rmHistoryData.length ||
        rmHistoryData[0].rm !== latestOneRM.rm ||
        rmHistoryData[0].exercise !== latestOneRM.exercise)
    ) {
      rmHistoryData.unshift(latestOneRM);
    }

    setRmHistory(rmHistoryData);
    setRmGoals(rmGoalsData);

    if (rmHistoryData.length > 0) {
      setLastOneRM(rmHistoryData[0]);

      const total = rmHistoryData.length;
      const achieved = rmHistoryData.filter((r) => {
        const original = r.exercise?.trim();
        const mapped = exerciseMap[original] || original;
        const goal = rmGoalsData[mapped];
        return goal !== undefined && r.rm >= goal;
      }).length;

      setGoalRate(Math.round((achieved / total) * 100));

      const pr = rmHistoryData.reduce((max, cur) => (cur.rm > max.rm ? cur : max), rmHistoryData[0]);
      setBestPR(pr);

      const bestMap = {};
      rmHistoryData.forEach((r) => {
        const original = r.exercise?.trim();
        const mapped = exerciseMap[original] || original;
        if (!bestMap[mapped] || r.rm > bestMap[mapped].rm) {
          bestMap[mapped] = { ...r, exercise: mapped };
        }
      });
      const bestArr = Object.values(bestMap).sort((a, b) => a.exercise.localeCompare(b.exercise));
      setBestPRsByExercise(bestArr);
    }
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#f9f9f9] dark:bg-[#111] text-[#111] dark:text-white min-h-screen max-w-3xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-center">SU’REN</h1>

      <div className="grid gap-6">
        {/* 오늘 날짜 */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm text-center space-y-1">
          <p className="text-xl sm:text-2xl font-semibold">{today}</p>
        </div>

        {/* 최근 기록 */}
        <div
          onClick={() => navigate("/one-rm")}
          className="cursor-pointer bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm hover:shadow-md transition"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Last Lift</h2>
          {lastOneRM ? (
            <div className="bg-gray-100 dark:bg-[#222] p-3 rounded-md text-center">
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                {new Date(lastOneRM.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}&nbsp;&nbsp;&nbsp;
                {lastOneRM.exercise}&nbsp;&nbsp;:&nbsp;&nbsp;{lastOneRM.rm} {lastOneRM.unit}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No Record</p>
          )}
        </div>

        {/* 종목별 최고 기록 */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Top Records</h2>
          {bestPRsByExercise.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {bestPRsByExercise.map((pr) => (
                <div key={pr.exercise} className="bg-gray-100 dark:bg-[#222] rounded-md p-3 text-sm text-center">
                  <div className="font-medium">{pr.exercise}</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {pr.rm} {pr.unit}<br />
                    {new Date(pr.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No PR record yet.</p>
          )}
        </div>

        {/* 종목별 목표 달성률 */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Goal Progress</h2>
          {(() => {
            const progressColors = ["bg-green-500", "bg-blue-500", "bg-pink-500", "bg-yellow-500", "bg-purple-500"];
            const allExercises = Array.from(new Set(rmHistory.map(r => exerciseMap[r.exercise?.trim()] || r.exercise?.trim())));
            return allExercises.map((exercise, index) => {
              const goal = rmGoals[exercise];
              const records = rmHistory.filter((r) => {
                const original = r.exercise?.trim();
                const mapped = exerciseMap[original] || original;
                return mapped === exercise;
              });
              const achieved = goal !== undefined ? records.filter((r) => r.rm >= goal).length : 0;
              const progress = goal !== undefined && records.length ? Math.round((achieved / records.length) * 100) : 0;
              const barColor = progressColors[index % progressColors.length];

              return (
                <div key={exercise} className="mb-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                    {exercise} {goal === undefined && <span className="text-xs text-gray-400">(No goal set)</span>}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-md h-3">
                    <div
                      className={`h-3 rounded-md transition-all ${barColor}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right text-gray-500 dark:text-gray-400">{goal !== undefined ? `${progress}%` : "No goal"}</p>
                </div>
              );
            });
          })()}
        </div>

        {/* AI 피드백 */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">AI Feedback</h2>
          {lastOneRM ? (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {lastOneRM.rm < (bestPR?.rm ?? 0)
                ? `You recently lifted ${lastOneRM.rm} ${lastOneRM.unit}, which is below your PR of ${bestPR.rm}. Consider pushing a bit more next time!`
                : `Great job! You're matching or exceeding your PR.`}
            </p>
          ) : (
            <p className="text-sm text-gray-400">No recent record to analyze.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;