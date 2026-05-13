# 🃏 Cards Probability HCI Project

**Live Demo:** https://cards-probability-hci.vercel.app  

---

## 📖 Overview

Interactive web app that calculates bust probabilities for Flip7 and Blackjack. Built for HCI course demonstrating three interface designs, user testing, and iterative improvement.

---

## ✨ Features

### Three Interfaces

| Interface | Description | Best For |
|-----------|-------------|----------|
| Desktop | Grid layout with hover effects | Computer users |
| Mobile | Bottom sheet, touch-optimized | Phone users |
| Visual Cards | Card visuals with grid hand | Visual learners |

### Games

- **Flip7** - Bust on duplicate number cards, special cards never bust
- **Blackjack** - Player hand + dealer up card, HIT/STAND recommendations

### Interactive Features

- Keyboard shortcuts (number keys, Ctrl+R, ESC)
- Duplicate card prevention (red buttons)
- Color-coded probability meter
- Card pop animations
- Game instructions modal

---

## 🚀 Running Locally

### Prerequisites

- Node.js 18+ (https://nodejs.org)
- Python 3.8+ (https://python.org)

### Steps

```bash
# Clone the repo
git clone https://github.com/hwbalex/cards-probability-hci.git
cd cards-probability-hci

# Backend (Terminal 1)
cd backend
pip install -r requirements.txt
python api.py

# Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

## 🎮 How to Use
1. Choose Flip7 or Blackjack
2. Select interface: Desktop, Mobile, or Visual Cards
3. Draw cards by clicking buttons
4. Watch the bust probability update
5. Reset or change the game anytime

Blackjack Mode
Toggle between:
- My Hand - Adds cards to your hand
- Dealer Card - Sets up the dealer's card

## ⌨️ Keyboard Shortcuts
0-9	Draw a number card

F	Draw f3 (Flip7)

C	Draw 2c (Flip7)

X	Draw +x (Flip7)

M	Draw x2 (Flip7)

V	Draw fr (Flip7)

J, Q, K, A	Draw face cards (Blackjack)

Ctrl+R	Reset game

Ctrl+G	Change game

ESC	Exit to game selector



## 🌐 Deployment
### Live URLs
Frontend: https://cards-probability-hci.vercel.app

### Deploy Your Own
Frontend (Vercel)

```bash
cd frontend
npm install -g vercel
vercel --prod
```

### Backend (Render)
1. Push to GitHub
2. Create Web Service on Render
3. Root directory: backend
4. Build: pip install -r requirements.txt
5. Start: gunicorn api:app

## 🤝 Team
Frontend: Alex Delgado
Backend: Charlie Cross

## ⚠️ Note
Backend runs on Render free tier. First visit after inactivity takes 15-30 seconds to wake up.
