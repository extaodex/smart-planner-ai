import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Clock, MapPin, CheckCircle2, AlertCircle,
  Calendar, ListTodo, TrendingUp, Zap, Brain
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.7 } }
};

const courses = [
  { title: 'Mathématiques', time: '08:30 - 10:30', room: 'Salle 204', color: '#6366f1' },
  { title: 'Physique-Chimie', time: '10:45 - 12:45', room: 'Labo A', color: '#a855f7' },
  { title: 'Informatique', time: '14:00 - 16:00', room: 'Amphi B', color: '#818cf8' },
];

const tasks = [
  { title: 'Rapport de stage', due: 'Demain', priority: 'Urgent', status: 'pending' },
  { title: 'Exercices Algèbre', due: 'Dans 3 jours', priority: 'Moyen', status: 'pending' },
  { title: 'Lecture Philo', due: 'Dans 1 semaine', priority: 'Faible', status: 'done' },
  { title: 'TP Chimie', due: 'Dans 5 jours', priority: 'Moyen', status: 'pending' },
];

const priorityConfig = {
  Urgent: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'rgba(239,68,68,0.3)', glow: '0 0 10px rgba(239,68,68,0.2)' },
  Moyen:  { bg: 'rgba(234,179,8,0.15)',  color: '#fbbf24', border: 'rgba(234,179,8,0.3)', glow: '' },
  Faible: { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80', border: 'rgba(34,197,94,0.3)',  glow: '' },
};

const Dashboard = () => {
  const [user, setUser] = React.useState({ name: 'Utilisateur' });
  const navigate = useNavigate();

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('planner_user');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') setUser(parsed);
      }
    } catch (e) {
      console.error("Dashboard: Error parsing user:", e);
      localStorage.removeItem('planner_user'); // Clean up corrupt data
    }
  }, []);

  return (
    <motion.div initial={false} animate="show" style={{ display:'flex', flexDirection:'column', gap:'2rem', paddingTop:'0.5rem', padding:'2rem' }}>
      {/* Page Header */}
      <motion.div variants={item} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'2.5rem', fontWeight:700, letterSpacing:'-0.02em', lineHeight:1.1 }}>
            Bonjour, <span style={{ background:'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{user && user.name ? user.name : 'Utilisateur'}</span> 👋
          </h1>
          <p style={{ color:'#adaaaa', marginTop:'0.5rem' }}>Voici votre aperçu intelligent pour aujourd'hui.</p>
        </div>
        <div style={{ textAlign:'right' }}>
          <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.4rem', fontWeight:700 }}>Mardi, 7 Avril 2026</p>
          <p style={{ color:'#adaaaa', fontSize:'0.875rem' }}>Prochain cours dans <span style={{ color:'#6366f1' }}>15 min</span></p>
        </div>
      </motion.div>

    {/* KPI Row */}
    <motion.div variants={item} style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
      {[
        { icon: TrendingUp, label: 'Score Discipline', value: '85%', sub: '+5% cette semaine', color: '#6366f1' },
        { icon: CheckCircle2, label: 'Tâches Complétées', value: '12/18', sub: 'Cette semaine', color: '#a855f7' },
        { icon: Brain, label: 'Heures de Focus', value: '24h', sub: 'Mois en cours', color: '#818cf8' },
      ].map((kpi, i) => (
        <div key={i} className="glass" style={{ padding:'1.5rem', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-20px', right:'-20px', opacity:0.06 }}>
            <kpi.icon style={{ width:100, height:100, color: kpi.color }} />
          </div>
          <kpi.icon style={{ width:20, height:20, color: kpi.color, marginBottom:'0.75rem' }} />
          <p style={{ color:'#adaaaa', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.1em' }}>{kpi.label}</p>
          <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'2rem', fontWeight:700, marginTop:'0.25rem' }}>{kpi.value}</p>
          <p style={{ color: kpi.color, fontSize:'0.75rem', marginTop:'0.25rem' }}>{kpi.sub}</p>
        </div>
      ))}
    </motion.div>

    <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'2rem' }}>
      {/* Left Column */}
      <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>

        {/* Cours du Jour */}
        <motion.section variants={item}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
            <Calendar style={{ width:18, height:18, color:'#6366f1' }} />
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.1rem', fontWeight:700 }}>Cours du Jour</h3>
          </div>
          <div style={{ display:'flex', gap:'1rem', overflowX:'auto', paddingBottom:'0.5rem' }}>
            {courses.map((c, i) => (
              <motion.div key={i} whileHover={{ y:-4, boxShadow:`0 0 25px ${c.color}40` }}
                className="glass" style={{ minWidth:260, padding:'1.25rem', cursor:'pointer', transition:'all .3s', borderTop: `2px solid ${c.color}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' }}>
                  <span style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color: c.color, background:`${c.color}20`, padding:'2px 8px', borderRadius:999 }}>EN COURS</span>
                  <Clock style={{ width:14, height:14, color:'#adaaaa' }} />
                </div>
                <h4 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, marginBottom:'0.5rem' }}>{c.title}</h4>
                <p style={{ fontSize:'0.8rem', color:'#adaaaa', display:'flex', alignItems:'center', gap:4 }}><Clock style={{ width:12, height:12 }} />{c.time}</p>
                <p style={{ fontSize:'0.8rem', color:'#adaaaa', display:'flex', alignItems:'center', gap:4, marginTop:4 }}><MapPin style={{ width:12, height:12 }} />{c.room}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tâches Prioritaires */}
        <motion.section variants={item}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <ListTodo style={{ width:18, height:18, color:'#a855f7' }} />
              <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.1rem', fontWeight:700 }}>Tâches Prioritaires</h3>
            </div>
                        <button 
              onClick={() => navigate('/tasks')}
              style={{ fontSize:'0.8rem', color:'#6366f1', background:'none', border:'none', cursor:'pointer', padding:'2px 5px' }}
            >
              Voir tout →
            </button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {tasks.map((t, i) => {
              const p = priorityConfig[t.priority];
              return (
                <motion.div key={i} whileHover={{ x: 4 }}
                  className="glass" style={{ padding:'1rem 1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                    {t.status === 'done'
                      ? <CheckCircle2 style={{ width:18, height:18, color:'#4ade80', flexShrink:0 }} />
                      : <div style={{ width:18, height:18, borderRadius:'50%', border:'2px solid #494847', flexShrink:0 }} />
                    }
                    <div>
                      <p style={{ fontWeight:500, textDecoration: t.status==='done' ? 'line-through' : 'none', color: t.status==='done' ? '#adaaaa' : '#fff' }}>{t.title}</p>
                      <p style={{ fontSize:'0.75rem', color:'#adaaaa' }}>Échéance: {t.due}</p>
                    </div>
                  </div>
                  <span style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', padding:'3px 10px', borderRadius:999, background: p.bg, color: p.color, border:`1px solid ${p.border}`, boxShadow: p.glow, whiteSpace:'nowrap' }}>
                    {t.priority}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* Right Column — AI Insights */}
      <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
        <motion.section variants={item} className="glass" style={{ padding:'1.5rem', background:'linear-gradient(160deg, rgba(99,102,241,0.08) 0%, transparent 100%)', border:'1px solid rgba(99,102,241,0.2)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.5rem' }}>
            <Sparkles style={{ width:20, height:20, color:'#6366f1' }} />
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.1rem', fontWeight:700 }}>Conseils IA</h3>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div style={{ padding:'1rem', borderRadius:'0.75rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize:'0.75rem', color:'#6366f1', fontWeight:700, marginBottom:'0.4rem', display:'flex', alignItems:'center', gap:4 }}><Zap style={{ width:12, height:12 }} />MEILLEUR MOMENT</p>
              <p style={{ fontSize:'0.8rem', color:'#adaaaa', lineHeight:1.6 }}>
                Votre pic de concentration est à <strong style={{ color:'#fff' }}>14:00</strong>. Idéal pour réviser <strong style={{ color:'#6366f1' }}>Mathématiques</strong>.
              </p>
            </div>
            <div style={{ padding:'1rem', borderRadius:'0.75rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ fontSize:'0.75rem', color:'#f87171', fontWeight:700, marginBottom:'0.4rem', display:'flex', alignItems:'center', gap:4 }}><AlertCircle style={{ width:12, height:12 }} />ANTI-PROCRASTINATION</p>
              <p style={{ fontSize:'0.8rem', color:'#adaaaa', lineHeight:1.6 }}>
                Divisez le <strong style={{ color:'#fff' }}>Rapport de stage</strong> en 3 étapes de 30 min. Commencez par l'introduction !
              </p>
            </div>
            <div style={{ padding:'1rem', borderRadius:'0.75rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(168,85,247,0.2)' }}>
              <p style={{ fontSize:'0.75rem', color:'#a855f7', fontWeight:700, marginBottom:'0.4rem', display:'flex', alignItems:'center', gap:4 }}><Brain style={{ width:12, height:12 }} />PLANNING AUTO</p>
              <p style={{ fontSize:'0.8rem', color:'#adaaaa', lineHeight:1.6 }}>
                3h de révisions planifiées ce soir. Mathématiques → Pause → Physique.
              </p>
            </div>
          </div>
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
            style={{ width:'100%', marginTop:'1.25rem', padding:'0.85rem', background:'linear-gradient(135deg,#6366f1,#a855f7)', border:'none', borderRadius:'0.75rem', color:'#000', fontWeight:700, cursor:'pointer', fontFamily:"'Space Grotesk',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <Sparkles style={{ width:16, height:16 }} /> Générer mon Planning
          </motion.button>
        </motion.section>

        {/* Weekly Focus */}
        <motion.section variants={item} className="glass" style={{ padding:'1.5rem' }}>
          <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1rem', fontWeight:700, marginBottom:'1.25rem' }}>Focus Hebdomadaire</h3>
          {[
            { label:'Mathématiques', pct:75, color:'#6366f1' },
            { label:'Physique', pct:50, color:'#a855f7' },
            { label:'Informatique', pct:90, color:'#818cf8' },
            { label:'Philosophie', pct:30, color:'#f59e0b' },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom:'1rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem', marginBottom:'0.3rem' }}>
                <span style={{ color:'#adaaaa' }}>{s.label}</span>
                <span style={{ color: s.color, fontWeight:700 }}>{s.pct}%</span>
              </div>
              <div style={{ width:'100%', height:4, background:'#262626', borderRadius:999, overflow:'hidden' }}>
                <motion.div initial={{ width:0 }} animate={{ width:`${s.pct}%` }}
                  transition={{ duration:1.2, delay: 0.6 + i*0.1, ease:[0.16,1,0.3,1] }}
                  style={{ height:'100%', background: s.color, borderRadius:999, boxShadow:`0 0 8px ${s.color}80` }} />
              </div>
            </div>
          ))}
        </motion.section>
      </div>
    </div>
  </motion.div>
  );
};

export default Dashboard;
