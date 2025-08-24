import { useEffect, useMemo, useState } from "react";
import { fetchReviews, toggleApproved } from "../api";
import TrendsPanel from "./TrendsPanel";
import { FaFilter } from "react-icons/fa";

export default function ManagerDashboard() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    minRating: "",
    channel: "",
    approved: "",
    listingName: ""
  });


  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const load = async () => {
    setLoading(true);
    try {
      alert("Listing Name Filter: " + String(filters.listingName));
      const { data } = await fetchReviews({
        
        minRating: filters.minRating ? Number(filters.minRating) : undefined,
        channel: filters.channel || undefined,
        approved: filters.approved || undefined,
        listingName: filters.listingName || undefined
      });
      setRows(data.reviews || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filters.minRating, filters.channel, filters.approved, filters.listingName]);

  const sortedRows = useMemo(() => {
    let sorted = [...rows];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA == null) return 1;
        if (valB == null) return -1;
        return sortConfig.direction === "asc"
          ? valA > valB ? 1 : -1
          : valA < valB ? 1 : -1;
      });
    }
    return sorted;
  }, [rows, sortConfig]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, page]);

  const kpis = useMemo(() => {
    const rated = rows.filter(r => r.rating != null);
    const avg = rated.length ? (rated.reduce((s, r) => s + r.rating, 0) / rated.length).toFixed(2) : null;
    const approved = rows.filter(r => r.approved).length;
    const percentApproved = rows.length ? (approved / rows.length * 100).toFixed(2) : 0;
    return { count: rows.length, avgRating: avg, percentApproved: percentApproved };
  }, [rows]);

  const onToggle = async (id, val) => {
    await toggleApproved(id, val);
    setRows(prev => prev.map(r => r.id === id ? { ...r, approved: val } : r));
  };

  function FiltersPanel({ filters, setFilters }) {
    return (
      <div style={{
        display: "flex",
        gap: 40,
        flexWrap: "wrap",
        background: "#f9f9f9",
        border: "1px solid #ccc",
        borderRadius: 12,
        padding: "16px",
        marginBottom: "24px",
        justifyContent: "center"
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Min Overall Rating</div>
          <input
            type="number"
            step="0.5"
            placeholder="e.g. 4"
            value={filters.minRating}
            onChange={e => setFilters(f => ({ ...f, minRating: e.target.value }))}
          />
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Channel</div>
          <select
            value={filters.channel}
            onChange={e => setFilters(f => ({ ...f, channel: e.target.value }))}
          >
            <option value="">Any</option>
            <option value="hostaway">Hostaway</option>
          </select>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Status</div>
          <select
            value={filters.approved}
            onChange={e => setFilters(f => ({ ...f, approved: e.target.value }))}
          >
            <option value="">Any</option>
            <option value="true">Approved</option>
            <option value="false">Unapproved</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Property</div>
          <select
            value={filters.listingName}
            onChange={e => setFilters(f => ({ ...f, listingName: e.target.value }))}
          >
            <option value="">Any</option>
            {Array.from(new Set(rows.map(r => r.listing_name))).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  function Th({ text, sortKey }) {
    const toggleSort = () => {
      setSortConfig(prev => ({
        key: sortKey,
        direction: prev.key === sortKey && prev.direction === "asc" ? "desc" : "asc"
      }));
    };

    return (
      <th onClick={toggleSort} style={{ cursor: "pointer", userSelect: "none", padding: "8px 6px", fontWeight: 600 }}>
        {text}
        {sortConfig.key === sortKey && (sortConfig.direction === "asc" ? " ▲" : " ▼")}
      </th>
    );
  }

  function KpisStrip({ kpis }) {
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: 16, margin: "8px 0 16px" }}>
        <KpiCard label="Total Reviews" value={kpis.count} />
        <KpiCard label="Avg Rating" value={kpis.avgRating ?? "—"} />
        <KpiCard label="Approved %" value={`${kpis.percentApproved}%`} />
      </div>
    );
  }

  function KpiCard({ label, value }) {
    return (
      <div style={{ border: "1px solid #eee", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
      </div>
    );
  }

  function ReviewsTable({ rows, loading, onToggle }) {
    if (loading) return <p>Loading…</p>;
    if (!rows.length) return <p>No reviews match your filters.</p>;

    return (
      <table width="100%" cellPadding={6} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <Th text="Date" sortKey="submitted_at" />
            <Th text="Overall Rating" sortKey="rating" />
            <Th text="Cleanliness" sortKey="cleanliness_rating" />
            <Th text="Communication" sortKey="communication_rating" />
            <Th text="Respect" sortKey="respect_house_rules_rating" />
            <Th text="Channel" sortKey="channel" />
            <Th text="Approve" />
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
              <td>{r.submitted_at?.slice(0, 10) ?? "—"}</td>
              <td>{r.rating ?? "—"}</td>
              <td>{r.cleanliness_rating ?? "—"}</td>
              <td>{r.communication_rating ?? "—"}</td>
              <td>{r.respect_house_rules_rating ?? "—"}</td>
              <td>{r.channel}</td>
              <td>
                <input type="checkbox" checked={!!r.approved} onChange={e => onToggle(r.id, e.target.checked)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 1100, margin: "24px auto", padding: "0 16px" }}>
      <KpisStrip kpis={kpis} />

      <button
        onClick={() => setShowFilters(f => !f)}
        style={{
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          background: "#f1f1f1",
          border: "1px solid #ccc",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        <FaFilter />
        Filters
      </button>
      {showFilters && <FiltersPanel filters={filters} setFilters={setFilters} />}

      <ReviewsTable rows={paginatedRows} loading={loading} onToggle={onToggle} />
      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: 16 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ marginRight: 36, borderRadius: 4, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>
          Prev
        </button>
        <span>Page {page} of {Math.ceil(rows.length / pageSize)}</span>
        <button onClick={() => setPage(p => (p * pageSize < rows.length ? p + 1 : p))} disabled={page * pageSize >= rows.length} style={{ borderRadius: 4, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>
          Next
        </button>
      </div>

      <TrendsPanel rows={rows} />
    </div>
  );
}
