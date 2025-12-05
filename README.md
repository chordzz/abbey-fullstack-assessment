# Abbey Fullstack Assessment

A full-stack social networking application built with Next.js, Node.js, Express, and PostgreSQL. This application allows users to connect with friends, follow other users, and manage their social network.

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Profile Management**: Update personal information, bio, and address
- **Friends System**: Send, accept, reject, and cancel friend requests
- **Followers System**: Follow/unfollow users, view followers and following lists
- **User Discovery**: Browse all users in the system with search functionality
- **Real-time Updates**: Dynamic UI updates reflecting friendship and follower status
- **Mobile Responsive**: Fully responsive design for all screen sizes

## Tech Stack

### Frontend
- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Axios** for API requests
- **Sonner** for toast notifications

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **UUID** for primary keys

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd abbey-fullstack-assessment
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb abbey_social_network

# Run database migrations (schema.sql should be in backend/src/db)
psql -d abbey_social_network -f backend/src/db/setup.sql
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration:
# PORT=5000
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=abbey_social_network
# DB_USER=your_db_user
# DB_PASSWORD=your_db_password
# JWT_SECRET=your_secret_key

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd abbey-frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Sample Login Details

Use any of these credentials to test the application:

| Email | Password | Name | Role |
|-------|----------|------|------|
| james@example.com | password123 | James Doe | Jazz Player \| Investor |
| sarah.wilson@example.com | password123 | Sarah Wilson | Software Engineer \| Tech Enthusiast |
| michael.chen@example.com | password123 | Michael Chen | Product Manager \| Startup Founder |
| emily.rodriguez@example.com | password123 | Emily Rodriguez | UX Designer \| Creative Director |
| david.okonkwo@example.com | password123 | David Okonkwo | Data Scientist \| AI Researcher |
| aisha.mohammed@example.com | password123 | Aisha Mohammed | Marketing Strategist \| Content Creator |
| lucas.silva@example.com | password123 | Lucas Silva | Full Stack Developer \| Open Source Contributor |
| olivia.brown@example.com | password123 | Olivia Brown | Financial Analyst \| Investment Advisor |
| daniel.kim@example.com | password123 | Daniel Kim | Cybersecurity Expert \| Ethical Hacker |
| sophia.martinez@example.com | password123 | Sophia Martinez | Architect \| Urban Planner |

> **Note**: All sample accounts use the password `password123`. These accounts should be created during the initial database setup or via the signup flow.

## Project Structure

```
abbey-fullstack-assessment/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Authentication middleware
│   │   ├── routes/          # API routes
│   │   ├── db/              # Database configuration
│   │   └── index.js         # Entry point
│   ├── .env.example
│   └── package.json
│
├── abbey-frontend/
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   └── lib/             # Utilities and configurations
│   ├── .env.local
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user

### Users
- `GET /api/users/profile` - Get current user profile
- `PATCH /api/users/profile` - Update user profile
- `GET /api/users/all` - Get all users (with optional search)
- `GET /api/users/:id` - Get user by ID

### Friends
- `GET /api/friends` - Get user's friends
- `GET /api/friends/requests` - Get received friend requests
- `GET /api/friends/requests/sent` - Get sent friend requests
- `POST /api/friends/request` - Send friend request
- `PATCH /api/friends/accept/:friendshipId` - Accept friend request
- `PATCH /api/friends/reject/:friendshipId` - Reject friend request
- `DELETE /api/friends/cancel/:friendshipId` - Cancel sent request
- `DELETE /api/friends/:friendId` - Remove friend

### Followers
- `GET /api/followers` - Get user's followers
- `GET /api/followers/following` - Get users you're following
- `GET /api/followers/stats` - Get follower statistics
- `POST /api/followers/follow` - Follow a user
- `DELETE /api/followers/unfollow/:userId` - Unfollow a user
- `DELETE /api/followers/remove/:userId` - Remove a follower

## Features Overview

### Authentication Flow
1. Users can sign up with email, password, name, bio, and address
2. Users can sign in with email and password
3. JWT tokens are stored in localStorage for authenticated requests

### Social Features
1. **Friends**: Send and manage friend requests, view friends list
2. **Followers**: Follow users, view followers and following lists
3. **Requests**: View pending sent and received friend requests
4. **Discovery**: Browse all users and send connection requests

### Mobile Experience
- Hamburger menu for mobile navigation
- Responsive card layouts
- Touch-friendly buttons and interactions
- Optimized for mobile, tablet, and desktop screens

### Building for Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd abbey-frontend
npm run build
```

## Support

For issues and questions, please open an issue on the GitHub repository.