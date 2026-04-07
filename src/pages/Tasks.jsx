import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, CheckCircle2, Circle, Clock, Sparkles, Brain, Trash2, X, Loader2 } from 'lucide-react';
import { getTasks, createTask, toggleTask, deleteTask, generatePlan } from '../services/api';

const priorityConfig = {
  Urgent: { bg:'rgba(239,68,68,0.15)', color:'#f87171', border:'rgba(239,68,68,0.3)', glow:'0 0 10px rgba(239,68,68,0.15)' },
  Moyen:  { bg:'rgba(234,179,8,0.15)',  color:'#fbbf24', border:'rgba(234,179,8,0.3)',  glow:'' },
  Faible: { bg:'rgba(34,197,94,0.15)',  color:'#4ade80', border:'rgba(34,197,94,0.3)',  glow:'' },
};

const container = { hidden:{opacity:0}, show:{opacity:1,transition:{staggerChildren:0.07}} };
const item = { hidden:{opacity:0,y:16}, show:{opacity:1,y:0,transition:{ease:[0.16,1,0.3,1],duration:0.6}} };

const Tasks = () => {
  const [tasks,      setTasks]      = useState([]);
  const [filter,     setFilter]     = useState('Toutes');
  const [search,     setSearch]     = useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [aiPlan,     setAIPlan]     = useState(null);
  const [planLoading,setPlanLoading]= useState(false);
  const [newTask,    setNewTask]    = useState({ title:'', description:'', due:'', priority:'Moyen', type:'Devoirs' });

  const filters = ['Toutes','Devoirs','Examens','Cours'];

  // Fetch tasks from backend (falls back to demo data if backend offline)
  useEffect(() => {
    getTasks()
      .then(r => setTasks(r.data))
      .catch(() => setTasks([
        { _id:'1', title:'Rapport de stage', description:'Rédiger les 10 premières pages', due:'Demain', priority:'Urgent', type:'Devoirs', done:false, aiTime:'2h 30min' },
        { _id:'2', title:'Exercices Algèbre – Ch.4', description:'Exercices 12 à 20 p.87', due:'Dans 3 jours', priority:'Moyen', type:'Devoirs', done:false, aiTime:'1h 15min' },
        { _id:'3', title:'Révision Physique Quantique', description:'Relire cours + fiches', due:'Dans 5 jours', priority:'Moyen', type:'Examens', done:false, aiTime:'3h' },
        { _id:'4', title:'Lecture Philo – Kant', description:'Pages 45 à 82', due:'Dans 7 jours', priority:'Faible', type:'Cours', done:true, aiTime:'1h' },
        { _id:'5', title:'TP Chimie Organique', description:'Préparer le protocole', due:'Dans 4 jours', priority:'Urgent', type:'Cours', done:false, aiTime:'45min' },
      ]))
      .finally(() => setLoading(false));
  }, []);

  const done = tasks.filter(t => t.done).length;
  const filtered = tasks.filter(t => {
    const matchFilter = filter === 'Toutes' || t.type === filter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleToggle = async (id) => {
    try {
      const r = await toggleTask(id);
      setTasks(ts => ts.map(t => t._id === id ? r.data : t));
    } catch {
      setTasks(ts => ts.map(t => t._id === id ? { ...t, done: !t.done } : t));
    }
  };

  const handleDelete = async (id) => {
    setTasks(ts => ts.filter(t => t._id !== id));
    try { await deleteTask(id); } catch {}
  };

  const handleAdd = async () => {
    if (!newTask.title.trim()) return;
    const optimistic = { _id: Date.now().toString(), ...newTask, done: false, aiTime: '~1h' };
    setTasks(ts => [optimistic, ...ts]);
    setNewTask({ title:'', description:'', due:'', priority:'Moyen', type:'Devoirs' });
    setShowModal(false);
    try {
      const r = await createTask(newTask);
      setTasks(ts => ts.map(t => t._id === optimistic._id ? r.data : t));
    } catch {}
  };

  const handleGeneratePlan = async () => {
    setPlanLoading(true);
    try {
      const r = await generatePlan(tasks.filter(t => !t.done), 4);
      setAIPlan(r.data);
    } catch {
      setAIPlan({
        plan: [
          { time:'14:00', task:'TP Chimie Organique', duration:'45min', priority:'Urgent' },
          { time:'14:55', task:'Rapport de stage', duration:'60min', priority:'Urgent' },
          { time:'16:10', task:'Exercices Algèbre', duration:'75min', priority:'Moyen' },
        ],
        advice: 'Commencez par la tâche la plus courte pour créer de l\'élan positif.',
      });
    } finally { setPlanLoading(false); }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ display:'flex', gap:'1.5rem' }}>
      {/* ── Main ── */}
      <div style={{ flex:1, minWidth:0 }}>
        {/* Header */}
        <motion.div variants={item} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <div>
            <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'2rem', fontWeight:700, letterSpacing:'-0.02em' }}>Mes Tâches</h1>
            <p style={{ color:'#adaaaa', fontSize:'0.875rem', marginTop:4 }}>
              {loading ? 'Chargement…' : `${done}/${tasks.length} tâches complétées cette semaine`}
            </p>
          </div>
          <motion.button onClick={() => setShowModal(true)} whileHover={{scale:1.03}} whileTap={{scale:0.97}}
            style={{ padding:'0.75rem 1.25rem', background:'linear-gradient(135deg,#6366f1,#a855f7)', border:'none', borderRadius:'0.75rem', color:'#000', fontWeight:700, cursor:'pointer', fontFamily:"'Space Grotesk',sans-serif", display:'flex', alignItems:'center', gap:8 }}>
            <Plus style={{ width:16, height:16 }} /> Ajouter une Tâche
          </motion.button>
        </motion.div>

        {/* Search & Filters */}
        <motion.div variants={item} style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <Search style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:'#494847' }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher une tâche…"
              style={{ width:'100%', paddingLeft:40, paddingRight:16, paddingTop:10, paddingBottom:10, background:'#1a1919', border:'1px solid #262626', borderRadius:'0.75rem', color:'#fff', fontFamily:"'Manrope',sans-serif", fontSize:'0.875rem', outline:'none' }} />
          </div>
          <div style={{ display:'flex', gap:'0.5rem' }}>
            {filters.map(f => (
              <motion.button key={f} onClick={()=>setFilter(f)} whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                style={{ padding:'0.5rem 1rem', borderRadius:'0.75rem', border: filter===f ? '1px solid #6366f1' : '1px solid #262626', background: filter===f ? 'rgba(99,102,241,0.15)' : '#1a1919', color: filter===f ? '#a3a6ff' : '#adaaaa', fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:'0.8rem', cursor:'pointer' }}>
                {f}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Task List */}
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}>
            <Loader2 style={{ width:32, height:32, color:'#6366f1', animation:'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            <AnimatePresence>
              {filtered.map(t => {
                const p = priorityConfig[t.priority] || priorityConfig.Moyen;
                return (
                  <motion.div key={t._id} variants={item} exit={{opacity:0,x:-20,height:0}}
                    layout className="glass" style={{ padding:'1.1rem 1.25rem', display:'flex', alignItems:'center', gap:'1rem' }}>
                    <motion.button whileTap={{scale:0.85}} onClick={() => handleToggle(t._id)}
                      style={{ background:'none', border:'none', color: t.done ? '#4ade80' : '#494847', cursor:'pointer', flexShrink:0 }}>
                      {t.done ? <CheckCircle2 style={{width:22,height:22}} /> : <Circle style={{width:22,height:22}} />}
                    </motion.button>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontWeight:600, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#adaaaa' : '#fff', marginBottom:2 }}>{t.title}</p>
                      <p style={{ fontSize:'0.75rem', color:'#494847', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.description}</p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', flexShrink:0 }}>
                      <span style={{ fontSize:'0.65rem', color:'#adaaaa', whiteSpace:'nowrap' }}>⏰ {t.due}</span>
                      <span style={{ fontSize:'0.65rem', display:'flex', alignItems:'center', gap:3, color:'#818cf8', whiteSpace:'nowrap' }}>
                        <Clock style={{width:10,height:10}} /> {t.aiTime}
                      </span>
                      <span style={{ fontSize:'0.65rem', fontWeight:700, padding:'2px 8px', borderRadius:999, background:p.bg, color:p.color, border:`1px solid ${p.border}`, whiteSpace:'nowrap', boxShadow:p.glow }}>
                        {t.priority}
                      </span>
                      <motion.button whileHover={{scale:1.1,color:'#f87171'}} onClick={() => handleDelete(t._id)}
                        style={{ background:'none', border:'none', color:'#494847', cursor:'pointer', padding:4 }}>
                        <Trash2 style={{width:14,height:14}} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filtered.length === 0 && !loading && (
              <div style={{ textAlign:'center', padding:'3rem', color:'#494847' }}>
                <CheckCircle2 style={{width:40,height:40,margin:'0 auto 1rem',color:'#4ade80'}} />
                <p>Aucune tâche trouvée. Excellent travail ! 🎉</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Right Sidebar ── */}
      <div style={{ width:275, flexShrink:0, display:'flex', flexDirection:'column', gap:'1.25rem' }}>

        {/* Progress Ring */}
        <motion.div variants={item} className="glass" style={{ padding:'1.25rem' }}>
          <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, marginBottom:'1rem', fontSize:'0.95rem' }}>Progression</h3>
          <div style={{ position:'relative', width:110, height:110, margin:'0 auto 1rem' }}>
            <svg viewBox="0 0 36 36" style={{ transform:'rotate(-90deg)', width:'100%', height:'100%' }}>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a1919" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#ringGrad)" strokeWidth="3"
                strokeDasharray={`${tasks.length ? (done/tasks.length*100).toFixed(1) : 0} 100`}
                strokeLinecap="round" style={{filter:'drop-shadow(0 0 6px #6366f1)'}} />
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
              <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.4rem', fontWeight:700, color:'#a3a6ff' }}>
                {tasks.length ? Math.round(done/tasks.length*100) : 0}%
              </p>
            </div>
          </div>
          <p style={{ textAlign:'center', fontSize:'0.8rem', color:'#adaaaa' }}>{done} sur {tasks.length} complétées</p>
        </motion.div>

        {/* AI Plan Generator */}
        <motion.div variants={item} className="glass" style={{ padding:'1.25rem', background:'linear-gradient(160deg,rgba(99,102,241,0.08),transparent)', border:'1px solid rgba(99,102,241,0.2)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'0.85rem' }}>
            <Sparkles style={{ width:16, height:16, color:'#6366f1' }} />
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'0.9rem' }}>Générer Planning IA</h3>
          </div>
          {aiPlan ? (
            <div>
              <p style={{ fontSize:'0.75rem', color:'#adaaaa', marginBottom:'0.75rem', lineHeight:1.6 }}>{aiPlan.advice}</p>
              {aiPlan.plan.map((p, i) => (
                <div key={i} style={{ padding:'0.4rem 0', borderBottom: i<aiPlan.plan.length-1 ? '1px solid #1a1919' : 'none' }}>
                  <p style={{ fontSize:'0.75rem', color:'#fff' }}>
                    <span style={{ color:'#6366f1', fontWeight:700 }}>{p.time}</span> – {p.task}
                  </p>
                  <p style={{ fontSize:'0.65rem', color:'#494847' }}>{p.duration}</p>
                </div>
              ))}
              <button onClick={() => setAIPlan(null)} style={{ fontSize:'0.7rem', color:'#adaaaa', background:'none', border:'none', cursor:'pointer', marginTop:8 }}>
                Réinitialiser
              </button>
            </div>
          ) : (
            <motion.button onClick={handleGeneratePlan} disabled={planLoading} whileHover={{scale:1.02}} whileTap={{scale:0.97}}
              style={{ width:'100%', padding:'0.75rem', background:'linear-gradient(135deg,#6366f1,#a855f7)', border:'none', borderRadius:'0.75rem', color:'#000', fontWeight:700, cursor:'pointer', fontFamily:"'Space Grotesk',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              {planLoading ? <Loader2 style={{width:16,height:16,animation:'spin 1s linear infinite'}} /> : <Sparkles style={{width:16,height:16}} />}
              {planLoading ? 'Génération…' : 'Générer mon Planning'}
            </motion.button>
          )}
        </motion.div>

        {/* Anti-procrastination tip */}
        <motion.div variants={item} className="glass" style={{ padding:'1.25rem', border:'1px solid rgba(239,68,68,0.15)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'0.85rem' }}>
            <Brain style={{ width:16, height:16, color:'#f87171' }} />
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'0.9rem', color:'#f87171' }}>Anti-Procrastination</h3>
          </div>
          <p style={{ fontSize:'0.8rem', color:'#adaaaa', lineHeight:1.7 }}>
            Commencez par la <strong style={{color:'#fff'}}>tâche la plus courte</strong> pour créer de l'élan. Utilisez la technique <strong style={{color:'#6366f1'}}>Pomodoro</strong> : 25 min de travail, 5 min de pause.
          </p>
        </motion.div>
      </div>

      {/* ── Add Task Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'1rem' }}>
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}}
              transition={{ease:[0.16,1,0.3,1],duration:0.4}}
              className="glass" style={{ width:'100%', maxWidth:460, padding:'2rem', position:'relative' }}>
              <button onClick={()=>setShowModal(false)} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', color:'#adaaaa', cursor:'pointer' }}>
                <X style={{width:18,height:18}} />
              </button>
              <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.4rem', fontWeight:700, marginBottom:'1.5rem' }}>Nouvelle Tâche</h2>
              {[
                { key:'title',       label:'Titre *',     placeholder:'Ex: Révision Mathématiques' },
                { key:'description', label:'Description', placeholder:'Détails de la tâche…' },
                { key:'due',         label:'Échéance',    placeholder:'Ex: Demain, Dans 3 jours' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom:'1rem' }}>
                  <label style={{ fontSize:'0.75rem', color:'#adaaaa', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>{f.label}</label>
                  <input value={newTask[f.key]} onChange={e=>setNewTask(n=>({...n,[f.key]:e.target.value}))} placeholder={f.placeholder}
                    style={{ width:'100%', padding:'0.7rem 1rem', background:'#1a1919', border:'1px solid #262626', borderRadius:'0.6rem', color:'#fff', fontFamily:"'Manrope',sans-serif", fontSize:'0.875rem', outline:'none' }} />
                </div>
              ))}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.5rem' }}>
                {[{ key:'priority', label:'Priorité', opts:['Urgent','Moyen','Faible'] }, { key:'type', label:'Type', opts:['Devoirs','Examens','Cours'] }].map(sel => (
                  <div key={sel.key}>
                    <label style={{ fontSize:'0.75rem', color:'#adaaaa', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>{sel.label}</label>
                    <select value={newTask[sel.key]} onChange={e=>setNewTask(n=>({...n,[sel.key]:e.target.value}))}
                      style={{ width:'100%', padding:'0.6rem 1rem', background:'#1a1919', border:'1px solid #262626', borderRadius:'0.6rem', color:'#fff', fontFamily:"'Manrope',sans-serif", fontSize:'0.875rem', outline:'none' }}>
                      {sel.opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <motion.button onClick={handleAdd} whileHover={{scale:1.02}} whileTap={{scale:0.97}}
                style={{ width:'100%', padding:'0.85rem', background:'linear-gradient(135deg,#6366f1,#a855f7)', border:'none', borderRadius:'0.75rem', color:'#000', fontWeight:700, cursor:'pointer', fontFamily:"'Space Grotesk',sans-serif", fontSize:'1rem' }}>
                Ajouter la Tâche
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
};

export default Tasks;
