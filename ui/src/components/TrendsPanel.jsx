import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function TrendsPanel({ rows }) {
  const trendData = useMemo(() => {
    const filteredReviews = rows.filter(r => r.rating != null && r.submittedAt);
    const groupedByDate = filteredReviews.reduce((acc, review) => {
        const date = review.submittedAt.slice(0, 10);
        if (!acc[date]) acc[date] = { date, total: 0, count: 0 };
        acc[date].total += review.rating;
        acc[date].count += 1;
        return acc;
    }, {});

    return Object.values(groupedByDate).map(item => ({
      date: item.date,
      avg: Number((item.total / item.count).toFixed(2))
    }));
  }, [rows]);

  return (
    <div style={{marginTop: 32}}>
    <h3>Rating Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="avg" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
