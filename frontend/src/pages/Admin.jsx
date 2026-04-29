import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trash2, PlusCircle, LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function Admin() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', brand: '', price: '', description: '', image: '' });

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const pData = await api.get('/products');
    setProducts(pData.data);
    
    try {
      const oData = await api.get('/orders', config);
      setOrders(oData.data);
      const uData = await api.get('/auth/users', config);
      setUsers(uData.data);
    } catch (e) { console.log(e); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.post('/products', newProduct, config);
      setNewProduct({ name: '', brand: '', price: '', description: '', image: '' });
      fetchData();
    } catch (error) { alert('Xatolik'); }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.delete(`/products/${id}`, config);
      fetchData();
    } catch (error) { alert('Xatolik'); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.put(`/orders/${id}/status`, { status }, config);
      fetchData();
    } catch (error) { alert('Xatolik'); }
  };

  if (!user || !user.isAdmin) return <Navigate to="/" />;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        <ul>
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}><LayoutDashboard size={18}/> Statistika</li>
          <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}><ShoppingCart size={18}/> Buyurtmalar</li>
          <li className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}><Package size={18}/> Atirlar</li>
          <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}><Users size={18}/> Mijozlar (Kuzatuv)</li>
        </ul>
      </aside>

      <main className="admin-main">
        {activeTab === 'dashboard' && (
          <div>
            <h2>Umumiy Statistika</h2>
            <div className="stats-cards">
              <div className="stat-card">
                <h4>Jami Buyurtmalar</h4>
                <p>{orders.length}</p>
              </div>
              <div className="stat-card">
                <h4>Umumiy Foyda</h4>
                <p>{formatCurrency(orders.reduce((acc, o) => acc + o.totalPrice, 0))}</p>
              </div>
              <div className="stat-card">
                <h4>Bazada Atirlar</h4>
                <p>{products.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2>Mijozlar Buyurtmalari</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mijoz</th>
                  <th>Manzil</th>
                  <th>Narx</th>
                  <th>Holati (Status)</th>
                  <th>Harakat</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.user.name} ({o.user.email})</td>
                    <td>{o.shippingAddress}</td>
                    <td>{formatCurrency(o.totalPrice)}</td>
                    <td>{o.status}</td>
                    <td>
                      <select 
                        value={o.status} 
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Kutilmoqda">Kutilmoqda</option>
                        <option value="Yig'ilyapti">Yig'ilyapti</option>
                        <option value="Jo'natildi">Jo'natildi</option>
                        <option value="Yetkazib berildi">Yetkazib berildi</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="admin-content">
            <div className="add-product-form">
              <h3>Yangi Qo'shish</h3>
              <form onSubmit={handleAddProduct}>
                <input type="text" placeholder="Nomi" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                <input type="text" placeholder="Brendi" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} required />
                <input type="number" placeholder="Narxi (So'mda)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                <input type="text" placeholder="Rasm URL" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} required />
                <textarea placeholder="Ta'rif" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required></textarea>
                <button type="submit" className="primary-btn"><PlusCircle size={18}/> Qo'shish</button>
              </form>
            </div>
            <div className="products-list">
              <h3>Mavjud Atirlar</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rasm</th>
                    <th>Nomi</th>
                    <th>Narxi</th>
                    <th>O'chirish</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td><img src={p.image} className="admin-product-img" /></td>
                      <td>{p.name}</td>
                      <td>{formatCurrency(p.price)}</td>
                      <td><button onClick={() => handleDeleteProduct(p.id)} className="delete-btn"><Trash2 size={18} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2>Ro'yxatdan o'tgan Mijozlar</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ism</th>
                  <th>Email (Login)</th>
                  <th>Parol</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td style={{fontFamily: 'monospace', color: 'var(--danger)'}}>{u.password}</td>
                    <td>{u.isAdmin ? 'Admin' : 'Mijoz'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
