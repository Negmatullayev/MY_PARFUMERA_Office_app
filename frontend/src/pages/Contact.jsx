import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="page-container contact-page">
      <h2>Biz bilan bog'lanish</h2>
      <div className="contact-content">
        <div className="contact-info">
          <div className="info-item">
            <Phone className="icon" />
            <div>
              <h3>Telefon</h3>
              <p>+998 20 006 20 46</p>
            </div>
          </div>
          <div className="info-item">
            <Mail className="icon" />
            <div>
              <h3>Email</h3>
              <p>info@myparfumera.uz</p>
            </div>
          </div>
          <div className="info-item">
            <MapPin className="icon" />
            <div>
              <h3>Manzil</h3>
              <p>Namangan shahri</p>
            </div>
          </div>
        </div>
        
        <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert("Xabar yuborildi!"); }}>
          <div className="form-group">
            <label>Ismingiz</label>
            <input type="text" placeholder="Ismingizni kiriting" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Emailingizni kiriting" required />
          </div>
          <div className="form-group">
            <label>Xabar</label>
            <textarea placeholder="Xabaringizni yozing..." rows="4" required></textarea>
          </div>
          <button type="submit" className="primary-btn">Yuborish</button>
        </form>
      </div>
    </div>
  );
}
