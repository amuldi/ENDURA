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
  const [goalRate, setGoalRate] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [goalProgressData, setGoalProgressData] = useState([]);
  const [trendMessages, setTrendMessages] = useState([]);
  const [aiSummaries, setAiSummaries] = useState([]);

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

    const achieved = rmHistory.filter((r) => {
      const original = r.exercise?.trim();
      const mapped = exerciseMap[original] || original;
      const goal = rmGoals[mapped];
      return goal !== undefined && r.rm >= goal;
    }).length;

    const total = rmHistory.length;
    setGoalRate(total ? Math.round((achieved / total) * 100) : 0);

    // 🎯 종목별 목표 달성률 도넛 그래프 데이터 계산
    const progressData = Object.entries(grouped).map(([exercise, rms]) => {
      const goal = rmGoals[exercise];
      if (!goal) return null;
      const achievedCount = rms.filter((rm) => rm >= goal).length;
      const percentage = rms.length ? Math.round((achievedCount / rms.length) * 100) : 0;
      return { exercise, percentage };
    }).filter(Boolean);
    setGoalProgressData(progressData);

    // 📈 종목별 최근 기록 추세 메시지 계산
    const trendMsgs = Object.entries(grouped).map(([exercise, rms]) => {
      const lastThree = rms.slice(-3);
      if (lastThree.length < 3) return { exercise, trend: "Stable" };
      const diffs = [lastThree[1] - lastThree[0], lastThree[2] - lastThree[1]];
      const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      let trend = "Stable";
      if (avgDiff > 0.5) trend = "Progress";
      else if (avgDiff < -0.5) trend = "Regressing";
      return { exercise, trend };
    });
    setTrendMessages(trendMsgs);

    // 🧠 AI 통계 메시지 요약 생성 (랜덤 문구 선택)
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const progressMessages = [
      "Steady improvement in recent weeks.",
      "Great work! You're making gains.",
      "Progressing well—keep it going!",
    ];
    const stableMessages = [
      "Performance is consistent. Stay focused!",
      "Holding steady. Maintain the routine.",
      "Stable progress—nice and controlled.",
    ];
    const regressingMessages = [
      "Performance has dipped. Consider reviewing your form.",
      "Regression detected rest or adjust your plan.",
      "You're losing ground. Reflect and refocus.",
    ];
    const summaries = trendMsgs.map(({ exercise, trend }) => {
      let message = "";
      if (trend === "Progress") {
        message = `${exercise}: ${pick(progressMessages)}`;
      } else if (trend === "Stable") {
        message = `${exercise}: ${pick(stableMessages)}`;
      } else if (trend === "Regressing") {
        message = `${exercise}: ${pick(regressingMessages)}`;
      }
      return { exercise, message };
    });
    setAiSummaries(summaries);

  }, []);

  const rmChartData = {
    labels: rmStats.map((s) => s.label),
    datasets: [
      {
        label: "Weekly average 1RM (kg)",
        data: rmStats.map((s) => s.avg.toFixed(1)),
        backgroundColor: [
          "#4ade80", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa", "#f472b6", "#34d399"
        ],
        borderRadius: 4,
        barThickness: 28,
      },
    ],
  };

  const doughnutData = {
    labels: goalProgressData.map((d) => d.exercise),
    datasets: [
      {
        label: "% Goal Achieved",
        data: goalProgressData.map((d) => d.percentage),
        backgroundColor: [
          "#4ade80",
          "#60a5fa",
          "#fbbf24",
          "#f87171",
          "#a78bfa",
          "#f472b6",
          "#34d399",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="px-4 sm:px-6 py-8 space-y-8 bg-[#f9f9f9] dark:bg-[#111] text-[#111] dark:text-white min-h-screen max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Insights</h1>

      <div className="grid gap-6">
        {/* Chart wrapper */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-4 sm:p-6 shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Averages</h2>
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

        {/* 🎯 Goal Achievement by Exercise 도넛 그래프 */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-4 sm:p-6 shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Goals</h2>
          <div className="h-[180px] sm:h-[240px] md:h-[300px]">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "right", labels: { color: isDarkMode ? "#fff" : "#111" } },
                },
              }}
            />
          </div>
        </div>

        {/* 📈 Recent Performance Trends 메시지 */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-4 sm:p-6 shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Trends</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {trendMessages.map(({ exercise, trend }) => (
              <div key={exercise} className="bg-gray-100 dark:bg-[#222] rounded-md p-3 text-sm text-center">
                <div className="font-medium">{exercise}</div>
                <div className="text-gray-500 dark:text-gray-400">{trend}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 🧠 AI Summary */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-4 sm:p-6 shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold mb-2">AI Notes</h2>
          <div className="space-y-2 text-sm">
            {aiSummaries.map(({ exercise, message }) => (
              <div key={exercise} className="bg-gray-100 dark:bg-[#222] rounded-md p-3">{message}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Insight;
