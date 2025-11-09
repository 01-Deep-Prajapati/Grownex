# Grownex - Professional Social Network

A professional social networking platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

- 👤 User authentication (JWT)
- 👔 Professional profile management
- 📝 Post creation and interaction
- 🖼️ Image and media upload
- 👍 Post likes and engagement
- 🎨 Modern, responsive UI with Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- React.js
- TailwindCSS
- Vite
- Axios
- React Router
- Context API

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Cloudinary (Media storage)
- Bcrypt (Password hashing)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/01-Deep-Prajapati/Grownex.git
cd grownex
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Set up backend environment variables (.env)

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
```

4. Install frontend dependencies

```bash
cd ../frontend
npm install
```

5. Set up frontend environment variables (.env)

```env
VITE_API_URL=http://localhost:5000
```

### Running the Application

1. Start the backend server

```bash
cd backend
npm run dev
```

2. Start the frontend development server

```bash
cd frontend
npm run dev
```

## 🌐 Deployment

### Backend (Render)

1. Create a new Web Service
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

### Frontend (Vercel)

1. Connect your GitHub repository
2. Configure build settings
3. Add environment variables
4. Deploy

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- TailwindCSS for the amazing utility-first CSS framework
- Cloudinary for media storage solutions
- MongoDB Atlas for database hosting
- Render and Vercel for hosting services
