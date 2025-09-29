# Budgeting App

This is a budgeting app with a Python FastAPI backend and a React frontend.

## Backend Setup (FastAPI)

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the backend server:**
   ```bash
   uvicorn app.main:app --reload
   ```

    The backend will be available at http://127.0.0.1:8000

## Frontend Setup (React)

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   pip install -r requirements.txt
   ```

2. **Run the frontend app:**
   ```bash
   npm start
   ```

- The frontend will be available at http://localhost:3000

## Features so far
- User registration and login (with JWT)
- Upload Excel files with transactions
- Data is stored in a SQLite database

## Notes
- Make sure the backend is running before using the frontend.
- The frontend and backend must run on different ports (default: 3000 and 8000).
- All dependencies are listed in their respective `requirements.txt` files.
