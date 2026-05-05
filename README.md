# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Setup Instructions

### Prerequisites

| Requirement | Download Link |
|-------------|---------------|
| Node.js (LTS) | https://nodejs.org |
| Python 3.8+ | https://python.org |
| Git | https://git-scm.com |

### Step 1: Clone the Repository

git clone https://github.com/YOUR_USERNAME/Cards-Probability-HCI.git
cd Cards-Probability-HCI

### Step 2: Set Up Backend (Flask)
cd backend
pip install -r requirements.txt
python api.py

Expected output:
Starting Card Game API Server
Server running at: http://localhost:5000
(Keep this terminal window open)

### Step 3: Set Up React
Open a new terminal window:


cd frontend
npm install
npm run dev

Expected output:
VITE ready
➜ Local: http://localhost:5173/
Step 4: Open the Application
Go to http://localhost:5173 in your browser.
