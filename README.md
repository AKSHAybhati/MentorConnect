# MentorConnect

A LinkedIn-style MERN application that connects new generation professionals with retired professionals for mentorship opportunities.

## Features

### Core Functionality
- **User Authentication**: Secure registration and login system
- **User Profiles**: Comprehensive profiles with experience, education, skills
- **Dual User Types**: Mentors (experienced/retired professionals) and Mentees (new generation)
- **Social Feed**: LinkedIn-style posts with likes, comments, and different post types
- **Connection System**: Send and manage connection requests
- **Real-time Messaging**: Chat with connections using Socket.io
- **Mentor Discovery**: Find and filter mentors by skills, location, and availability

### Key Pages
- **Feed**: Social media-style feed with posts and interactions
- **Mentors**: Discover and connect with available mentors
- **Network**: Manage connections and connection requests
- **Messages**: Real-time messaging with connections
- **Profile**: View and edit user profiles

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Socket.io** for real-time messaging
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Cloudinary** for image uploads (configured)

### Frontend
- **React** with functional components and hooks
- **Material-UI (MUI)** for modern UI components
- **React Router** for navigation
- **Axios** for API calls
- **Socket.io-client** for real-time features

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/mentorconnect
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For local MongoDB
mongod
```

### 4. Run the Application

```bash
# Start both client and server concurrently
npm run dev

# Or start them separately:
# Terminal 1 - Start server
npm run server

# Terminal 2 - Start client
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

### Getting Started
1. **Register**: Create an account as either a Mentor or Mentee
2. **Complete Profile**: Add your experience, skills, and goals
3. **Explore**: Browse the feed, discover mentors, or find connections
4. **Connect**: Send connection requests to build your network
5. **Message**: Chat with your connections in real-time

### User Types

**Mentors (Experienced Professionals)**
- Share knowledge and experience
- Offer mentorship in specific areas
- Create posts offering guidance
- Set availability status

**Mentees (New Generation Professionals)**
- Seek guidance and mentorship
- Connect with experienced professionals
- Ask questions and request advice
- Set career goals

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get users with filters
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/mentors/available` - Get available mentors

### Posts
- `GET /api/posts` - Get all posts (feed)
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment

### Connections
- `POST /api/connections/request` - Send connection request
- `GET /api/connections/requests` - Get received requests
- `PUT /api/connections/:id/respond` - Accept/decline request
- `GET /api/connections/my-connections` - Get user's connections

### Messages
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:userId` - Get messages with user
- `POST /api/messages` - Send message

## Project Structure

```
mentorconnect/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth, Socket)
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main app component
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── index.js            # Server entry point
└── package.json            # Root package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- Video calling integration
- Advanced search and filtering
- Mentorship program management
- Event scheduling
- Mobile app development
- AI-powered mentor matching