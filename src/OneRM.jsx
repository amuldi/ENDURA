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
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  const convert = (value, toUnit) => (toUnit === "lb" ? value * 2.20462 : value / 2.20462);

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
    const newRecord = { exercise, weight: w, reps: r, rm: parseFloat(finalResult.toFixed(1)), date, unit };
    const updatedHistory = [newRecord, ...history];

    setHistory(updatedHistory);
    localStorage.setItem("rmHistory", JSON.stringify(updatedHistory));

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

  const handleDelete = (index) => {
    const updated = [...history];
    updated.splice(index, 1);
    setHistory(updated);
    localStorage.setItem("rmHistory", JSON.stringify(updated));
  };

  const now = new Date();
  const filtered = history.filter(item => {
    if (!exercise || item.exercise === exercise) {
      if (filter === "week") return now - new Date(item.date) <= 7 * 86400000;
      if (filter === "month") return now - new Date(item.date) <= 30 * 86400000;
      return true;
    }
    return false;
  });

  const goalLine = goals[exercise];

  const chartData = {
    labels: filtered.map(item => item.date).reverse(),
    datasets: [
      {
        label: "1RM (kg)",
        data: filtered.map(item => item.rm).reverse(),
        borderColor: "#00BFA6",
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
        annotations: goalLine
          ? {
              goalLine: {
                type: "line",
                yMin: goalLine,
                yMax: goalLine,
                borderColor: "red",
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                  content: "목표 1RM",
                  enabled: true,
                  position: "start",
                  backgroundColor: "transparent",
                  color: "red",
                },
              },
            }
          : {},
      },
    },
  };

  return (
    <div className="px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">1RM 계산기</h1>

      <select
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        className="w-full border p-3 rounded-lg bg-white text-black dark:bg-[#333] dark:text-white focus:ring-2 focus:ring-gray-400 transition"
      >
        <option value="">운동 종목 선택</option>
        {Object.keys(exerciseMap).map(key => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder={`중량 (${unit})`}
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-gray-400 transition"
      />

      <input
        type="number"
        placeholder="반복 횟수"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-gray-400 transition"
      />

      <button
        onClick={handleCalculate}
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-300"
      >
        1RM 계산
      </button>

      {result && (
        <div className="text-center text-lg font-semibold mt-6">
          {exerciseMap[exercise] || exercise} 예상 1RM: {result} {unit}
        </div>
      )}

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">목표 1RM 설정</h2>
        <input
          type="number"
          placeholder={`목표 1RM (${unit})`}
          value={currentGoal}
          onChange={(e) => setCurrentGoal(e.target.value)}
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-gray-400 transition"
        />
        <button
          onClick={handleGoalSave}
          className="w-full bg-black text-white py-3 rounded-lg mt-3 hover:bg-gray-800 active:scale-95 transition-all duration-300"
        >
          목표 저장
        </button>
      </div>

      {filtered.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">최근 기록</h2>
          <ul className="space-y-2 max-h-64 overflow-y-auto text-sm">
            {filtered.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center border p-2 rounded">
                <span>{item.date} | {item.exercise} | {item.weight} {item.unit} x {item.reps} = {item.rm} {item.unit}</span>
                <button onClick={() => handleDelete(idx)} className="text-red-500 text-xs">
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {filtered.length > 1 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">1RM 추이</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      {isAchieved && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in">
          <div className="text-white text-3xl font-bold animate-scale-up">
            목표 1RM을 달성했습니다!
          </div>
        </div>
      )}
    </div>
  );
}

export default OneRM;
