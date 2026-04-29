import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <div className="app-container">
              <Toaster position="top-right" />
              <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/account" element={<Account />} />
                <Route path="/admin/*" element={<Admin />} />
              </Routes>
            </main>
            <footer className="footer">
              <p>&copy; {new Date().getFullYear()} MY PARFUMERA. Barcha huquqlar himoyalangan. Namangan shahrida ishlab chiqarilgan.</p>
            </footer>
          </div>
        </Router>
      </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
