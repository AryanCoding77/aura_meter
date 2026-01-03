# Deployment Verification Checklist

## ✅ Completed Steps

### Edge Functions
- [x] `create-razorpay-order` deployed (2 deployments)
- [x] `verify-razorpay-payment` deployed (2 deployments)
- [x] Functions accessible at: `https://iycaqitoykonldxunjkl.supabase.co/functions/v1/`

### Secrets Configuration
- [x] `SUPABASE_URL` set
- [x] `SUPABASE_ANON_KEY` set
- [x] `SUPABASE_SERVICE_ROLE_KEY` set
- [x] `SUPABASE_DB_URL` set
- [x] `RAZORPAY_KEY_ID` set (test mode: rzp_test_...)
- [x] `RAZORPAY_KEY_SECRET` set

### Frontend Configuration
- [x] `VITE_RAZORPAY_KEY_ID` set in .env (rzp_test_f4NyhSLAU2AeOW)
- [x] `VITE_SUPABASE_URL` configured
- [x] `VITE_SUPABASE_ANON_KEY` configured

## ⚠️ Pending Steps

### Database Setup
Run this SQL in your Supabase SQL Editor:

```sql
-- Check if payments table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'payments'
);

-- If false, run the entire supabase-payments-table.sql file
```

**Action Required:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase-payments-table.sql`
3. Paste and run
4. Verify no errors

### Verify Database Schema

```sql
-- Check payments table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- Check if history_unlocked column exists in profiles
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'history_unlocked';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'payments';
```

### Test Payment Flow

**Test Mode Checklist:**

1. **Navigate to Buy Plan Page**
   ```
   http://localhost:5173/buy-plan
   ```
   - [ ] Page loads without errors
   - [ ] All 3 plans display correctly
   - [ ] "Most Popular" badge shows on Best plan
   - [ ] Buttons are enabled

2. **Test Basic Plan Purchase**
   - [ ] Click "Buy Basic" button
   - [ ] Razorpay modal opens
   - [ ] Use test card: `4111 1111 1111 1111`
   - [ ] CVV: `123`, Expiry: `12/25`
   - [ ] Payment succeeds
   - [ ] Success toast appears
   - [ ] Redirects to dashboard
   - [ ] Credits updated to 5
   - [ ] Plan updated to "basic"

3. **Verify Database Updates**
   ```sql
   -- Check payment record
   SELECT * FROM payments 
   WHERE user_id = 'YOUR_USER_ID' 
   ORDER BY created_at DESC 
   LIMIT 1;
   
   -- Check profile update
   SELECT plan, credits_remaining, history_unlocked 
   FROM profiles 
   WHERE id = 'YOUR_USER_ID';
   ```

4. **Test Best Plan Purchase**
   - [ ] Click "Get Best" button
   - [ ] Complete payment
   - [ ] Credits updated to 12
   - [ ] Plan updated to "best"
   - [ ] `history_unlocked` = true
   - [ ] History page accessible

5. **Test VIP Plan Purchase**
   - [ ] Click "Go VIP" button
   - [ ] Complete payment
   - [ ] Credits updated to 25
   - [ ] Plan updated to "vip"
   - [ ] `history_unlocked` = true

### Test Edge Cases

1. **Payment Cancellation**
   - [ ] Click plan button
   - [ ] Close Razorpay modal
   - [ ] "Payment cancelled" toast shows
   - [ ] Button re-enabled

2. **Payment Failure**
   - [ ] Use test card: `4000 0000 0000 0002`
   - [ ] Payment fails
   - [ ] Error toast shows
   - [ ] Button re-enabled

3. **Owned Plan**
   - [ ] After buying a plan
   - [ ] Button shows "Owned"
   - [ ] Button is disabled
   - [ ] "Current Plan" badge shows

4. **Zero Credits**
   - [ ] Set credits to 0 in database
   - [ ] Go to History page
   - [ ] "Buy Credits" CTA shows
   - [ ] Clicking redirects to /buy-plan

### Check Edge Function Logs

1. Go to Supabase Dashboard → Edge Functions → Logs
2. Look for any errors in:
   - `create-razorpay-order`
   - `verify-razorpay-payment`

**Common Issues to Check:**
- CORS errors
- Missing environment variables
- Database connection errors
- Razorpay API errors

## 🔍 Verification Commands

### Check if payments table exists
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'payments';
```

### Check profiles table structure
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';
```

### Test Edge Function (using curl)
```bash
# Test create-razorpay-order
curl -X POST \
  'https://iycaqitoykonldxunjkl.supabase.co/functions/v1/create-razorpay-order' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "test-user-id",
    "plan_type": "basic",
    "amount": 5000
  }'
```

## 🚨 Troubleshooting

### Issue: Razorpay modal doesn't open
**Solution:**
- Check browser console for errors
- Verify `VITE_RAZORPAY_KEY_ID` in .env
- Ensure Razorpay script loaded (check Network tab)

### Issue: Payment succeeds but credits not added
**Solution:**
1. Check Edge Function logs for errors
2. Verify payment record in database:
   ```sql
   SELECT * FROM payments WHERE status = 'created';
   ```
3. Manually update if needed:
   ```sql
   UPDATE profiles 
   SET credits_remaining = credits_remaining + 5,
       plan = 'basic'
   WHERE id = 'USER_ID';
   ```

### Issue: CORS error in Edge Function
**Solution:**
- Edge Functions already have CORS headers
- Check if request includes proper Authorization header
- Verify Supabase URL is correct

### Issue: "Missing required fields" error
**Solution:**
- Check Edge Function logs
- Verify request body includes:
  - user_id
  - plan_type
  - amount

### Issue: "Invalid payment signature" error
**Solution:**
- Verify `RAZORPAY_KEY_SECRET` is set correctly in Supabase secrets
- Check if signature verification logic is correct
- Ensure order_id and payment_id are passed correctly

## ✅ Final Checklist

Before going live:

- [ ] Database schema created (payments table + history_unlocked column)
- [ ] Edge Functions deployed and working
- [ ] All secrets configured correctly
- [ ] Test payment completed successfully
- [ ] Credits added correctly
- [ ] Plan updated correctly
- [ ] History unlocked for premium plans
- [ ] Payment record stored in database
- [ ] No errors in Edge Function logs
- [ ] No errors in browser console
- [ ] All edge cases tested
- [ ] Razorpay test mode working

## 🎯 Next Steps

### For Production Launch:

1. **Complete Razorpay KYC**
   - Submit business documents
   - Wait for approval
   - Get live API keys

2. **Switch to Live Keys**
   ```bash
   # Update Supabase secrets
   supabase secrets set RAZORPAY_KEY_ID=rzp_live_xxxxx
   supabase secrets set RAZORPAY_KEY_SECRET=xxxxx
   
   # Update .env
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
   ```

3. **Test with Real Payment**
   - Use smallest amount (₹50)
   - Verify everything works
   - Check Razorpay dashboard

4. **Monitor**
   - Watch Edge Function logs
   - Track payment success rate
   - Monitor user feedback

## 📊 Success Metrics

Track these after launch:
- Payment success rate (target: >95%)
- Average response time (target: <2s)
- Error rate (target: <1%)
- Conversion rate (target: >10%)

## 🆘 Support

If you encounter issues:
1. Check Edge Function logs first
2. Verify database records
3. Check Razorpay dashboard
4. Review error messages carefully
5. Refer to RAZORPAY_INTEGRATION_GUIDE.md

---

**Current Status**: Edge Functions deployed ✅
**Next Step**: Run database migration SQL
**Test Mode**: Active (rzp_test_...)
