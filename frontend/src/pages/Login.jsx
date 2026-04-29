import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Xush kelibsiz!');
      navigate('/account');
    } catch (err) {
      toast.error('Email yoki parol noto\'g\'ri!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container auth-page">
      <div className="luxury-auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <LogIn size={30} color="var(--primary)" />
          </div>
          <h2>Xush Kelibsiz</h2>
          <p>Tizimga kirish uchun ma'lumotlaringizni kiriting</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="luxury-input-group">
            <label>Email Manzili</label>
            <div className="input-wrapper">
              <Mail className="icon" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="luxury-input-group">
            <label>Maxfiy Parol</label>
            <div className="input-wrapper">
              <Lock className="icon" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin"
                required
              />
            </div>
          </div>

          <button type="submit" className="luxury-btn" disabled={loading}>
            {loading ? 'Kirilmoqda...' : 'Tizimga Kirish'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Akkauntingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link></p>
        </div>
      </div>
    </div>
  );
}
