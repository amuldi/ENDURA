// Dashboard.jsx - 네모형 + 세련된 반응형 리디자인 + 카드 클릭 시 상세 페이지 이동
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [today, setToday] = useState("");
  const [lastOneRM, setLastOneRM] = useState(null);
  const [lastZone, setLastZone] = useState(null);
  const [goalRate, setGoalRate] = useState(0);

  useEffect(() => {
    const dateObj = new Date();
const options = { year: "numeric", month: "long", day: "numeric" };
const formatted = dateObj.toLocaleDateString("en-US", options); // → May 6, 2025
setToday(formatted);


    const rmHistory = JSON.parse(localStorage.getItem("rmHistory")) || [];
    if (rmHistory.length > 0) setLastOneRM(rmHistory[0]);

    const zoneHistory = JSON.parse(localStorage.getItem("zoneRecords")) || [];
    if (zoneHistory.length > 0) setLastZone(zoneHistory[0]);

    const rmGoals = JSON.parse(localStorage.getItem("rmGoals")) || {};
    if (rmHistory.length > 0) {
      const total = rmHistory.length;
      const achieved = rmHistory.filter(
        (r) => r.exercise && rmGoals[r.exercise] && r.rm >= rmGoals[r.exercise]
      ).length;
      setGoalRate(Math.round((achieved / total) * 100));
    }
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#f9f9f9] dark:bg-[#111] text-[#111] dark:text-white min-h-screen max-w-3xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-center">ENDURA</h1>

      <div className="grid gap-6">
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm text-center space-y-1">
          <p className="text-xl sm:text-2xl font-semibold">{today}</p>
        </div>

        <div
          onClick={() => navigate("/one-rm")}
          className="cursor-pointer bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm hover:shadow-md transition"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Recent 1RM Record</h2>
          {lastOneRM ? (
   <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
   {new Date(lastOneRM.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}&nbsp;&nbsp;&nbsp;
   {lastOneRM.exercise}&nbsp;&nbsp;:&nbsp;&nbsp;{lastOneRM.rm} {lastOneRM.unit}
 </p>
 
          
          ) : (
            <p className="text-sm text-gray-400">No Record</p>
          )}
        </div>

        <div
          onClick={() => navigate("/zone")}
          className="cursor-pointer bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm hover:shadow-md transition"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Recent Zone Record</h2>
          {lastZone ? (
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
        {new Date(lastZone.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        &nbsp;&nbsp; {lastZone.heartRate}bpm → {lastZone.zone}
      </p>
      
          ) : (
            <p className="text-sm text-gray-400">NO Record</p>
          )}
        </div>

        <div
          onClick={() => navigate("/insight")}
          className="cursor-pointer bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm hover:shadow-md transition"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-2">1RM Goal Progress</h2>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-md h-4 sm:h-5">
            <div
              className="bg-[#111] dark:bg-white h-4 sm:h-5 rounded-md transition-all"
              style={{ width: `${goalRate}%` }}
            ></div>
          </div>
          <p className="text-center text-sm sm:text-base mt-2 text-gray-700 dark:text-gray-300">{goalRate}% </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;