import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} savatga qo'shildi!`);
  };

  const handleRemove = (e, product) => {
    e.preventDefault();
    toggleWishlist(product);
    toast.error(`${product.name} sevimlilardan olib tashlandi.`);
  };

  return (
    <div className="page-container wishlist-page">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <Heart fill="var(--danger)" color="var(--danger)" /> Mening Sevimlilarim
      </h2>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Heart size={64} color="var(--text-muted)" style={{ opacity: 0.2, marginBottom: '1rem' }}/>
          <p>Sizda hali sevimlilar yo'q.</p>
          <Link to="/" className="primary-btn" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Atirlarni ko'rish
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card">
              <div className="img-container">
                <img src={product.image} alt={product.name} />
                <button className="wishlist-icon-btn" onClick={(e) => handleRemove(e, product)}>
                  <Trash2 size={20} color="var(--danger)" />
                </button>
              </div>
              <div className="product-info">
                <span className="brand">{product.brand}</span>
                <h3>{product.name}</h3>
                <div className="price-row">
                  <span className="price">{formatCurrency(product.price)}</span>
                  <button className="buy-btn" onClick={(e) => handleAddToCart(e, product)}>
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
