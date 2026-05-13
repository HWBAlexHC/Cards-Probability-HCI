import axios from 'axios';

const API_BASE_URL = 'https://cards-probability-api.onrender.com/api';
const SESSION_ID = 'my-game-session-' + Date.now();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const startNewGame = async (gameType) => {
  const response = await api.post('/new_game', {
    game_type: gameType,
    session_id: SESSION_ID
  });
  return response.data;
};

export const drawCard = async (card) => {
  const response = await api.post('/draw_card', {
    session_id: SESSION_ID,
    card: card
  });
  return response.data;
};

export const resetGame = async () => {
  const response = await api.post('/reset', {
    session_id: SESSION_ID
  });
  return response.data;
};

export const getGameState = async () => {
  const response = await api.get('/game_state', {
    params: { session_id: SESSION_ID }
  });
  return response.data;
};

export const setDealerCard = async (card) => {
  const response = await api.post('/set_dealer_card', {
    session_id: SESSION_ID,
    card: card
  });
  return response.data;
};