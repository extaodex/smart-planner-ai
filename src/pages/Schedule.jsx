import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Sparkles, Calendar as CalIcon, Trash2, X, Loader2 } from 'lucide-react';
import { getCourses, createCourse, deleteCourse } from '../services/api';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HOURS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { ease: [0.16,1,0.3,1], duration:0.65 } } };

const Schedule = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', room: '', day: 0, start: 0, duration: 1, color: '#6366f1' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const r = await getCourses();
      setCourses(r.data);
    } catch {
      // Fallback demo data
      setCourses([
        { _id:'1', title:'Mathématiques', day:0, start:0, duration:2, room:'Salle 204', color:'#6366f1' },
        { _id:'2', title:'Physique', day:0, start:3, duration:1, room:'Labo A', color:'#a855f7' },
      ]);
    } finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!newCourse.title) return;
    try {
      const r = await createCourse(newCourse);
      setCourses([...courses, r.data]);
      setShowModal(false);
      setNewCourse({ title: '', room: '', day: 0, start: 0, duration: 1, color: '#6366f1' });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    setCourses(courses.filter(c => c._id !== id));
    try { await deleteCourse(id); } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}>
      <Loader2 style={{ width:40, height:40, color:'#6366f1', animation:'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ display:'flex', gap:'1.5rem', flexDirection: window.innerWidth <= 1024 ? 'column' : 'row' }}>
      {/* Main calendar grid */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <motion.div variants={item} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'2rem', fontWeight:700, letterSpacing:'-0.02em' }}>Mon Emploi du Temps</h1>
            <p style={{ color:'#adaaaa', fontSize:'0.875rem', marginTop:4 }}>Gérez vos cours et activités personnelles</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <button onClick={() => setWeekOffset(0)} style={{ padding:'0.5rem 1rem', borderRadius:'0.75rem', background:'linear-gradient(135deg,#6366f1,#a855f7)', border:'none', color:'#000', fontWeight:700, cursor:'pointer', fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.8rem' }}>
              Aujourd'hui
            </button>
            <motion.button whileHover={{ scale:1.05 }} onClick={() => setWeekOffset(w => w-1)} style={{ width:36, height:36, borderRadius:'50%', background:'#1a1919', border:'1px solid #494847', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <ChevronLeft style={{ width:16, height:16 }} />
            </motion.button>
            <motion.button whileHover={{ scale:1.05 }} onClick={() => setWeekOffset(w => w+1)} style={{ width:36, height:36, borderRadius:'50%', background:'#1a1919', border:'1px solid #494847', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <ChevronRight style={{ width:16, height:16 }} />
            </motion.button>
          </div>
        </motion.div>

        {/* Grid Card */}
        <motion.div variants={item} className="glass" style={{ padding:'1rem', overflowX:'auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'60px repeat(6,1fr)', gap:0, minWidth:700 }}>
            <div />
            {DAYS.map((d, i) => (
              <div key={i} style={{ textAlign:'center', padding:'0.5rem 0', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'0.8rem', borderBottom:'1px solid #1a1919', color: i === (new Date().getDay() - 1) ? '#6366f1' : '#adaaaa' }}>
                {d}
              </div>
            ))}
            {HOURS.map((h, hi) => (
              <React.Fragment key={hi}>
                <div style={{ paddingRight:'0.75rem', fontSize:'0.7rem', color:'#494847', textAlign:'right', paddingTop:'0.25rem', height:75 }}>{h}</div>
                {DAYS.map((_, di) => {
                  const ev = courses.find(e => e.day===di && e.start===hi);
                  return (
                    <div key={di} style={{ borderLeft:'1px solid #1a1919', borderBottom:'1px solid #1a1919', height:75, position:'relative', padding:'2px' }}>
                      {ev && (
                        <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                          style={{ position:'absolute', top:2, left:2, right:2, height: ev.duration*75-4, 
                            background:`linear-gradient(135deg,${ev.color}30,${ev.color}15)`,
                            border:`1px solid ${ev.color}50`, borderLeft:`3px solid ${ev.color}`,
                            borderRadius:'0.5rem', padding:'0.5rem', zIndex:1, overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                          <div>
                            <p style={{ fontWeight:700, fontSize:'0.75rem', color:'#fff', fontFamily:"'Space Grotesk',sans-serif", marginBottom:2 }}>{ev.title}</p>
                            <p style={{ fontSize:'0.65rem', color:'#adaaaa' }}>{ev.room}</p>
                          </div>
                          <button onClick={() => handleDelete(ev._id)} style={{ background:'none', border:'none', color:'#494847', cursor:'pointer', alignSelf:'flex-end' }}>
                            <Trash2 style={{ width:12, height:12 }} />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sidebar - Quick Add & Suggestions */}
      <div style={{ width: window.innerWidth <= 1024 ? '100%' : 280, flexShrink:0, display:'flex', flexDirection:'column', gap:'1.25rem' }}>
        <motion.button variants={item} onClick={() => setShowModal(true)} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
          style={{ width:'100%', padding:'0.85rem', background:'linear-gradient(135deg,#6366f1,#a855f7)', border:'none', borderRadius:'0.75rem', color:'#000', fontWeight:700, cursor:'pointer', fontFamily:"'Space Grotesk',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <Plus style={{ width:18, height:18 }} /> Ajouter un programme
        </motion.button>

        <motion.div variants={item} className="glass" style={{ padding:'1.25rem', background:'linear-gradient(160deg,rgba(99,102,241,0.08),transparent)', border:'1px solid rgba(99,102,241,0.2)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1rem' }}>
            <Sparkles style={{ width:16, height:16, color:'#6366f1' }} />
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'0.95rem' }}>Optimisation IA</h3>
          </div>
          <p style={{ fontSize:'0.8rem', color:'#adaaaa', lineHeight:1.7 }}>
            Votre pic de concentration est à <strong style={{ color:'#6366f1' }}>09:00</strong>. Programmez vos cours les plus denses le lundi matin.
          </p>
        </motion.div>

        <motion.div variants={item} className="glass" style={{ padding:'1.25rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1rem' }}>
            <CalIcon style={{ width:16, height:16, color:'#6366f1' }} />
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'0.95rem' }}>Infos Sauvegarde</h3>
          </div>
          <p style={{ fontSize:'0.75rem', color:'#adaaaa', lineHeight:1.5 }}>
            Vos données sont sauvegardées en permanence sur votre base de données sécurisée.
          </p>
        </motion.div>
      </div>

      {/* Add Program Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1100, padding:'1rem' }}>
            <motion.div initial={{scale:0.9}} animate={{scale:1}} className="glass" style={{ width:'100%', maxWidth:400, padding:'2rem', position:'relative' }}>
              <button onClick={()=>setShowModal(false)} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', color:'#adaaaa', cursor:'pointer' }}><X /></button>
              <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", marginBottom:'1.5rem' }}>Ajouter un programme</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <input placeholder="Titre (ex: Sport, Math, Travail)" value={newCourse.title} onChange={e=>setNewCourse({...newCourse, title:e.target.value})}
                  style={{ width:'100%', padding:'0.75rem', background:'#1a1919', border:'1px solid #262626', borderRadius:'0.6rem', color:'#fff', outline:'none' }} />
                <input placeholder="Lieu/Notes" value={newCourse.room} onChange={e=>setNewCourse({...newCourse, room:e.target.value})}
                  style={{ width:'100%', padding:'0.75rem', background:'#1a1919', border:'1px solid #262626', borderRadius:'0.6rem', color:'#fff', outline:'none' }} />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  <select value={newCourse.day} onChange={e=>setNewCourse({...newCourse, day:parseInt(e.target.value)})}
                    style={{ padding:'0.75rem', background:'#1a1919', border:'1px solid #262626', borderRadius:'0.6rem', color:'#fff' }}>
                    {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                  </select>
                  <select value={newCourse.start} onChange={e=>setNewCourse({...newCourse, start:parseInt(e.target.value)})}
                    style={{ padding:'0.75rem', background:'#1a1919', border:'1px solid #262626', borderRadius:'0.6rem', color:'#fff' }}>
                    {HOURS.map((h, i) => <option key={i} value={i}>{h}</option>)}
                  </select>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <label style={{ fontSize:'0.8rem', color:'#adaaaa' }}>Durée (heures):</label>
                  <select value={newCourse.duration} onChange={e=>setNewCourse({...newCourse, duration:parseInt(e.target.value)})}
                    style={{ padding:'0.5rem', background:'#1a1919', border:'1px solid #262626', borderRadius:'0.6rem', color:'#fff' }}>
                    {[1,2,3,4].map(v => <option key={v} value={v}>{v}h</option>)}
                  </select>
                </div>
                <button onClick={handleCreate} style={{ marginTop:'1rem', padding:'0.75rem', background:'linear-gradient(135deg,#6366f1,#a855f7)', border:'none', borderRadius:'0.75rem', color:'#000', fontWeight:700, cursor:'pointer' }}>
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Schedule;
