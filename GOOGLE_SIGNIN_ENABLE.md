# Firebase Console: Enable Google Sign-In (Visual Steps)

## The Problem
You're seeing: `Firebase: Error (auth/operation-not-allowed)`

This means Google authentication is **DISABLED** in your Firebase project.

---

## Solution: Enable Google Sign-In in Firebase Console

### STEP 1: Open Firebase Console
- Go to: https://console.firebase.google.com/
- Select project: **grams-auth**

### STEP 2: Navigate to Authentication
In the left sidebar:
```
Build
  └─ Authentication (click here)
```

### STEP 3: Click "Sign-in method" Tab
You should see:
- Email/Password (might be enabled)
- Phone Number
- Google (THIS ONE - likely DISABLED ❌)
- Apple
- Facebook
- etc.

### STEP 4: Click on Google Provider
Click the **Google** row to open its settings.

### STEP 5: Enable Google Sign-In
You'll see a toggle switch that looks like:

**BEFORE (Disabled):**
```
Google     [⚪️ OFF]
```

**AFTER (Enabled):**
```
Google     [🔵 ON]
```

Click the toggle to turn it ON (it will turn blue).

### STEP 6: Select Support Email
A dropdown menu will appear asking for a support email. Choose one from the list (usually your Firebase project email).

### STEP 7: Click SAVE
Click the blue **SAVE** button at the bottom.

### STEP 8: Confirm Status
You should now see:
```
Google     [🔵 Enabled]
Scopes: profile, email
```

---

## After Enabling - Test It

1. Go back to your GRAMS app
2. Hard refresh the page: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
3. Clear browser cache if needed
4. Click **"Continue with Google"** button
5. Google popup should now appear ✅

---

## Troubleshooting Checklist

- [ ] Google provider shows "Enabled" (blue toggle)
- [ ] Support email is selected
- [ ] Clicked "SAVE" button
- [ ] Cleared browser cache
- [ ] Hard refreshed page (Ctrl+Shift+R)
- [ ] No console errors about credentials

---

## What Happens After Enabling

### 1️⃣ User clicks "Continue with Google"
↓
### 2️⃣ Google popup opens (doesn't close automatically now!)
↓
### 3️⃣ User signs in with Google account
↓
### 4️⃣ Backend receives data & creates user in MongoDB
↓
### 5️⃣ User is redirected to dashboard
↓
### ✅ Success!

---

## Database Check

You can verify user was created by checking MongoDB:

```javascript
db.users.find({ isGoogleAuth: true })
```

Should return users like:
```
{
  _id: ObjectId(...),
  name: "John Doe",
  email: "john@gmail.com",
  googleId: "firebase-uid",
  isGoogleAuth: true,
  profilePicture: "https://...",
  role: "user",
  createdAt: ISODate(...)
}
```

---

## Still Having Issues?

### Pop-up closes immediately?
- [ ] Check DevTools Console for errors
- [ ] Allow pop-ups in browser settings
- [ ] Try incognito/private window
- [ ] Clear all LocalStorage: DevTools → Application → Local Storage → Clear All

### Getting "auth/popup-blocked"?
- [ ] Check browser pop-up settings
- [ ] Add `localhost:5173` to allowed pop-ups

### Getting "auth/operation-not-allowed" still?
- [ ] Verify Google toggle is BLUE (enabled)
- [ ] Clicked SAVE button
- [ ] Hard refresh entire page
- [ ] Close all tabs and reopen

---

## Video Tutorial (if needed)

Search YouTube for: "Firebase Google Sign-in Setup 2024"

Most recent tutorials will show:
1. Firebase Console
2. Authentication section
3. Sign-in methods
4. Google toggle

---

## Success Indicators

✅ Google toggle is blue (enabled)
✅ "Continue with Google" button appears in signup page
✅ Clicking button opens Google login popup
✅ Popup stays open until user completes auth
✅ User appears in MongoDB with `isGoogleAuth: true`

---

**Next Step:** Enable Google in Firebase Console following the steps above, then test again!
