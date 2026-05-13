import { useState } from 'react';
import './MobileLayout.css';

function MobileLayout({ gameType, hand, bustProb, loading, onDrawCard, onReset, onChangeGame, onSetDealerCard, dealerCard, recommendation }) {
  const [showBottomSheet, setShowBottomSheet] = useState(true);
  const [activeHand, setActiveHand] = useState('player'); // 'player' or 'dealer' for Blackjack

  const flip7Cards = ['0','1','2','3','4','5','6','7','8','9','10','11','12','f3','2c','+x','x2','fr'];
  const blackjackCards = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  const cards = gameType === 'flip7' ? flip7Cards : blackjackCards;

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

  return (
    <div className="mobile-layout">
      {/* Header */}
      <header className="mobile-header">
        <h1>{gameType === 'flip7' ? 'Flip7' : 'Blackjack'}</h1>
        <div className="header-buttons">
          <button onClick={onReset} className="reset-btn">Reset</button>
          <button onClick={onChangeGame} className="change-btn">Change Game</button>
        </div>
      </header>

      {/* Blackjack Dealer Section (only for Blackjack) */}
      {gameType === 'blackjack' && (
        <div className="dealer-section-mobile">
          <h2>🃟 Dealer's Up Card</h2>
          <div className="dealer-hand-mobile">
            {dealerCard ? (
              <div className="dealer-card-mobile">
                <span className="dealer-card-value">{dealerCard}</span>
                <span className="dealer-card-label">Up Card</span>
              </div>
            ) : (
              <div className="empty-dealer-mobile">
                <p>No dealer card</p>
                <p className="hint-mobile">Tap "Dealer" mode below</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Player Hand Section */}
      <div className="hand-section">
        <h2>
          {gameType === 'blackjack' ? '👤 Your Hand' : '🎴 Your Hand'}
          {playerTotal > 0 && ` (Total: ${playerTotal})`}
        </h2>
        <div className="hand-scroll">
          {hand.length === 0 ? (
            <p className="empty-hand">Tap a card to start</p>
          ) : (
            hand.map((card, i) => (
              <div key={i} className="mobile-card">{card}</div>
            ))
          )}
        </div>
        {isBust && (
          <div className="bust-warning-mobile">💥 BUSTED! You went over 21! 💥</div>
        )}
      </div>

      {/* Blackjack Mode Selector (only for Blackjack) */}
      {gameType === 'blackjack' && (
        <div className="mode-selector-mobile">
          <div className="mode-buttons-mobile">
            <button 
              className={`mode-btn-mobile ${activeHand === 'player' ? 'active' : ''}`}
              onClick={() => setActiveHand('player')}
            >
              👤 My Hand
            </button>
            <button 
              className={`mode-btn-mobile ${activeHand === 'dealer' ? 'active' : ''}`}
              onClick={() => setActiveHand('dealer')}
            >
              🃟 Dealer Card
            </button>
          </div>
          <div className="mode-status-mobile">
            Adding to: {activeHand === 'player' ? 'YOUR hand' : 'DEALER\'S up card'}
          </div>
        </div>
      )}

      {/* Probability Section */}
      <div className={`bottom-sheet ${showBottomSheet ? 'open' : ''}`}>
        <div className="sheet-handle" onClick={() => setShowBottomSheet(!showBottomSheet)}>
          <div className="handle-bar"></div>
        </div>
        <div className="sheet-content">
          <div className="probability-mobile">
            <span className="prob-label">Bust Probability</span>
            <span className="prob-value-mobile">{(bustProb * 100).toFixed(1)}%</span>
          </div>
          {recommendation && (
            <div className="recommendation-mobile">
              Recommendation: <strong>{recommendation}</strong>
            </div>
          )}
          {loading && <div className="loading-spinner">Loading...</div>}
        </div>
      </div>

      {/* Card Grid */}
      <div className="card-grid-mobile">
        {cards.map(card => {
          // For Flip7: disable duplicate number cards
          const specialCards = ['f3', '2c', '+x', 'x2', 'fr'];
          const isDuplicate = gameType === 'flip7' && hand.includes(card) && !specialCards.includes(card);
          
          return (
            <button
              key={card}
              onClick={() => {
                if (gameType === 'blackjack') {
                  if (activeHand === 'player') {
                    onDrawCard(card);
                  } else {
                    onSetDealerCard(card);
                  }
                } else {
                  onDrawCard(card);
                }
              }}
              disabled={loading || isDuplicate}
              className="mobile-card-btn"
              style={{
                backgroundColor: isDuplicate ? '#dc3545' : '#ffd700',
                color: isDuplicate ? 'white' : '#1a472a'
              }}
            >
              {card}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MobileLayout;