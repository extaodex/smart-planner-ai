/**
 * Utility for Browser Notifications
 */

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn("Ce navigateur ne supporte pas les notifications bureau.");
    return false;
  }

  if (Notification.permission === 'granted') return true;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const sendNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: options.body || 'Rappel de Smart Planner AI',
      icon: '/vite.svg', // Fallback icon
      ...options,
    });
  }
};

export const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    
    // Create oscillator for the note
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // A nice futuristic bell sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // Pitch A5
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1); // Slide to A6
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6); // Decay
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch (err) {
    console.warn("Web Audio API non supportée sur ce navigateur", err);
  }
};

/**
 * Example usage in a component:
 *
 * useEffect(() => {
 *   const check = setInterval(() => {
 *     // Logic to check if a task is due in 5 mins
 *     if (isDueSoon) sendNotification("Tâche à faire !", { body: "Nom de la tâche" });
 *   }, 60000);
 *   return () => clearInterval(check);
 * }, []);
 */
