import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { register } from '../services/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await register({ name, email, password });
      localStorage.setItem('planner_token', res.data.token);
      localStorage.setItem('planner_user', JSON.stringify(res.data.user));
      navigate('/');
      window.location.reload(); // Refresh to update sidebar/state
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 60, height: 60, borderRadius: '1rem', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 16px rgba(99,102,241,0.3)' }}>
            <UserPlus style={{ color: '#000', width: 30, height: 30 }} />
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 700 }}>Inscription</h1>
          <p style={{ color: '#adaaaa', marginTop: '0.5rem' }}>Préparez votre succès futur dès aujourd'hui</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '0.75rem', color: '#ef4444', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <AlertCircle style={{ width: 18, height: 18 }} />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#494847' }} />
            <input 
              type="text" 
              placeholder="Prénom" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', background: '#1a1919', border: '1px solid #262626', borderRadius: '0.75rem', color: '#fff', outline: 'none' }} 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#494847' }} />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', background: '#1a1919', border: '1px solid #262626', borderRadius: '0.75rem', color: '#fff', outline: 'none' }} 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#494847' }} />
            <input 
              type="password" 
              placeholder="Mot de passe" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', background: '#1a1919', border: '1px solid #262626', borderRadius: '0.75rem', color: '#fff', outline: 'none' }} 
            />
          </div>

          <motion.button 
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg,#6366f1,#a855f7)', border: 'none', borderRadius: '0.75rem', color: '#000', fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
          >
            {loading ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} /> : 'Créer un compte'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#adaaaa', fontSize: '0.875rem' }}>
          Vous avez déjà un compte ? <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
