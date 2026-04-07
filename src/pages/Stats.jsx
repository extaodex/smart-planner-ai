import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Brain, Zap, Download, Loader2 } from 'lucide-react';
import { getAIStats } from '../services/api';

const container = { hidden:{opacity:0}, show:{opacity:1,transition:{staggerChildren:0.08}} };
const item = { hidden:{opacity:0,y:16}, show:{opacity:1,y:0,transition:{ease:[0.16,1,0.3,1],duration:0.65}} };

const DEMO_STATS = {
  disciplineScore: 88,
  completionRate:  76,
  focusHours:      68,
  streak:          5,
  bestDay:  'Mardi',
  bestHour: '14:00',
  insights: [
    { type:'peak',    message:'Concentration +20% le matin (08:00–10:00)' },
    { type:'streak',  message:'Série de 5 jours consécutifs 🔥' },
    { type:'warning', message:'Mathématiques sous-révisée cette semaine' },
  ],
};

const subjects = [
  { name:'Mathématiques', hours:18, color:'#6366f1' },
  { name:'Physique',      hours:12, color:'#a855f7' },
  { name:'Informatique',  hours:22, color:'#818cf8' },
  { name:'Philosophie',   hours:7,  color:'#f59e0b' },
  { name:'Chimie',        hours:9,  color:'#10b981' },
];
const maxHours = Math.max(...subjects.map(s => s.hours));

const weekData = [60, 75, 50, 85, 70, 90, 65];
const days     = ['L','M','M','J','V','S','D'];

const insightIcons = { peak: Zap, streak: TrendingUp, warning: Brain };
const insightColors = { peak:'#6366f1', streak:'#4ade80', warning:'#f87171' };

const Stats = () => {
  const [stats, setStats] = useState(DEMO_STATS);
  const [range, setRange] = useState('Semaine');
  const [loading, setLoading] = useState(true);
  const [processedData, setProcessedData] = useState(weekData);

  useEffect(() => {
    fetchStats();
  }, [range]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Mocking range-specific data
      if (range === 'Mois') setProcessedData([80, 70, 90, 85, 75, 95, 88]);
      else if (range === 'Trimestre') setProcessedData([50, 60, 55, 70, 65, 80, 75]);
      else setProcessedData(weekData);

      const r = await getAIStats();
      setStats(r.data);
    } catch {
      setStats(DEMO_STATS);
    } finally { setLoading(false); }
  };

  const handleExport = () => {
    const data = JSON.stringify({ stats, range, date: new Date().toISOString() });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-planner-stats-${range}.json`;
    link.click();
  };

  if (loading && !stats) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}>
      <Loader2 style={{ width:40, height:40, color:'#6366f1', animation:'spin 1s linear infinite' }} />
    </div>
  );

  const ranges = ['Semaine', 'Mois', 'Trimestre'];

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ display:'flex', gap:'1.5rem', flexDirection: window.innerWidth <= 1200 ? 'column' : 'row' }}>
      {/* ── Main ── */}
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:'1.5rem' }}>

        {/* Header */}
        <motion.div variants={item} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'2rem', fontWeight:700, letterSpacing:'-0.02em' }}>Statistiques</h1>
            <p style={{ color:'#adaaaa', fontSize:'0.875rem', marginTop:4 }}>Analyse IA de vos performances</p>
          </div>
          <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
            {ranges.map(r => (
              <motion.button key={r} onClick={()=>setRange(r)} whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                style={{ padding:'0.45rem 0.9rem', borderRadius:'0.6rem', border: range===r ? '1px solid #6366f1' : '1px solid #262626', background: range===r ? 'rgba(99,102,241,0.15)' : '#1a1919', color: range===r ? '#a3a6ff' : '#adaaaa', fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:'0.78rem', cursor:'pointer' }}>
                {r}
              </motion.button>
            ))}
            <motion.button onClick={handleExport} whileHover={{scale:1.03}} whileTap={{scale:0.97}}
              style={{ padding:'0.45rem 0.9rem', borderRadius:'0.6rem', border:'1px solid #262626', background:'#1a1919', color:'#adaaaa', fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:'0.78rem', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
              <Download style={{width:12,height:12}} /> Exporter
            </motion.button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={item} className="responsive-grid">
          {[
            { label:'Score Discipline', value:`${stats.disciplineScore}%`, sub:'Analyse IA en temps réel', color:'#6366f1' },
            { label:'Taux Complétion',  value:`${stats.completionRate}%`, sub: range, color:'#a855f7' },
            { label:'Heures Focus',     value:`${stats.focusHours}h`,     sub: range, color:'#818cf8' },
            { label:'Série Actuelle',   value:`${stats.streak} jours 🔥`, sub:`Score: +2pts`, color:'#f59e0b' },
          ].map((k, i) => (
            <motion.div key={i} whileHover={{y:-3}} className="glass" style={{ padding:'1.25rem' }}>
              <p style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'#adaaaa', marginBottom:8 }}>{k.label}</p>
              <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.6rem', fontWeight:700, color:k.color }}>{k.value}</p>
              <p style={{ fontSize:'0.7rem', color:'#494847', marginTop:4 }}>{k.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div variants={item} style={{ display:'grid', gridTemplateColumns: window.innerWidth <= 800 ? '1fr' : '1fr 1fr', gap:'1.5rem' }}>

          {/* Bar Chart — Focus par matière */}
          <div className="glass" style={{ padding:'1.5rem' }}>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, marginBottom:'1.25rem', fontSize:'0.95rem' }}>Focus par Matière (heures)</h3>
            {subjects.map((s, i) => (
              <div key={i} style={{ marginBottom:'0.9rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', marginBottom:4 }}>
                  <span style={{ color:'#adaaaa' }}>{s.name}</span>
                  <span style={{ color:s.color, fontWeight:700 }}>{s.hours}h</span>
                </div>
                <div style={{ height:6, background:'#262626', borderRadius:999, overflow:'hidden' }}>
                  <motion.div initial={{width:0}} animate={{width:`${(s.hours/maxHours)*100}%`}}
                    transition={{duration:1.2, delay:0.4+i*0.08, ease:[0.16,1,0.3,1]}}
                    style={{ height:'100%', background:s.color, borderRadius:999, boxShadow:`0 0 8px ${s.color}80` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Sparkline — Productivité hebdo */}
          <div className="glass" style={{ padding:'1.5rem' }}>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, marginBottom:'1.25rem', fontSize:'0.95rem' }}>Tendance de Productivité (%)</h3>
            <svg viewBox="0 0 290 120" style={{ width:'100%', overflow:'visible' }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline points={processedData.map((v,i)=>`${i*47+4},${105-(v/100)*90}`).join(' ')} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {weekData.map((v, i) => (
                <g key={i}>
                  <circle cx={i*47+4} cy={105-(v/100)*90} r="4" fill="#6366f1" style={{filter:'drop-shadow(0 0 5px #6366f1)'}} />
                  <text x={i*47+4} y="120" textAnchor="middle" fill="#494847" fontSize="10">{days[i]}</text>
                  <text x={i*47+4} y={105-(v/100)*90-9} textAnchor="middle" fill="#a3a6ff" fontSize="9">{v}%</text>
                </g>
              ))}
            </svg>
          </div>
        </motion.div>

        {/* Donut + Big Score */}
        <motion.div variants={item} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
          {/* Donut */}
          <div className="glass" style={{ padding:'1.5rem', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, marginBottom:'1.25rem', fontSize:'0.95rem', alignSelf:'flex-start' }}>Taux de Complétion</h3>
            <div style={{ position:'relative', width:130, height:130 }}>
              <svg viewBox="0 0 36 36" style={{ transform:'rotate(-90deg)', width:'100%', height:'100%' }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a1919" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6366f1" strokeWidth="3"
                  strokeDasharray={`${stats.completionRate} ${100-stats.completionRate}`} strokeLinecap="round"
                  style={{filter:'drop-shadow(0 0 6px #6366f1)'}} />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#a855f7" strokeWidth="3"
                  strokeDasharray={`${Math.max(0,100-stats.completionRate-10)} 100`}
                  strokeDashoffset={`-${stats.completionRate}`} strokeLinecap="round"
                  style={{filter:'drop-shadow(0 0 4px #a855f7)'}} />
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.5rem', fontWeight:700, color:'#a3a6ff' }}>{stats.completionRate}%</p>
              </div>
            </div>
            <div style={{ marginTop:'1rem', display:'flex', gap:'1.25rem', fontSize:'0.75rem' }}>
              <span style={{ display:'flex', alignItems:'center', gap:4, color:'#adaaaa' }}><span style={{ width:8, height:8, borderRadius:'50%', background:'#6366f1', display:'inline-block' }} />Complétées</span>
              <span style={{ display:'flex', alignItems:'center', gap:4, color:'#adaaaa' }}><span style={{ width:8, height:8, borderRadius:'50%', background:'#a855f7', display:'inline-block' }} />Partielles</span>
            </div>
          </div>

          {/* Big Score */}
          <div className="glass" style={{ padding:'1.5rem', background:'linear-gradient(160deg,rgba(99,102,241,0.08),transparent)', border:'1px solid rgba(99,102,241,0.15)' }}>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, marginBottom:'1rem', fontSize:'0.95rem' }}>Score de Discipline Global</h3>
            <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'4.5rem', fontWeight:800, color:'#a3a6ff', letterSpacing:'-0.04em', lineHeight:1, textShadow:'0 0 40px rgba(99,102,241,0.4)' }}>
              {stats.disciplineScore}%
            </p>
            <p style={{ color:'#adaaaa', fontSize:'0.8rem', marginTop:8 }}>Top 15% de votre promotion</p>
            <div style={{ width:'100%', height:6, background:'#1a1919', borderRadius:999, marginTop:'1.25rem', overflow:'hidden' }}>
              <motion.div initial={{width:0}} animate={{width:`${stats.disciplineScore}%`}}
                transition={{duration:1.5, ease:[0.16,1,0.3,1], delay:0.3}}
                style={{ height:'100%', background:'linear-gradient(90deg,#6366f1,#a855f7)', boxShadow:'0 0 12px rgba(99,102,241,0.5)', borderRadius:999 }} />
            </div>
            <p style={{ color:'#4ade80', fontSize:'0.75rem', marginTop:8 }}>↑ +3% cette semaine · Meilleur jour: {stats.bestDay} · Pic: {stats.bestHour}</p>
          </div>
        </motion.div>
      </div>

      {/* ── AI Sidebar ── */}
      <div style={{ width:265, flexShrink:0 }}>
        <motion.div variants={item} className="glass" style={{ padding:'1.25rem', background:'linear-gradient(160deg,rgba(99,102,241,0.07),transparent)', position:'sticky', top:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1.25rem' }}>
            <Brain style={{ width:18, height:18, color:'#6366f1' }} />
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'0.95rem' }}>Analyses IA Prédictives</h3>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {stats.insights.map((insight, i) => {
              const Icon  = insightIcons[insight.type]  || Brain;
              const color = insightColors[insight.type] || '#adaaaa';
              return (
                <motion.div key={i} whileHover={{x:3}}
                  style={{ padding:'1rem', borderRadius:'0.75rem', background:'rgba(255,255,255,0.03)', border:`1px solid ${color}25` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                    <Icon style={{ width:13, height:13, color }} />
                    <p style={{ fontSize:'0.75rem', fontWeight:700, color, textTransform:'uppercase', letterSpacing:'0.05em' }}>{insight.type}</p>
                  </div>
                  <p style={{ fontSize:'0.78rem', color:'#adaaaa', lineHeight:1.6 }}>{insight.message}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Best study time */}
          <div style={{ marginTop:'1.25rem', padding:'1rem', borderRadius:'0.75rem', background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)' }}>
            <p style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.08em', color:'#6366f1', fontWeight:700, marginBottom:6 }}>
              Pic de concentration
            </p>
            <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.6rem', fontWeight:700 }}>{stats.bestHour}</p>
            <p style={{ fontSize:'0.75rem', color:'#adaaaa', marginTop:2 }}>Planifiez vos tâches difficiles ici</p>
          </div>
        </motion.div>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </motion.div>
  );
};

export default Stats;
