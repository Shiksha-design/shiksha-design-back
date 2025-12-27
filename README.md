# Shiksha EduTech - Backend API

A robust backend API for the Shiksha EduTech platform, built with Node.js, Express, and MongoDB. This project serves as the backend service for managing educational content, companies, programs, and user authentication.

## 🚀 Features

- RESTful API architecture
- JWT-based authentication
- File upload handling
- CRUD operations for companies, programs, and categories
- MongoDB database integration
- Automated CRUD generation

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **File Uploads:** Multer

## 📁 Project Structure

```
shiksha-design-back/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── db/               # Database operations
├── models/           # Database models
├── routes/           # API routes
├── uploads/          # File uploads
├── utils/            # Utility functions
├── app.js            # Main application file
└── package.json      # Project dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or remote)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd shiksha-design-back
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

### Running the Server

- Development mode (with hot-reload):
  ```bash
  npm run dev
  ```

- Production mode:
  ```bash
  npm start
  ```

The server will start at `http://localhost:3000`

## 🔧 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create a new company
- `GET /api/programs` - Get all programs
- `GET /api/categories` - Get all categories
