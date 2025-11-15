# Library Management System - Frontend

React-based frontend for the Library Management System.

## Features

- User Authentication (Login/Register)
- Role-based access control (Admin/Regular User)
- Book Reading (Regular Users)
- Book CRUD Operations (Admin Users)
  - Read Books
  - Add Books
  - Update Books
  - Delete Books

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure the backend server is running on `http://localhost:5000`

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Usage

1. Register a new user (default role: regular)
2. Login with your credentials
3. Based on your role:
   - **Regular User**: Can read books by searching with book ID
   - **Admin User**: Can perform all CRUD operations on books

## API Integration

The frontend integrates with the backend API at:
- Base URL: `http://localhost:5000/api/v1/user`

### Endpoints Used:
- POST `/register-user` - User registration
- POST `/login-user` - User authentication
- GET `/library-main/read-book` - Read book (requires auth)
- POST `/library-main/add-book` - Add book (admin only)
- PUT `/library-main/update-book` - Update book (admin only)
- DELETE `/library-main/delete-book` - Delete book (admin only)

## Notes

- The frontend expects JWT tokens in the Authorization header
- Token is stored in localStorage after successful login
- Role-based UI rendering based on user role from JWT token

