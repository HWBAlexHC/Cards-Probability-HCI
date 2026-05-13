import { useState } from 'react';
import VisualCard from './VisualCard';
import VisualHand from './VisualHand';
import './VisualInterface.css';

function VisualInterface({ gameType, hand, bustProb, loading, onDrawCard, onReset, onChangeGame, onSetDealerCard, dealerCard, recommendation }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeHand, setActiveHand] = useState('player'); // for Blackjack

  const flip7Cards = ['0','1','2','3','4','5','6','7','8','9','10','11','12','f3','2c','+x','x2','fr'];
  const blackjackCards = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  const cards = gameType === 'flip7' ? flip7Cards : blackjackCards;

  const numberCards = cards.filter(c => !isNaN(c) || (c >= '2' && c <= '10'));
  const specialCards = cards.filter(c => isNaN(c) && !(c >= '2' && c <= '10'));

  // Calculate hand value for Blackjack
  const getHandValue = (handCards) => {
    if (!handCards || handCards.length === 0) return 0;
    let total = 0;
    let aces = 0;
    for (const card of handCards) {
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

  const playerTotal = gameType === 'blackjack' ? getHandValue(hand) : null;
  const isBust = playerTotal > 21;

  const handleCardClick = async (card) => {
    setSelectedCard(card);
    
    if (gameType === 'blackjack') {
      if (activeHand === 'player') {
        await onDrawCard(card);
      } else {
        await onSetDealerCard(card);
      }
    } else {
      await onDrawCard(card);
    }
    
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 800);
    setTimeout(() => setSelectedCard(null), 300);
  };

  const getBustColor = () => {
    if (bustProb < 0.3) return '#2ecc71';
    if (bustProb < 0.6) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="visual-interface">
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

      {/* Blackjack Dealer Section */}
      {gameType === 'blackjack' && (
        <div className="dealer-section-visual">
          <h2>🃟 Dealer's Up Card</h2>
          <div className="dealer-cards-visual">
            {dealerCard ? (
              <div className="dealer-card-visual">
                <div className="dealer-card-value">{dealerCard}</div>
                <div className="dealer-card-label">Up Card</div>
              </div>
            ) : (
              <div className="empty-dealer-visual">
                <p>No dealer card set yet</p>
                <p className="hint-visual">Switch to "Dealer" mode below to add</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Player Hand Section */}
      <div className="visual-hand-section">
        <h2>
          🃟 Your Hand {playerTotal > 0 && `(Total: ${playerTotal})`}
          <span className="hand-count">({hand.length} cards)</span>
        </h2>
        <VisualHand hand={hand} />
        {isBust && (
          <div className="bust-warning-visual">💥 BUSTED! You went over 21! 💥</div>
        )}
      </div>

      {/* Blackjack Mode Selector */}
      {gameType === 'blackjack' && (
        <div className="mode-selector-visual">
          <div className="mode-buttons-visual">
            <button 
              className={`mode-btn-visual ${activeHand === 'player' ? 'active' : ''}`}
              onClick={() => setActiveHand('player')}
            >
              👤 Add to My Hand
            </button>
            <button 
              className={`mode-btn-visual ${activeHand === 'dealer' ? 'active' : ''}`}
              onClick={() => setActiveHand('dealer')}
            >
              🃟 Set Dealer Card
            </button>
          </div>
          <div className="mode-status-visual">
            Currently: {activeHand === 'player' ? 'Adding to YOUR hand' : 'Setting DEALER\'S up card'}
          </div>
        </div>
      )}

      {/* Probability Section */}
      <div className="visual-probability">
        <div className="prob-meter">
          <div 
            className="prob-meter-fill" 
            style={{ width: `${bustProb * 100}%`, backgroundColor: getBustColor() }}
          />
        </div>
        <div className="prob-stats">
          <span>Safe</span>
          <span className="prob-percentage">{(bustProb * 100).toFixed(1)}% Bust</span>
          <span>Risky</span>
        </div>
        {recommendation && (
          <div className="recommendation-visual">
            📊 Recommendation: <strong>{recommendation}</strong>
          </div>
        )}
        {bustProb > 0.7 && hand.length > 0 && !isBust && (
          <div className="warning-message">⚠️ High risk of busting!</div>
        )}
      </div>

      {/* Card Selection Area */}
      <div className="card-selection-area">
        <h3>📦 Select a Card to Draw</h3>
        
        {numberCards.length > 0 && (
          <div className="card-row">
            <div className="row-label">Numbers</div>
            <div className="card-grid-visual">
              {numberCards.map(card => {
                const specialCardsBJ = ['f3', '2c', '+x', 'x2', 'fr'];
                const isDuplicate = gameType === 'flip7' && hand.includes(card) && !specialCardsBJ.includes(card);
                return (
                  <VisualCard
                    key={card}
                    card={card}
                    isSelected={selectedCard === card}
                    onClick={handleCardClick}
                    disabled={loading || isDuplicate}
                  />
                );
              })}
            </div>
          </div>
        )}

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

      {loading && (
        <div className="visual-loading">
          <div className="spinner">🎴</div>
          <p>Drawing card...</p>
        </div>
      )}

      {showFeedback && (
        <div className="card-pop">
          <div className="pop-card">✨ Card Added! ✨</div>
        </div>
      )}
    </div>
  );
}

export default VisualInterface;