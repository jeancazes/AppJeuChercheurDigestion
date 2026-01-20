import { useState } from 'react';
import { useRouter } from 'next/router';

const TEACHER_PIN = '1447';
const MAX_ATTEMPTS = 3;

export default function TeacherLogin() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError('Accès verrouillé. Réessayez plus tard.');
      return;
    }

    if (pin === TEACHER_PIN) {
      // Succès - rediriger vers le dashboard
      router.push('/teacher/dashboard');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setError('Trop de tentatives. Accès verrouillé.');
        // Déverrouiller après 30 secondes
        setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
          setError('');
        }, 30000);
      } else {
        setError(`Code incorrect. ${MAX_ATTEMPTS - newAttempts} tentative(s) restante(s).`);
      }
      setPin('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>👨‍🏫 Interface Professeur</h1>
          <p style={styles.subtitle}>Le Laboratoire Fabuleux</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Code PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Entrez le code PIN"
              style={styles.input}
              maxLength="4"
              disabled={isLocked}
              autoFocus
            />
          </div>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            style={styles.button}
            disabled={isLocked || pin.length !== 4}
          >
            {isLocked ? '🔒 Verrouillé' : 'Accéder'}
          </button>
        </form>

        <div style={styles.footer}>
          <button 
            onClick={() => router.push('/')}
            style={styles.backButton}
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    margin: '0 0 10px 0',
    color: '#667eea',
  },
  subtitle: {
    fontSize: '1rem',
    margin: 0,
    color: '#666',
  },
  form: {
    marginBottom: '20px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '1.2rem',
    border: '2px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    letterSpacing: '4px',
  },
  error: {
    background: '#fee',
    border: '1px solid #fcc',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '15px',
    color: '#c00',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: '15px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  footer: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
};
