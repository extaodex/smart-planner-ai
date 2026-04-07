import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Moon, Globe, Shield, Palette, Save, BrainCircuit, X } from 'lucide-react';

const container = { hidden:{opacity:0}, show:{opacity:1,transition:{staggerChildren:0.08}} };
const item = { hidden:{opacity:0,y:16}, show:{opacity:1,y:0,transition:{ease:[0.16,1,0.3,1],duration:0.65}} };

const Toggle = ({ enabled, onChange }) => (
  <motion.div onClick={onChange} whileTap={{scale:0.9}} style={{ width:44, height:24, borderRadius:999, background: enabled ? '#6366f1' : '#262626', cursor:'pointer', position:'relative', transition:'background 0.3s', boxShadow: enabled ? '0 0 10px rgba(99,102,241,0.5)' : 'none', border:'1px solid rgba(255,255,255,0.05)', flexShrink:0 }}>
    <motion.div animate={{ x: enabled ? 22 : 2 }} transition={{ ease:[0.16,1,0.3,1], duration:0.3 }}
      style={{ position:'absolute', top:2, width:18, height:18, borderRadius:'50%', background:'#fff' }} />
  </motion.div>
);

const InputField = ({ label, value, onChange, type='text', placeholder='' }) => (
  <div style={{ marginBottom:'1rem' }}>
    <label style={{ fontSize:'0.75rem', color:'#adaaaa', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ width:'100%', padding:'0.7rem 1rem', background:'#1a1919', border:'1px solid #262626', borderRadius:'0.6rem', color:'#fff', fontFamily:"'Manrope',sans-serif", fontSize:'0.875rem', outline:'none' }} />
  </div>
);

const Settings = () => {
  const [prefs, setPrefs] = useState(() => {
    let base = {
      notifications: true, aiSuggestions: true, darkMode: true, soundEffects: false,
      studyHoursPerDay: 4, startHour: '08:00', primaryColor: '#6366f1',
      aiProvider: 'Gemini', apiKey: '',
    };
    
    try {
      const saved = localStorage.getItem('planner_settings');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        base = { ...base, ...JSON.parse(saved) };
      }
    } catch (e) { console.warn("Settings: settings data corrupt", e); }

    let userProfile = { name: 'Utilisateur', email: '' };
    try {
      const savedUser = localStorage.getItem('planner_user');
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        userProfile = { ...userProfile, ...JSON.parse(savedUser) };
      }
    } catch (e) { console.warn("Settings: user data corrupt", e); }

    // Sync name/email from user profile if not in settings
    return { ...base, name: base.name || userProfile.name || 'Utilisateur', email: base.email || userProfile.email || '' };
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', prefs.primaryColor);
  }, [prefs.primaryColor]);

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    // 1. Save global settings
    localStorage.setItem('planner_settings', JSON.stringify(prefs));
    
    // 2. Sync user name back to planner_user for Sidebar/Dashboard
    const user = JSON.parse(localStorage.getItem('planner_user') || '{}');
    localStorage.setItem('planner_user', JSON.stringify({ ...user, name: prefs.name, email: prefs.email }));

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      window.location.reload(); // Refresh to sync Sidebar/Dashboard names
    }, 1000);
    
    if (prefs.notifications) {
      import('../utils/notifications').then(n => n.requestNotificationPermission());
    }
  };

  const sections = [
    {
      title:'Profil Personnel', icon: User, color:'#6366f1',
      content: (
        <div>
          <InputField label="Prénom / Pseudo" value={prefs.name} onChange={v=>setPrefs(p=>({...p,name:v}))} placeholder="Comment on vous appelle ?" />
          <InputField label="Email" value={prefs.email} onChange={v=>setPrefs(p=>({...p,email:v}))} type="email" placeholder="votre@email.com" />
          <div style={{ marginTop:'0.5rem' }}>
            <label style={{ fontSize:'0.75rem', color:'#adaaaa', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Langue de l'Interface</label>
            <select value={prefs.lang || 'Français'} onChange={e=>setPrefs(p=>({...p,lang:e.target.value}))}
              style={{ width:'100%', padding:'0.7rem 1rem', background:'#1a1919', border:'1px solid #262626', borderRadius:'0.6rem', color:'#fff', fontFamily:"'Manrope',sans-serif", fontSize:'0.875rem', outline:'none' }}>
              {['Français','English','العربية'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      )
    },
    {
      title:'Configuration IA', icon: BrainCircuit, color:'#a855f7',
      content: (
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div>
            <label style={{ fontSize:'0.75rem', color:'#adaaaa', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Moteur d'Intelligence Artificielle</label>
            <select value={prefs.aiProvider || 'Gemini'} onChange={e=>setPrefs(p=>({...p,aiProvider:e.target.value}))}
              style={{ width:'100%', padding:'0.7rem 1rem', background:'#1a1919', border:'1px solid #262626', borderRadius:'0.6rem', color:'#fff', fontFamily:"'Manrope',sans-serif", fontSize:'0.875rem', outline:'none' }}>
              {['Gemini', 'ChatGPT', 'Claude'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <InputField label="Votre Clé API" value={prefs.apiKey || ''} onChange={v=>setPrefs(p=>({...p,apiKey:v}))} type="password" placeholder="sk-..." />
          
          {!prefs.apiKey && (
            <div style={{ padding:'0.75rem', borderRadius:'0.5rem', background:'rgba(234,179,8,0.1)', border:'1px solid rgba(234,179,8,0.2)', display:'flex', gap:10, alignItems:'start' }}>
               <Shield style={{ width:16, height:16, color:'#f59e0b', flexShrink:0, marginTop:2 }} />
               <p style={{ fontSize:'0.7rem', color:'#f59e0b', lineHeight:1.4 }}>
                 <strong>Attention :</strong> Aucune clé API détectée. L'IA utilisera le mode "Démo" limité 
                 ou le moteur gratuit par défaut. Certaines analyses avancées seront désactivées.
               </p>
            </div>
          )}

          <p style={{ fontSize:'0.7rem', color:'#777575', lineHeight:1.5 }}>
             💡 <strong>Google Gemini</strong> offre un palier gratuit généreux. 
             Les clés pour <strong>ChatGPT (OpenAI)</strong> ou <strong>Claude</strong> nécessitent un abonnement ou du crédit.
          </p>
          <div style={{width:'100%', height:1, background:'#262626', margin:'0.25rem 0'}} />
          <div>
            <label style={{ fontSize:'0.75rem', color:'#adaaaa', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Heures d'étude par jour</label>
            <input type="range" min="1" max="12" value={prefs.studyHoursPerDay}
              onChange={e=>setPrefs(p=>({...p,studyHoursPerDay:parseInt(e.target.value)}))}
              style={{ width:'100%', height:4, accentColor:'#6366f1', cursor:'pointer' }} />
            <p style={{ textAlign:'right', fontSize:'0.8rem', color:'#6366f1', fontWeight:700, marginTop:4 }}>{prefs.studyHoursPerDay}h / jour</p>
          </div>
        </div>
      )
    },
    {
      title:'Notifications & Son', icon: Bell, color:'#f59e0b',
      content: (
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <p style={{ fontWeight:600, fontSize:'0.875rem' }}>Rappels de tâches</p>
              <p style={{ fontSize:'0.75rem', color:'#adaaaa', marginTop:2 }}>Notifications système avant les échéances</p>
            </div>
            <Toggle enabled={prefs.notifications} onChange={() => toggle('notifications')} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <p style={{ fontWeight:600, fontSize:'0.875rem' }}>Effets sonores</p>
              <p style={{ fontSize:'0.75rem', color:'#adaaaa', marginTop:2 }}>Audio immersif généré par IA Web</p>
            </div>
            <Toggle enabled={prefs.soundEffects} onChange={() => {
              const nextState = !prefs.soundEffects;
              if (nextState) {
                import('../utils/notifications').then(n => n.playNotificationSound());
              }
              setPrefs(p => ({ ...p, soundEffects: nextState }));
            }} />
          </div>
        </div>
      )
    },
    {
      title:'Apparence Visuelle', icon: Palette, color:'#818cf8',
      content: (
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <p style={{ fontWeight:600, fontSize:'0.875rem' }}>Mode sombre</p>
              <p style={{ fontSize:'0.75rem', color:'#adaaaa', marginTop:2 }}>Interface futuriste synthetic-dark</p>
            </div>
            <Toggle enabled={prefs.darkMode} onChange={() => toggle('darkMode')} />
          </div>
          <div>
            <label style={{ fontSize:'0.75rem', color:'#adaaaa', display:'block', marginBottom:'0.75rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Couleur d'accent</label>
            <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
              {['#6366f1','#a855f7','#06b6d4','#10b981','#f59e0b','#ef4444'].map(c => (
                <motion.div key={c} whileHover={{scale:1.15}} whileTap={{scale:0.9}} onClick={()=>setPrefs(p=>({...p,primaryColor:c}))}
                  style={{ width:28, height:28, borderRadius:'50%', background:c, cursor:'pointer', border: prefs.primaryColor===c ? `3px solid #fff` : '3px solid transparent', boxShadow: prefs.primaryColor===c ? `0 0 12px ${c}` : 'none' }} />
              ))}
            </div>
          </div>
        </div>
      )
    },
  ];

  const gridCols = window.innerWidth <= 1024 ? '1fr' : '1fr 1fr';

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'2rem', fontWeight:700, letterSpacing:'-0.02em' }}>Paramètres</h1>
        <p style={{ color:'#adaaaa', fontSize:'0.875rem', marginTop:4 }}>Gérez votre profil et configurez vos clés d'Intelligence Artificielle</p>
      </motion.div>

      <div style={{ display:'grid', gridTemplateColumns: gridCols, gap:'1.5rem' }}>
        {sections.map((sec, i) => (
          <motion.div key={i} variants={item} className="glass" style={{ padding:'1.5rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1.25rem' }}>
              <div style={{ width:34, height:34, borderRadius:'0.6rem', background:`${sec.color}20`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <sec.icon style={{ width:18, height:18, color:sec.color }} />
              </div>
              <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'1rem' }}>{sec.title}</h3>
            </div>
            {sec.content}
          </motion.div>
        ))}
      </div>

      <motion.div variants={item} style={{ marginTop:'2rem', display:'flex', justifyContent:'flex-end' }}>
        <motion.button onClick={handleSave} whileHover={{scale:1.03}} whileTap={{scale:0.97}}
          style={{ padding:'0.85rem 2rem', background: saved ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#6366f1,#a855f7)', border:'none', borderRadius:'0.75rem', color:'#000', fontWeight:700, cursor:'pointer', fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.95rem', display:'flex', alignItems:'center', gap:8, boxShadow: saved ? '0 0 20px rgba(16,185,129,0.4)' : '0 0 20px rgba(99,102,241,0.3)' }}>
          <Save style={{ width:16, height:16 }} />
          {saved ? '✓ Paramètres Appliqués' : 'Sauvegarder les modifications'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
