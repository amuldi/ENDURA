// Dashboard.jsx - 무채색 기반 고급 스타일 라이트모드 대시보드
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
    if (rmHistory.length > 0) {
      setLastOneRM(rmHistory[0]);
    }

    const zoneHistory = JSON.parse(localStorage.getItem("zoneRecords")) || [];
    if (zoneHistory.length > 0) {
      setLastZone(zoneHistory[0]);
    }

    const rmGoals = JSON.parse(localStorage.getItem("rmGoals")) || {};
    if (rmHistory.length > 0) {
      const total = rmHistory.length;
      const achieved = rmHistory.filter((r) => r.exercise && rmGoals[r.exercise] && r.rm >= rmGoals[r.exercise]).length;
      setGoalRate(Math.round((achieved / total) * 100));
    }
  }, []);

  return (
    <div className="px-6 py-8 space-y-6 bg-white text-black min-h-screen">
      <h1 className="text-4xl font-bold text-center">REPMAX </h1>

      <div className="grid gap-6">
        <div className="bg-[#f9f9f9] border border-gray-200 rounded-xl p-6 shadow-md text-center">
          <div className="text-lg font-medium text-gray-600"></div>
          <div className="text-2xl font-bold text-gray-900">{today}</div>
        </div>

        <div className="bg-[#f9f9f9] border border-gray-200 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">최근 1RM 기록</h2>
          {lastOneRM ? (
            <div className="text-sm text-gray-800">
              {lastOneRM.date} | {lastOneRM.exercise} | {lastOneRM.rm} {lastOneRM.unit}
            </div>
          ) : (
            <p className="text-sm text-gray-400">기록 없음</p>
          )}
        </div>

        <div className="bg-[#f9f9f9] border border-gray-200 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">최근 Zone 기록</h2>
          {lastZone ? (
            <div className="text-sm text-gray-800">
              {lastZone.date} | 평균 심박수 {lastZone.heartRate}bpm → {lastZone.zone}
            </div>
          ) : (
            <p className="text-sm text-gray-400">기록 없음</p>
          )}
        </div>

        <div className="bg-[#f9f9f9] border border-gray-200 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">1RM 목표 도달률</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-black h-4 rounded-full"
              style={{ width: `${goalRate}%` }}
            ></div>
          </div>
          <p className="text-center text-sm mt-1 text-gray-700">{goalRate}% 도달</p>
        </div>

        <div className="flex justify-center gap-4">
          <a href="#" className="px-4 py-2 bg-black text-white rounded-lg font-medium">기록 보기</a>
          <a href="#" className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium">분석 보기</a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
