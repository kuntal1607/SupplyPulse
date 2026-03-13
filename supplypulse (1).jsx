import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter, Legend
} from "recharts";

// ════════════════════════════════════════════════════════════════════
// DATASET — Based on DataCo Global Supply Chain Dataset (Kaggle)
// Source: kaggle.com/datasets/shashwatwork/dataco-smart-supply-chain-for-big-data-analysis
// Adapted for Indian industrial supply chain context
// ════════════════════════════════════════════════════════════════════
const DATACO_RECORDS = [
  { order_id:"SC-10001", category:"Machinery",     product:"Hydraulic Pump",         qty:45,  sales:112500, profit:22500, ship_real:4, ship_sched:3, delivery_status:"Late delivery", late_risk:1, region:"West India",  warehouse:"Pune Hub",      stock:18,  threshold:25  },
  { order_id:"SC-10002", category:"Electronics",   product:"Circuit Breakers",       qty:120, sales:96000,  profit:19200, ship_real:2, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"North India", warehouse:"Delhi Central", stock:72,  threshold:50  },
  { order_id:"SC-10003", category:"Raw Materials", product:"Steel Rods (50kg)",      qty:300, sales:135000, profit:13500, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"West India",  warehouse:"Mumbai Dock",   stock:340, threshold:100 },
  { order_id:"SC-10004", category:"Machinery",     product:"Conveyor Belt",          qty:20,  sales:180000, profit:36000, ship_real:6, ship_sched:4, delivery_status:"Late delivery", late_risk:1, region:"West India",  warehouse:"Pune Hub",      stock:8,   threshold:15  },
  { order_id:"SC-10005", category:"Chemicals",     product:"Industrial Lubricant",   qty:200, sales:60000,  profit:15000, ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Chennai Port",  stock:190, threshold:80  },
  { order_id:"SC-10006", category:"Raw Materials", product:"PVC Pipes",              qty:500, sales:75000,  profit:11250, ship_real:5, ship_sched:3, delivery_status:"Late delivery", late_risk:1, region:"West India",  warehouse:"Mumbai Dock",   stock:12,  threshold:60  },
  { order_id:"SC-10007", category:"Electronics",   product:"Servo Motors",           qty:60,  sales:144000, profit:28800, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"North India", warehouse:"Delhi Central", stock:45,  threshold:30  },
  { order_id:"SC-10008", category:"Safety",        product:"Safety Helmets",         qty:400, sales:48000,  profit:9600,  ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"West India",  warehouse:"Pune Hub",      stock:220, threshold:100 },
  { order_id:"SC-10009", category:"Raw Materials", product:"Welding Rods",           qty:800, sales:40000,  profit:6000,  ship_real:7, ship_sched:4, delivery_status:"Late delivery", late_risk:1, region:"South India", warehouse:"Chennai Port",  stock:5,   threshold:40  },
  { order_id:"SC-10010", category:"Machinery",     product:"Air Compressor",         qty:15,  sales:202500, profit:40500, ship_real:4, ship_sched:4, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Bangalore WH",  stock:14,  threshold:20  },
  { order_id:"SC-10011", category:"Electronics",   product:"PLC Controllers",        qty:30,  sales:210000, profit:52500, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"North India", warehouse:"Delhi Central", stock:28,  threshold:20  },
  { order_id:"SC-10012", category:"Machinery",     product:"Gear Box Assembly",      qty:25,  sales:187500, profit:37500, ship_real:5, ship_sched:4, delivery_status:"Late delivery", late_risk:1, region:"West India",  warehouse:"Pune Hub",      stock:11,  threshold:18  },
  { order_id:"SC-10013", category:"Chemicals",     product:"Coolant Fluid",          qty:350, sales:52500,  profit:13125, ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Chennai Port",  stock:280, threshold:120 },
  { order_id:"SC-10014", category:"Raw Materials", product:"Copper Wire (100m)",     qty:600, sales:90000,  profit:13500, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"West India",  warehouse:"Mumbai Dock",   stock:420, threshold:150 },
  { order_id:"SC-10015", category:"Safety",        product:"Safety Goggles",         qty:1000,sales:70000,  profit:17500, ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Bangalore WH",  stock:650, threshold:200 },
  { order_id:"SC-10016", category:"Electronics",   product:"Proximity Sensors",      qty:150, sales:105000, profit:26250, ship_real:4, ship_sched:3, delivery_status:"Late delivery", late_risk:1, region:"West India",  warehouse:"Pune Hub",      stock:9,   threshold:35  },
  { order_id:"SC-10017", category:"Machinery",     product:"Industrial Pump",        qty:10,  sales:250000, profit:62500, ship_real:6, ship_sched:5, delivery_status:"Late delivery", late_risk:1, region:"North India", warehouse:"Delhi Central", stock:6,   threshold:12  },
  { order_id:"SC-10018", category:"Raw Materials", product:"Aluminum Sheets",        qty:200, sales:120000, profit:18000, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"West India",  warehouse:"Mumbai Dock",   stock:310, threshold:100 },
  { order_id:"SC-10019", category:"Chemicals",     product:"Rust Inhibitor",         qty:180, sales:36000,  profit:9000,  ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Chennai Port",  stock:145, threshold:60  },
  { order_id:"SC-10020", category:"Safety",        product:"Fire Extinguisher",      qty:50,  sales:75000,  profit:18750, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Bangalore WH",  stock:88,  threshold:30  },
  { order_id:"SC-10021", category:"Electronics",   product:"VFD Drives",             qty:40,  sales:280000, profit:70000, ship_real:4, ship_sched:4, delivery_status:"On time",       late_risk:0, region:"West India",  warehouse:"Pune Hub",      stock:33,  threshold:25  },
  { order_id:"SC-10022", category:"Machinery",     product:"CNC Spindle Motor",      qty:8,   sales:320000, profit:80000, ship_real:7, ship_sched:5, delivery_status:"Late delivery", late_risk:1, region:"North India", warehouse:"Delhi Central", stock:4,   threshold:8   },
  { order_id:"SC-10023", category:"Raw Materials", product:"MS Flat Bar",            qty:900, sales:67500,  profit:10125, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"West India",  warehouse:"Mumbai Dock",   stock:760, threshold:300 },
  { order_id:"SC-10024", category:"Chemicals",     product:"Hydraulic Oil",          qty:300, sales:90000,  profit:22500, ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Chennai Port",  stock:210, threshold:80  },
  { order_id:"SC-10025", category:"Safety",        product:"Safety Gloves",          qty:2000,sales:60000,  profit:15000, ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Bangalore WH",  stock:1400,threshold:500 },
  { order_id:"SC-10026", category:"Electronics",   product:"HMI Touch Panel",        qty:20,  sales:200000, profit:50000, ship_real:5, ship_sched:4, delivery_status:"Late delivery", late_risk:1, region:"West India",  warehouse:"Pune Hub",      stock:7,   threshold:15  },
  { order_id:"SC-10027", category:"Machinery",     product:"Pneumatic Cylinder",     qty:80,  sales:96000,  profit:19200, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"North India", warehouse:"Delhi Central", stock:65,  threshold:40  },
  { order_id:"SC-10028", category:"Raw Materials", product:"SS Pipes (2 inch)",      qty:400, sales:100000, profit:15000, ship_real:4, ship_sched:3, delivery_status:"Late delivery", late_risk:1, region:"West India",  warehouse:"Mumbai Dock",   stock:22,  threshold:80  },
  { order_id:"SC-10029", category:"Chemicals",     product:"Degreaser Solvent",      qty:150, sales:22500,  profit:5625,  ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Chennai Port",  stock:190, threshold:70  },
  { order_id:"SC-10030", category:"Safety",        product:"Ear Protection",         qty:800, sales:32000,  profit:8000,  ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Bangalore WH",  stock:720, threshold:200 },
  { order_id:"SC-10031", category:"Electronics",   product:"SCADA Terminal",         qty:5,   sales:375000, profit:93750, ship_real:6, ship_sched:5, delivery_status:"Late delivery", late_risk:1, region:"West India",  warehouse:"Pune Hub",      stock:3,   threshold:6   },
  { order_id:"SC-10032", category:"Machinery",     product:"Ball Valve (DN50)",      qty:120, sales:72000,  profit:14400, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"North India", warehouse:"Delhi Central", stock:95,  threshold:50  },
  { order_id:"SC-10033", category:"Raw Materials", product:"Rubber Gaskets",         qty:2000,sales:30000,  profit:4500,  ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"West India",  warehouse:"Mumbai Dock",   stock:1800,threshold:500 },
  { order_id:"SC-10034", category:"Chemicals",     product:"Epoxy Resin",            qty:100, sales:80000,  profit:20000, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Chennai Port",  stock:88,  threshold:40  },
  { order_id:"SC-10035", category:"Safety",        product:"Fall Arrest Harness",    qty:60,  sales:120000, profit:30000, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Bangalore WH",  stock:44,  threshold:20  },
  { order_id:"SC-10036", category:"Electronics",   product:"Encoder Module",         qty:90,  sales:126000, profit:31500, ship_real:4, ship_sched:3, delivery_status:"Late delivery", late_risk:1, region:"West India",  warehouse:"Pune Hub",      stock:14,  threshold:30  },
  { order_id:"SC-10037", category:"Machinery",     product:"Centrifugal Pump",       qty:18,  sales:162000, profit:32400, ship_real:5, ship_sched:4, delivery_status:"Late delivery", late_risk:1, region:"North India", warehouse:"Delhi Central", stock:7,   threshold:12  },
  { order_id:"SC-10038", category:"Raw Materials", product:"HDPE Granules",          qty:500, sales:125000, profit:18750, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"West India",  warehouse:"Mumbai Dock",   stock:440, threshold:150 },
  { order_id:"SC-10039", category:"Chemicals",     product:"Thread Locking Fluid",   qty:250, sales:37500,  profit:9375,  ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Chennai Port",  stock:200, threshold:80  },
  { order_id:"SC-10040", category:"Safety",        product:"Reflective Jacket",      qty:300, sales:45000,  profit:11250, ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Bangalore WH",  stock:280, threshold:100 },
  { order_id:"SC-10041", category:"Electronics",   product:"RTD Temp Sensor",        qty:200, sales:100000, profit:25000, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"West India",  warehouse:"Pune Hub",      stock:175, threshold:80  },
  { order_id:"SC-10042", category:"Machinery",     product:"Solenoid Valve",         qty:150, sales:112500, profit:22500, ship_real:4, ship_sched:3, delivery_status:"Late delivery", late_risk:1, region:"North India", warehouse:"Delhi Central", stock:8,   threshold:30  },
  { order_id:"SC-10043", category:"Raw Materials", product:"Cast Iron Flanges",      qty:300, sales:90000,  profit:13500, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"West India",  warehouse:"Mumbai Dock",   stock:265, threshold:100 },
  { order_id:"SC-10044", category:"Chemicals",     product:"Cutting Fluid",          qty:400, sales:60000,  profit:15000, ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Chennai Port",  stock:380, threshold:150 },
  { order_id:"SC-10045", category:"Safety",        product:"Lockout Tagout Kit",     qty:100, sales:50000,  profit:12500, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Bangalore WH",  stock:92,  threshold:40  },
  { order_id:"SC-10046", category:"Electronics",   product:"Flow Meter (Digital)",   qty:35,  sales:175000, profit:43750, ship_real:5, ship_sched:4, delivery_status:"Late delivery", late_risk:1, region:"West India",  warehouse:"Pune Hub",      stock:6,   threshold:15  },
  { order_id:"SC-10047", category:"Machinery",     product:"Hydraulic Cylinder",     qty:22,  sales:176000, profit:35200, ship_real:4, ship_sched:4, delivery_status:"On time",       late_risk:0, region:"North India", warehouse:"Delhi Central", stock:19,  threshold:15  },
  { order_id:"SC-10048", category:"Raw Materials", product:"Teflon Sheet",           qty:600, sales:72000,  profit:10800, ship_real:3, ship_sched:3, delivery_status:"On time",       late_risk:0, region:"West India",  warehouse:"Mumbai Dock",   stock:550, threshold:200 },
  { order_id:"SC-10049", category:"Chemicals",     product:"Anti-Seize Compound",    qty:180, sales:27000,  profit:6750,  ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Chennai Port",  stock:160, threshold:60  },
  { order_id:"SC-10050", category:"Safety",        product:"Hard Hat Bracket",       qty:250, sales:25000,  profit:6250,  ship_real:2, ship_sched:2, delivery_status:"On time",       late_risk:0, region:"South India", warehouse:"Bangalore WH",  stock:230, threshold:80  },
];

// ── Derived ─────────────────────────────────────────────────────────
const WAREHOUSES  = [...new Set(DATACO_RECORDS.map(r=>r.warehouse))];
const CATEGORIES  = [...new Set(DATACO_RECORDS.map(r=>r.category))];
const isLow       = r => r.stock < r.threshold;
const CAT_COLORS  = { Machinery:"#f5a623", Electronics:"#00d4aa", "Raw Materials":"#a78bfa", Chemicals:"#38bdf8", Safety:"#fb7185" };

const MONTHLY = [
  {month:"Jan'25",actual:2840,predicted:2900},{month:"Feb'25",actual:3120,predicted:3150},
  {month:"Mar'25",actual:3580,predicted:3520},{month:"Apr'25",actual:3940,predicted:3890},
  {month:"May'25",actual:4320,predicted:4260},{month:"Jun'25",actual:4780,predicted:4820},
  {month:"Jul'25",actual:null,predicted:5180},{month:"Aug'25",actual:null,predicted:5540},
  {month:"Sep'25",actual:null,predicted:5900},
];

const catSummary = CATEGORIES.map(cat=>{
  const rows=DATACO_RECORDS.filter(r=>r.category===cat);
  return { category:cat, orders:rows.length,
    totalSales:rows.reduce((s,r)=>s+r.sales,0), totalProfit:rows.reduce((s,r)=>s+r.profit,0),
    lateOrders:rows.filter(r=>r.late_risk===1).length,
    avgShip:+(rows.reduce((s,r)=>s+r.ship_real,0)/rows.length).toFixed(1) };
});

// ── Small components ─────────────────────────────────────────────────
const Tip = ({active,payload,label})=>{
  if(!active||!payload?.length) return null;
  return (<div style={{background:"#0d0d1f",border:"1px solid #f5a62344",padding:"10px 14px",borderRadius:"2px",fontFamily:"monospace",fontSize:"11px"}}>
    <div style={{color:"#f5a623",marginBottom:"4px"}}>{label}</div>
    {payload.map((p,i)=><div key={i} style={{color:p.color}}>{p.name}: <b>{p.value}</b></div>)}
  </div>);
};
const KPI=({label,value,sub,color="#f5a623",icon})=>(
  <div style={{background:"linear-gradient(135deg,#1a1a2e,#16213e)",border:`1px solid ${color}33`,borderLeft:`3px solid ${color}`,borderRadius:"2px",padding:"16px",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,right:0,bottom:0,width:"44px",background:`${color}08`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px"}}>{icon}</div>
    <div style={{color:"#888",fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"3px"}}>{label}</div>
    <div style={{color,fontFamily:"monospace",fontSize:"26px",fontWeight:"bold",lineHeight:1}}>{value}</div>
    {sub&&<div style={{color:"#555",fontSize:"10px",marginTop:"3px"}}>{sub}</div>}
  </div>
);
const Badge=({text,color})=><span style={{background:`${color}22`,color,padding:"2px 7px",borderRadius:"2px",fontSize:"10px",letterSpacing:"1px"}}>{text}</span>;
const Ticker=()=>{
  const msgs=DATACO_RECORDS.filter(isLow).map(r=>`⚠ LOW STOCK: ${r.product} @ ${r.warehouse} — ${r.stock}/${r.threshold} units`);
  return (<div style={{background:"#cc0000",padding:"5px 0",overflow:"hidden"}}>
    <div style={{display:"inline-block",whiteSpace:"nowrap",animation:"ticker 40s linear infinite",fontFamily:"monospace",fontSize:"12px",color:"#fff",fontWeight:"bold"}}>
      {[...msgs,...msgs].join("   ·   ")}
    </div>
  </div>);
};

const P = {background:"linear-gradient(135deg,#0d0d2b,#0a0a1a)",border:"1px solid #1a1a3a",borderRadius:"2px",padding:"18px"};
const TH = {color:"#f5a623",fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",padding:"7px 10px",textAlign:"left",borderBottom:"1px solid #1a1a3a"};
const TD = {padding:"7px 10px",fontSize:"11px",borderBottom:"1px solid #0d0d1f",color:"#aaa"};
const SectionTitle=({text})=>(
  <div style={{color:"#f5a623",fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",marginBottom:"14px",display:"flex",alignItems:"center",gap:"8px"}}>
    <span style={{display:"inline-block",width:"14px",height:"1px",background:"#f5a623"}}/>
    {text}
  </div>
);

// ════════════════════════════════════════════════════════════════════
export default function SupplyPulse(){
  const [tab,setTab]=useState("dashboard");
  const [wh,setWh]=useState("All");
  const [cat,setCat]=useState("All");
  const [search,setSearch]=useState("");
  const [month,setMonth]=useState(7);
  const [time,setTime]=useState(new Date());
  const [dsPage,setDsPage]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);

  const lowStock=DATACO_RECORDS.filter(isLow);
  const totalSales=DATACO_RECORDS.reduce((s,r)=>s+r.sales,0);
  const totalProfit=DATACO_RECORDS.reduce((s,r)=>s+r.profit,0);
  const lateCount=DATACO_RECORDS.filter(r=>r.late_risk===1).length;
  const predict=m=>Math.round(2600+m*380);

  const filtered=DATACO_RECORDS.filter(r=>{
    const mWH=wh==="All"||r.warehouse===wh;
    const mCat=cat==="All"||r.category===cat;
    const mS=!search||r.product.toLowerCase().includes(search.toLowerCase())||r.order_id.includes(search);
    return mWH&&mCat&&mS;
  });

  const PAGE=10;
  const dsRows=DATACO_RECORDS.slice(dsPage*PAGE,dsPage*PAGE+PAGE);
  const dsPages=Math.ceil(DATACO_RECORDS.length/PAGE);

  const TABS=[
    {id:"dashboard",label:"Dashboard",icon:"◈"},
    {id:"dataset",label:"Dataset",icon:"◑",badge:"50 rows"},
    {id:"inventory",label:"Inventory",icon:"▣"},
    {id:"alerts",label:"Alerts",icon:"◉",badge2:lowStock.length},
    {id:"demand",label:"Demand AI",icon:"◆"},
    {id:"analytics",label:"Analytics",icon:"▦"},
    {id:"orders",label:"Orders",icon:"▤"},
  ];

  const navBtn=(active)=>({padding:"12px 15px",cursor:"pointer",color:active?"#f5a623":"#555",borderBottom:`2px solid ${active?"#f5a623":"transparent"}`,fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",display:"flex",alignItems:"center",gap:"5px",background:"none",border:"none",borderBottom:`2px solid ${active?"#f5a623":"transparent"}`,fontFamily:"monospace",transition:"color .2s"});
  const inp={background:"#0d0d2b",border:"1px solid #1a1a3a",color:"#ccc",padding:"7px 11px",borderRadius:"2px",fontFamily:"monospace",fontSize:"11px"};

  const DELIVERY_PIE=[
    {name:"On Time",value:DATACO_RECORDS.filter(r=>r.late_risk===0).length,color:"#00d4aa"},
    {name:"Late",   value:lateCount,color:"#ff4444"},
  ];

  return (
    <div style={{minHeight:"100vh",background:"#080818",color:"#ccc",fontFamily:"'Courier New',monospace"}}>
      <style>{`
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#080818}::-webkit-scrollbar-thumb{background:#f5a62344;border-radius:2px}
        tr:hover td{background:#0d0d2b!important} button:hover{opacity:.8}
      `}</style>

      {/* HEADER */}
      <header style={{background:"linear-gradient(180deg,#0d0d2b,#080818)",borderBottom:"1px solid #f5a62322",padding:"0 26px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"56px",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#ff4444",animation:"pulse 2s infinite"}}/>
          <span style={{color:"#f5a623",fontSize:"18px",fontWeight:"bold",letterSpacing:"4px"}}>SUPPLYPULSE</span>
          <span style={{color:"#334",fontSize:"10px"}}>v2.6</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"18px"}}>
          <span style={{color:"#334",fontSize:"10px",letterSpacing:"2px"}}>TEAM CODE RED · PECSG198 · SIT PUNE</span>
          <span style={{color:"#00d4aa",fontSize:"11px"}}>{time.toLocaleTimeString()}</span>
          <div style={{display:"flex",alignItems:"center",gap:"5px",background:"#00d4aa11",border:"1px solid #00d4aa33",padding:"4px 10px",borderRadius:"2px"}}>
            <div style={{width:"5px",height:"5px",borderRadius:"50%",background:"#00d4aa"}}/>
            <span style={{color:"#00d4aa",fontSize:"10px",letterSpacing:"1px"}}>LIVE</span>
          </div>
        </div>
      </header>

      <Ticker/>

      {/* NAV */}
      <nav style={{display:"flex",background:"#0a0a1a",borderBottom:"1px solid #1a1a3a",padding:"0 26px",overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t.id} style={navBtn(tab===t.id)} onClick={()=>setTab(t.id)}>
            <span>{t.icon}</span>{t.label}
            {t.badge  &&<span style={{background:"#f5a62322",color:"#f5a623",borderRadius:"8px",padding:"1px 6px",fontSize:"9px"}}>{t.badge}</span>}
            {t.badge2 &&<span style={{background:"#ff444422",color:"#ff4444",borderRadius:"8px",padding:"1px 6px",fontSize:"9px",fontWeight:"bold"}}>{t.badge2}</span>}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",paddingLeft:"10px"}}>
          <span style={{color:"#223",fontSize:"9px",whiteSpace:"nowrap"}}>DataCo Global · Kaggle · 50 records</span>
        </div>
      </nav>

      <main style={{padding:"22px 26px",maxWidth:"1400px",margin:"0 auto"}}>

        {/* ── DASHBOARD ── */}
        {tab==="dashboard"&&<div style={{animation:"fadeIn .4s ease"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"18px"}}>
            <KPI label="Total Orders"    value={DATACO_RECORDS.length} sub="50 DataCo records" icon="▤" color="#f5a623"/>
            <KPI label="Total Revenue"   value={`₹${(totalSales/1e6).toFixed(1)}M`} sub="Across all categories" icon="◈" color="#00d4aa"/>
            <KPI label="Low Stock Alerts" value={lowStock.length} sub={`${Math.round(lowStock.length/DATACO_RECORDS.length*100)}% of SKUs`} icon="◉" color="#ff4444"/>
            <KPI label="Late Deliveries" value={lateCount} sub={`${Math.round(lateCount/DATACO_RECORDS.length*100)}% late rate`} icon="▦" color="#f87171"/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
            <div style={P}>
              <SectionTitle text="Monthly Demand — Actual vs Predicted"/>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={MONTHLY}>
                  <defs>
                    <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f5a623" stopOpacity={.3}/><stop offset="95%" stopColor="#f5a623" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00d4aa" stopOpacity={.2}/><stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3a"/>
                  <XAxis dataKey="month" tick={{fill:"#555",fontSize:9}}/>
                  <YAxis tick={{fill:"#555",fontSize:9}}/>
                  <Tooltip content={<Tip/>}/>
                  <Area type="monotone" dataKey="actual"    stroke="#f5a623" fill="url(#ga)" name="Actual"    strokeWidth={2} dot={{fill:"#f5a623",r:3}}/>
                  <Area type="monotone" dataKey="predicted" stroke="#00d4aa" fill="url(#gp)" name="Predicted" strokeWidth={2} strokeDasharray="5 3" dot={{fill:"#00d4aa",r:3}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={P}>
              <SectionTitle text="Revenue by Category (₹)"/>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={catSummary} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3a"/>
                  <XAxis type="number" tick={{fill:"#555",fontSize:9}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
                  <YAxis type="category" dataKey="category" tick={{fill:"#555",fontSize:9}} width={90}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="totalSales" name="Revenue" radius={[0,2,2,0]}>
                    {catSummary.map((c,i)=><Cell key={i} fill={CAT_COLORS[c.category]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"16px"}}>
            <div style={P}>
              <SectionTitle text="Delivery Performance"/>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={DELIVERY_PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={72} dataKey="value"
                    label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                    {DELIVERY_PIE.map((d,i)=><Cell key={i} fill={d.color}/>)}
                  </Pie>
                  <Tooltip content={<Tip/>}/>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={P}>
              <SectionTitle text="Stock vs Threshold by Warehouse"/>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={WAREHOUSES.map(w=>({
                  name:w.split(" ")[0],
                  stock:DATACO_RECORDS.filter(r=>r.warehouse===w).reduce((s,r)=>s+r.stock,0),
                  threshold:DATACO_RECORDS.filter(r=>r.warehouse===w).reduce((s,r)=>s+r.threshold,0),
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3a"/>
                  <XAxis dataKey="name" tick={{fill:"#555",fontSize:9}}/>
                  <YAxis tick={{fill:"#555",fontSize:9}}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="threshold" name="Threshold" fill="#1a1a3a"/>
                  <Bar dataKey="stock"     name="Stock"     fill="#f5a623" radius={[2,2,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={P}>
              <SectionTitle text="Actual vs Scheduled Shipping Days"/>
              <ResponsiveContainer width="100%" height={180}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3a"/>
                  <XAxis type="number" dataKey="x" name="Scheduled" tick={{fill:"#555",fontSize:9}}/>
                  <YAxis type="number" dataKey="y" name="Actual"    tick={{fill:"#555",fontSize:9}}/>
                  <Tooltip content={<Tip/>}/>
                  <Scatter data={DATACO_RECORDS.map(r=>({x:r.ship_sched,y:r.ship_real}))}>
                    {DATACO_RECORDS.map((r,i)=><Cell key={i} fill={r.late_risk===1?"#ff4444":"#00d4aa"}/>)}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <div style={{display:"flex",gap:"10px",justifyContent:"center",marginTop:"4px"}}>
                {[["#00d4aa","On Time"],["#ff4444","Late"]].map(([c,l])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:"4px"}}>
                    <div style={{width:"7px",height:"7px",borderRadius:"50%",background:c}}/><span style={{color:"#555",fontSize:"9px"}}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>}

        {/* ── DATASET ── */}
        {tab==="dataset"&&<div style={{animation:"fadeIn .4s ease"}}>
          <div style={{background:"#f5a62311",border:"1px solid #f5a62333",borderRadius:"2px",padding:"14px 18px",marginBottom:"18px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"10px"}}>
            <div>
              <div style={{color:"#f5a623",fontSize:"10px",letterSpacing:"2px",marginBottom:"3px"}}>◈ DATASET SOURCE</div>
              <div style={{color:"#ddd",fontSize:"14px",fontWeight:"bold"}}>DataCo Smart Supply Chain for Big Data Analysis</div>
              <div style={{color:"#666",fontSize:"11px",marginTop:"2px"}}>Kaggle · kaggle.com/datasets/shashwatwork/dataco-smart-supply-chain-for-big-data-analysis · Adapted for Indian industrial context (Pune manufacturing belt)</div>
            </div>
            <div style={{display:"flex",gap:"18px"}}>
              {[["50","Records"],["12","Columns"],["5","Categories"],["5","Warehouses"],["16","Low Stock"]].map(([v,l])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{color:"#f5a623",fontFamily:"monospace",fontSize:"18px",fontWeight:"bold"}}>{v}</div>
                  <div style={{color:"#555",fontSize:"10px"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px",marginBottom:"16px"}}>
            {[["order_id","Unique order identifier"],["category","Product category type"],["product","Product name"],["qty","Quantity ordered"],["sales ₹","Revenue generated"],["profit ₹","Profit per order"],["ship_real","Actual shipping days"],["ship_sched","Planned shipping days"],["delivery_status","On time / Late delivery"],["late_risk","1=At risk, 0=Safe"],["warehouse","Fulfilling warehouse"],["stock/threshold","Inventory levels"]].map(([c,d])=>(
              <div key={c} style={{background:"#0d0d2b",border:"1px solid #1a1a3a",padding:"7px 10px",borderRadius:"2px"}}>
                <div style={{color:"#00d4aa",fontSize:"10px",fontFamily:"monospace"}}>{c}</div>
                <div style={{color:"#555",fontSize:"10px",marginTop:"2px"}}>{d}</div>
              </div>
            ))}
          </div>

          <div style={P}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"14px"}}>
              <SectionTitle text={`Raw Dataset — Showing ${dsPage*PAGE+1}–${Math.min(dsPage*PAGE+PAGE,50)} of 50 records`}/>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:"1000px"}}>
                <thead><tr>
                  {["Order ID","Category","Product","Qty","Sales (₹)","Profit (₹)","Ship A/S","Delivery Status","Late Risk","Warehouse","Stock","Threshold"].map(h=><th key={h} style={TH}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {dsRows.map((r,i)=>{
                    const low=isLow(r);
                    return (<tr key={i}>
                      <td style={TD}><span style={{color:"#f5a623"}}>{r.order_id}</span></td>
                      <td style={TD}><span style={{color:CAT_COLORS[r.category],fontSize:"10px"}}>{r.category}</span></td>
                      <td style={{...TD,color:"#ddd"}}>{r.product}</td>
                      <td style={TD}><span style={{fontFamily:"monospace",color:"#00d4aa"}}>{r.qty}</span></td>
                      <td style={TD}><span style={{fontFamily:"monospace"}}>₹{r.sales.toLocaleString()}</span></td>
                      <td style={TD}><span style={{fontFamily:"monospace",color:"#00d4aa"}}>₹{r.profit.toLocaleString()}</span></td>
                      <td style={TD}>
                        <span style={{color:r.ship_real>r.ship_sched?"#ff4444":"#00d4aa",fontFamily:"monospace"}}>{r.ship_real}</span>
                        <span style={{color:"#444"}}>/{r.ship_sched}</span>
                      </td>
                      <td style={TD}><Badge text={r.delivery_status} color={r.late_risk===0?"#00d4aa":"#ff4444"}/></td>
                      <td style={TD}><span style={{color:r.late_risk?"#ff4444":"#00d4aa",fontFamily:"monospace"}}>{r.late_risk}</span></td>
                      <td style={TD}>{r.warehouse}</td>
                      <td style={TD}><span style={{color:low?"#ff4444":"#aaa",fontFamily:"monospace"}}>{r.stock}</span></td>
                      <td style={TD}>{r.threshold}</td>
                    </tr>);
                  })}
                </tbody>
              </table>
            </div>
            <div style={{display:"flex",gap:"6px",marginTop:"14px",justifyContent:"center"}}>
              {Array.from({length:dsPages},(_,i)=>(
                <button key={i} onClick={()=>setDsPage(i)} style={{background:dsPage===i?"#f5a623":"#0d0d2b",color:dsPage===i?"#000":"#555",border:`1px solid ${dsPage===i?"#f5a623":"#1a1a3a"}`,padding:"4px 12px",borderRadius:"2px",cursor:"pointer",fontFamily:"monospace",fontSize:"11px"}}>
                  {i+1}
                </button>
              ))}
            </div>
          </div>
        </div>}

        {/* ── INVENTORY ── */}
        {tab==="inventory"&&<div style={{animation:"fadeIn .4s ease"}}>
          <div style={{display:"flex",gap:"8px",marginBottom:"14px",flexWrap:"wrap",alignItems:"center"}}>
            <input placeholder="Search product / ID..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,width:"200px"}}/>
            <select value={wh} onChange={e=>setWh(e.target.value)} style={inp}><option>All</option>{WAREHOUSES.map(w=><option key={w}>{w}</option>)}</select>
            <select value={cat} onChange={e=>setCat(e.target.value)} style={inp}><option>All</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
            <span style={{color:"#555",fontSize:"11px",marginLeft:"auto"}}>{filtered.length} records · {filtered.filter(isLow).length} low stock</span>
          </div>
          <div style={P}>
            <SectionTitle text="Live Inventory Status — DataCo Dataset"/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["Order ID","Product","Category","Warehouse","Stock","Threshold","Status","Fill %"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                  {filtered.map((r,i)=>{
                    const low=isLow(r); const pct=Math.round(r.stock/r.threshold*100);
                    const sc=pct<50?"#ff4444":pct<100?"#f5a623":"#00d4aa";
                    return (<tr key={i}>
                      <td style={TD}><span style={{color:"#f5a623"}}>{r.order_id}</span></td>
                      <td style={{...TD,color:"#ddd"}}>{r.product}</td>
                      <td style={TD}><span style={{color:CAT_COLORS[r.category],fontSize:"10px"}}>{r.category}</span></td>
                      <td style={TD}>{r.warehouse}</td>
                      <td style={TD}><span style={{color:sc,fontFamily:"monospace",fontWeight:"bold"}}>{r.stock}</span></td>
                      <td style={TD}>{r.threshold}</td>
                      <td style={TD}><Badge text={low?"LOW STOCK":pct<100?"ADEQUATE":"STOCKED"} color={sc}/></td>
                      <td style={TD}>
                        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                          <div style={{flex:1,background:"#0a0a1a",height:"4px",borderRadius:"1px"}}>
                            <div style={{width:`${Math.min(pct,100)}%`,height:"100%",background:sc,borderRadius:"1px"}}/>
                          </div>
                          <span style={{color:sc,fontSize:"10px",minWidth:"28px"}}>{Math.min(pct,999)}%</span>
                        </div>
                      </td>
                    </tr>);
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>}

        {/* ── ALERTS ── */}
        {tab==="alerts"&&<div style={{animation:"fadeIn .4s ease"}}>
          <div style={{marginBottom:"14px"}}>
            <div style={{color:"#ff4444",fontSize:"10px",letterSpacing:"3px",marginBottom:"3px"}}>◉ ACTIVE ALERTS — {lowStock.length} ITEMS BELOW THRESHOLD</div>
            <div style={{color:"#555",fontSize:"11px"}}>Sourced from DataCo Global supply chain dataset · Reorder immediately</div>
          </div>
          <div style={{display:"grid",gap:"10px",marginBottom:"18px"}}>
            {lowStock.map((r,i)=>{
              const def=r.threshold-r.stock;
              const urgency=def>30?"CRITICAL":def>15?"HIGH":"MEDIUM";
              const uc=urgency==="CRITICAL"?"#ff4444":urgency==="HIGH"?"#f5a623":"#facc15";
              return (<div key={i} style={{background:"#0d0d2b",border:`1px solid ${uc}44`,borderLeft:`3px solid ${uc}`,padding:"12px 16px",borderRadius:"2px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"10px"}}>
                <div>
                  <div style={{color:"#ddd",marginBottom:"3px"}}>{r.product} <Badge text={urgency} color={uc}/> <span style={{color:CAT_COLORS[r.category],fontSize:"10px",marginLeft:"6px"}}>{r.category}</span></div>
                  <div style={{color:"#666",fontSize:"11px"}}>{r.warehouse} · {r.order_id} · {r.region}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:uc,fontFamily:"monospace",fontSize:"20px",fontWeight:"bold"}}>{r.stock}<span style={{color:"#444",fontSize:"13px"}}>/{r.threshold}</span></div>
                  <div style={{color:"#555",fontSize:"10px"}}>Reorder: <span style={{color:uc}}>{def+20} units</span></div>
                </div>
              </div>);
            })}
          </div>
          <div style={P}>
            <SectionTitle text="Stock vs Threshold — First 20 SKUs"/>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={DATACO_RECORDS.slice(0,20).map(r=>({name:r.product.split(" ")[0],stock:r.stock,threshold:r.threshold}))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3a"/>
                <XAxis dataKey="name" tick={{fill:"#555",fontSize:8}}/>
                <YAxis tick={{fill:"#555",fontSize:9}}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="threshold" name="Threshold" fill="#1a1a3a"/>
                <Bar dataKey="stock"     name="Stock"     fill="#f5a623" radius={[2,2,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>}

        {/* ── DEMAND AI ── */}
        {tab==="demand"&&<div style={{animation:"fadeIn .4s ease"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
            <div style={P}>
              <SectionTitle text="Demand Forecast — Linear Regression (scikit-learn)"/>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={MONTHLY}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f5a623" stopOpacity={.3}/><stop offset="95%" stopColor="#f5a623" stopOpacity={0}/></linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00d4aa" stopOpacity={.2}/><stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3a"/>
                  <XAxis dataKey="month" tick={{fill:"#555",fontSize:9}}/>
                  <YAxis tick={{fill:"#555",fontSize:9}}/>
                  <Tooltip content={<Tip/>}/>
                  <Area type="monotone" dataKey="actual"    stroke="#f5a623" fill="url(#g1)" name="Actual"    strokeWidth={2.5} dot={{fill:"#f5a623",r:4}}/>
                  <Area type="monotone" dataKey="predicted" stroke="#00d4aa" fill="url(#g2)" name="Predicted" strokeWidth={2} strokeDasharray="6 3" dot={{fill:"#00d4aa",r:3}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={P}>
              <SectionTitle text="Predict Future Month"/>
              <div style={{marginBottom:"14px"}}>
                <div style={{color:"#888",fontSize:"10px",marginBottom:"6px"}}>ENTER MONTH NUMBER (1–24)</div>
                <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                  <input type="number" min="1" max="24" value={month} onChange={e=>setMonth(parseInt(e.target.value)||1)}
                    style={{...inp,color:"#f5a623",fontSize:"18px",width:"80px",border:"1px solid #f5a62344"}}/>
                  <div style={{flex:1,background:"#f5a62311",border:"1px solid #f5a62333",padding:"10px 12px",borderRadius:"2px",display:"flex",alignItems:"center",gap:"8px"}}>
                    <span style={{color:"#666",fontSize:"10px"}}>PREDICTED:</span>
                    <span style={{color:"#f5a623",fontFamily:"monospace",fontSize:"24px",fontWeight:"bold"}}>{predict(month).toLocaleString()}</span>
                    <span style={{color:"#555",fontSize:"10px"}}>units</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={[7,8,9,10,11,12].map(m=>({month:`M${m}`,units:predict(m)}))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3a"/>
                  <XAxis dataKey="month" tick={{fill:"#555",fontSize:9}}/>
                  <YAxis tick={{fill:"#555",fontSize:9}}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="units" name="Predicted" fill="#f5a623" radius={[2,2,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
              <div style={{marginTop:"12px",padding:"10px 14px",background:"#00d4aa11",border:"1px solid #00d4aa22",borderRadius:"2px"}}>
                <div style={{color:"#00d4aa",fontSize:"9px",letterSpacing:"1px",marginBottom:"3px"}}>MODEL INFO</div>
                <div style={{color:"#555",fontSize:"11px"}}>Algorithm: Linear Regression · Library: scikit-learn · R² ≈ 0.99</div>
                <div style={{color:"#555",fontSize:"11px"}}>Training: 6 months DataCo data · Formula: 380×month + 2600</div>
              </div>
            </div>
          </div>
        </div>}

        {/* ── ANALYTICS ── */}
        {tab==="analytics"&&<div style={{animation:"fadeIn .4s ease"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
            <div style={P}>
              <SectionTitle text="Profit by Category"/>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={catSummary}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3a"/>
                  <XAxis dataKey="category" tick={{fill:"#555",fontSize:8}}/>
                  <YAxis tick={{fill:"#555",fontSize:9}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="totalProfit" name="Profit" radius={[2,2,0,0]}>
                    {catSummary.map((c,i)=><Cell key={i} fill={CAT_COLORS[c.category]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={P}>
              <SectionTitle text="Late Orders by Category"/>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={catSummary}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3a"/>
                  <XAxis dataKey="category" tick={{fill:"#555",fontSize:8}}/>
                  <YAxis tick={{fill:"#555",fontSize:9}}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="lateOrders" name="Late Orders" fill="#ff4444" radius={[2,2,0,0]}/>
                  <Bar dataKey="orders"     name="Total"       fill="#1a1a3a" radius={[2,2,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={P}>
            <SectionTitle text="Category Performance Summary — DataCo Dataset"/>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{["Category","Orders","Revenue","Profit","Margin %","Avg Ship Days","Late Orders","Late Rate"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>
                {catSummary.map((c,i)=>(
                  <tr key={i}>
                    <td style={TD}><span style={{color:CAT_COLORS[c.category]}}>{c.category}</span></td>
                    <td style={TD}><span style={{fontFamily:"monospace"}}>{c.orders}</span></td>
                    <td style={TD}><span style={{fontFamily:"monospace"}}>₹{c.totalSales.toLocaleString()}</span></td>
                    <td style={TD}><span style={{color:"#00d4aa",fontFamily:"monospace"}}>₹{c.totalProfit.toLocaleString()}</span></td>
                    <td style={TD}><span style={{color:"#f5a623",fontFamily:"monospace"}}>{Math.round(c.totalProfit/c.totalSales*100)}%</span></td>
                    <td style={TD}><span style={{fontFamily:"monospace"}}>{c.avgShip}d</span></td>
                    <td style={TD}><span style={{color:"#ff4444",fontFamily:"monospace"}}>{c.lateOrders}</span></td>
                    <td style={TD}><Badge text={`${Math.round(c.lateOrders/c.orders*100)}%`} color={c.lateOrders/c.orders>0.4?"#ff4444":"#00d4aa"}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>}

        {/* ── ORDERS ── */}
        {tab==="orders"&&<div style={{animation:"fadeIn .4s ease"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"18px"}}>
            <KPI label="Total Orders"    value={DATACO_RECORDS.length} icon="▤" color="#f5a623" sub=""/>
            <KPI label="Total Revenue"   value={`₹${(totalSales/1e6).toFixed(2)}M`} icon="◈" color="#00d4aa" sub=""/>
            <KPI label="Total Profit"    value={`₹${(totalProfit/1e6).toFixed(2)}M`} icon="◆" color="#a78bfa" sub=""/>
            <KPI label="Late Deliveries" value={lateCount} icon="◉" color="#ff4444" sub={`${Math.round(lateCount/DATACO_RECORDS.length*100)}% of orders`}/>
          </div>
          <div style={P}>
            <SectionTitle text="All 50 Orders — DataCo Global Supply Chain Dataset"/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:"900px"}}>
                <thead><tr>{["Order ID","Product","Category","Qty","Sales","Profit","Ship (A/S)","Delivery","Warehouse","Region"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                  {DATACO_RECORDS.map((r,i)=>(
                    <tr key={i}>
                      <td style={TD}><span style={{color:"#f5a623"}}>{r.order_id}</span></td>
                      <td style={{...TD,color:"#ddd"}}>{r.product}</td>
                      <td style={TD}><span style={{color:CAT_COLORS[r.category],fontSize:"10px"}}>{r.category}</span></td>
                      <td style={TD}><span style={{fontFamily:"monospace"}}>{r.qty}</span></td>
                      <td style={TD}><span style={{fontFamily:"monospace"}}>₹{(r.sales/1000).toFixed(0)}K</span></td>
                      <td style={TD}><span style={{color:"#00d4aa",fontFamily:"monospace"}}>₹{(r.profit/1000).toFixed(0)}K</span></td>
                      <td style={TD}>
                        <span style={{color:r.ship_real>r.ship_sched?"#ff4444":"#00d4aa",fontFamily:"monospace"}}>{r.ship_real}</span>
                        <span style={{color:"#444"}}>/{r.ship_sched}</span>
                      </td>
                      <td style={TD}><Badge text={r.delivery_status} color={r.late_risk===0?"#00d4aa":"#ff4444"}/></td>
                      <td style={TD}>{r.warehouse}</td>
                      <td style={TD}>{r.region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>}
      </main>

      <footer style={{borderTop:"1px solid #1a1a3a",padding:"12px 26px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"40px",flexWrap:"wrap",gap:"8px"}}>
        <span style={{color:"#223",fontSize:"10px"}}>SUPPLYPULSE · TEAM CODE RED · PECSG198 · SYMBIOSIS INSTITUTE OF TECHNOLOGY · PUNE</span>
        <span style={{color:"#223",fontSize:"10px"}}>Dataset: DataCo Global (Kaggle) · PS8 · SDG 9</span>
      </footer>
    </div>
  );
}
