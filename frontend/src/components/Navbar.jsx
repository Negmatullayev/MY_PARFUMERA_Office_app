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

  const cartCount = (cart || []).reduce((a, c) => a + (c.qty || 1), 0);

  return (
    <nav className="luxury-navbar">
      <div className="navbar-container">
        <div className="nav-brand">
          <Link to="/" className="brand-logo">
            MY <span>PARFUMERA</span>
          </Link>
        </div>

        <div className="nav-menu">
          <Link to="/" className="nav-item">
            <Home size={20} />
            <span>Bosh sahifa</span>
          </Link>
          <Link to="/contact" className="nav-item">
            <Phone size={20} />
            <span>Aloqa</span>
          </Link>
          <Link to="/wishlist" className="nav-item badge-parent">
            <Heart size={20} />
            {wishlist?.length > 0 && <span className="badge">{wishlist.length}</span>}
          </Link>
          <Link to="/cart" className="nav-item badge-parent">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          <div className="nav-divider"></div>

          {user ? (
            <div className="user-section">
              <Link to="/account" className="user-profile">
                <div className="avatar-sm">{user.email[0].toUpperCase()}</div>
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="admin-badge">Admin</Link>
              )}
              <button onClick={handleLogout} className="logout-icon-btn">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="luxury-login-btn">
              <User size={18} />
              <span>Kirish</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
