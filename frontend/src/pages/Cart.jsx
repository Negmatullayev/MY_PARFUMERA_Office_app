import { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, CreditCard, Banknote, MapPin, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

export default function Cart() {
  const { user } = useContext(AuthContext);
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Naqd');

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!shippingAddress || !phone) {
      toast.error("Iltimos, manzil va telefon raqamingizni kiriting!");
      return;
    }
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems: cart,
          shippingAddress: `${shippingAddress} (Tel: ${phone})`,
          paymentMethod,
          totalPrice
        },
        config
      );
      
      clearCart();
      toast.success("Buyurtma muvaffaqiyatli rasmiylashtirildi!");
      navigate('/account');
    } catch (error) {
      toast.error("Buyurtma berishda xatolik yuz berdi.");
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="page-container">
      <h2>Savat va Rasmiylashtirish</h2>
      
      {cart.length === 0 ? (
        <p style={{ marginTop: '2rem' }}>Savatingiz bo'sh. Bosh sahifaga qaytib atirlarni tanlang.</p>
      ) : (
        <div className="cart-content advanced-checkout">
          <div className="cart-items-section">
            <h3>Sizning Tanlovingiz</h3>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-img" />
                <div className="cart-info">
                  <h4>{item.name}</h4>
                  <p className="brand">{item.brand}</p>
                  <p>Soni: {item.qty} ta</p>
                </div>
                <div className="cart-price">{formatCurrency(item.price * item.qty)}</div>
                <button onClick={() => removeFromCart(item.id)} className="delete-btn">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="checkout-summary-section">
            <div className="cart-summary">
              <h3>To'lov Ma'lumotlari</h3>
              <div className="summary-row">
                <span>Tovarlar narxi:</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="summary-row shipping-free">
                <span>Yetkazib berish:</span>
                <span>Bepul (0 so'm)</span>
              </div>
              <div className="summary-row total">
                <span>Jami To'lov:</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="advanced-checkout-form">
              <h3>Yetkazib berish manzili</h3>
              
              <div className="form-group">
                <div className="input-with-icon">
                  <User size={18} className="icon" />
                  <input type="text" value={user.name} disabled />
                </div>
              </div>

              <div className="form-group">
                <div className="input-with-icon">
                  <Phone size={18} className="icon" />
                  <input 
                    type="text" 
                    placeholder="Telefon raqamingiz (+998...)" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-with-icon">
                  <MapPin size={18} className="icon" />
                  <textarea 
                    placeholder="To'liq manzil (Viloyat, Tuman, Ko'cha, Uy)" 
                    value={shippingAddress} 
                    onChange={e => setShippingAddress(e.target.value)} 
                    required 
                    rows="3"
                  />
                </div>
              </div>

              <h3>To'lov Usuli</h3>
              <div className="payment-methods">
                <label className={`payment-method ${paymentMethod === 'Naqd' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Naqd" 
                    checked={paymentMethod === 'Naqd'} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <Banknote size={24} />
                  <span>Qabul qilganda naqd to'lash</span>
                </label>
                <label className={`payment-method ${paymentMethod === 'Karta' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Karta" 
                    checked={paymentMethod === 'Karta'} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <CreditCard size={24} />
                  <span>Karta orqali to'lash</span>
                </label>
              </div>

              <button type="submit" className="primary-btn w-100" style={{marginTop: '2rem'}}>
                Rasmiylashtirish ({formatCurrency(totalPrice)})
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
