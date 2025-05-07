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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(document.documentElement.classList.contains("dark"));

    const updateMode = (e) => setIsDarkMode(e.matches);
    matchDark.addEventListener("change", updateMode);
    return () => matchDark.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    const rmHistory = JSON.parse(localStorage.getItem("rmHistory")) || [];
    const rmGoals = JSON.parse(localStorage.getItem("rmGoals")) || {};
    const zoneHistory = JSON.parse(localStorage.getItem("zoneRecords")) || [];

    const exerciseMap = {
      "벤치프레스": "Bench Press",
      "벤치 프레스": "Bench Press",
      "스쿼트": "Squat",
      "바벨로우": "Barbell Row",
      "데드리프트": "Deadlift",
      "오버헤드프레스": "Overhead Press",
      "오버헤드 프레스": "Overhead Press",
    };

    const grouped = {};
    rmHistory.forEach((item) => {
      const original = item.exercise?.trim();
      const key = exerciseMap[original] || original;
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

    const achieved = rmHistory.filter((r) => {
      const original = r.exercise?.trim();
      const mapped = exerciseMap[original] || original;
      const goal = rmGoals[mapped];
      return goal !== undefined && r.rm >= goal;
    }).length;

    const total = rmHistory.length;
    setGoalRate(total ? Math.round((achieved / total) * 100) : 0);
  }, []);

  const rmChartData = {
    labels: rmStats.map((s) => s.label),
    datasets: [
      {
        label: "Weekly average 1RM (kg)",
        data: rmStats.map((s) => s.avg.toFixed(1)),
        backgroundColor: isDarkMode ? "#ffffff" : "#111111",
        borderRadius: 4,
        barThickness: 28,
      },
    ],
  };

  const zoneChartData = {
    labels: Object.keys(zoneStats),
    datasets: [
      {
        label: "Zone data",
        data: Object.values(zoneStats),
        backgroundColor: isDarkMode
          ? ["#ffffff", "#bbbbbb", "#999999", "#777777", "#555555"]
          : ["#111111", "#333333", "#555555", "#777777", "#999999"],
      },
    ],
  };

  return (
    <div className="px-4 sm:px-6 py-8 space-y-8 bg-[#f9f9f9] dark:bg-[#111] text-[#111] dark:text-white min-h-screen max-w-3xl mx-auto">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Workout Insights</h1>
  
    <div className="grid gap-6">
      {/* Chart wrapper */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-semibold mb-2">Weekly average 1RM</h2>
        <div className="h-[180px] sm:h-[240px] md:h-[300px]">
          <Bar
            data={rmChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </div>
    
  
        {/* Zone Chart */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Zone Data</h2>
          <div className="h-[220px] sm:h-[260px]">
            <Doughnut
              data={zoneChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </div>
        </div>

        {/* 1RM Goal Progress */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">1RM Goal Progress</h2>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-md h-4 sm:h-5">
            <div
              className="bg-[#111] dark:bg-white h-4 sm:h-5 rounded-md transition-all"
              style={{ width: `${goalRate}%` }}
            ></div>
          </div>
          <p className="text-center text-sm sm:text-base mt-2 text-gray-700 dark:text-gray-300">
            {goalRate}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default Insight;
