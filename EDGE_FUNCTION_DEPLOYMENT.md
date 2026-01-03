# Edge Function Deployment Instructions

## The 401 Error

The error you're seeing means the Edge Functions haven't been deployed to Supabase yet. You need to deploy them before the payment system will work.

## Option 1: Deploy Edge Functions (Recommended)

### Prerequisites
1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```
(Find your project ref in Supabase Dashboard URL: https://supabase.com/dashboard/project/YOUR_PROJECT_REF)

### Deploy Functions

```bash
# Deploy create order function
supabase functions deploy create-razorpay-order

# Deploy verify payment function
supabase functions deploy verify-razorpay-payment
```

### Set Secrets

```bash
# Set Razorpay credentials
supabase secrets set RAZORPAY_KEY_ID=your_razorpay_key_id
supabase secrets set RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Set Supabase credentials (get from dashboard)
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Verify Deployment

Check if functions are deployed:
```bash
supabase functions list
```

You should see:
- create-razorpay-order
- verify-razorpay-payment

## Option 2: Alternative Without Edge Functions (Temporary)

If you can't deploy Edge Functions right now, I can create a simplified version that:
1. Uses Razorpay's client-side only mode
2. Stores payment info directly in Supabase
3. Requires manual verification (less secure)

This is NOT recommended for production but can work for testing.

Would you like me to create this alternative?

## Troubleshooting

### Error: "supabase: command not found"
Install Supabase CLI:
```bash
npm install -g supabase
```

### Error: "Not logged in"
Run:
```bash
supabase login
```

### Error: "Project not linked"
Run:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### Error: "Permission denied"
Make sure you have admin access to the Supabase project.

### Error: "Function already exists"
Update instead:
```bash
supabase functions deploy create-razorpay-order --no-verify-jwt
supabase functions deploy verify-razorpay-payment --no-verify-jwt
```

## Testing After Deployment

1. Navigate to `/buy-plan`
2. Click a plan button
3. Check browser console for errors
4. If you see Razorpay modal, functions are working
5. Complete test payment with card: 4111 1111 1111 1111

## Checking Function Logs

View logs in Supabase Dashboard:
1. Go to Edge Functions section
2. Click on function name
3. View logs tab
4. Check for errors

Or via CLI:
```bash
supabase functions logs create-razorpay-order
supabase functions logs verify-razorpay-payment
```

## Next Steps

1. Deploy the Edge Functions using Option 1
2. Set the required secrets
3. Test the payment flow
4. Check the logs for any errors
5. Verify credits are added correctly

Let me know if you need help with any of these steps!
