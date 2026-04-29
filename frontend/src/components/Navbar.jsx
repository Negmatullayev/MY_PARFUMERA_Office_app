import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { LogOut, User, LayoutDashboard, Phone, Home, ShoppingCart, Heart } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">MY PARFUMERA</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/"><Home size={18} /> Bosh sahifa</Link></li>
        <li><Link to="/contact"><Phone size={18} /> Bog'lanish</Link></li>
        <li>
          <Link to="/wishlist">
            <Heart size={18} /> Sevimlilar ({wishlist?.length || 0})
          </Link>
        </li>
        <li>
          <Link to="/cart">
            <ShoppingCart size={18} /> Savat ({cart.reduce((a,c)=>a+c.qty,0)})
          </Link>
        </li>
        
        {user ? (
          <>
            <li><Link to="/account"><User size={18} /> Akkaunt</Link></li>
            {user.isAdmin && (
              <li><Link to="/admin" className="admin-link"><LayoutDashboard size={18} /> Admin</Link></li>
            )}
            <li>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={18} /> Chiqish
              </button>
            </li>
          </>
        ) : (
          <li><Link to="/login" className="login-btn"><User size={18} /> Kirish</Link></li>
        )}
      </ul>
    </nav>
  );
}
