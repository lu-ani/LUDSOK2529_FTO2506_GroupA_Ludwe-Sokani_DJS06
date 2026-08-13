# 🎙️ Full-Stack Podcast App

> A podcast application evolving from a React frontend into a full-stack application with authentication, persistent user data, and a PostgreSQL backend.

**🚧 Currently in development**

---

## ✨ About

This project started as a **React podcast application** consuming an external podcast API.

The goal is to turn it into a complete full-stack application while learning how the different layers of a modern web application work together:

```text
React
  ↓
FastAPI REST API
  ↓
SQLAlchemy
  ↓
PostgreSQL
```

The project is also an opportunity to explore authentication, API design, database relationships, security, testing, and eventually Docker and deployment.

---

## 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Backend

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)

### Database & Authentication

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## 🚀 Current Features

### 🎧 Podcast Application

- Browse podcasts using an external podcast API
- React-based user interface
- Responsive design
- Podcast favourites UI

### 🔐 Authentication

- User registration
- Password hashing
- Password verification
- User login
- JWT access tokens
- OAuth2 bearer authentication
- Protected API routes
- `/auth/me` endpoint

### 🗄️ Database

PostgreSQL currently stores:

**Users**

```text
users
├── id
├── email
└── password_hash
```

**Favourites**

```text
favourites
├── id
├── user_id
└── podcast_id
```

The favourites table represents the relationship between a user and a podcast.

A user can favourite many podcasts, and a podcast can be favourited by many users.

---

## 🧠 Security

Authentication is handled by the backend rather than trusting the frontend to identify the user.

Protected requests use a JWT bearer token:

```text
User
 ↓
Login
 ↓
JWT issued
 ↓
Protected request
 ↓
JWT verified
 ↓
Current user identified
 ↓
Route continues
```

The API therefore does not rely on the frontend sending a `user_id` when performing authenticated actions.

---

## ❤️ Currently Working On

The current development focus is the **Favourites API**.

### `POST /favourites`

The endpoint will:

1. Authenticate the user.
2. Receive the podcast ID.
3. Check whether the podcast is already favourited by that user.
4. Prevent duplicate favourites.
5. Create the relationship in PostgreSQL.
6. Return a response to the React application.

The frontend will then use the backend's state to control the favourite heart:

```text
🤍 Not favourited

❤️ Favourited
```

---

## 🗺️ Roadmap

### Backend

- [x] FastAPI project setup
- [x] PostgreSQL setup
- [x] SQLAlchemy models
- [x] User registration
- [x] Password hashing
- [x] Login
- [x] JWT authentication
- [x] Protected routes
- [x] `/auth/me`
- [ ] `POST /favourites`
- [ ] `GET /favourites`
- [ ] `DELETE /favourites/{podcast_id}`
- [ ] Duplicate favourite protection
- [ ] Automated backend tests

### Frontend Integration

- [ ] Connect authentication to the backend
- [ ] Send JWTs with protected requests
- [ ] Connect favourite buttons to the API
- [ ] Load existing favourites
- [ ] Add/remove favourites
- [ ] Improve API error handling

### Infrastructure

- [ ] Dockerize backend
- [ ] Dockerize frontend
- [ ] Docker Compose
- [ ] Containerized PostgreSQL
- [ ] Production environment configuration
- [ ] Deployment

---

## 📁 Project Structure

```text
Podcast-App/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── security/
│   │   ├── utils/
│   │   ├── dependencies.py
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── create_tables.py
│   ├── requirements.txt
│   └── ...
│
└── README.md
```

---

## 🔧 Running Locally

### Backend

Clone the repository and enter the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file containing the required environment variables.

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📚 What I'm Learning

This project is part of my transition from **frontend development into full-stack development**.

Through the project I'm gaining practical experience with:

- REST API design
- FastAPI
- PostgreSQL
- SQLAlchemy
- Database relationships
- Authentication & authorization
- JWTs
- OAuth2
- API security
- Request validation
- Frontend/backend communication
- Environment variables
- API testing
- Docker
- Deployment

The emphasis is on understanding the reasoning behind the architecture rather than simply getting the code to work.

---

## 🔮 Future Plans

Once the core application is complete, I'd like to explore:

- Refresh tokens
- Better API error handling
- **Automated** testing
- Database migrations
- Pagination
- Caching
- CI/CD
- Docker deployment
- Production hosting

---

## 👨‍💻 About This Project

This project represents my progression from building frontend applications that consume APIs to building an application that provides and consumes its own API.

The original React application is becoming the frontend of a larger system with its own:

**Authentication → API → Business Logic → Database**
