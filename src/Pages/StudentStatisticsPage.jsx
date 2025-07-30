// StudentStatisticsPage.jsx
import { useState } from "react";
import { FiX } from "react-icons/fi";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";

const pastelColors = [
  "#A78BFA", "#60A5FA", "#34D399", "#FBBF24", "#F87171",
  "#F472B6", "#818CF8", "#4ADE80", "#FCD34D", "#FB7185",
];

const stats = [
  { title: "الواجبات", value: 85, items: ["واجب 1", "واجب 2"] },
  { title: "الامتحانات", value: 90, items: ["امتحان منتصف الترم", "النهائي"] },
  { title: "الحصص", value: 70, items: ["حصة 1", "حصة 2", "حصة 3"] },
  { title: "حضور بنفس اليوم", value: 95, items: ["5 محاضرات"] },
  { title: "تقفيل الامتحان", value: 100, items: ["امتحان 1", "امتحان 2"] },
  { title: "تقفيل الواجب", value: 100, items: ["واجب 1", "واجب 2"] },
  { title: "تقفيل الامتحان والواجب", value: 100, items: ["كلهم"] },
];

const chartData = [
  { name: "الأسبوع", value: 78 },
  { name: "الشهر", value: 82 },
  { name: "الترم", value: 91 },
  { name: "السنة", value: 87 },
];

export default function StudentStatisticsPage() {
  const [selected, setSelected] = useState(null);

  const openModal = (item) => setSelected(item);
  const closeModal = () => setSelected(null);

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-violet-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-8 text-center text-violet-700 dark:text-violet-300">إحصائيات الطالب</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative w-32 h-32 rounded-full bg-white dark:bg-gray-800 shadow flex items-center justify-center cursor-pointer hover:scale-105 transition"
            onClick={() => openModal(stat)}
            style={{
              border: `6px solid ${pastelColors[index % pastelColors.length]}`,
            }}
          >
            <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center text-center text-xs font-bold text-gray-700 dark:text-white p-2">
              {stat.title}
            </div>
            <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
              <circle
                className="text-gray-300 dark:text-gray-700"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                r="45"
                cx="64"
                cy="64"
              />
              <circle
                stroke={pastelColors[index % pastelColors.length]}
                strokeWidth="6"
                fill="transparent"
                r="45"
                cx="64"
                cy="64"
                strokeDasharray="282.74"
                strokeDashoffset={282.74 - (282.74 * stat.value) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-sm font-bold text-gray-900 dark:text-white">
              {stat.value}%
            </span>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative space-y-4">
            <button
              className="absolute top-2 right-2 text-gray-700 dark:text-white hover:text-red-500"
              onClick={closeModal}
            >
              <FiX size={20} />
            </button>
            <h2 className="text-lg font-semibold text-violet-700 dark:text-violet-300">{selected.title}</h2>
            <ul className="space-y-1 list-disc list-inside text-sm text-gray-800 dark:text-gray-300">
              {selected.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            {["الواجبات", "الامتحانات"].includes(selected.title) && (
              <div className="text-sm text-violet-700 dark:text-violet-400">
                الدرجة: {selected.value} / 100 ({selected.value}%)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="mt-12 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-violet-700 dark:text-violet-300 text-center">الأداء العام</h2>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={60}
                label
              >
                {chartData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={pastelColors[i % pastelColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
