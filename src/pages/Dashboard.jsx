import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Clock, MapPin, CheckCircle2, AlertCircle,
  Calendar, ListTodo, TrendingUp, Zap, Brain
} from 'lucide-react';

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
    }
  }, []);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'2rem', padding:'2rem', color: '#fff' }}>
      {/* Page Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'2.5rem', fontWeight:700, letterSpacing:'-0.02em', lineHeight:1.1 }}>
            Bonjour, <span style={{ background:'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{user?.name || 'Utilisateur'}</span> 👋
          </h1>
          <p style={{ color:'#adaaaa', marginTop:'0.5rem' }}>Voici votre aperçu intelligent pour aujourd'hui.</p>
        </div>
        <div style={{ textAlign:'right' }}>
          <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.4rem', fontWeight:700 }}>Mardi, 7 Avril 2026</p>
          <p style={{ color:'#adaaaa', fontSize:'0.875rem' }}>Prochain cours dans <span style={{ color:'#6366f1' }}>15 min</span></p>
        </div>
      </div>

    {/* KPI Row */}
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1.5rem' }}>
      {[
        { icon: TrendingUp, label: 'Score Discipline', value: '85%', sub: '+5% cette semaine', color: '#6366f1' },
        { icon: CheckCircle2, label: 'Tâches Complétées', value: '12/18', sub: 'Cette semaine', color: '#a855f7' },
        { icon: Brain, label: 'Heures de Focus', value: '24h', sub: 'Mois en cours', color: '#818cf8' },
      ].map((kpi, i) => (
        <div key={i} className="glass" style={{ padding:'1.5rem', position:'relative', overflow:'hidden', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
          <kpi.icon style={{ width:20, height:20, color: kpi.color, marginBottom:'0.75rem' }} />
          <p style={{ color:'#adaaaa', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.1em' }}>{kpi.label}</p>
          <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'2rem', fontWeight:700, marginTop:'0.25rem' }}>{kpi.value}</p>
          <p style={{ color: kpi.color, fontSize:'0.75rem', marginTop:'0.25rem' }}>{kpi.sub}</p>
        </div>
      ))}
    </div>

    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'2rem' }}>
      {/* Left Column */}
      <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
        <section>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
            <Calendar style={{ width:18, height:18, color:'#6366f1' }} />
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.1rem', fontWeight:700 }}>Cours du Jour</h3>
          </div>
          <div style={{ display:'flex', gap:'1rem', overflowX:'auto', paddingBottom:'0.5rem' }}>
            {courses.map((c, i) => (
              <div key={i} className="glass" style={{ minWidth:260, padding:'1.25rem', borderTop: `2px solid ${c.color}`, background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' }}>
                  <span style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', color: c.color, background:`${c.color}20`, padding:'2px 8px', borderRadius:999 }}>EN COURS</span>
                </div>
                <h4 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, marginBottom:'0.5rem' }}>{c.title}</h4>
                <p style={{ fontSize:'0.8rem', color:'#adaaaa', display:'flex', alignItems:'center', gap:4 }}>{c.time}</p>
                <p style={{ fontSize:'0.8rem', color:'#adaaaa', display:'flex', alignItems:'center', gap:4, marginTop:4 }}>{c.room}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
