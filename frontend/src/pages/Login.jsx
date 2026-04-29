import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(data);
      navigate('/account');
    } catch (err) {
      setError('Email yoki parol noto\'g\'ri!');
    }
  };

  return (
    <div className="page-container auth-page">
      <div className="auth-card">
        <h2>Tizimga Kirish</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
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
          <div className="form-group">
            <label>Parol</label>
            <div className="input-with-icon">
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
          <button type="submit" className="primary-btn w-100">Kirish</button>
        </form>
        <p className="auth-redirect">
          Akkauntingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
        </p>
      </div>
    </div>
  );
}
