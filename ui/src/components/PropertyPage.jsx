import { useEffect, useState } from "react";
import { fetchPublicReviews } from "../api";

export default function PropertyPage() {
  const [listingId, setListingId] = useState("");   // TODO (you): hardcode one for demo
  const [items, setItems] = useState([]);

  const load = async () => {
    if (!listingId) return;
    const { data } = await fetchPublicReviews(listingId);
    setItems(data || []);
  };

  useEffect(()=>{ /* TODO (you): call load on mount with default listingId */ }, []);

  return (
    <div style={{maxWidth:1000, margin:"24px auto", padding:"0 16px"}}>
      {/* Hero / Property header */}
      <section style={{margin:"8px 0 16px"}}>
        <h1 style={{fontSize:28, marginBottom:4}}>Property Title (Mock)</h1>
        <div style={{color:"#666"}}>Location • Sleeps 4 • 2 Beds</div>
      </section>

      {/* Reviews Section */}
      <section style={{marginTop:24}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h2>Guest reviews</h2>
          <div>
            <input placeholder="Listing ID" value={listingId} onChange={e=>setListingId(e.target.value)} />
            <button onClick={load} disabled={!listingId}>Load</button>
          </div>
        </div>
        <p style={{color:"#666", marginTop:4}}>Only manager-approved reviews are displayed.</p>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:12}}>
          {items.map(r=>(
            <article key={r.id} style={{border:"1px solid #eee", borderRadius:10, padding:12}}>
              <div style={{fontWeight:600}}>{r.guestName ?? "Guest"}</div>
              <div style={{fontSize:12, color:"#666"}}>
                {r.submittedAt?.slice(0,10) ?? ""} • {r.rating ?? "—"}★
              </div>
              <p style={{marginTop:8}}>{r.text}</p>
            </article>
          ))}
        </div>

        {!items.length && <p style={{marginTop:10}}>No approved reviews yet for this listing.</p>}
      </section>
    </div>
  );
}
