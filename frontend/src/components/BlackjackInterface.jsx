import { useState } from 'react';
import './BlackjackInterface.css';

function BlackjackInterface({ 
  playerHand, 
  dealerCard, 
  bustProb, 
  recommendation,
  playerValue,
  loading, 
  onDrawCard, 
  onSetDealerCard,
  onReset, 
  onChangeGame 
}) {
  const [activeHand, setActiveHand] = useState('player'); // 'player' or 'dealer'
  
  const blackjackCards = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  
  // Calculate hand value display
  const getHandValue = (hand) => {
    if (!hand || hand.length === 0) return 0;
    let total = 0;
    let aces = 0;
    for (const card of hand) {
      if (card === 'A') {
        aces++;
        total += 11;
      } else if (['K','Q','J'].includes(card)) {
        total += 10;
      } else {
        total += parseInt(card);
      }
    }
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }
    return total;
  };
  
  const playerTotal = getHandValue(playerHand);
  const isBust = playerTotal > 21;
  
  // Get card color
  const getCardColor = (card) => {
    if (card === 'A') return '#e74c3c';
    if (['K','Q','J'].includes(card)) return '#e74c3c';
    return '#ffffff';
  };
  
  return (
    <div className="blackjack-interface">
      <div className="blackjack-header">
        <h1>♠️ Blackjack ♣️</h1>
        <div className="header-buttons">
          <button onClick={onReset} className="reset-btn">Reset Game</button>
          <button onClick={onChangeGame} className="change-btn">Change Game</button>
        </div>
      </div>
      
      {/* Dealer's Hand Section */}
      <div className="dealer-section">
        <h2>🃟 Dealer's Up Card</h2>
        <div className="dealer-hand">
          {dealerCard ? (
            <div 
              className="dealer-card"
              style={{ backgroundColor: getCardColor(dealerCard), color: getCardColor(dealerCard) === '#ffffff' ? '#000' : '#fff' }}
            >
              <div className="card-value-large">{dealerCard}</div>
              <div className="card-label">Dealer</div>
            </div>
          ) : (
            <div className="empty-dealer">
              <p>No dealer card set</p>
              <p className="hint">Switch to "Set Dealer Card" mode below</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Player's Hand Section */}
      <div className="player-section">
        <h2>👤 Your Hand {playerTotal > 0 && `(Total: ${playerTotal})`}</h2>
        <div className="player-hand">
          {playerHand.length === 0 ? (
            <p className="empty-hand">No cards yet. Start drawing!</p>
          ) : (
            <div className="hand-cards">
              {playerHand.map((card, i) => (
                <div 
                  key={i} 
                  className="player-card"
                  style={{ backgroundColor: getCardColor(card), color: getCardColor(card) === '#ffffff' ? '#000' : '#fff' }}
                >
                  {card}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {isBust && (
          <div className="bust-warning">💥 BUSTED! You went over 21! 💥</div>
        )}
        
        {!isBust && playerHand.length > 0 && (
          <div className="probability-section">
            <div className="prob-meter">
              <div 
                className="prob-fill" 
                style={{ 
                  width: `${bustProb * 100}%`,
                  backgroundColor: bustProb < 0.3 ? '#2ecc71' : bustProb < 0.6 ? '#f39c12' : '#e74c3c'
                }}
              />
            </div>
            <div className="prob-stats">
              <span>Bust Probability: {(bustProb * 100).toFixed(1)}%</span>
              {recommendation && <span className="recommendation">Recommend: {recommendation}</span>}
            </div>
          </div>
        )}
      </div>
      
      {/* Active Hand Selector */}
      <div className="active-hand-selector">
        <h3>📝 Adding cards to:</h3>
        <div className="selector-buttons">
          <button 
            className={`selector-btn ${activeHand === 'player' ? 'active' : ''}`}
            onClick={() => setActiveHand('player')}
          >
            👤 My Hand
          </button>
          <button 
            className={`selector-btn ${activeHand === 'dealer' ? 'active' : ''}`}
            onClick={() => setActiveHand('dealer')}
          >
            🃟 Dealer's Card
          </button>
        </div>
        <div className="selector-status">
          Currently adding to: <strong>{activeHand === 'player' ? 'YOUR hand' : 'DEALER\'S up card'}</strong>
        </div>
      </div>
      
      {/* Card Buttons */}
      <div className="card-buttons">
        {blackjackCards.map(card => (
          <button
            key={card}
            onClick={() => {
              if (activeHand === 'player') {
                onDrawCard(card);
              } else {
                onSetDealerCard(card);
              }
            }}
            disabled={loading}
            className="card-btn"
          >
            {card}
          </button>
        ))}
      </div>
      
      {/* Keyboard Hint */}
      <div className="keyboard-hint">
        💡 Keyboard shortcuts: Number keys (2-9), J, Q, K, A | Ctrl+R=Reset, ESC=Exit
      </div>
      
      {loading && <div className="loading-overlay">Loading...</div>}
    </div>
  );
}

export default BlackjackInterface;