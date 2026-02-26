# Auth Service

This is the authentication microservice for the EngSoc User Center application.

## Setup

1. **Install Dependencies:**
   ```bash
   cd backend/auth-service
   npm install
   ```

2. **Environment Variables:**
   Copy `env.example` to `.env` and fill in your values:
   ```bash
   cp env.example .env
   ```
   
   Then edit `.env` with your actual values:
   - `MONGO_URI`: Your MongoDB connection string (required)
     - Local: `mongodb://localhost:27017/engsoc_user_center`
     - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database_name`
   - `SESSION_SECRET`: A random secret key for sessions (required)
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Only needed if using Google OAuth (optional)

## Running

### Development Mode:
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The service will run on port 4001.

## API Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/check` - Check if user is authenticated
- `POST /auth/logout` - Logout user
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /ping` - Health check

## Docker

To run with Docker:
```bash
docker-compose up auth-service
```

Or run all services:
```bash
docker-compose up
```

