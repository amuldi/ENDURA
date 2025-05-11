// OneRM.jsx - 커스텀 드롭다운으로 운동 종목 선택 구현 (펼침/닫힘 아이콘 포함)
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
  const [exerciseDropdownOpen, setExerciseDropdownOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [goals, setGoals] = useState({});
  const [currentGoal, setCurrentGoal] = useState("");
  const [unit, setUnit] = useState("kg");
  const [filter, setFilter] = useState("all");
  const [isAchieved, setIsAchieved] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const exerciseMap = {
    "Bench Press": "Bench Press",
    "Squat": "Squat",
    "Deadlift": "Deadlift",
    "Overhead Press": "Overhead Press",
    "Barbell Row": "Barbell Row",
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem("rmHistory");
    const savedGoals = localStorage.getItem("rmGoals");

    if (savedHistory) setHistory(JSON.parse(savedHistory));
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

  const handleCalculate = () => {
    if (!exercise || !weight || !reps) {
      alert("Enter your exercise, weight, and reps");
      return;
    }

    const w = parseFloat(weight);
    const r = parseInt(reps);
    const estimated1RM = w * (1 + r / 30);
    const finalResult = unit === "kg" ? estimated1RM : convert(estimated1RM, "lb");

    setResult(parseFloat(finalResult.toFixed(1)));
    setCurrentGoal(goals[exercise] || "");
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

    const goalValue = goals[exercise];
    if (goalValue && finalResult >= goalValue) {
      setIsAchieved(true);
      setTimeout(() => setIsAchieved(false), 1000);
    } else {
      setIsAchieved(false);
    }
  };

  const handleGoalSave = () => {
    if (!exercise) {
      alert("Select an exercise");
      return;
    }

    const goalValue = parseFloat(currentGoal);
    if (isNaN(goalValue) || goalValue <= 0) {
      alert("Enter your target 1RM");
      return;
    }

    const newGoals = { ...goals, [exercise]: goalValue };
    setGoals(newGoals);
    localStorage.setItem("rmGoals", JSON.stringify(newGoals));
    alert("Save complete");
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
        borderColor: "#111",
        backgroundColor: "#ddd",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10 bg-[#f9f9f9] dark:bg-[#111] text-[#111] dark:text-white min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold text-center">1RM Tracker</h1>

      {isAchieved && (
        <div className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-md p-4 text-center font-semibold animate-fade-in">
          Goal 1RM reached
        </div>
      )}

      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm hover:shadow-md transition">
        <h2 className="text-lg font-semibold mb-4"></h2>

        {/* 커스텀 드롭다운 */}
        <div className="mb-4">
          <button
            onClick={() => setExerciseDropdownOpen((prev) => !prev)}
            className="w-full text-left py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1a1a] text-sm sm:text-base font-semibold flex justify-between items-center hover:bg-gray-100 dark:hover:bg-[#222] transition"
          >
            <span>{exercise || "Exercise"}</span>
            <span className="text-lg">{exerciseDropdownOpen ? "▴" : "▾"}</span>
          </button>

          {exerciseDropdownOpen && (
            <ul className="mt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1a1a] shadow-sm max-h-60 overflow-y-auto">
              {Object.keys(exerciseMap).map((key) => (
                <li
                  key={key}
                  onClick={() => {
                    setExercise(key);
                    setExerciseDropdownOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-[#333] ${exercise === key ? "bg-gray-100 dark:bg-[#222] font-bold" : ""}`}
                >
                  {key}
                </li>
              ))}
            </ul>
          )}
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            placeholder={`Weight (${unit})`}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md bg-white dark:bg-[#1a1a1a] text-sm sm:text-base transition focus:outline-none focus:ring-2 focus:ring-[#111] dark:focus:ring-white"
          />
          <input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md bg-white dark:bg-[#1a1a1a] text-sm sm:text-base transition focus:outline-none focus:ring-2 focus:ring-[#111] dark:focus:ring-white"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-3 bg-[#111] dark:bg-white text-white dark:text-black rounded-md text-sm sm:text-base font-semibold hover:opacity-90 hover:scale-[1.01] active:scale-95 transition duration-200"
        >
          Calculate
        </button>
      </div>

      {result !== null && (
        <div className="text-center text-2xl sm:text-3xl font-bold mt-2 transition-opacity animate-fade-in">
          Estimated 1RM: {result} {unit}
        </div>
      )}

      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm hover:shadow-md transition">
        <h2 className="text-lg font-semibold mb-2">Goal </h2>
        <input
          type="number"
          placeholder={`Target 1RM (${unit})`}
          value={currentGoal}
          onChange={(e) => setCurrentGoal(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md bg-white dark:bg-[#1a1a1a] text-sm transition focus:outline-none focus:ring-2 focus:ring-[#111] dark:focus:ring-white"
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleGoalSave}
            className="flex-1 py-3 bg-[#111] dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:opacity-90 hover:scale-[1.01] active:scale-95 transition duration-200"
          >
             Save
          </button>
          {goals[exercise] && (
            <button
              onClick={handleDeleteGoal}
              className="flex-1 py-3 border border-gray-400 text-gray-600 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#222] hover:scale-[1.01] active:scale-95 transition duration-200"
            >
               Remove
            </button>
          )}
        </div>
      </div>

      {filtered.length > 0 && (
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4"> History</h2>
          {Object.keys(exerciseMap).map((exKey) => {
            const group = filtered.filter((item) => item.exercise === exKey);
            
            if (group.length === 0) return null;

            const isOpen = expanded === exKey;

            return (
              <div key={exKey} className="mb-4">
                 <button
                  onClick={() => setExpanded(isOpen ? null : exKey)}
                  className="w-full text-left py-2 px-4 border border-gray-300 dark:border-gray-600 
                     rounded-md bg-gray-100 dark:bg-[#222] text-sm font-semibold 
                     hover:bg-gray-200 dark:hover:bg-[#333] transition 
                     flex justify-between items-center"
                >
                  <span>{exKey}</span>
                  <span className="ml-2 text-lg">{isOpen ? "▴": "▾"}</span>
                </button>

                {isOpen && (
                  <ul className="space-y-2 text-sm mt-2 max-h-64 overflow-y-auto">
                    {group.map((item, idx) => (
                      <li key={`${exKey}-${idx}`} className="flex justify-between items-center border border-gray-300 p-3 rounded-md">
                        <span>
                          {new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}&nbsp;&nbsp;&nbsp;
                          {item.weight} {item.unit}&nbsp;&nbsp;×&nbsp;&nbsp;{item.reps}&nbsp;&nbsp;=&nbsp;&nbsp;{item.rm} {item.unit}
                        </span>

                        <button
                          onClick={() => {
                            const updated = history.filter((h) => !(h.date === item.date && h.exercise === item.exercise && h.rm === item.rm));
                            setHistory(updated);
                            localStorage.setItem("rmHistory", JSON.stringify(updated));
                          }}
                          className="text-red-500 text-xs hover:underline"
                        >
                        Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OneRM;
