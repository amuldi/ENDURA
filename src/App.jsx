// ✅ 전체 코드 - 1RM 계산기 (최종 버전)
//  주간/월간 필터, 목표 달성 애니메이션, 최고기록 강조, 반응형 개선, 도움말, 다국어, 단위 변환, 다크모드

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
import annotationPlugin from 'chartjs-plugin-annotation';
import "animate.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

const translations = {
  ko: {
    title: "💪 1RM 계산기",
    unit: "단위",
    exercise: "운동 종목 선택",
    weight: "중량",
    reps: "반복 횟수",
    calculate: "1RM 계산",
    estimated: "예상 1RM",
    goalTitle: "🎯 목표 1RM 설정",
    goalPlaceholder: "목표 1RM",
    saveGoal: "목표 저장",
    currentGoal: "현재 목표",
    toggleMode: { dark: "🌞 라이트 모드", light: "🌙 다크 모드" },
    history: "📌 최근 기록",
    chart: "📈 1RM 추이",
    achieved: "🎉 목표 달성!",
    delete: "삭제",
    errorExercise: "운동할 종목을 선택하세요.",
    errorInputs: "중량과 반복 횟수를 모두 올바르게 입력해주세요.",
    language: "언어",
    filter: "기간 필터"
  },
  en: {
    title: "💪 1RM Calculator",
    unit: "Unit",
    exercise: "Select Exercise",
    weight: "Weight",
    reps: "Reps",
    calculate: "Calculate 1RM",
    estimated: "Estimated 1RM",
    goalTitle: "🎯 Set Goal 1RM",
    goalPlaceholder: "Goal 1RM",
    saveGoal: "Save Goal",
    currentGoal: "Current Goal",
    toggleMode: { dark: "🌞 Light Mode", light: "🌙 Dark Mode" },
    history: "📌 Recent Records",
    chart: "📈 1RM Progress",
    achieved: "🎉 Goal Achieved!",
    delete: "Delete",
    errorExercise: "Please select an exercise.",
    errorInputs: "Please enter valid weight and reps.",
    language: "Language",
    filter: "Filter Period"
  }
};

const exerciseMap = {
  "벤치 프레스": { ko: "벤치 프레스", en: "Bench Press" },
  "스쿼트": { ko: "스쿼트", en: "Squat" },
  "데드리프트": { ko: "데드리프트", en: "Deadlift" },
  "오버헤드 프레스": { ko: "오버헤드 프레스", en: "Overhead Press" },
  "바벨로우": { ko: "바벨로우", en: "Barbell Row" }
};

function App() {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [goals, setGoals] = useState({});
  const [currentGoal, setCurrentGoal] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [unit, setUnit] = useState("kg");
  const [language, setLanguage] = useState("ko");
  const [errors, setErrors] = useState({});
  const [errorKey, setErrorKey] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [filter, setFilter] = useState("all");

  const t = translations[language];
  const convert = (value, toUnit) => (toUnit === "lb" ? value * 2.20462 : value / 2.20462);

  useEffect(() => {
    const savedHistory = localStorage.getItem("rmHistory");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    const savedGoals = localStorage.getItem("rmGoals");
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setDarkMode(savedTheme === "dark");
    else setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleCalculate = () => {
    const newErrors = {};
    if (!exercise) newErrors.exercise = t.errorExercise;
    if (!weight || !reps || parseFloat(weight) <= 0 || parseInt(reps) <= 0) newErrors.inputs = t.errorInputs;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorKey((prev) => prev + 1);
      return;
    }
    setErrors({});
    const w = parseFloat(weight);
    const r = parseInt(reps);
    const weightInKg = unit === "kg" ? w : convert(w, "kg");
    const estimated1RM = weightInKg * (1 + r / 30);
    const finalResult = unit === "kg" ? estimated1RM : convert(estimated1RM, "lb");

    const goalRM = goals[exercise] || 0;
    if (goalRM && estimated1RM >= goalRM) {
      setShowCongrats(true);
      setTimeout(() => setShowCongrats(false), 3000);
    }

    setResult(parseFloat(finalResult.toFixed(1)));
    const date = new Date().toISOString().split("T")[0];
    const newRecord = { exercise, weight: w, reps: r, rm: parseFloat(finalResult.toFixed(1)), date, unit };
    const updatedHistory = [newRecord, ...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    setHistory(updatedHistory);
    localStorage.setItem("rmHistory", JSON.stringify(updatedHistory));
  };

  const handleDelete = (index) => {
    const updated = [...history];
    updated.splice(index, 1);
    setHistory(updated);
    localStorage.setItem("rmHistory", JSON.stringify(updated));
  };

  const handleGoalSave = () => {
    if (!exercise || !currentGoal) return alert(t.errorExercise);
    const numericGoal = parseFloat(currentGoal);
    const goalInKg = unit === "kg" ? numericGoal : convert(numericGoal, "kg");
    const newGoals = { ...goals, [exercise]: goalInKg };
    setGoals(newGoals);
    localStorage.setItem("rmGoals", JSON.stringify(newGoals));
    alert("목표 1RM 저장 완료!");
  };

  const now = new Date();
  const filtered = history.filter((item) => {
    if (!exercise || item.exercise === exercise) {
      if (filter === "week") return now - new Date(item.date) <= 7 * 86400000;
      if (filter === "month") return now - new Date(item.date) <= 30 * 86400000;
      return true;
    }
    return false;
  });

  const maxRM = Math.max(...filtered.map(item => item.unit === unit ? item.rm : convert(item.rm, unit)));
  const reversedFiltered = [...filtered].reverse();
  const goalRM = goals[exercise] || 0;
  const displayGoalRM = unit === "kg" ? goalRM : convert(goalRM, "lb");

  const chartData = {
    labels: reversedFiltered.map((item) => item.date),
    datasets: [
      {
        label: `${exerciseMap[exercise]?.[language] || exercise} 1RM (${unit})`,
        data: reversedFiltered.map((item) => item.unit === unit ? item.rm : convert(item.rm, unit)),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      annotation: goalRM ? {
        annotations: {
          goalLine: {
            type: 'line',
            yMin: displayGoalRM,
            yMax: displayGoalRM,
            borderColor: 'red',
            borderWidth: 2,
            label: {
              content: t.achieved,
              enabled: true,
              position: 'end'
            }
          }
        }
      } : undefined
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen px-4 py-6 sm:px-2`}>
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} max-w-3xl mx-auto p-6 sm:p-3 rounded shadow-md space-y-4`}>
        <div className="flex flex-wrap justify-between items-center gap-2 sm:gap-1">
          <h1 className="text-2xl sm:text-lg font-bold">{t.title}</h1>
          <div className="flex gap-2 sm:gap-1">
            <button onClick={() => setUnit(unit === "kg" ? "lb" : "kg")} className="text-sm px-3 sm:px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded">🌐 {t.unit}: {unit.toUpperCase()}</button>
            <button onClick={() => setLanguage(language === "ko" ? "en" : "ko")} className="text-sm px-3 sm:px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded">🌍 {t.language}: {language.toUpperCase()}</button>
          </div>
        </div>

        <select value={exercise} onChange={(e) => setExercise(e.target.value)} className={`w-full border p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}>
          <option value="">{t.exercise}</option>
          {Object.entries(exerciseMap).map(([value, label]) => (
            <option key={value} value={value}>{label[language]}</option>
          ))}
        </select>
        {errors.exercise && <div key={errorKey + "e"} className="text-red-500 text-sm animate__animated animate__headShake">{errors.exercise}</div>}

        <input type="number" placeholder={`${t.weight} (${unit})`} title="운동 시 실제 들었던 중량을 입력하세요." value={weight} onChange={(e) => setWeight(e.target.value)} className={`w-full border p-2 rounded text-sm ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`} />
        <input type="number" placeholder={t.reps} title="실제 수행한 반복 횟수를 입력하세요." value={reps} onChange={(e) => setReps(e.target.value)} className={`w-full border p-2 rounded text-sm ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`} />
        {errors.inputs && <div key={errorKey + "i"} className="text-red-500 text-sm animate__animated animate__headShake">{errors.inputs}</div>}

        <button onClick={handleCalculate} className="w-full bg-blue-500 text-white p-2 rounded text-sm">{t.calculate}</button>
        {showCongrats && (
          <div className="text-center text-green-500 text-xl font-bold animate__animated animate__bounceIn">
            🎉 목표 1RM을 달성했습니다!
          </div>
        )}
        {result && <div className="text-lg font-semibold text-center">[{exerciseMap[exercise]?.[language] || exercise}] {t.estimated}: <strong>{result} {unit}</strong></div>}

        <div className="border-t pt-4">
          <h2 className="font-semibold text-lg">{t.goalTitle}</h2>
          <input type="number" placeholder={`${t.goalPlaceholder} (${unit})`} title="도달하고 싶은 1RM 목표 중량을 입력하세요." value={currentGoal} onChange={(e) => setCurrentGoal(e.target.value)} className={`w-full border p-2 rounded mt-2 text-sm ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`} />
          <button onClick={handleGoalSave} className="w-full bg-green-500 text-white p-2 rounded mt-2 text-sm">{t.saveGoal}</button>
        </div>

        <button onClick={() => setDarkMode(!darkMode)} className={`w-full ${darkMode ? "bg-yellow-500" : "bg-gray-800 text-white"} p-2 rounded text-sm`}>
          {darkMode ? t.toggleMode.dark : t.toggleMode.light}
        </button>

        {filtered.length > 0 && (
          <>
            <div className="flex justify-center gap-2 sm:gap-1 flex-wrap text-sm">
              <button onClick={() => setFilter("all")} className={`px-3 sm:px-2 py-1 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>전체</button>
              <button onClick={() => setFilter("week")} className={`px-3 sm:px-2 py-1 rounded ${filter === "week" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>7일</button>
              <button onClick={() => setFilter("month")} className={`px-3 sm:px-2 py-1 rounded ${filter === "month" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>30일</button>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">{t.history}</h2>
              <ul className="space-y-2 max-h-64 overflow-y-auto text-sm sm:text-xs">
                {filtered.map((item, index) => (
                  <li key={index} className={`p-2 border rounded flex justify-between ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <span>{item.date} | {exerciseMap[item.exercise]?.[language] || item.exercise} | {item.weight} {item.unit} x {item.reps} = <strong>{item.rm} {item.unit} {item.unit === unit && item.rm === maxRM ? '🏆' : ''}</strong></span>
                    <button className="text-red-500 ml-2" onClick={() => handleDelete(index)}>{t.delete}</button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {filtered.length > 1 && (
          <div className="mt-6 sm:mt-4">
            <h2 className="text-lg font-semibold mb-2">{t.chart}</h2>
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;