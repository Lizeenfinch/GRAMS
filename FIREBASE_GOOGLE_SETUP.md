# Firebase Google Sign-In Setup Guide

## Issue: auth/operation-not-allowed

This error occurs when **Google Sign-In is not enabled in Firebase Console**. Follow these steps to fix it:

---

## Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **grams-auth**

---

## Step 2: Enable Google Sign-In Method

1. In the left sidebar, go to **Build** → **Authentication**
2. Click on the **Sign-in method** tab
3. Look for **Google** provider
4. Click on **Google**
5. Toggle the **Enable** switch to **ON** (it should turn blue)
6. Select a support email (dropdown will appear)
7. Click **Save**

---

## Step 3: Verify Configuration

After enabling, you should see:
- ✅ Google provider with status "Enabled"
- ✅ Scopes: profile, email (default)

---

## Step 4: Add OAuth Consent Screen (if using custom domain)

If you're using a custom domain:

1. Go to **Project Settings** (gear icon)
2. Click on **Service Accounts** tab
3. The API should be enabled automatically

---

## Step 5: Test Google Sign-In

After enabling, test with:

```javascript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './config/firebaseConfig';

const handleGoogleSignUp = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    console.log('User:', result.user);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## Common Issues & Solutions

### Issue 1: "auth/operation-not-allowed"
**Solution:** Enable Google in Firebase Console (Steps above)

### Issue 2: Pop-up closes immediately
**Solutions:**
- Clear browser cache and reload
- Check if pop-up is being blocked (allow pop-ups for your domain)
- Verify domain is added to authorized domains in Firebase

### Issue 3: "auth/network-request-failed"
**Solution:** Check internet connection and Firebase configuration

### Issue 4: Pop-up blocked
**Solution:** Allow pop-ups in browser settings for `localhost:5173` or your domain

---

## Add Authorized Domains (If using custom domain)

1. Go to **Authentication** → **Settings** tab
2. Scroll down to **Authorized domains**
3. Your domain should be listed:
   - `localhost` ✓ (for local development)
   - Your deployed domain (if applicable)

---

## Frontend Configuration (Already Done)

Your **firebaseConfig.js** is properly configured:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAvzxM7nP7ys-W_nxf7WqdnLyxYmSDBKGg",
  authDomain: "grams-auth.firebaseapp.com",
  projectId: "grams-auth",
  storageBucket: "grams-auth.firebasestorage.app",
  messagingSenderId: "748565551290",
  appId: "1:748565551290:web:a43f0eb0694fdd51ec8a83"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

---

## Backend Configuration (Already Done)

Your backend **authController.js** is ready to handle Google auth:

```javascript
exports.googleLogin = async (req, res) => {
  try {
    const { name, email, phone, googleId, profilePicture } = req.body;
    
    // Creates or updates user in MongoDB
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        name,
        email,
        phone,
        googleId,
        isGoogleAuth: true,
        profilePicture
      });
      await user.save();
    }
    
    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name, email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## Quick Checklist

- [ ] Navigate to Firebase Console
- [ ] Select "grams-auth" project
- [ ] Go to Authentication → Sign-in method
- [ ] Find Google provider
- [ ] Click on it
- [ ] Toggle **Enable** switch to ON
- [ ] Select support email
- [ ] Click **Save**
- [ ] Clear browser cache
- [ ] Hard refresh page (Ctrl+Shift+R)
- [ ] Test "Continue with Google" button

---

## After Enabling

The flow will work like this:

```
User clicks "Continue with Google"
    ↓
Google popup appears
    ↓
User authenticates with Google
    ↓
Firebase returns user data
    ↓
Frontend sends to Backend: { name, email, phone, googleId, profilePicture }
    ↓
Backend creates/updates user in MongoDB
    ↓
Backend returns JWT token
    ↓
Frontend stores token & redirects to dashboard
    ↓
✅ User logged in!
```

---

## Need Help?

If it still doesn't work after enabling:

1. **Clear everything:**
   - Clear browser cache
   - Clear localStorage: Open DevTools → Application → Local Storage → Clear All
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

2. **Check Firebase Status:**
   - Visit [Firebase Status](https://status.firebase.google.com/)
   - Ensure all services are operational

3. **Verify API is enabled:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Search for "Google Identity Services API"
   - Make sure it's enabled

4. **Check Console Errors:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for actual error message

---

## User Database Entry Example

After successful Google sign-up, you'll see in MongoDB:

```json
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "email": "john@gmail.com",
  "phone": "+91...",
  "googleId": "firebase-uid-12345",
  "isGoogleAuth": true,
  "profilePicture": "https://lh3.googleusercontent.com/...",
  "role": "user",
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

---

**Status:** ✅ All code is ready. Just enable Google in Firebase Console!
