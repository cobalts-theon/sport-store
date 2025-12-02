import React from 'react';
import './components-style/credit-card.css';

const CreditCard = ({ cardNumber, cardName, expiryDate, cvv }) => {
  // Format card number with spaces and mask most digits (show only last 4)
  const formatCardNumber = (number) => {
    const raw = (number || '').replace(/\D/g, '');
    if (!raw) return '#### #### #### ####';

    // If the number is short (<=4) show it as-is
    if (raw.length <= 4) return raw;

    const last4 = raw.slice(-4);
    const maskedLen = Math.max(0, raw.length - 4);
    // Use bullet character for masking
    const masked = '•'.repeat(maskedLen) + last4;

    // Split into groups of 4 for display
    const groups = masked.match(/.{1,4}/g) || [masked];
    return groups.join(' ');
  };

  // Determine card type (simple check)
  const getCardType = (number) => {
    if (!number) return 'visa';
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5')) return 'mastercard';
    return 'visa';
  };

  const cardType = getCardType(cardNumber);

  return (
    <div className="credit-card-container">
      <div className={`credit-card ${cardType}`}>
        <div className="card-front">
          <div className="card-chip">
            <div className="chip-line"></div>
            <div className="chip-line"></div>
            <div className="chip-line"></div>
            <div className="chip-line"></div>
            <div className="chip-main"></div>
          </div>
          <div className="card-logo">
            {cardType === 'visa' ? (
              <span className="visa-logo">VISA</span>
            ) : (
              <div className="mastercard-logo">
                <div className="circle red"></div>
                <div className="circle orange"></div>
              </div>
            )}
          </div>
          <div className="card-number">
            {formatCardNumber(cardNumber)}
          </div>
          <div className="card-info">
            <div className="card-holder">
              <span className="label">Card Holder</span>
              <span className="value">{cardName || 'YOUR NAME'}</span>
            </div>
            <div className="card-expiry">
              <span className="label">Expires</span>
              <span className="value">{expiryDate || 'MM/YY'}</span>
            </div>
            <div className="card-cvv">
              <span className="label">CVV</span>
              <span className="value">{cvv ? '***' : '123'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
