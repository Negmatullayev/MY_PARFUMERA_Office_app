import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, ArrowLeft, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products`);
        const found = data.find(p => p.id === parseInt(id));
        setProduct(found);
      } catch (error) {
        toast.error("Atirni yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loader">Yuklanmoqda...</div>;
  if (!product) return <div className="page-container"><h2>Atir topilmadi</h2></div>;

  const isLiked = wishlist.find(w => w.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} savatga qo'shildi!`);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    if (isLiked) toast.error(`${product.name} sevimlilardan olib tashlandi.`);
    else toast.success(`${product.name} sevimlilarga qo'shildi!`);
  };

  return (
    <div className="page-container product-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={18}/> Orqaga</button>
      
      <div className="details-content">
        <div className="details-img-wrapper">
          <img src={product.image} alt={product.name} />
          <button className={`wishlist-btn-large ${isLiked ? 'active' : ''}`} onClick={handleToggleWishlist}>
            <Heart size={24} fill={isLiked ? 'var(--danger)' : 'none'} color={isLiked ? 'var(--danger)' : 'white'} />
          </button>
        </div>
        
        <div className="details-info">
          <span className="brand">{product.brand}</span>
          <h2>{product.name}</h2>
          <p className="price">{formatCurrency(product.price)}</p>
          
          <div className="desc-box">
            <h3>Ta'rif</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="benefits">
            <ul>
              <li>✔️ 100% Original mahsulot</li>
              <li>✔️ Toshkent bo'ylab bepul yetkazib berish (Free Shipping)</li>
              <li>✔️ Kafolatlangan sifat</li>
            </ul>
          </div>

          <button className="primary-btn w-100" onClick={handleAddToCart}>
            <ShoppingBag size={20} /> Savatga Qo'shish
          </button>
        </div>
      </div>
    </div>
  );
}
