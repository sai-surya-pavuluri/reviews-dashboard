import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const dayColors = {
  Monday: "#8884d8",
  Tuesday: "#82ca9d",
  Wednesday: "#ffc658",
  Thursday: "#ff7f50",
  Friday: "#00c49f",
  Saturday: "#ff69b4",
  Sunday: "#a52a2a"
};

function getColor(day) {
  return dayColors[day] || "#8884d8";
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#fff",
        border: "1px solid #ccc",
        padding: "8px",
        borderRadius: "6px"
      }}>
        <strong>{label}</strong>
        <div>Avg Rating: {payload[0].value}</div>
      </div>
    );
  }
  return null;
};


export default function TrendsPanel({ rows }) {
  const trendData = useMemo(() => {
    const weekdayTotals = Array(7).fill(0);
    const weekdayCounts = Array(7).fill(0);

    rows.forEach(r => {
      if (r.rating != null && r.submitted_at) {
        const weekday = new Date(r.submitted_at).getDay();
        weekdayTotals[weekday] += r.rating;
        weekdayCounts[weekday]++;
      }
    });

    return dayMap.map((day, i) => ({
      day,
      avg: weekdayCounts[i] ? Number((weekdayTotals[i] / weekdayCounts[i]).toFixed(2)) : 0
    }));
  }, [rows]);

  return (
    <div style={{ flex: 1, paddingLeft: 24 }}>
      <h3 style={{ textAlign: "center" }}>Avg Overall Rating by Day</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, 5]} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="avg">
            {trendData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.day)} />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
