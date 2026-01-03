# Fix Supabase Profiles Table - Step by Step Guide

## Problem
The profiles table is not storing user data when users sign up or log in.

## Solution Steps

### Step 1: Run the SQL Script

1. Go to your Supabase Dashboard
2. Navigate to: **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy and paste the entire contents of `fix-profiles-table.sql`
5. Click **"Run"** or press `Ctrl+Enter`

### Step 2: Verify the Fix

After running the script, check:

1. **Go to Table Editor** → **profiles**
2. You should now see profiles for all existing users
3. Each profile should have:
   - `id` (UUID matching auth.users)
   - `email`
   - `full_name` (from Google OAuth or email)
   - `avatar_url` (from Google profile picture)
   - `plan` (default: 'free')
   - `credits_remaining` (default: 3)

### Step 3: Test with New User

1. Log out of your app
2. Create a new account or log in with a different Google account
3. Check the profiles table - a new row should appear automatically
4. The dashboard should now show your profile info correctly

## What the Script Does

1. **Creates/Updates Table Structure** - Ensures profiles table has correct columns
2. **Fixes RLS Policies** - Allows users to read/write their own profiles
3. **Updates Trigger Function** - Handles both `name` and `full_name` from OAuth
4. **Recreates Trigger** - Ensures it fires on new user creation
5. **Backfills Data** - Creates profiles for existing users who don't have one
6. **Adds Indexes** - Improves query performance

## Common Issues & Solutions

### Issue 1: "Permission denied for table profiles"
**Solution:** The RLS policies are now fixed. Make sure you're logged in as the user whose profile you're trying to access.

### Issue 2: "Trigger function does not exist"
**Solution:** The script recreates the trigger function with `SECURITY DEFINER` which gives it the necessary permissions.

### Issue 3: Still no profiles appearing
**Solution:** 
1. Check if the trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

2. Manually create a profile for testing:
```sql
INSERT INTO public.profiles (id, email, full_name, plan, credits_remaining)
VALUES (
  auth.uid(),
  (SELECT email FROM auth.users WHERE id = auth.uid()),
  'Test User',
  'free',
  3
);
```

### Issue 4: 406 Error when fetching profile
**Solution:** This was happening because of RLS policies. The script fixes this by:
- Adding proper SELECT policy
- Using `SECURITY DEFINER` on the trigger function
- Allowing service role to insert profiles

## Verification Query

Run this to see all profiles:

```sql
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.avatar_url,
  p.plan,
  p.credits_remaining,
  p.created_at,
  au.email as auth_email,
  au.created_at as user_created_at
FROM public.profiles p
LEFT JOIN auth.users au ON au.id = p.id
ORDER BY p.created_at DESC;
```

## Expected Result

After running the fix:
- ✅ Existing users have profiles
- ✅ New signups automatically create profiles
- ✅ Google OAuth users get name and picture
- ✅ Dashboard shows user info correctly
- ✅ No more 406 errors

## Need More Help?

If profiles still aren't working:

1. Check Supabase logs: **Logs** → **Postgres Logs**
2. Look for errors related to `profiles` or `handle_new_user`
3. Verify your Supabase URL and anon key in `.env` are correct
4. Make sure you're using the correct project (check project ID in URL)
