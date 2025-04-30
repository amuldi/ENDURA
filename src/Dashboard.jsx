// Dashboard.jsx - 네모형 + 세련된 반응형 리디자인
import React, { useEffect, useState } from "react";

function Dashboard() {
  const [today, setToday] = useState("");
  const [lastOneRM, setLastOneRM] = useState(null);
  const [lastZone, setLastZone] = useState(null);
  const [goalRate, setGoalRate] = useState(0);

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setToday(date);

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
      <h1 className="text-3xl sm:text-4xl font-bold text-center">REPMAX</h1>

      <div className="grid gap-6">
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm text-center space-y-1">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400"></p>
          <p className="text-xl sm:text-2xl font-semibold">{today}</p>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">최근 1RM 기록</h2>
          {lastOneRM ? (
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              {lastOneRM.date}  {lastOneRM.exercise} : {lastOneRM.rm} {lastOneRM.unit}
            </p>
          ) : (
            <p className="text-sm text-gray-400">기록 없음</p>
          )}
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">최근 Zone 기록</h2>
          {lastZone ? (
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              {lastZone.date}  평균 심박수 {lastZone.heartRate}bpm → {lastZone.zone}
            </p>
          ) : (
            <p className="text-sm text-gray-400">기록 없음</p>
          )}
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">1RM 목표 도달률</h2>
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
