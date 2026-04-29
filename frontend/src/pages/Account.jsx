import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Package } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function Account() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
          setOrders(data);
        } catch (error) {
          console.error("Buyurtmalarni olishda xatolik");
        }
      };
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="page-container account-page">
      <h2>Shaxsiy Akkaunt</h2>
      <div className="account-details">
        <div className="avatar">
          <User size={64} />
        </div>
        <div className="info">
          <h3>{user.name}</h3>
          <p><Mail size={16} /> {user.email}</p>
          <p className="role">
            <Shield size={16} /> 
            Rol: {user.isAdmin ? 'Administrator' : 'Foydalanuvchi'}
          </p>
        </div>
      </div>

      <div className="my-orders">
        <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}><Package /> Mening Buyurtmalarim</h3>
        {orders.length === 0 ? (
          <p>Sizda hozircha buyurtmalar yo'q.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sana</th>
                <th>Umumiy Narx</th>
                <th>Holati (Status)</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{formatCurrency(order.totalPrice)}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
