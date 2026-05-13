import React, { useState, useEffect } from 'react';
import './CreditPopup.css';

function CreditPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup shortly after page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="credit-popup-overlay">
      <div className="credit-popup-box">
        <button className="close-btn" onClick={() => setIsVisible(false)}>×</button>
        <div className="credit-content">
          <span className="sparkle">✨</span>
          <h3>Welcome!</h3>
          <p>This website is proudly made by <br/><strong>Kamlesh</strong> & <strong>Sunny Choudhary</strong></p>
          <button className="credit-ok-btn" onClick={() => setIsVisible(false)}>Awesome!</button>
        </div>
      </div>
    </div>
  );
}

export default CreditPopup;
