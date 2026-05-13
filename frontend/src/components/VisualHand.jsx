function VisualHand({ hand }) {
  const getDisplayValue = (card) => {
    const mapping = {
      'f3': 'F3', '2c': '2C', '+x': '+X', 'x2': '×2', 'fr': 'FR',
      '10': '10', 'J': 'J', 'Q': 'Q', 'K': 'K', 'A': 'A'
    };
    return mapping[card] || card;
  };

  const getCardColor = (card) => {
    const specialCards = ['f3', '2c', '+x', 'x2', 'fr'];
    if (specialCards.includes(card)) return '#9b59b6';
    if (['J','Q','K','A'].includes(card)) return '#e74c3c';
    return '#ffffff';
  };

  if (hand.length === 0) {
    return (
      <div className="empty-hand-visual">
        <div className="card-placeholder">🎴</div>
        <p>Your hand is empty</p>
      </div>
    );
  }

  return (
    <div className="visual-hand-container">
      <div className="hand-grid">
        {hand.map((card, index) => (
          <div 
            key={index} 
            className="hand-card-item"
            style={{
              backgroundColor: getCardColor(card),
            }}
          >
            <div className="hand-card-value" style={{
              color: getCardColor(card) === '#ffffff' ? '#000' : '#fff'
            }}>
              {getDisplayValue(card)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VisualHand;