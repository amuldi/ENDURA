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
import "animate.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [goals, setGoals] = useState({});
  const [currentGoal, setCurrentGoal] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorKey, setErrorKey] = useState(0); // 애니메이션 리셋용 key

  useEffect(() => {
    const savedHistory = localStorage.getItem("rmHistory");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedGoals = localStorage.getItem("rmGoals");
    if (savedGoals) setGoals(JSON.parse(savedGoals));

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (exercise && goals[exercise]) {
      setCurrentGoal(goals[exercise]);
    } else {
      setCurrentGoal("");
    }
  }, [exercise, goals]);

  const handleCalculate = () => {
    if (!exercise) {
      setErrorMessage("운동할 종목을 선택하세요.");
      setErrorKey(prev => prev + 1); // 애니메이션 트리거
      return;
    }
    setErrorMessage("");

    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (!isNaN(w) && !isNaN(r) && r > 0) {
      const estimated1RM = w * (1 + r / 30);
      if (estimated1RM > 1000) {
        alert("1RM이 너무 높습니다. 다시 확인해주세요.");
        return;
      }
      const newResult = parseFloat(estimated1RM.toFixed(1));
      setResult(newResult);

      const date = new Date().toISOString().split("T")[0];
      const newRecord = { exercise, weight: w, reps: r, rm: newResult, date };

      const updatedHistory = [newRecord, ...history].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setHistory(updatedHistory);
      localStorage.setItem("rmHistory", JSON.stringify(updatedHistory));
    }
  };

  const handleDelete = (index) => {
    const updated = [...history];
    updated.splice(index, 1);
    setHistory(updated);
    localStorage.setItem("rmHistory", JSON.stringify(updated));
  };

  const handleGoalSave = () => {
    if (!exercise || !currentGoal) {
      alert("종목과 목표 1RM을 입력하세요.");
      return;
    }
    const newGoals = { ...goals, [exercise]: parseFloat(currentGoal) };
    setGoals(newGoals);
    localStorage.setItem("rmGoals", JSON.stringify(newGoals));
    alert("목표 1RM 저장 완료!");
  };

  const filtered = history.filter((item) => !exercise || item.exercise === exercise);
  const latestRM = filtered.length ? filtered[0].rm : 0;
  const goalRM = goals[exercise] || 0;

  useEffect(() => {
    if (goalRM && latestRM >= goalRM) {
      alert("축하합니다! 목표 1RM을 달성했습니다!");
    }
  }, [latestRM, goalRM]);

  // 최근 기록이 오른쪽에 오도록 reversedData를 생성
  const reversedFiltered = [...filtered].reverse();

  const chartData = {
    labels: reversedFiltered.map((item) => item.date),
    datasets: [
      {
        label: `${exercise} 1RM`,
        data: reversedFiltered.map((item) => item.rm),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen p-6`}>
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} max-w-xl mx-auto p-6 rounded shadow-md space-y-4`}>
        <h1 className="text-2xl font-bold">💪 1RM 계산기</h1>

        <select
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          className={`w-full border p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
        >
          <option value="">운동 종목 선택</option>
          <option value="벤치 프레스">벤치 프레스</option>
          <option value="스쿼트">스쿼트</option>
          <option value="데드리프트">데드리프트</option>
          <option value="오버헤드 프레스">오버헤드 프레스</option>
          <option value="바벨로우">바벨로우</option>
        </select>

        {errorMessage && (
          <div key={errorKey} className="text-red-500 text-sm animate__animated animate__headShake">
            {errorMessage}
          </div>
        )}

        <input
          type="number"
          placeholder="중량 (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className={`w-full border p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
        />
        <input
          type="number"
          placeholder="반복 횟수"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className={`w-full border p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
        />

        <button onClick={handleCalculate} className="w-full bg-blue-500 text-white p-2 rounded">
          1RM 계산
        </button>

        {result && (
          <div className="text-lg font-semibold text-center">
            [{exercise}] 예상 1RM: <strong>{result} kg</strong>
          </div>
        )}

        {/* 목표 설정 */}
        <div className="mt-6 border-t pt-4">
          <h2 className="font-semibold text-lg">🎯 목표 1RM 설정</h2>
          <input
            type="number"
            placeholder="목표 1RM (kg)"
            value={currentGoal}
            onChange={(e) => setCurrentGoal(e.target.value)}
            className={`w-full border p-2 rounded mt-2 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
          />
          <button onClick={handleGoalSave} className="w-full bg-green-500 text-white p-2 rounded mt-2">
            목표 저장
          </button>
        </div>

        {/* 다크모드 버튼 */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`mt-4 w-full ${darkMode ? "bg-yellow-500" : "bg-gray-800"} text-white p-2 rounded`}
        >
          {darkMode ? "🌞 라이트 모드" : "🌙 다크 모드"}
        </button>

        {/* 최근 기록 */}
        {filtered.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">📌 최근 기록</h2>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {filtered.map((item, index) => (
                <li key={index} className={`p-2 border rounded ${darkMode ? "bg-gray-700" : "bg-gray-50"} flex justify-between`}>
                  <span>
                    {item.date} | {item.exercise} | {item.weight}kg x {item.reps}회 = <strong>{item.rm}kg</strong>
                  </span>
                  <button className="text-red-500 ml-2" onClick={() => handleDelete(index)}>삭제</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 차트 */}
        {filtered.length > 1 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">📈 1RM 추이</h2>
            <Line data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
