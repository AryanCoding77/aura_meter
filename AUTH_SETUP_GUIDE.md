# Aura Meter - Authentication Setup Guide

## 🚀 Quick Start

This guide will help you set up the complete authentication system with Supabase.

## 📋 Prerequisites

- Supabase account (free tier works)
- Google Cloud Console account (for OAuth)
- Environment variables configured in `.env`

## 🔧 Step 1: Supabase Database Setup

### 1.1 Run the SQL Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase-schema.sql`
4. Paste and run the SQL script

This will create:
- `profiles` table with RLS policies
- Automatic profile creation trigger
- Indexes for performance
- Updated `aura_results` table with user linking

### 1.2 Verify Tables

Check that these tables exist:
- `profiles` - User profile data
- `aura_results` - Analysis results (if exists)

## 🔐 Step 2: Configure Google OAuth

### 2.1 Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - User Type: External
   - App name: Aura Meter
   - Support email: Your email
   - Authorized domains: Add your domain

6. Create OAuth Client ID:
   - Application type: Web application
   - Name: Aura Meter Web
   - Authorized redirect URIs:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
   - Replace `YOUR_PROJECT_REF` with your Supabase project reference

7. Copy the **Client ID** and **Client Secret**

### 2.2 Configure Supabase OAuth

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** provider
3. Enable it
4. Paste your Google **Client ID** and **Client Secret**
5. Save changes

## 🌐 Step 3: Configure Redirect URLs

In Supabase dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Add these URLs to **Redirect URLs**:
   ```
   http://localhost:5173/dashboard
   https://yourdomain.com/dashboard
   ```
3. Set **Site URL** to your production domain

## 📝 Step 4: Environment Variables

Ensure your `.env` file has:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: **Supabase Dashboard** → **Settings** → **API**

## 🧪 Step 5: Test Authentication

### Test Email/Password Auth

1. Start dev server: `npm run dev`
2. Navigate to `/login`
3. Try signing up with email/password
4. Check Supabase **Authentication** → **Users** to verify user creation
5. Check **Table Editor** → **profiles** to verify profile creation

### Test Google OAuth

1. Click "Continue with Google"
2. Complete Google sign-in flow
3. Should redirect to `/dashboard`
4. Verify profile created in database

## 🔒 Step 6: Row Level Security (RLS)

The SQL script automatically enables RLS. Verify policies:

1. Go to **Table Editor** → **profiles**
2. Click **RLS** tab
3. Should see policies:
   - Users can view own profile
   - Users can update own profile
   - Users can insert own profile

## 📱 Step 7: Test Protected Routes

Try accessing these routes:

- `/dashboard` - Should redirect to `/login` if not authenticated
- `/history` - Should show locked state for free users
- `/settings` - Should show user info

## 🎯 Features Implemented

### ✅ Authentication
- [x] Email/password signup
- [x] Email/password login
- [x] Google OAuth
- [x] Session persistence
- [x] Auto-login on refresh
- [x] Secure logout
- [x] Protected routes

### ✅ User Management
- [x] Automatic profile creation
- [x] User roles (free/basic/best/vip)
- [x] Credits system
- [x] Profile updates

### ✅ Pages
- [x] `/login` - Public login page
- [x] `/dashboard` - Protected dashboard
- [x] `/history` - Protected, locked for free users
- [x] `/settings` - Protected settings page

### ✅ Security
- [x] Row Level Security (RLS)
- [x] Auth guards
- [x] Secure session handling
- [x] Protected API calls

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: Check `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Issue: Google OAuth not working
**Solution**: 
1. Verify redirect URI in Google Console matches Supabase callback URL
2. Check Google credentials in Supabase are correct
3. Ensure Google+ API is enabled

### Issue: Profile not created on signup
**Solution**: 
1. Check if trigger `on_auth_user_created` exists
2. Verify RLS policies allow INSERT
3. Check Supabase logs for errors

### Issue: Can't access protected routes
**Solution**:
1. Clear browser cache and cookies
2. Check if session is stored (DevTools → Application → Local Storage)
3. Verify auth state in React DevTools

### Issue: RLS blocking queries
**Solution**:
1. Verify user is authenticated
2. Check RLS policies match user ID
3. Use Supabase SQL Editor to test queries with `auth.uid()`

## 📚 Code Structure

```
src/
├── lib/
│   ├── auth.ts              # Auth helper functions
│   └── supabase.ts          # Supabase client
├── contexts/
│   └── AuthContext.tsx      # Auth state management
├── components/
│   ├── ProtectedRoute.tsx   # Route guard component
│   └── DashboardLayout.tsx  # Dashboard layout with sidebar
└── pages/
    ├── Login.tsx            # Login/signup page
    ├── Dashboard.tsx        # Main dashboard
    ├── History.tsx          # Analysis history (locked for free)
    └── Settings.tsx         # User settings
```

## 🔄 Next Steps

1. **Add password reset**: Implement forgot password flow
2. **Email verification**: Enable email confirmation in Supabase
3. **Social providers**: Add more OAuth providers (GitHub, Twitter)
4. **Profile editing**: Allow users to update name/avatar
5. **Plan upgrades**: Integrate payment system (Stripe/Razorpay)
6. **Usage tracking**: Track analysis count per user
7. **Admin panel**: Create admin dashboard for user management

## 📖 API Reference

### Auth Functions (`src/lib/auth.ts`)

```typescript
// Sign up with email
signUpWithEmail(email: string, password: string)

// Sign in with email
signInWithEmail(email: string, password: string)

// Sign in with Google
signInWithGoogle()

// Sign out
signOut()

// Get current session
getSession(): Promise<Session | null>

// Get current user
getCurrentUser(): Promise<User | null>

// Get user profile
getUserProfile(userId: string): Promise<UserProfile | null>

// Update user profile
updateUserProfile(userId: string, updates: Partial<UserProfile>)
```

### Auth Context Hook

```typescript
const { user, profile, session, loading, refreshProfile } = useAuth();
```

## 🎨 Customization

### Change Plan Names
Edit `src/lib/auth.ts` and update the `UserProfile` interface:
```typescript
plan: 'free' | 'basic' | 'best' | 'vip' | 'your-plan-name';
```

Also update the SQL schema CHECK constraint.

### Add Profile Fields
1. Add column to `profiles` table in Supabase
2. Update `UserProfile` interface in `src/lib/auth.ts`
3. Update profile creation/update functions

### Customize UI Theme
All pages use Tailwind classes. Modify:
- `src/pages/Login.tsx` - Login page styling
- `src/components/DashboardLayout.tsx` - Dashboard layout
- Individual page components for specific styling

## 🚀 Deployment

### Environment Variables
Set these in your hosting platform:
```
VITE_SUPABASE_URL=your-production-url
VITE_SUPABASE_ANON_KEY=your-production-key
```

### OAuth Redirect URLs
Add production URLs to:
1. Google Cloud Console authorized redirect URIs
2. Supabase redirect URLs configuration

### Build
```bash
npm run build
```

## 📞 Support

For issues or questions:
1. Check Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Review this guide's troubleshooting section
4. Check Supabase documentation: https://supabase.com/docs

---

**Status**: ✅ Production Ready

All authentication features are implemented and tested. The system is secure, scalable, and ready for production use.
