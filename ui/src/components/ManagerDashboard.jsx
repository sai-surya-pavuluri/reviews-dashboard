import { useEffect, useMemo, useState } from "react";
import { fetchReviews, toggleApproved } from "../api";
import TrendsPanel from "./TrendsPanel";

export default function ManagerDashboard() {
  
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    minRating: "",
    channel: "",
    submitted_at: "",
    approved: ""
  });

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page]);


  // --- load
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await fetchReviews({
        minRating: filters.minRating ? Number(filters.minRating) : undefined,
        channel: filters.channel || undefined,
        approved: filters.approved || undefined
      });
      setRows(data.reviews || []);
      // TODO (you): also store KPIs (data.kpis)
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load();}, [filters.minRating, filters.channel, filters.approved]);

  const kpis = useMemo(()=>{
    const rated = rows.filter(r=>r.rating!=null);
    const avg = rated.length ? (rated.reduce((s,r)=>s+r.rating,0)/rated.length).toFixed(2) : null;
    const approved = rows.filter(r=>r.approved).length;
    if (approved === 0) return { count: rows.length, avgRating: avg, percentApproved: 0 };
    const percentApproved = (approved / rows.length * 100).toFixed(2);
    return { count: rows.length, avgRating: avg, percentApproved: percentApproved };
  }, [rows]);

  // --- approve toggle
  const onToggle = async (id, val) => {
    await toggleApproved(id, val);
    setRows(prev => prev.map(r => r.id === id ? { ...r, approved: val } : r));
  };

  function FiltersBar({ filters, setFilters, loading, reload }) {
    return (
        <div style={{display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:10, margin:"12px 0"}}>
        <span>Filters:</span>
        <input
            type="number"
            step="1"
            placeholder="Min rating"
            value={filters.minRating}
            onChange={e=>setFilters(f=>({...f, minRating:e.target.value}))}
        />
        <select
            value={filters.channel}
            onChange={e=>setFilters(f=>({...f, channel:e.target.value}))}
        >
            <option value="">Channel: any</option>
            <option value="hostaway">Hostaway</option>
            {/* TODO (you): add "google" once you integrate it */}
        </select>
        <select
            value={filters.approved}
            onChange={e=>setFilters(f=>({...f, approved:e.target.value}))}
        >
            <option value="">Approved: any</option>
            <option value="true">Approved</option>
            <option value="false">Unapproved</option>
        </select>
        <button disabled={loading} onClick={reload}>Refresh</button>
        </div>
    );
  }

  function KpisStrip({ kpis }) {
    return (
        <div style={{display:"flex", justifyContent:"center", gap:16, margin:"8px 0 16px"}}>
          <KpiCard label="Total Reviews" value={kpis.count} />
          <KpiCard label="Avg Rating" value={kpis.avgRating ?? "—"} />
          <KpiCard label="Approved %" value={`${kpis.percentApproved}%`} />
        </div>
    );
  }

    function KpiCard({ label, value }) {
        return (
            <div style={{border:"1px solid #eee", borderRadius:10, padding:"12px 16px"}}>
            <div style={{fontSize:12, color:"#666"}}>{label}</div>
            <div style={{fontSize:22, fontWeight:700}}>{value}</div>
            </div>
        );
    }

    function ReviewsTable({ rows, loading, onToggle }) {
        if (loading) return <p>Loading…</p>;
        if (!rows.length) return <p>No reviews match your filters.</p>;

        return (
            <table width="100%" cellPadding={6} style={{borderCollapse:"collapse", marginLeft: 40}}>
            <thead>
                <tr style={{borderBottom:"1px solid #ddd"}}>
                <Th text="Date" />
                <Th text="Rating" />
                <Th text="Categories" />
                <Th text="Channel" />
                <Th text="Approve" />
                </tr>
            </thead>
            <tbody>
                {rows.map(r=>(
                <tr key={r.id} style={{borderBottom:"1px solid #f4f4f4"}}>
                    <td>{r.submitted_at?.slice(0,10) ?? "—"}</td>
                    <td>{r.rating ?? "—"}</td>
                    <td> <div style={{display: "flex", gap: 4, flexWrap: "wrap", maxWidth: 160}}>
                        {r.cleanliness_rating != null && (
                          <span style={{fontSize:12, border:"1px solid #eee", borderRadius:6, padding:"2px 6px"}}>
                            cleanliness: {r.cleanliness_rating}
                          </span>
                        )}
                        {r.communication_rating != null && (
                          <span style={{fontSize:12, border:"1px solid #eee", borderRadius:6, padding:"2px 6px"}}>
                            communication: {r.communication_rating}
                          </span>
                        )}
                        {r.respect_house_rules_rating != null && (
                          <span style={{fontSize:12, border:"1px solid #eee", borderRadius:6, padding:"2px 6px"}}>
                            respect: {r.respect_house_rules_rating}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{r.channel}</td>
                    <td>
                    <input type="checkbox" checked={!!r.approved} onChange={e=>onToggle(r.id, e.target.checked)} />
                    </td>
                </tr>
                ))}
            </tbody>
            </table>

        );
        }

        function Th({ text }) {
        return <th style={{textAlign:"left", fontWeight:600, fontSize:13, padding:"8px 6px"}}>{text}</th>;
        }




  return (
    <div style={{maxWidth:1100, margin:"24px auto", padding:"0 16px"}}>
      <KpisStrip kpis={kpis} />

      <FiltersBar filters={filters} setFilters={setFilters} loading={loading} reload={load} />

      <ReviewsTable rows={paginatedRows} loading={loading} onToggle={onToggle} />
      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: 16 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ marginRight: 36, borderRadius: 4, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>
          Prev
        </button>
        <span>Page {page} of {Math.ceil(rows.length / pageSize)}</span>
        <button onClick={() => setPage(p => (p * pageSize < rows.length ? p + 1 : p))} disabled={page * pageSize >= rows.length} style={{borderRadius: 4, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>
          Next
        </button>
      </div>

      <TrendsPanel rows={rows} />
    </div>
  );
}
