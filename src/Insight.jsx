// Insight.jsx - Zone 분포 그래프 색상 복원
import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Insight() {
  const [rmStats, setRmStats] = useState([]);
  const [zoneStats, setZoneStats] = useState({});
  const [goalRate, setGoalRate] = useState(0);

  useEffect(() => {
    const rmHistory = JSON.parse(localStorage.getItem("rmHistory")) || [];
    const rmGoals = JSON.parse(localStorage.getItem("rmGoals")) || {};
    const zoneHistory = JSON.parse(localStorage.getItem("zoneRecords")) || [];

    const grouped = {};
    rmHistory.forEach((item) => {
      const date = new Date(item.date);
      const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      const key = `${item.exercise}-${week}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item.rm);
    });
    const stats = Object.entries(grouped).map(([label, list]) => ({
      label,
      avg: list.reduce((a, b) => a + b, 0) / list.length,
    }));
    setRmStats(stats);

    const zoneCounts = {};
    zoneHistory.forEach((r) => {
      zoneCounts[r.zone] = (zoneCounts[r.zone] || 0) + 1;
    });
    setZoneStats(zoneCounts);

    const achieved = rmHistory.filter(
      (r) => r.exercise && rmGoals[r.exercise] && r.rm >= rmGoals[r.exercise]
    ).length;
    const total = rmHistory.length;
    setGoalRate(total ? Math.round((achieved / total) * 100) : 0);
  }, []);

  const rmChartData = {
    labels: rmStats.map((s) => s.label),
    datasets: [
      {
        label: "평균 1RM (kg)",
        data: rmStats.map((s) => s.avg.toFixed(1)),
        backgroundColor: "#333",
      },
    ],
  };

  const zoneChartData = {
    labels: Object.keys(zoneStats),
    datasets: [
      {
        label: "Zone 분포",
        data: Object.values(zoneStats),
        backgroundColor: [
          "#A7F3D0", // Zone 1 - 연한 초록
          "#6EE7B7", // Zone 2 - 중간 초록
          "#34D399", // Zone 3 - 진한 초록
          "#10B981", // Zone 4 - 짙은 초록
          "#059669"  // Zone 5 - 어두운 초록
        ],
      },
    ],
  };

  return (
    <div className="px-6 py-8 space-y-8 bg-white text-black min-h-screen">
      <h1 className="text-4xl font-bold text-center"> 성과 분석</h1>

      <div className="grid gap-8">
        <div className="bg-[#f9f9f9] border border-gray-200 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">운동별 주간 평균 1RM</h2>
          <Bar data={rmChartData} options={{ responsive: true }} />
        </div>

        <div className="bg-[#f9f9f9] border border-gray-200 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Zone 분포</h2>
          <Doughnut data={zoneChartData} options={{ responsive: true }} />
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
      </div>
    </div>
  );
}

export default Insight;
