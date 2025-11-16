# Library Management System - Implementation Summary

**Project:** Library Management System  
**Implementation Date:** November 2025  
**Author:** Shreedhar Bhat

---

## Overview

This report documents the complete implementation of a **Role-Based Access Control (RBAC)** system for the Library Management System. The system successfully implements user roles ("admin" and "regular user") with appropriate permissions, ensuring that only authorized users can perform CRUD operations on books while maintaining read access for all authenticated users.

---

## 1. Key Achievements

1. **User and Book model establishment** and database connection.
2. **Creation of Admin and Regular user roles** with proper permissions.
3. **JWT-based authentication** with role-based authorization.
4. **User management interface** for role assignment and access controls.
5. **Tested for all required functionality** as per assignment.

---

## 2. Technologies Used

### Backend Technologies
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Data storage
- **Mongoose** - Database queries
- **JWT (jsonwebtoken)** - Authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment variables
- **nodemon** - Development server with auto reload
- **CORS** - Cross-origin resource sharing

### Frontend Technologies
- **React** - UI framework
- **React Scripts** - Build tooling
- **React Router DOM** - Client-side routing

### Deployment
- **Backend:** Deployed on **Render.com**
- **Frontend:** Deployed on **Vercel.com**

---

## 3. System Architecture

### 3.1 Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │         │    Database     │
│   (React)       │◄───────►│   (Express)     │◄───────►│   (MongoDB)     │
│                 │  HTTP   │                 │  Mongoose│                 │
│  - BookReader   │         │  - Routes       │         │  - Users        │
│  - BookMgmt     │         │  - Controllers  │         │  - Books        │
│  - Auth Utils   │         │  - Middleware   │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### 3.2 Authentication Flow

```
User Registration/Login
    ↓
JWT Token Generation (includes role)
    ↓
Token Stored in localStorage
    ↓
API Request with Token
    ↓
verifyAccessToken Middleware (validates token)
    ↓
verifyRole Middleware (checks role for protected routes)
    ↓
Controller Execution
```

### 3.3 Authorization Flow

```
API Request
    ↓
Is route protected? → No → Execute
    ↓ Yes
verifyAccessToken → Invalid → 401 Unauthorized
    ↓ Valid
Is admin route? → No → Execute
    ↓ Yes
verifyRole → Regular User → 403 Forbidden
    ↓ Admin
Execute Controller
```

---

## 4. Implementation Details

1. Implemented **two user roles** — admin and regular — with clearly defined permissions.
2. **Registration always assigns regular role**; only admins can promote users.
3. **All admin operations** (add, update, delete books, manage users) are securely protected.
4. **Middleware validates tokens** and verifies user roles before accessing routes.
5. **Unauthorized access returns proper 401/403 responses** with clean error handling.
6. **Frontend dynamically shows features** based on role, with separate admin and user views.
7. **Admin panel supports** viewing users, promoting roles, and managing books.
8. **Manual testing completed** for login, role assignment, CRUD access, and UI restrictions.
9. **Automated tests** (unit, integration, E2E) are pending and planned for future improvement.
10. **Backend deployed successfully**; environment variables, CORS, & API connectivity verified.

---

## 5. API Documentation

### 1. Register User
- **Endpoint:** `POST /api/v1/user/register-user`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "username": "string",
    "fullname": "string",
    "email": "string",
    "address": "string",
    "phoneNumber": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User Registration Successful"
  }
  ```

### 2. Login User
- **Endpoint:** `POST /api/v1/user/login-user`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "string",
    "refreshToken": "string",
    "user": { ... }
  }
  ```

### 3. Read Book (Authenticated)
- **Endpoint:** `GET /api/v1/user/library-main/read-book?bookId=<bookId>`
- **Access:** All Authenticated Users
- **Headers:** `{ "Authorization": "<token>" }`
- **Response:**
  ```json
  {
    "isBook": { ... }
  }
  ```

### 4. Get All Books (Authenticated)
- **Endpoint:** `GET /api/v1/user/library-main/get-all-books`
- **Access:** All Authenticated Users
- **Headers:** `{ "Authorization": "<token>" }`
- **Response:**
  ```json
  {
    "books": [...]
  }
  ```

### 5. Add Book (Admin Only)
- **Endpoint:** `POST /api/v1/user/library-main/add-book`
- **Access:** Admin Only
- **Headers:** `{ "Authorization": "<token>" }`
- **Request Body:**
  ```json
  {
    "title": "string",
    "bookId": "string",
    "section": "string",
    "author": "string",
    "content": "string",
    "edition": "number"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Book created successfully!"
  }
  ```

### 6. Update Book (Admin Only)
- **Endpoint:** `PUT /api/v1/user/library-main/update-book`
- **Access:** Admin Only
- **Headers:** `{ "Authorization": "<token>" }`
- **Request Body:**
  ```json
  {
    "bookId": "string",
    "updation": "string"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Book Updated Successfully!"
  }
  ```

### 7. Delete Book (Admin Only)
- **Endpoint:** `DELETE /api/v1/user/library-main/delete-book`
- **Access:** Admin Only
- **Headers:** `{ "Authorization": "<token>" }`
- **Request Body:**
  ```json
  {
    "title": "string",
    "bookId": "string"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Book deleted Successfully!"
  }
  ```

### 8. Get All Users (Admin Only)
- **Endpoint:** `GET /api/v1/user/users/get-all-users`
- **Access:** Admin Only
- **Headers:** `{ "Authorization": "<token>" }`
- **Response:**
  ```json
  {
    "users": [...]
  }
  ```

### 9. Update User Role (Admin Only)
- **Endpoint:** `PUT /api/v1/user/users/update-role`
- **Access:** Admin Only
- **Headers:** `{ "Authorization": "<token>" }`
- **Request Body:**
  ```json
  {
    "userId": "string",
    "role": "admin" | "regular"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User role updated successfully",
    "user": { ... }
  }
  ```

---

## 6. Testing & Verification

### 6.1 Authentication Tests
- ✅ User registration creates account with **"regular"** role
- ✅ Login returns **JWT token** with role information
- ✅ Invalid credentials rejected

### 6.2 Authorization Tests
- ✅ Regular users can **read books**
- ✅ Regular users **cannot** add/update/delete books
- ✅ Admin users can perform **all CRUD operations**
- ✅ Unauthorized access returns **403 error**

### 6.3 Frontend Tests
- ✅ Regular users see **BookReader** component
- ✅ Admin users see **BookManagement** component
- ✅ Role displayed in navbar
- ✅ Admin panel accessible only to admins
- ✅ Role assignment works correctly

### 6.4 Integration Tests
- ✅ API endpoints respond correctly
- ✅ Middleware chain works properly
- ✅ Error handling works as expected
- ✅ CORS allows frontend requests

---

## 7. Conclusion

1. The **User Roles and Permissions system** has been fully implemented with a strong RBAC setup, supporting both admin and regular user roles with secure permissions.

2. **Authentication is handled using JWT**, and all admin-level operations are protected through server-side authorization.

3. The **frontend smoothly adapts** based on the user's role, offering an intuitive and clear role-based interface.

4. The entire system has been **successfully deployed**, with the backend running on **Render** and the frontend deployed on **Vercel**, ensuring reliable production-level performance.

5. Overall, the implementation **meets all required functionalities** and provides a secure, scalable, and user-friendly authentication and authorization flow.

---

**Status:** ✅ Production Ready  
**Last Updated:** November 2025
