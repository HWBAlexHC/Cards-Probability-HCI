import { useState, useEffect } from 'react';
import VisualCard from './VisualCard';
import VisualHand from './VisualHand';
import './VisualInterface.css';

function VisualInterface({ gameType, hand, bustProb, loading, onDrawCard, onReset, onChangeGame }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const flip7Cards = ['0','1','2','3','4','5','6','7','8','9','10','11','12','f3','2c','+x','x2','fr'];
  const blackjackCards = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  const cards = gameType === 'flip7' ? flip7Cards : blackjackCards;

  // Split cards into rows for better display
  const numberCards = cards.filter(c => !isNaN(c) || (c >= '2' && c <= '10'));
  const specialCards = cards.filter(c => isNaN(c) && !(c >= '2' && c <= '10'));

  const handleCardClick = async (card) => {
    setSelectedCard(card);
    await onDrawCard(card);
    
    // Show feedback animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1000);
    
    setTimeout(() => setSelectedCard(null), 300);
  };

  // Get bust color (green/yellow/red)
  const getBustColor = () => {
    if (bustProb < 0.3) return '#2ecc71';
    if (bustProb < 0.6) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="visual-interface">
      {/* Header */}
      <header className="visual-header">
        <div>
          <h1>{gameType === 'flip7' ? '♠️ Flip7 ♣️' : '🃏 Blackjack 🃏'}</h1>
          <p className="game-subtitle">Select cards to build your hand</p>
        </div>
        <div className="visual-header-buttons">
          <button onClick={onReset} className="visual-reset-btn">↺ Reset</button>
          <button onClick={onChangeGame} className="visual-change-btn">⇄ Change Game</button>
        </div>
      </header>

      {/* Your Hand - Visual fan spread */}
      <div className="visual-hand-section">
        <h2>
          <span className="hand-icon">🃟</span> Your Hand 
          <span className="hand-count">({hand.length} cards)</span>
        </h2>
        <VisualHand hand={hand} />
      </div>

      {/* Bust Probability - Visual meter */}
      <div className="visual-probability">
        <div className="prob-meter">
          <div 
            className="prob-meter-fill" 
            style={{ 
              width: `${bustProb * 100}%`,
              backgroundColor: getBustColor()
            }}
          />
        </div>
        <div className="prob-stats">
          <span>Safe</span>
          <span className="prob-percentage">{(bustProb * 100).toFixed(1)}% Bust</span>
          <span>Risky</span>
        </div>
        {bustProb > 0.5 && hand.length > 0 && (
          <div className="warning-message">⚠️ High risk of busting!</div>
        )}
      </div>

      {/* Card Selection Area - Visual cards */}
      <div className="card-selection-area">
        <h3>📦 Select a Card to Draw</h3>
        
        {/* Number Cards Row */}
        {numberCards.length > 0 && (
          <div className="card-row">
            <div className="row-label">Numbers</div>
            <div className="card-grid-visual">
              {numberCards.map(card => (
                <VisualCard
                  key={card}
                  card={card}
                  isSelected={selectedCard === card}
                  onClick={handleCardClick}
                  disabled={loading}
                />
              ))}
            </div>
          </div>
        )}

        {/* Special/Face Cards Row */}
        {specialCards.length > 0 && (
          <div className="card-row">
            <div className="row-label">Specials</div>
            <div className="card-grid-visual">
              {specialCards.map(card => (
                <VisualCard
                  key={card}
                  card={card}
                  isSelected={selectedCard === card}
                  onClick={handleCardClick}
                  disabled={loading}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="visual-loading">
          <div className="spinner">🎴</div>
          <p>Drawing card...</p>
        </div>
      )}

      {/* Success Animation */}
      {showConfetti && (
        <div className="card-pop">
          <div className="pop-card">✨ +1 Card ✨</div>
        </div>
      )}
    </div>
  );
}

export default VisualInterface;