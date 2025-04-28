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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Zone2() {
  const [age, setAge] = useState("");
  const [time, setTime] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [zone2Range, setZone2Range] = useState({ min: null, max: null });
  const [resultMessage, setResultMessage] = useState("");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const savedRecords = localStorage.getItem("zone2Records");
    if (savedRecords) setRecords(JSON.parse(savedRecords));
  }, []);

  const calculateZone2Range = (inputAge) => {
    const maxHeartRate = 220 - inputAge;
    const min = Math.round(maxHeartRate * 0.6);
    const max = Math.round(maxHeartRate * 0.7);
    setZone2Range({ min, max });
  };

  const handleAgeChange = (e) => {
    const inputAge = parseInt(e.target.value);
    setAge(inputAge);
    if (!isNaN(inputAge)) {
      calculateZone2Range(inputAge);
    }
  };

  const handleJudgeZone2 = () => {
    if (!heartRate || !zone2Range.min || !zone2Range.max) {
      alert("평균 심박수와 나이를 입력하세요.");
      return;
    }
    const hr = parseInt(heartRate);
    if (hr >= zone2Range.min && hr <= zone2Range.max) {
      setResultMessage("Zone2 성공");
    } else {
      setResultMessage("Zone2 실패");
    }
    setTimeout(() => setResultMessage(""), 1000);
  };

  const handleSaveRecord = () => {
    if (!time || !heartRate) {
      alert("운동 시간과 심박수를 입력하세요.");
      return;
    }
    const newRecord = {
      date: new Date().toISOString().split("T")[0],
      time: parseInt(time),
      heartRate: parseInt(heartRate),
    };
    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);
    localStorage.setItem("zone2Records", JSON.stringify(updatedRecords));
  };

  const handleDelete = (index) => {
    const updated = [...records];
    updated.splice(index, 1);
    setRecords(updated);
    localStorage.setItem("zone2Records", JSON.stringify(updated));
  };

  const timeData = records.map((r) => r.time).reverse();
  const heartRateData = records.map((r) => r.heartRate).reverse();
  const labels = records.map((r) => r.date).reverse();

  const chartData = {
    labels,
    datasets: [
      {
        label: "운동 시간 (분)",
        data: timeData,
        borderColor: "#00BFA6",
        tension: 0.4,
      },
      {
        label: "평균 심박수 (bpm)",
        data: heartRateData,
        borderColor: "#2196F3",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Zone2 계산기</h1>

      <input
        type="number"
        placeholder="나이 입력"
        value={age}
        onChange={handleAgeChange}
        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-gray-400 transition"
      />

      {zone2Range.min && zone2Range.max && (
        <div className="text-center text-lg font-semibold mt-4">
          추천 Zone2 심박수 범위: {zone2Range.min} ~ {zone2Range.max} bpm
        </div>
      )}

      <input
        type="number"
        placeholder="운동 시간 (분)"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-gray-400 transition"
      />
      <input
        type="number"
        placeholder="평균 심박수 (bpm)"
        value={heartRate}
        onChange={(e) => setHeartRate(e.target.value)}
        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-gray-400 transition"
      />

      <div className="flex flex-col gap-3">
        <button
          onClick={handleJudgeZone2}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-300"
        >
          Zone2 판정
        </button>
        <button
          onClick={handleSaveRecord}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-300"
        >
          기록 저장
        </button>
      </div>

      {resultMessage && (
        <div className="text-center text-xl font-bold mt-6">
          {resultMessage}
        </div>
      )}

      {records.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-8 mb-4">운동 기록</h2>
          <ul className="space-y-2 max-h-64 overflow-y-auto text-sm">
            {records.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center border p-2 rounded">
                <span>
                  {item.date} | {item.time}분 | {item.heartRate} bpm
                </span>
                <button
                  onClick={() => handleDelete(idx)}
                  className="text-red-500 text-xs"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {records.length > 1 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">운동 추이</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

export default Zone2;
