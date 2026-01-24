# Authentication Flow Guide

## Overview
This document describes the complete authentication flow with console logging for debugging.

---

## 📱 SIGNUP FLOW (Frontend → Backend → OTP Screen)

### Frontend: Signup.jsx
```
User fills form → Click "Create Account"
    ↓
✅ Local validation (name, email, password, terms)
    ↓
🔐 [SIGNUP] Starting registration
    ↓
authService.register(name, email, password)
    ↓
📤 [AUTHSERVICE] Sending registration request
    ↓
📨 [AUTHSERVICE] Registration response received
    ↓
💾 [AUTHSERVICE] Stored email in localStorage
    ↓
✅ [SIGNUP] Registration response received
    ↓
🎯 [SIGNUP] Navigating to OTP verification
    ↓
📱 OTPVerification screen (ready for user to enter OTP)
```

### Backend: auth.controller.js - register()
```
📥 [REGISTER] Request body received
    ↓
✅ [REGISTER] Validation passed (Joi schema)
    ↓
👤 [REGISTER] User created in database
    ↓
🔑 [REGISTER] NOT returning tokens (user must verify OTP first)
    ↓
Return 201 JSON:
{
  user: { id, email, name, role },
  success: true,
  message: "Registration successful. Please verify your OTP."
}
```

**IMPORTANT**: Tokens are NOT sent during registration. User must verify OTP first!

---

## ✉️ OTP VERIFICATION FLOW

### Frontend: OTPVerification.jsx
```
User enters OTP code
    ↓
Click "Verify OTP"
    ↓
authService.verifyOTP(email, otp)
    ↓
Response contains:
- accessToken
- refreshToken
- user data
    ↓
Store tokens in localStorage
    ↓
Navigate to /dashboard
```

### Backend: auth.controller.js - verifyOTP()
```
📥 [VERIFY OTP] Request for email received
    ↓
🔍 [VERIFY OTP] Looking up OTP record in database
    ↓
If OTP not found:
  ❌ [VERIFY OTP] Invalid OTP → Return 400 error
    ↓
If OTP found:
  ✅ [VERIFY OTP] OTP verified, delete record
    ↓
  👤 Fetch user from database
    ↓
  🔑 [VERIFY OTP] Generate access & refresh tokens
    ↓
  Return 200 JSON:
  {
    success: true,
    message: "OTP verified successfully",
    accessToken,
    refreshToken,
    user: { id, email, name, role }
  }
```

---

## 🔐 LOGIN FLOW

### Frontend: Login.jsx
```
User enters email & password
    ↓
✅ Local validation (email required, password required)
    ↓
🔐 [LOGIN] Starting login attempt
    ↓
authService.login(email, password)
    ↓
📤 [AUTHSERVICE] Sending login request
    ↓
📨 [AUTHSERVICE] Login response received
    ↓
💾 [AUTHSERVICE] Access token & refresh token stored
    ↓
✅ [LOGIN] Login successful
    ↓
Navigate to /dashboard
```

### Backend: auth.controller.js - login()
```
📥 [LOGIN] Request for email received
    ↓
✅ [LOGIN] Validation passed
    ↓
👤 [LOGIN] User authenticated in database
    ↓
🔑 [LOGIN] Tokens generated
    ↓
Return 200 JSON:
{
  user: { id, email, name, role },
  tokens: { accessToken, refreshToken }
}
```

---

## 🔍 CONSOLE LOG REFERENCE

### Frontend Console Logs
| Log | Meaning |
|-----|---------|
| `🔐 [SIGNUP]` | Signup process started |
| `📤 [AUTHSERVICE]` | API request being sent |
| `📨 [AUTHSERVICE]` | API response received |
| `💾 [AUTHSERVICE]` | Data stored in localStorage |
| `🎯 [SIGNUP]` | Navigation to next screen |
| `❌ [SIGNUP]` | Registration failed |

### Backend Console Logs
| Log | Meaning |
|-----|---------|
| `📥 [REGISTER]` | Registration request received |
| `✅ [REGISTER]` | Validation passed |
| `👤 [REGISTER]` | User created successfully |
| `🔑 [REGISTER]` | Tokens NOT sent (user needs OTP) |
| `📥 [VERIFY OTP]` | OTP verification requested |
| `🔍 [VERIFY OTP]` | Looking up OTP in database |
| `✅ [VERIFY OTP]` | OTP verified |
| `❌ [VERIFY OTP]` | Invalid OTP |
| `🔑 [VERIFY OTP]` | Tokens generated after OTP verified |

---

## 🐛 Troubleshooting

### Issue: User logs in immediately after signup (skips OTP)
**Cause**: Register endpoint was returning tokens

**Fix**: Modified register() to NOT return tokens. Tokens only returned after OTP verification.

### Issue: Login shows "Invalid credentials"
**Possible causes**:
1. User hasn't completed OTP verification yet (not in User collection)
2. Wrong email/password combination
3. User doesn't exist in database

**Solution**: Ensure user completes OTP verification before attempting login

### Issue: OTP verification fails
**Possible causes**:
1. OTP code is incorrect
2. OTP record doesn't exist in database
3. OTP has expired (if TTL is set)

**Solution**: Check console logs to see if OTP record exists in database

---

## 📊 Expected Request/Response Flow

### Signup Request
```javascript
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Signup Response (201 Created)
```javascript
{
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "success": true,
  "message": "Registration successful. Please verify your OTP."
}
```

### OTP Verification Request
```javascript
POST /auth/verify-otp
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### OTP Verification Response (200 OK)
```javascript
{
  "success": true,
  "message": "OTP verified successfully",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Login Request
```javascript
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Login Response (200 OK)
```javascript
{
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

## ✅ Verification Checklist

- [ ] Console logs appear during signup
- [ ] User is created in database
- [ ] Tokens are NOT returned during signup
- [ ] Navigation goes to OTP screen after signup
- [ ] OTP verification stores tokens in localStorage
- [ ] Login requires valid credentials
- [ ] Dashboard is accessible after login
- [ ] Token refresh works correctly
- [ ] Logout clears localStorage
