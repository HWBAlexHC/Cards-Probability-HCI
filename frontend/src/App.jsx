import { useState, useEffect } from 'react';
import { startNewGame, drawCard, resetGame, setDealerCard, getGameState } from './services/api';
import MobileLayout from './components/MobileLayout';
import VisualInterface from './components/VisualInterface';
import BlackjackInterface from './components/BlackjackInterface';
import './App.css';

function App() {
  const [interfaceType, setInterfaceType] = useState('desktop');
  const [gameType, setGameType] = useState(null);
  const [hand, setHand] = useState([]);
  const [dealerCard, setDealerCardState] = useState(null);
  const [bustProb, setBustProb] = useState(0);
  const [recommendation, setRecommendation] = useState('');
  const [playerValue, setPlayerValue] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch full game state (for dealer card)
  const fetchGameState = async () => {
    try {
      const state = await getGameState();
      if (state.dealer_card) setDealerCardState(state.dealer_card);
      if (state.recommendation) setRecommendation(state.recommendation);
      if (state.player_value) setPlayerValue(state.player_value);
      if (state.bust_probability !== undefined) setBustProb(state.bust_probability);
    } catch (error) {
      console.error('Error fetching game state:', error);
    }
  };

  const startGame = async (type) => {
    setLoading(true);
    await startNewGame(type);
    setGameType(type);
    setHand([]);
    setDealerCardState(null);
    setBustProb(0);
    setRecommendation('');
    setPlayerValue(0);
    setLoading(false);
  };

  const handleDrawCard = async (card) => {
    // Flip7 duplicate check
    if (gameType === 'flip7') {
      const specialCards = ['f3', '2c', '+x', 'x2', 'fr'];
      if (!specialCards.includes(card) && hand.includes(card)) {
        alert(`⚠️ Card "${card}" is already in your hand! You busted!`);
        return;
      }
    }
    
    setLoading(true);
    try {
      const result = await drawCard(card);
      setHand(result.hand || []);
      setBustProb(result.bust_probability || 0);
      await fetchGameState();
    } catch (error) {
      console.error('Error drawing card:', error);
      alert('Failed to draw card. Make sure Flask backend is running on port 5000');
    }
    setLoading(false);
  };

  const handleSetDealerCard = async (card) => {
    setLoading(true);
    try {
      await setDealerCard(card);
      setDealerCardState(card);
      await fetchGameState();
      alert(`Dealer's up card set to: ${card}`);
    } catch (error) {
      console.error('Error setting dealer card:', error);
      alert('Failed to set dealer card');
    }
    setLoading(false);
  };

  const handleReset = async () => {
    setLoading(true);
    await resetGame();
    setHand([]);
    setDealerCardState(null);
    setBustProb(0);
    setRecommendation('');
    setPlayerValue(0);
    setLoading(false);
  };

  const handleChangeGame = () => {
    setGameType(null);
    setHand([]);
    setDealerCardState(null);
    setBustProb(0);
    setRecommendation('');
    setPlayerValue(0);
  };

  const flip7Cards = ['0','1','2','3','4','5','6','7','8','9','10','11','12','f3','2c','+x','x2','fr'];

  // Game Selector
  if (!gameType) {
    return (
      <div className="game-selector">
        <h1>🎴 Card Game Probability Calculator</h1>
        <div className="interface-switcher">
          <button className={interfaceType === 'desktop' ? 'active' : ''} onClick={() => setInterfaceType('desktop')}>🖥️ Desktop View</button>
          <button className={interfaceType === 'mobile' ? 'active' : ''} onClick={() => setInterfaceType('mobile')}>📱 Mobile View</button>
          <button className={interfaceType === 'visual' ? 'active' : ''} onClick={() => setInterfaceType('visual')}>🃏 Visual Cards View</button>
        </div>
        <div className="game-buttons">
          <button onClick={() => startGame('flip7')}>🃟 Play Flip7</button>
          <button onClick={() => startGame('blackjack')}>♠️ Play Blackjack</button>
        </div>
      </div>
    );
  }

  // Blackjack uses special interface
  if (gameType === 'blackjack' && interfaceType === 'desktop') {
    return (
      <BlackjackInterface
        playerHand={hand}
        dealerCard={dealerCard}
        bustProb={bustProb}
        recommendation={recommendation}
        playerValue={playerValue}
        loading={loading}
        onDrawCard={handleDrawCard}
        onSetDealerCard={handleSetDealerCard}
        onReset={handleReset}
        onChangeGame={handleChangeGame}
      />
    );
  }

  // Flip7 Desktop Interface
  if (interfaceType === 'desktop' && gameType === 'flip7') {
    const specialCards = ['f3', '2c', '+x', 'x2', 'fr'];
    return (
      <div className="game-container">
        <div className="interface-indicator">
          <span>🖥️ Desktop Interface - Flip7</span>
          <button onClick={() => setInterfaceType('mobile')}>Switch to Mobile</button>
          <button onClick={() => setInterfaceType('visual')}>Switch to Visual Cards</button>
        </div>
        
        <h1>Flip7</h1>
        
        <div className="hand-display">
          <h2>Your Hand:</h2>
          <div className="cards">
            {hand.length === 0 ? (
              <p>No cards yet. Draw your first card!</p>
            ) : (
              hand.map((card, i) => (
                <span key={i} className="card">{card}</span>
              ))
            )}
          </div>
        </div>

        <div className="probability">
          <h3>Bust Probability on Next Draw:</h3>
          <div className="prob-value">{(bustProb * 100).toFixed(1)}%</div>
        </div>

        <div className="card-buttons">
          {flip7Cards.map(card => {
            const isDuplicate = hand.includes(card) && !specialCards.includes(card);
            return (
              <button 
                key={card} 
                onClick={() => handleDrawCard(card)}
                disabled={loading || isDuplicate}
                className="card-btn"
                style={{
                  backgroundColor: isDuplicate ? '#dc3545' : '#ffd700',
                  color: isDuplicate ? 'white' : '#1a472a'
                }}
                title={isDuplicate ? "Already in hand - drawing this will bust!" : "Draw this card"}
              >
                {card}
              </button>
            );
          })}
        </div>

        <div className="controls">
          <button onClick={handleReset} disabled={loading}>Reset Game</button>
          <button onClick={handleChangeGame}>Change Game</button>
        </div>

        <div className="keyboard-hint">
          💡 Keyboard shortcuts: Number keys (0-9), F=f3, C=2c, X=+x, M=x2, V=fr | Ctrl+R=Reset, ESC=Exit
        </div>

        {loading && <p>Loading...</p>}
      </div>
    );
  }

  if (interfaceType === 'mobile') {
    return (
      <MobileLayout
        gameType={gameType}
        hand={hand}
        bustProb={bustProb}
        loading={loading}
        onDrawCard={handleDrawCard}
        onReset={handleReset}
        onChangeGame={handleChangeGame}
        onSetDealerCard={handleSetDealerCard}  
        dealerCard={dealerCard}                
        recommendation={recommendation}        
      />
    );
  }

  // Visual Interface
  return (
  <VisualInterface
    gameType={gameType}
    hand={hand}
    bustProb={bustProb}
    loading={loading}
    onDrawCard={handleDrawCard}
    onReset={handleReset}
    onChangeGame={handleChangeGame}
    onSetDealerCard={handleSetDealerCard}  
    dealerCard={dealerCard}                
    recommendation={recommendation}        
  />
  );
}

export default App;