from flask import Flask, request, jsonify
from flask_cors import CORS
import sys

# Import the game classes
try:
    from blackjack import Blackjack
    from flip7 import Flip7
except ImportError as e:
    print(f"Error importing game files: {e}")
    print("Make sure blackjack.py and flip7.py are in the same folder")
    sys.exit(1)

app = Flask(__name__)
CORS(app)

# Store active games
games = {}

@app.route('/api/new_game', methods=['POST'])
def new_game():
    data = request.json
    game_type = data.get('game_type')
    session_id = data.get('session_id', 'default')
    
    if game_type == 'blackjack':
        games[session_id] = Blackjack()
    else:
        games[session_id] = Flip7()
    
    return jsonify({
        'status': 'ok',
        'session_id': session_id,
        'game_type': game_type
    })

@app.route('/api/draw_card', methods=['POST'])
def draw_card():
    data = request.json
    session_id = data.get('session_id', 'default')
    card = data.get('card')
    
    game = games.get(session_id)
    if not game:
        return jsonify({'error': 'Game not found'}), 404
    
    # Draw the card
    game.draw_card(card)
    
    # Prepare response
    response = {
        'hand': game.hand,
        'bust_probability': getattr(game, 'bust_prob', 0)
    }
    
    return jsonify(response)

@app.route('/api/reset', methods=['POST'])
def reset():
    data = request.json
    session_id = data.get('session_id', 'default')
    
    if session_id in games:
        games[session_id].reset()
        return jsonify({'status': 'ok'})
    
    return jsonify({'error': 'Game not found'}), 404

@app.route('/api/set_dealer_card', methods=['POST'])
def set_dealer_card():
    """Special endpoint for Blackjack dealer card"""
    data = request.json
    session_id = data.get('session_id', 'default')
    card = data.get('card')
    
    game = games.get(session_id)
    if not game:
        return jsonify({'error': 'Game not found'}), 404
    
    if not isinstance(game, Blackjack):
        return jsonify({'error': 'Only Blackjack has dealer cards'}), 400
    
    game.set_dealer_card(card)
    
    return jsonify({
        'dealer_card': game.dealer_card,
        'hand': game.hand,
        'bust_probability': game.bust_prob
    })

@app.route('/api/game_state', methods=['GET'])
def game_state():
    """Get current game state without making changes"""
    session_id = request.args.get('session_id', 'default')
    game = games.get(session_id)
    
    if not game:
        return jsonify({'error': 'Game not found'}), 404
    
    response = {
        'hand': game.hand,
        'bust_probability': getattr(game, 'bust_prob', 0)
    }
    
    # Add Blackjack-specific info if applicable
    if isinstance(game, Blackjack) and game.dealer_card:
        try:
            analysis = game.analyze()
            response['recommendation'] = analysis['recommend']
            response['player_value'] = analysis['player_value']
            response['dealer_card'] = game.dealer_card
        except:
            pass
    
    return jsonify(response)

if __name__ == '__main__':
    print("=" * 50)
    print("Starting Card Game API Server")
    print("=" * 50)
    print(f"Server running at: http://localhost:5000")
    print("=" * 50)
    print("\nPress CTRL+C to stop the server\n")
    
    app.run(debug=True, port=5000, host='127.0.0.1')