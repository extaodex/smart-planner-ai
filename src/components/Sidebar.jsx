import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, ListTodo, BarChart3, Settings, BrainCircuit, LogOut, User } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard',        path: '/' },
  { icon: Calendar,        label: 'Emploi du temps',  path: '/schedule' },
  { icon: ListTodo,        label: 'Mes Tâches',       path: '/tasks' },
  { icon: BarChart3,       label: 'Statistiques',     path: '/stats' },
];

const Sidebar = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  const [user, setUser] = React.useState({ name: 'Utilisateur' });

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('planner_user');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') setUser(parsed);
      }
    } catch (e) {
      console.error("Sidebar: User Data corrupted, clearing...", e);
      localStorage.removeItem('planner_user');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('planner_token');
    localStorage.removeItem('planner_user');
    window.location.reload();
  };

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: 64,
        background: 'rgba(14,14,14,0.85)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex',
        justifyContent: 'space-around', alignItems: 'center', zIndex: 1000,
        padding: '0 1rem'
      }}>
        {[...menuItems, { icon: Settings, label: 'Réglages', path: '/settings' }].map(({ icon: Icon, path }) => (
          <NavLink key={path} to={path} end={path==='/'} style={{ textDecoration:'none' }}>
            {({ isActive }) => (
              <div style={{
                color: isActive ? '#6366f1' : '#494847',
                padding: '10px', transition: 'color 0.2s'
              }}>
                <Icon style={{ width: 24, height: 24 }} />
              </div>
            )}
          </NavLink>
        ))}
        <div onClick={handleLogout} style={{ color: '#494847', padding: '10px' }}>
          <LogOut style={{ width: 24, height: 24 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: 240, minHeight: '100vh', background: '#0e0e0e',
      borderRight: '1px solid #1a1919', display: 'flex',
      flexDirection: 'column', padding: '1.5rem 1.25rem',
      position: 'sticky', top: 0, height: '100vh', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'0.5rem 0.25rem', marginBottom:'2rem' }}>
        <BrainCircuit style={{ width:28, height:28, color:'#6366f1', filter:'drop-shadow(0 0 6px #6366f1)' }} />
        <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'1.1rem', background:'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Smart AI</span>
      </div>

      {/* Navigation */}
      <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:'0.4rem' }}>
        {menuItems.map(({ icon: Icon, label, path }) => (
          <NavLink key={path} to={path} end={path==='/'} style={{ textDecoration:'none' }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '0.7rem 0.9rem', borderRadius: '0.8rem',
                background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                color: isActive ? '#a3a6ff' : '#777575',
                transition: 'all 0.2s ease', cursor: 'pointer',
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '0.875rem',
              }}
              onMouseEnter={e => { if(!isActive) { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#fff'; }}}
              onMouseLeave={e => { if(!isActive) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#777575'; }}}
              >
                <Icon style={{ width:18, height:18, flexShrink:0 }} />
                <span>{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div style={{ marginBottom:'1.5rem', padding:'1rem', borderRadius:'0.8rem', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', color:'#000' }}>
          <User style={{ width:18, height:18 }} />
        </div>
        <div style={{ minWidth:0 }}>
           <p style={{ fontSize:'0.8rem', fontWeight:700, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.name || 'Utilisateur'}</p>
           <p style={{ fontSize:'0.6rem', color:'#777575', textTransform:'uppercase', letterSpacing:'0.05em' }}>ID: {user.id ? String(user.id).slice(-4) : '...'}</p>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem' }}>
        <NavLink to="/settings" style={{ textDecoration:'none' }}>
          {({ isActive }) => (
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'0.7rem 0.9rem', borderRadius:'0.75rem', color: isActive ? '#a3a6ff' : '#494847', fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:'0.875rem', cursor:'pointer', transition:'all 0.2s' }}>
              <Settings style={{ width:18, height:18 }} />
              <span>Paramètres</span>
            </div>
          )}
        </NavLink>
        <div onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:12, padding:'0.7rem 0.9rem', borderRadius:'0.75rem', color:'#494847', fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:'0.875rem', cursor:'pointer', transition:'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color='#ef4444'; e.currentTarget.style.background='rgba(239,68,68,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.color='#494847'; e.currentTarget.style.background='transparent'; }}
        >
          <LogOut style={{ width:18, height:18 }} />
          <span>Déconnexion</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
