import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function TrendsPanel({ rows }) {
  const trendData = useMemo(() => {
    const dayMap = {};

    rows.forEach(r => {
      if (!r.rating || !r.submitted_at) return;
      const weekday = new Date(r.submitted_at).toLocaleDateString("en-US", { weekday: 'long' });

      if (!dayMap[weekday]) {
        dayMap[weekday] = { day: weekday, total: 0, count: 0 };
      }

      dayMap[weekday].total += r.rating;
      dayMap[weekday].count += 1;
    });

    const orderedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return orderedDays.map(day => {
      const data = dayMap[day];
      return {
        day,
        avg: data ? Number((data.total / data.count).toFixed(2)) : null
      };
    });
  }, [rows]);

  return (
    <div style={{marginTop: 32}}>
    <h3>Avg Rating by Weekday</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="avg" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
