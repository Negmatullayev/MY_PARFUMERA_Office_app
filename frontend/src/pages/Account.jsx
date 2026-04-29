import { useContext, useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Package, Settings, CreditCard, MapPin, Bell } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function Account() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await api.get('/orders/myorders', config);
          setOrders(data);
        } catch (error) {
          console.error("Buyurtmalarni olishda xatolik");
        }
      };
      fetchOrders();
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="page-container account-page">
      <div className="account-layout">
        {/* Sidebar */}
        <aside className="account-sidebar">
          <div className="user-brief">
            <div className="luxury-avatar">
              {user.email[0].toUpperCase()}
            </div>
            <h3>{user.name || 'Foydalanuvchi'}</h3>
            <p>{user.email}</p>
          </div>
          
          <nav className="account-nav">
            <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
              <User size={18} /> Profil
            </button>
            <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
              <Package size={18} /> Buyurtmalar
            </button>
            <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
              <Settings size={18} /> Sozlamalar
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="account-main">
          {activeTab === 'profile' && (
            <div className="account-card">
              <h2>Mening Profilim</h2>
              <div className="profile-grid">
                <div className="profile-item">
                  <span>To'liq ism</span>
                  <p>{user.name || 'Kiritilmagan'}</p>
                </div>
                <div className="profile-item">
                  <span>Email manzil</span>
                  <p>{user.email}</p>
                </div>
                <div className="profile-item">
                  <span>Hisob turi</span>
                  <p className="role-tag">{user.isAdmin ? 'Administrator' : 'Xaridor'}</p>
                </div>
                <div className="profile-item">
                  <span>A'zo bo'lgan sana</span>
                  <p>29.04.2026</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="account-card">
              <h2>Buyurtmalar Tarixi</h2>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <Package size={48} />
                  <p>Sizda hali buyurtmalar mavjud emas.</p>
                  <Link to="/" className="luxury-btn-sm">Do'konni ko'rish</Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-item">
                      <div className="order-header">
                        <span>#{order.id}</span>
                        <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                      </div>
                      <div className="order-details">
                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="order-price">{formatCurrency(order.totalPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="account-card">
              <h2>Tizim Sozlamalari</h2>
              <div className="settings-groups">
                <div className="settings-section">
                  <h3><Bell size={18} /> Bildirishnomalar</h3>
                  <div className="setting-toggle">
                    <p>Yangi mahsulotlar haqida xabar berish</p>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="setting-toggle">
                    <p>Buyurtma holati o'zgarganda xabar berish</p>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>

                <div className="settings-section">
                  <h3><Shield size={18} /> Xavfsizlik</h3>
                  <button className="luxury-btn-outline">Parolni o'zgartirish</button>
                </div>

                <div className="settings-section">
                  <h3><MapPin size={18} /> Manzillar</h3>
                  <button className="luxury-btn-outline">Yangi manzil qo'shish</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
