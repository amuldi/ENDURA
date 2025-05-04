// Insight.jsx - 네모형 세련된 분석화면 리디자인
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
      const key = item.exercise
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
        backgroundColor: "#111",
        borderRadius: 4,
        barThickness: 28,
      },
    ],
  };

  const zoneChartData = {
    labels: Object.keys(zoneStats),
    datasets: [
      {
        label: "Zone 분포",
        data: Object.values(zoneStats),
        backgroundColor: ["#111", "#333", "#555", "#777", "#999"],
      },
    ],
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#f9f9f9] dark:bg-[#111] text-[#111] dark:text-white min-h-screen max-w-3xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-center">운동 분석</h1>

      <div className="grid gap-8">
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white-700 rounded-md p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-2"> 주간 평균 1RM</h2>
          <div className="h-[220px] sm:h-[280px]">
            <Bar data={rmChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white-700 rounded-md p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Zone 분포</h2>
          <div className="h-[220px] sm:h-[260px]">
            <Doughnut data={zoneChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white-700 rounded-md p-6 shadow-sm">
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

export default Insight;
