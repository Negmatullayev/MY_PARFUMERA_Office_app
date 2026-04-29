import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { ShoppingBag, Search, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Barchasi');
  
  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        toast.error('Xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // prevent routing to details
    addToCart(product);
    toast.success(`${product.name} savatga qo'shildi!`);
  };

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    toggleWishlist(product);
    const isLiked = wishlist.find(w => w.id === product.id);
    if (isLiked) toast.error(`${product.name} sevimlilardan olindi`);
    else toast.success(`${product.name} sevimlilarga qo'shildi`);
  };

  const brands = ['Barchasi', ...new Set(products.map(p => p.brand))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'Barchasi' || p.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  if (loading) return <div className="loader">Yuklanmoqda...</div>;

  return (
    <div className="page-container home-page">
      <header className="hero">
        <h1>Nafis Atirlar Olamiga Xush Kelibsiz</h1>
        <p>O'zingizga mos bo'lgan eng sara va eksklyuziv iforlarni toping.</p>
        
        <div className="search-filter-bar">
          <div className="search-input">
            <Search size={18} className="icon"/>
            <input 
              type="text" 
              placeholder="Atir nomini qidiring..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="brand-filter" 
            value={selectedBrand} 
            onChange={e => setSelectedBrand(e.target.value)}
          >
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </header>
      
      <section className="products-grid">
        {filteredProducts.map(product => {
          const isLiked = wishlist.find(w => w.id === product.id);
          return (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card">
              <div className="img-container">
                <img src={product.image} alt={product.name} />
                <button 
                  className="wishlist-icon-btn" 
                  onClick={(e) => handleToggleWishlist(e, product)}
                >
                  <Heart size={20} fill={isLiked ? 'var(--danger)' : 'none'} color={isLiked ? 'var(--danger)' : 'var(--primary)'} />
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
          );
        })}
        {filteredProducts.length === 0 && <p className="no-results">Hech narsa topilmadi.</p>}
      </section>
    </div>
  );
}
