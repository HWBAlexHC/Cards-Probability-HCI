function VisualCard({ card, isSelected, onClick, disabled }) {
  // Map card values to display names
  const getDisplayValue = (card) => {
    const mapping = {
      'f3': 'Flip 3',
      '2c': '2nd Ch', 
      '+x': '+X',
      'x2': '×2',
      'fr': 'Frz',
      '10': '10',
      'J': 'J',
      'Q': 'Q',
      'K': 'K',
      'A': 'A'
    };
    return mapping[card] || card;
  };

  // Different styling for special Flip7 cards
  const isSpecialCard = ['f3', '2c', '+x', 'x2', 'fr'].includes(card);
  const isNumberCard = !isNaN(card) || (card >= '2' && card <= '10');
  
  let cardColor = '#fff';
  let textColor = '#000';
  
  if (isSpecialCard) {
    cardColor = '#9b59b6'; // Purple for special cards
    textColor = '#fff';
  } else if (card === 'A' || card === 'K' || card === 'Q' || card === 'J') {
    cardColor = '#e74c3c'; // Red for face cards
    textColor = '#fff';
  }

  return (
    <button
      className={`visual-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(card)}
      disabled={disabled}
      style={{
        backgroundColor: cardColor,
        color: textColor,
        transform: isSelected ? 'translateY(-10px)' : 'none'
      }}
    >
      <div className="card-inner">
        <div className="card-value-large">{getDisplayValue(card)}</div>
        <div className="card-suit">
          {card === 'A' ? '♠️' : 
           card === 'K' ? '♣️' : 
           card === 'Q' ? '♥️' : 
           card === 'J' ? '♦️' : ''}
        </div>
      </div>
    </button>
  );
}

export default VisualCard;