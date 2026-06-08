# SBVM Authentication API Documentation (v1)

This document details the REST API specifications, payload models, and response structures for the **Saraswati Bal Vidya Mandir (SBVM)** authentication and RBAC systems.

## 🌐 Base Configuration
* **Base URL:** `http://localhost:5000` (Local) / Production Web URL
* **API Prefix:** `/api/v1/auth`
* **Default Format:** JSON (`Content-Type: application/json`)

---

## 🔒 Error Codes & Responses
All endpoints conform to clean JSON error structures formatted by `errorMiddleware`:

| HTTP Status | Reason | Payload Format |
|---|---|---|
| **`400 Bad Request`** | Input validation fails (via Zod). | `{ "status": "fail", "message": "Validation failed", "errors": [{ "field": "email", "message": "..." }] }` |
| **`401 Unauthorized`** | JWT token expired, signatures invalid, or wrong login credentials. | `{ "status": "fail", "message": "Invalid email or password" }` |
| **`403 Forbidden`** | User role is deactivated or lacks permissions (RBAC reject). | `{ "status": "fail", "message": "Role is not authorized to access this resource" }` |
| **`404 Not Found`** | Profile database record not found. | `{ "status": "fail", "message": "User session expired or not found" }` |
| **`500 Server Error`** | Unhandled internal exception or DB disconnect. | `{ "status": "error", "message": "Something went wrong on our end." }` |

---

## 📌 Endpoint Registry

### 1. Register Guest Applicant
Creates a candidate applicant profile and corresponding user credentials.
* **Route:** `POST /register-applicant`
* **Access:** Public

#### Request Body Schema (Zod Validated):
```json
{
  "email": "candidate@email.com",
  "phone": "9988776655",
  "password": "strongPassword123",
  "firstName": "Rahul",
  "lastName": "Sharma",
  "dob": "2010-08-15",
  "gender": "Male",
  "parentName": "Suresh Kumar Sharma",
  "appliedClass": "Class 11 Science"
}
```

#### Success Response (`201 Created`):
```json
{
  "status": "success",
  "_id": "60d0fe4f5311236168a109a2",
  "email": "candidate@email.com",
  "role": "Guest",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "profile": {
    "_id": "60d0fe4f5311236168a109a1",
    "firstName": "Rahul",
    "lastName": "Sharma",
    "dob": "2010-08-15T00:00:00.000Z",
    "gender": "Male",
    "parentName": "Suresh Kumar Sharma",
    "parentEmail": "candidate@email.com",
    "parentPhone": "9988776655",
    "appliedClass": "Class 11 Science",
    "status": "Draft",
    "feeConcessionPercentage": 0,
    "createdAt": "2026-06-05T14:50:34.000Z",
    "updatedAt": "2026-06-05T14:50:34.000Z"
  }
}
```

---

### 2. User Login
Authenticates users of all roles (Admin, Teacher, Student, Parent, Guest).
* **Route:** `POST /login`
* **Access:** Public
* **Security:** Sets HTTP-only SameSite cookie `refreshToken` (expires in 7 days).

#### Request Body Schema (Zod Validated):
```json
{
  "email": "admin@sbvm.edu.in",
  "password": "adminPassword123"
}
```

#### Success Response (`200 OK`):
```json
{
  "status": "success",
  "_id": "60d0fe4f5311236168a109b5",
  "email": "admin@sbvm.edu.in",
  "role": "Admin",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "profile": {
    "_id": "60d0fe4f5311236168a109b4",
    "employeeId": "ADM001",
    "department": "Executive Office",
    "designation": "Director of Operations"
  }
}
```

---

### 3. Refresh Access Token
Issues a new short-lived access token using the HttpOnly refresh token cookie.
* **Route:** `POST /refresh-token`
* **Access:** Public (Requires valid `refreshToken` cookie)

#### Success Response (`200 OK`):
```json
{
  "status": "success",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d0fe4f5311236168a109b5",
    "email": "admin@sbvm.edu.in",
    "role": "Admin",
    "profile": {
      "_id": "60d0fe4f5311236168a109b4",
      "employeeId": "ADM001",
      "department": "Executive Office",
      "designation": "Director of Operations"
    }
  }
}
```

---

### 4. User Logout
Clears the `refreshToken` HttpOnly cookie, terminating the session.
* **Route:** `POST /logout`
* **Access:** Public

#### Success Response (`200 OK`):
```json
{
  "status": "success",
  "message": "Successfully logged out"
}
```

---

### 5. Get Session Profile
Retrieves detailed profile metadata for the active logged-in session.
* **Route:** `GET /me`
* **Access:** Private (Requires `Authorization: Bearer <accessToken>` header)

#### Success Response (`200 OK`):
```json
{
  "status": "success",
  "user": {
    "_id": "60d0fe4f5311236168a109b5",
    "email": "admin@sbvm.edu.in",
    "phone": "9876543210",
    "role": "Admin",
    "isActive": true,
    "roleRefModel": "AdminProfile",
    "profileRef": {
      "_id": "60d0fe4f5311236168a109b4",
      "employeeId": "ADM001",
      "department": "Executive Office",
      "designation": "Director of Operations"
    }
  }
}
```
