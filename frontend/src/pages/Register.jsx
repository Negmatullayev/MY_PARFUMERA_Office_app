import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, User as UserIcon } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      login(data);
      navigate('/account');
    } catch (err) {
      setError('Bunday foydalanuvchi mavjud yoki xatolik yuz berdi!');
    }
  };

  return (
    <div className="page-container auth-page">
      <div className="auth-card">
        <h2>Ro'yxatdan O'tish</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ismingiz</label>
            <div className="input-with-icon">
              <UserIcon className="icon" size={18} />
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ismingiz"
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <Mail className="icon" size={18} />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="email@example.com"
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
                placeholder="Parolingizni kiriting"
                required 
              />
            </div>
          </div>
          <button type="submit" className="primary-btn w-100">Ro'yxatdan O'tish</button>
        </form>
        <p className="auth-redirect">
          Allaqachon akkauntingiz bormi? <Link to="/login">Kirish</Link>
        </p>
      </div>
    </div>
  );
}
