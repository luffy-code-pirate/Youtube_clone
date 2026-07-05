# YouTube Clone — MERN Stack

A full-stack YouTube clone built with MongoDB, Express, React, and Node.js.

---

## Features

- **Home Page** — Video grid with category filter buttons and search bar
- **User Authentication** — Register and login with JWT-based auth
- **Video Player** — Watch videos with like/dislike and full comment CRUD
- **Channel Page** — Create, view, edit and delete your videos
- **Search** — Search videos by title from the header
- **Filter** — Filter videos by category (Web Development, Music, Gaming etc.)
- **Responsive** — Works on mobile, tablet and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Version Control | Git + GitHub |

---

## Project Structure

```
youtube_clone/
├── backend/
│   ├── controllers/        # Route logic
│   ├── middleware/         # JWT auth middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── seed.js             # Database seeder
│   └── server.js           # Entry point
└── frontend/
    └── src/
        ├── api/            # Axios instance with JWT interceptor
        ├── components/     # Header, Sidebar, VideoCard
        ├── context/        # AuthContext (global login state)
        └── pages/          # Home, Login, Register, VideoPlayer, Channel etc.
```

---

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### 1. Clone the repository
```bash
git clone https://github.com/YourUsername/Youtube_Clone.git
cd Youtube_Clone
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/youtube-clone

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app
Go to **http://localhost:5173** in your browser.

---

## API Endpoints

### User Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/users/register | Public |
| POST | /api/users/login | Public |
| GET | /api/users/profile | Private |

### Videos
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/videos | Public |
| GET | /api/videos/:id | Public |
| POST | /api/videos | Private |
| PUT | /api/videos/:id | Private |
| DELETE | /api/videos/:id | Private |
| PUT | /api/videos/:id/like | Private |
| PUT | /api/videos/:id/dislike | Private |

### Channels
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/channels | Private |
| GET | /api/channels/mine | Private |
| GET | /api/channels/:id | Public |

### Comments
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/comments/:videoId | Public |
| POST | /api/comments | Private |
| PUT | /api/comments/:id | Private |
| DELETE | /api/comments/:id | Private |

---

## Sample Test Data

### Register a user
```json
POST /api/users/register
{
  "username": "JohnDoe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Upload a video (after login and creating a channel)
```json
POST /api/videos
{
  "title": "Learn React in 30 Minutes",
  "thumbnailUrl": "https://picsum.photos/seed/react/320/180",
  "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
  "description": "A quick tutorial to get started with React.",
  "category": "Web Development",
  "channelId": "your_channel_id_here"
}
```

---

## Seed Database

To help evaluators test the app, run the seed script:

```bash
cd backend
node seed.js
```

This creates sample users, channels, videos and comments automatically.

### Test Login Credentials
| Email | Password |
|---|---|
| john@example.com | 123456 |
| jane@example.com | 123456 |

---

## Git Commit History

This project follows individual commits for each feature:
- `feat(backend)` — backend features
- `feat(frontend)` — frontend features
- `fix` — bug fixes

---

## Author

**Prahlad Jha**
Full Stack Developer — MERN Stack Capstone Project