// OneRM.jsx - 드롭다운 아이콘 개선 + 1RM 달성 축하 메시지 복구
import React, { useState, useEffect } from "react";

function OneRM() {
  const [exercise, setExercise] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [goals, setGoals] = useState({});
  const [currentGoal, setCurrentGoal] = useState("");
  const [unit, setUnit] = useState("kg");
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

  const handleCalculate = () => {
    if (!exercise || !weight || !reps) return;
    const w = parseFloat(weight);
    const r = parseInt(reps);
    const estimated = w * (1 + r / 30);
    const final = unit === "kg" ? estimated : estimated * 2.20462;
    const date = new Date().toISOString().split("T")[0];
    const newEntry = { exercise, weight: w, reps: r, rm: parseFloat(final.toFixed(1)), date, unit };
    const updated = [newEntry, ...history];
    setResult(final.toFixed(1));
    setHistory(updated);
    localStorage.setItem("rmHistory", JSON.stringify(updated));
    if (goals[exercise] && final >= goals[exercise]) {
      setIsAchieved(true);
      setTimeout(() => setIsAchieved(false), 3000);
    }
  };

  const handleGoalSave = () => {
    if (!exercise || !currentGoal) return;
    const g = { ...goals, [exercise]: parseFloat(currentGoal) };
    setGoals(g);
    localStorage.setItem("rmGoals", JSON.stringify(g));
  };

  const handleDeleteGoal = () => {
    const g = { ...goals };
    delete g[exercise];
    setGoals(g);
    localStorage.setItem("rmGoals", JSON.stringify(g));
    setCurrentGoal("");
  };

  const filtered = history.filter(item => item.exercise);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10 bg-[#f9f9f9] dark:bg-[#111] text-[#111] dark:text-white min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold text-center">1RM 계산기</h1>

      {isAchieved && (
        <div className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-md p-4 text-center font-semibold animate-fade-in">
          🎉 목표 1RM을 달성했습니다!
        </div>
      )}

      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">운동 종목 및 입력</h2>
        <div className="relative">
          <select
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            onClick={() => setIsSelectOpen(prev => !prev)}
            onBlur={() => setTimeout(() => setIsSelectOpen(false), 150)}
            className="w-full p-3 pr-10 mb-4 border border-gray-300 rounded-md bg-white dark:bg-[#1a1a1a] appearance-none"
          >
            <option value="">운동 종목 선택</option>
            {Object.keys(exerciseMap).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          <div className="absolute right-3 top-[16px] text-gray-500 pointer-events-none">
            {isSelectOpen ? "▴" : "▾"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            placeholder="중량"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="p-3 border rounded-md bg-white dark:bg-[#1a1a1a]"
          />
          <input
            type="number"
            placeholder="반복"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="p-3 border rounded-md bg-white dark:bg-[#1a1a1a]"
          />
        </div>
        <button
          onClick={handleCalculate}
          className="w-full py-3 bg-[#111] text-white rounded-md hover:opacity-90"
        >
          1RM 계산
        </button>
      </div>

      {result && (
        <div className="text-center text-xl font-semibold">예상 1RM: {result} {unit}</div>
      )}

      <div className="bg-white dark:bg-[#1a1a1a] border p-6 rounded-md">
        <h2 className="text-lg font-semibold mb-2">목표 1RM</h2>
        <input
          type="number"
          placeholder="목표 1RM"
          value={currentGoal}
          onChange={(e) => setCurrentGoal(e.target.value)}
          className="w-full p-3 border rounded-md bg-white dark:bg-[#1a1a1a]"
        />
        <div className="flex gap-2 mt-4">
          <button onClick={handleGoalSave} className="flex-1 py-3 bg-[#111] text-white rounded-md">목표 저장</button>
          {goals[exercise] && (
            <button onClick={handleDeleteGoal} className="flex-1 py-3 border rounded-md">목표 삭제</button>
          )}
        </div>
      </div>

      {filtered.length > 0 && (
        <div className="bg-white dark:bg-[#1a1a1a] border p-6 rounded-md">
          <h2 className="text-lg font-semibold mb-4">운동별 최근 기록</h2>
          {Object.keys(exerciseMap).map((exKey) => {
            const group = filtered.filter((item) => item.exercise === exKey);
            if (group.length === 0) return null;
            const isOpen = expanded === exKey;
            return (
              <div key={exKey} className="mb-4">
                <button
                  onClick={() => setExpanded(isOpen ? null : exKey)}
                  className="w-full text-left py-2 px-4 border rounded-md bg-gray-100 dark:bg-[#222] hover:bg-gray-200"
                >
                  {exKey} <span className="float-right">{isOpen ? "▴" : "▾"}</span>
                </button>
                {isOpen && (
                  <ul className="mt-2 space-y-2 text-sm max-h-64 overflow-y-auto">
                    {group.map((item, idx) => (
                      <li key={idx} className="flex justify-between border p-3 rounded-md">
                        <span>{item.date} | {item.weight} {item.unit} × {item.reps} = {item.rm} {item.unit}</span>
                        <button
                          onClick={() => {
                            const updated = history.filter((h) => !(h.date === item.date && h.exercise === item.exercise && h.rm === item.rm));
                            setHistory(updated);
                            localStorage.setItem("rmHistory", JSON.stringify(updated));
                          }}
                          className="text-red-500 text-xs"
                        >
                          삭제
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
