import { useEffect, useMemo, useState } from "react";
import { fetchReviews, toggleApproved } from "../api";

export default function ManagerDashboard() {
  // --- state
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    listingId: "",
    minRating: "",
    channel: "",
    // TODO (you): add date range: startDate, endDate
    approved: "" // "", "true", "false"
  });

  // --- load
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await fetchReviews({
        listingId: filters.listingId || undefined,
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

  useEffect(()=>{ load(); /* eslint-disable-next-line */}, [filters.listingId, filters.minRating, filters.channel, filters.approved]);

  // --- derived KPIs (client-side)
  const kpis = useMemo(()=>{
    const rated = rows.filter(r=>r.rating!=null);
    const avg = rated.length ? (rated.reduce((s,r)=>s+r.rating,0)/rated.length).toFixed(2) : null;
    return { count: rows.length, avgRating: avg };
  }, [rows]);

  // --- approve toggle
  const onToggle = async (id, val) => {
    await toggleApproved(id, val);
    setRows(prev => prev.map(r => r.id === id ? { ...r, approved: val } : r));
  };

  function FiltersBar({ filters, setFilters, loading, reload }) {
    return (
        <div style={{display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:10, margin:"12px 0"}}>
        <input
            placeholder="Listing ID"
            value={filters.listingId}
            onChange={e=>setFilters(f=>({...f, listingId:e.target.value}))}
        />
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
        <div style={{display:"flex", gap:16, margin:"8px 0 16px"}}>
        <KpiCard label="Total Reviews" value={kpis.count} />
        <KpiCard label="Avg Rating" value={kpis.avgRating ?? "—"} />
        {/* TODO (you): add % approved */}
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
            <table width="100%" cellPadding={6} style={{borderCollapse:"collapse"}}>
            <thead>
                <tr style={{borderBottom:"1px solid #ddd"}}>
                <Th text="Date" />
                <Th text="Listing" />
                <Th text="Guest" />
                <Th text="Rating" />
                <Th text="Categories" />
                <Th text="Text" />
                <Th text="Channel" />
                <Th text="Approved" />
                </tr>
            </thead>
            <tbody>
                {rows.map(r=>(
                <tr key={r.id} style={{borderBottom:"1px solid #f4f4f4"}}>
                    <td>{r.submittedAt?.slice(0,10) ?? "—"}</td>
                    <td>{r.listingId}</td>
                    <td>{r.guestName ?? "—"}</td>
                    <td>{r.rating ?? "—"}</td>
                    <td>
                    {/* TODO (you): render chips from r.categories */}
                    {/* tiny example: */}
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",maxWidth:160}}>
                        {(r.categories||[]).slice(0,3).map((c,i)=>(
                        <span key={i} style={{fontSize:12, border:"1px solid #eee", borderRadius:6, padding:"2px 6px"}}>
                            {c.category}:{c.rating}
                        </span>
                        ))}
                    </div>
                    </td>
                    <td style={{maxWidth:360, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                    {r.publicText}
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
      <h1>Reviews Dashboard</h1>

      <FiltersBar filters={filters} setFilters={setFilters} loading={loading} reload={load} />

      <KpisStrip kpis={kpis} />

      <ReviewsTable rows={rows} loading={loading} onToggle={onToggle} />
      
      {/* TODO (you): add <TrendsPanel rows={rows}/> for rating-over-time sparkline */}
    </div>
  );
}
