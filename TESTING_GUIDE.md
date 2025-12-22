# Firebase Phone Authentication - Testing Guide

## Prerequisites

✅ Packages installed (firebase, firebase-admin)
✅ Firebase project created
✅ Phone authentication enabled in Firebase Console

## Local Testing Steps

### 1. Configure Firebase Console (One-time setup)

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Phone** tab
4. Add test phone numbers:
   ```
   Phone: +911234567890
   OTP: 123456
   ```
   ```
   Phone: +919876543210
   OTP: 654321
   ```

### 2. Update Environment Variables

#### Client (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=AIzaSyC...
REACT_APP_FIREBASE_AUTH_DOMAIN=grams-xxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=grams-xxx
REACT_APP_FIREBASE_STORAGE_BUCKET=grams-xxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123...
```

#### Server (`server/.env`):
```env
FIREBASE_PROJECT_ID=grams-xxx
# No need for serviceAccountKey.json during local testing if using file
# Just place it in server/ root folder
```

#### Server (`server/serviceAccountKey.json`):
- Download from Firebase Console
- Project Settings → Service Accounts → Generate New Private Key
- Save in `server/` root directory

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Expected output:
```
✅ Firebase Admin initialized successfully
Server running on port 5000
✅ Connected to MongoDB
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Expected output:
```
  VITE v4.4.9  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 4. Test Phone Authentication

#### Scenario 1: New User Registration

1. Open browser: `http://localhost:5173/phone-login`
2. See "Phone Authentication" form
3. Enter phone: `+911234567890`
4. reCAPTCHA should appear ✓
5. Click "Send OTP"
6. Expected: "OTP sent successfully!" message appears
7. Enter OTP: `123456`
8. Click "Verify OTP"
9. Expected: "OTP verified! Now enter your details." message
10. Enter:
    - Full Name: `John Doe`
    - Email: `john@example.com`
11. Click "Create Account"
12. Expected: 
    - "Account created successfully!" message
    - Redirect to `/dashboard`
    - User logged in with sidebar visible

#### Scenario 2: Existing User Login

1. From previous scenario, user already registered
2. Go to `http://localhost:5173/phone-login`
3. Enter same phone: `+911234567890`
4. Send OTP → receive OTP
5. Enter OTP: `123456`
6. Should show: "Complete Your Profile" page
7. User data pre-filled (from previous registration)
8. Click "Create Account"
9. Expected:
    - User redirected to dashboard
    - Logged in successfully

#### Scenario 3: Different Test Phone

1. Go to `http://localhost:5173/phone-login`
2. Clear previous data (open DevTools → Application → Clear all)
3. Enter phone: `+919876543210` (second test number)
4. Send OTP → Enter OTP: `654321`
5. Fill in details
6. Create account
7. Should create new user in MongoDB

### 5. Verify User in MongoDB

Open MongoDB Compass or MongoDB Atlas:

```
Database: grams
Collection: users
```

Should see documents like:
```json
{
  "_id": ObjectId(...),
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+911234567890",
  "role": "user",
  "isActive": true,
  "createdAt": ISODate(...),
  "updatedAt": ISODate(...)
}
```

### 6. Check Network Requests

Open browser DevTools → Network tab:

Look for requests:
1. `POST /api/phone-auth/phone-register` 
   - Status: 200
   - Response includes `{ token, user }`

## Testing Checklist

### reCAPTCHA
- [ ] reCAPTCHA appears on phone input screen
- [ ] reCAPTCHA can be clicked
- [ ] Callback fires after verification

### OTP Flow
- [ ] "Send OTP" button works
- [ ] Success message appears
- [ ] OTP input field shows
- [ ] Only accepts 6 digits
- [ ] "Verify OTP" button works

### User Details
- [ ] Name field is editable
- [ ] Email field is editable
- [ ] Phone number displays (read-only)
- [ ] "Create Account" button works

### Database
- [ ] User created in MongoDB
- [ ] Email unique constraint works
- [ ] Phone number stored correctly
- [ ] Role defaults to "user"

### Authentication
- [ ] JWT token generated
- [ ] Token stored in localStorage
- [ ] User redirected to dashboard
- [ ] Dashboard protected (can't access without login)
- [ ] Logout clears token

## Common Test Scenarios

### ✅ Success Cases

**Case 1: First-time user**
- New phone number
- New email
- Should create user successfully

**Case 2: Returning user (same phone)**
- Previous registration
- Login with same phone
- Should not create duplicate
- Should log in successfully

**Case 3: Invalid phone format**
- Missing country code
- Too short/long
- Should show error

### ❌ Error Cases

**Error 1: Wrong OTP**
- Input: Wrong OTP code
- Expected: "Invalid OTP" error message

**Error 2: Missing Fields**
- Skip name or email
- Expected: "Please fill in all fields" error

**Error 3: Duplicate Email**
- Use email from existing user
- Expected: Error message (if email unique)

**Error 4: No reCAPTCHA**
- Test before reCAPTCHA loads
- Expected: reCAPTCHA error

**Error 5: Firebase Not Initialized**
- Wrong project ID
- Wrong service account
- Expected: Firebase initialization error

## Debugging Tips

### Check reCAPTCHA Loading
```javascript
// In browser console
window.grecaptcha
// Should return object, not undefined
```

### Check Firebase Config
```javascript
// In browser console
import { auth } from './config/firebaseConfig'
console.log(auth)
// Should show auth object with methods
```

### Check Backend Logs
Monitor server terminal for:
- Firebase Admin initialization
- Database connection
- Request logs
- Error messages

### Check Network Tab
Firefox/Chrome DevTools → Network tab:
1. Filter by XHR
2. Look for `/api/phone-auth/phone-register`
3. Check:
   - Request payload
   - Response data
   - Status code

### MongoDB Verification
```javascript
// MongoDB Compass or Atlas
db.users.find()
// Should show all registered users
```

## Performance Testing

### Metrics to Check
- [ ] Form loads in < 2 seconds
- [ ] reCAPTCHA appears in < 3 seconds
- [ ] OTP sent in < 5 seconds
- [ ] OTP verified in < 5 seconds
- [ ] User created in < 3 seconds
- [ ] Page redirect < 2 seconds

### Load Testing
- [ ] Multiple simultaneous registrations
- [ ] Multiple OTP verifications
- [ ] Database queries don't timeout

## Clean Up Test Data

### Delete Test Users from MongoDB
```javascript
// MongoDB Compass
db.users.deleteMany({ 
  phone: /^\+91/ 
})
```

### Clear Browser Storage
```javascript
// Browser console
localStorage.clear()
sessionStorage.clear()
```

### Reset Firebase Test Phone
Firebase Console → Authentication → Phone → Edit test number

## Troubleshooting

### Issue: reCAPTCHA not appearing
**Check:**
- Firebase Console → Authentication → Settings
- Ensure reCAPTCHA is enabled
- Check browser console for errors
- Verify containerId matches: "recaptcha-container"

### Issue: OTP always fails
**Check:**
- Using correct test OTP (123456, 654321)
- Test phone number is added in Firebase Console
- Not using real phone without SMS provider

### Issue: User not created in MongoDB
**Check:**
- MongoDB connection working
- Email is unique
- Phone is unique
- Server logs for errors

### Issue: JWT token not saved
**Check:**
- localStorage not cleared
- Token returned from backend
- AuthStore setToken called
- Browser DevTools → Application → localStorage

## Real World Testing (With SMS Provider)

Once ready for production:

1. Set up Twilio or SMS provider
2. Remove test phone numbers from Firebase
3. Enable real SMS sending
4. Test with real phone number
5. Check SMS arrives in < 30 seconds
6. Verify OTP from SMS message
7. Ensure user creation works end-to-end

## Next Steps After Testing

✅ Local testing complete
- [ ] Deploy to Render/Railway (backend)
- [ ] Deploy to Vercel (frontend)
- [ ] Update Firebase authorized domains
- [ ] Test on production domain
- [ ] Monitor error logs
- [ ] Collect user feedback
