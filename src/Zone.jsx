// Zone.jsx - 무채색 기반 고급 스타일 UI 리디자인
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

function Zone() {
  const [age, setAge] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [zone, setZone] = useState("");
  const [zoneRanges, setZoneRanges] = useState(null);
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("all");
  const [successRate, setSuccessRate] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("zoneRecords");
    if (saved) {
      const parsed = JSON.parse(saved);
      setRecords(parsed);
      const successCount = parsed.filter(r => r.zone === "Zone 2").length;
      setSuccessRate(parsed.length ? Math.round((successCount / parsed.length) * 100) : null);
    }
  }, []);

  const calculateZone = () => {
    if (!age || !heartRate) {
      alert("나이와 평균 심박수를 입력하세요.");
      return;
    }

    const maxHR = 220 - parseInt(age);
    const hr = parseInt(heartRate);

    const zones = {
      "Zone 1": [0.5 * maxHR, 0.6 * maxHR],
      "Zone 2": [0.6 * maxHR, 0.7 * maxHR],
      "Zone 3": [0.7 * maxHR, 0.8 * maxHR],
      "Zone 4": [0.8 * maxHR, 0.9 * maxHR],
      "Zone 5": [0.9 * maxHR, maxHR],
    };

    setZoneRanges(zones);

    let result = "범위 초과";
    for (let [name, [min, max]] of Object.entries(zones)) {
      if (hr >= min && hr < max) {
        result = name;
        break;
      }
    }
    setZone(result);

    const today = new Date().toISOString().split("T")[0];
    const newRecord = {
      date: today,
      age: parseInt(age),
      heartRate: hr,
      zone: result,
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem("zoneRecords", JSON.stringify(updated));

    const successCount = updated.filter(r => r.zone === "Zone 2").length;
    setSuccessRate(updated.length ? Math.round((successCount / updated.length) * 100) : null);
  };

  const handleDelete = (index) => {
    const updated = [...records];
    updated.splice(index, 1);
    setRecords(updated);
    localStorage.setItem("zoneRecords", JSON.stringify(updated));

    const successCount = updated.filter(r => r.zone === "Zone 2").length;
    setSuccessRate(updated.length ? Math.round((successCount / updated.length) * 100) : null);
  };

  const now = new Date();
  const filteredRecords = records.filter((item) => {
    const itemDate = new Date(item.date);
    if (filter === "week") return now - itemDate <= 7 * 86400000;
    if (filter === "month") return now - itemDate <= 30 * 86400000;
    return true;
  });

  const chartData = {
    labels: filteredRecords.map(r => r.date).reverse(),
    datasets: [
      {
        label: "심박수 (bpm)",
        data: filteredRecords.map(r => r.heartRate).reverse(),
        borderColor: "#333",
        backgroundColor: "#ddd",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="px-6 py-8 space-y-6 bg-white text-black min-h-screen">
      <h1 className="text-4xl font-bold text-center">Zone 계산기</h1>

      <div className="grid gap-6">
        <div className="bg-[#f9f9f9] border border-gray-200 rounded-xl p-6 shadow-md">
          <input
            type="number"
            placeholder="나이 입력"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="평균 심박수 (bpm)"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg mt-3"
          />

          <button
            onClick={calculateZone}
            className="w-full mt-4 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800"
          >
            Zone 판정 및 저장
          </button>

          {zone && (
            <div className="text-center text-2xl font-bold mt-6">
              판정 결과: <span className="text-gray-900">{zone}</span>
            </div>
          )}

          {successRate !== null && (
            <div className="text-center text-sm text-gray-500">
              전체 Zone 기록 중 Zone2 성공률: <strong>{successRate}%</strong>
            </div>
          )}

          {zoneRanges && (
            <div className="mt-6 text-sm text-gray-600">
              <p className="font-semibold mb-2">Zone별 심박수 범위 (bpm):</p>
              <ul className="list-disc pl-6 space-y-1">
                {Object.entries(zoneRanges).map(([name, [min, max]]) => (
                  <li key={name}>
                    {name}: {Math.round(min)} ~ {Math.round(max)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {['all', 'week', 'month'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-full border text-sm ${filter === f ? 'bg-black text-white' : 'bg-white text-black border-gray-400'}`}
            >
              {f === 'all' ? '전체' : f === 'week' ? '주간' : '월간'}
            </button>
          ))}
        </div>

        {filteredRecords.length > 0 && (
          <div className="bg-[#f9f9f9] border border-gray-200 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Zone 기록</h2>
            <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
              {filteredRecords.map((r, idx) => (
                <li key={idx} className="border border-gray-300 p-2 rounded flex justify-between items-center">
                  <span>{r.date} | {r.heartRate}bpm → {r.zone}</span>
                  <button onClick={() => handleDelete(idx)} className="text-red-500 text-xs ml-4">삭제</button>
                </li>
              ))}
            </ul>

            {filteredRecords.length > 1 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">심박수 변화 추이</h2>
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Zone;
