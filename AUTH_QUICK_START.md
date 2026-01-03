# 🔐 Authentication Quick Start

## 1️⃣ Run SQL Schema (2 minutes)

1. Open Supabase Dashboard → SQL Editor
2. Copy/paste contents of `supabase-schema.sql`
3. Click "Run"

## 2️⃣ Configure Google OAuth (5 minutes)

### Google Cloud Console
1. Go to https://console.cloud.google.com/
2. Create OAuth 2.0 Client ID
3. Add redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
4. Copy Client ID & Secret

### Supabase Dashboard
1. Go to Authentication → Providers → Google
2. Enable and paste Client ID & Secret
3. Save

## 3️⃣ Test It (1 minute)

```bash
npm run dev
```

Visit: http://localhost:5173/login

Try:
- ✅ Email signup
- ✅ Google login
- ✅ Access `/dashboard`

## 🎯 Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Login/signup page |
| `/dashboard` | Protected | Main dashboard |
| `/history` | Protected | Analysis history (locked for free) |
| `/settings` | Protected | User settings |
| `/upload` | Public | Upload screenshot |

## 🔑 Key Files

- `src/lib/auth.ts` - Auth functions
- `src/contexts/AuthContext.tsx` - Auth state
- `src/components/ProtectedRoute.tsx` - Route guard
- `src/pages/Login.tsx` - Login page
- `supabase-schema.sql` - Database schema

## 🐛 Common Issues

**Can't login?**
- Check `.env` has correct Supabase credentials
- Clear browser cache

**Google OAuth fails?**
- Verify redirect URI matches exactly
- Check Client ID/Secret in Supabase

**Profile not created?**
- Run SQL schema again
- Check Supabase logs

## 📚 Full Guide

See `AUTH_SETUP_GUIDE.md` for detailed instructions.
