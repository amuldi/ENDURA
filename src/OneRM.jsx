// OneRM.jsx - 목표 1RM 저장/삭제 및 전체 기능 포함
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

function OneRM() {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [goals, setGoals] = useState({});
  const [currentGoal, setCurrentGoal] = useState("");
  const [unit, setUnit] = useState("kg");
  const [filter, setFilter] = useState("all");
  const [isAchieved, setIsAchieved] = useState(false);
  const [maxRecords, setMaxRecords] = useState({});

  const exerciseMap = {
    "벤치 프레스": "Bench Press",
    "스쿼트": "Squat",
    "데드리프트": "Deadlift",
    "오버헤드 프레스": "Overhead Press",
    "바벨로우": "Barbell Row",
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem("rmHistory");
    const savedGoals = localStorage.getItem("rmGoals");
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setHistory(parsed);
      updateMaxRecords(parsed);
    }
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals);
      setGoals(parsedGoals);
    }
  }, []);

  useEffect(() => {
    if (exercise && goals[exercise]) {
      setCurrentGoal(goals[exercise]);
    } else {
      setCurrentGoal("");
    }
  }, [exercise, goals]);

  const convert = (value, toUnit) =>
    toUnit === "lb" ? value * 2.20462 : value / 2.20462;

  const updateMaxRecords = (records) => {
    const grouped = {};
    records.forEach((r) => {
      if (!grouped[r.exercise] || r.rm > grouped[r.exercise]) {
        grouped[r.exercise] = r.rm;
      }
    });
    setMaxRecords(grouped);
  };

  const handleCalculate = () => {
    if (!exercise || !weight || !reps) {
      alert("운동, 중량, 반복 수를 입력하세요.");
      return;
    }
    const w = parseFloat(weight);
    const r = parseInt(reps);
    const estimated1RM = w * (1 + r / 30);
    const finalResult = unit === "kg" ? estimated1RM : convert(estimated1RM, "lb");

    setResult(parseFloat(finalResult.toFixed(1)));

    const date = new Date().toISOString().split("T")[0];
    const newRecord = {
      exercise,
      weight: w,
      reps: r,
      rm: parseFloat(finalResult.toFixed(1)),
      date,
      unit,
    };
    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("rmHistory", JSON.stringify(updatedHistory));
    updateMaxRecords(updatedHistory);

    const goalValue = goals[exercise];
    if (goalValue && finalResult >= goalValue) {
      setIsAchieved(true);
      setTimeout(() => setIsAchieved(false), 1000);
    } else {
      setIsAchieved(false);
    }
  };

  const handleGoalSave = () => {
    if (!exercise || !currentGoal) {
      alert("운동과 목표 1RM을 입력하세요.");
      return;
    }
    const goalValue = parseFloat(currentGoal);
    const newGoals = { ...goals, [exercise]: goalValue };
    setGoals(newGoals);
    localStorage.setItem("rmGoals", JSON.stringify(newGoals));
    alert("목표 1RM 저장 완료");
  };

  const handleDeleteGoal = () => {
    if (!exercise) return;
    const updated = { ...goals };
    delete updated[exercise];
    setGoals(updated);
    localStorage.setItem("rmGoals", JSON.stringify(updated));
    setCurrentGoal("");
  };

  const now = new Date();
  const filtered = history.filter((item) => {
    const itemDate = new Date(item.date);
    if (filter === "week") return now - itemDate <= 7 * 86400000;
    if (filter === "month") return now - itemDate <= 30 * 86400000;
    return true;
  });

  const chartData = {
    labels: filtered.map((item) => item.date).reverse(),
    datasets: [
      {
        label: "1RM (kg)",
        data: filtered.map((item) => item.rm).reverse(),
        borderColor: "#000",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
    plugins: {
      annotation: {
        annotations: goals[exercise]
          ? {
              goalLine: {
                type: "line",
                yMin: goals[exercise],
                yMax: goals[exercise],
                borderColor: "#f43f5e",
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                  content: "목표 1RM",
                  enabled: true,
                  position: "start",
                  backgroundColor: "transparent",
                  color: "#f43f5e",
                },
              },
            }
          : {},
      },
    },
  };

  return (
    <div className="px-6 py-8 space-y-6 bg-white text-black min-h-screen">
      <h1 className="text-4xl font-bold text-center">1RM 계산기</h1>

      <select
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg"
      >
        <option value="">운동 종목 선택</option>
        {Object.keys(exerciseMap).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      <div className="flex gap-4">
        <input
          type="number"
          placeholder={`중량 (${unit})`}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          placeholder="반복 횟수"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg"
        />
      </div>

      <button
        onClick={handleCalculate}
        className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800"
      >
        1RM 계산
      </button>

      {result && (
        <div className="text-center text-2xl font-bold mt-4">
          예상 1RM: {result} {unit}
        </div>
      )}

      <div className="bg-[#f9f9f9] border border-gray-200 rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-2">목표 1RM 설정</h2>
        <input
          type="number"
          placeholder={`목표 1RM (${unit})`}
          value={currentGoal}
          onChange={(e) => setCurrentGoal(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleGoalSave}
            className="flex-1 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800"
          >
            목표 저장
          </button>
          {goals[exercise] && (
            <button
              onClick={handleDeleteGoal}
              className="flex-1 py-3 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100"
            >
              목표 삭제
            </button>
          )}
        </div>
      </div>

      {filtered.length > 0 && (
        <div className="bg-[#f9f9f9] border border-gray-200 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">최근 기록</h2>
          <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
            {filtered.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border border-gray-300 p-3 rounded-lg"
              >
                <span>
                  {item.date} | {item.exercise} | {item.weight} {item.unit} ×{" "}
                  {item.reps} = {item.rm} {item.unit}
                </span>
                <button
                  onClick={() => {
                    const updated = [...history];
                    updated.splice(idx, 1);
                    setHistory(updated);
                    localStorage.setItem("rmHistory", JSON.stringify(updated));
                    updateMaxRecords(updated);
                  }}
                  className="text-red-500 text-xs hover:underline"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {filtered.length > 1 && (
        <div className="bg-[#f9f9f9] border border-gray-200 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">1RM 추이</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

export default OneRM;
