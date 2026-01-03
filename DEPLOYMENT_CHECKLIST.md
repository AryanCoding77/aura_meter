# Buy Plan Feature - Deployment Checklist

## Pre-Deployment

### 1. Razorpay Account Setup
- [ ] Create Razorpay account at https://razorpay.com
- [ ] Complete KYC verification
- [ ] Get Test API keys from Dashboard
- [ ] Get Live API keys (after KYC approval)

### 2. Database Setup
- [ ] Run `supabase-payments-table.sql` in Supabase SQL Editor
- [ ] Verify `payments` table created
- [ ] Verify `history_unlocked` column added to `profiles`
- [ ] Check RLS policies applied
- [ ] Verify indexes created

### 3. Edge Functions Setup
- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Login: `supabase login`
- [ ] Link project: `supabase link --project-ref your-project-ref`
- [ ] Deploy functions:
  ```bash
  supabase functions deploy create-razorpay-order
  supabase functions deploy verify-razorpay-payment
  ```

### 4. Environment Variables

**Supabase Secrets (Backend)**
```bash
supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxxxx
supabase secrets set RAZORPAY_KEY_SECRET=xxxxx
supabase secrets set SUPABASE_URL=https://xxx.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

**Frontend .env**
```bash
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

### 5. Code Verification
- [ ] All files created:
  - `src/pages/BuyPlan.tsx`
  - `supabase-payments-table.sql`
  - `supabase/functions/create-razorpay-order/index.ts`
  - `supabase/functions/verify-razorpay-payment/index.ts`
  - `supabase/functions/deno.json`
- [ ] DashboardLayout updated with Buy Plan nav item
- [ ] App.tsx updated with /buy-plan route
- [ ] History.tsx updated with upgrade CTAs
- [ ] AuthContext has refreshProfile function

## Testing Phase

### Test Mode Testing
- [ ] Set Razorpay test keys in environment
- [ ] Navigate to /buy-plan
- [ ] Verify all 3 plans display
- [ ] Test Basic plan purchase:
  - [ ] Click "Buy Basic"
  - [ ] Razorpay modal opens
  - [ ] Use test card: 4111 1111 1111 1111
  - [ ] Payment succeeds
  - [ ] Credits added (5)
  - [ ] Plan updated to "basic"
  - [ ] Toast shows success
  - [ ] Redirects to dashboard
- [ ] Test Best plan purchase:
  - [ ] Credits added (12)
  - [ ] Plan updated to "best"
  - [ ] history_unlocked = true
  - [ ] History page accessible
- [ ] Test VIP plan purchase:
  - [ ] Credits added (25)
  - [ ] Plan updated to "vip"
  - [ ] history_unlocked = true

### Edge Case Testing
- [ ] Test payment cancellation
- [ ] Test payment failure (use card: 4000 0000 0000 0002)
- [ ] Test buying same plan twice (button should be disabled)
- [ ] Test buying lower tier plan (button should be disabled)
- [ ] Test with 0 credits (upgrade CTA shows)
- [ ] Test rapid button clicks (should prevent duplicate)
- [ ] Test network disconnection during payment

### Database Verification
```sql
-- Check payments table
SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;

-- Check profile updates
SELECT id, email, plan, credits_remaining, history_unlocked 
FROM profiles 
WHERE plan != 'free';

-- Check payment statuses
SELECT status, COUNT(*) 
FROM payments 
GROUP BY status;
```

### Edge Function Logs
- [ ] Check create-razorpay-order logs
- [ ] Check verify-razorpay-payment logs
- [ ] Verify no errors in logs
- [ ] Check response times

## Production Deployment

### 1. Switch to Live Keys
- [ ] Get live Razorpay keys from dashboard
- [ ] Update Supabase secrets:
  ```bash
  supabase secrets set RAZORPAY_KEY_ID=rzp_live_xxxxx
  supabase secrets set RAZORPAY_KEY_SECRET=xxxxx
  ```
- [ ] Update frontend .env:
  ```
  VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
  ```
- [ ] Rebuild and deploy frontend

### 2. Small Amount Test
- [ ] Test with smallest plan (Basic - ₹50)
- [ ] Use real payment method
- [ ] Verify payment succeeds
- [ ] Verify credits added
- [ ] Check payment record in database
- [ ] Verify Razorpay dashboard shows payment

### 3. Monitoring Setup
- [ ] Set up Supabase alerts for Edge Function errors
- [ ] Monitor payment success rate
- [ ] Track failed payments
- [ ] Set up daily payment summary

### 4. User Communication
- [ ] Update documentation
- [ ] Add FAQ section
- [ ] Create support email template
- [ ] Prepare refund policy

## Post-Deployment

### Day 1
- [ ] Monitor all payments closely
- [ ] Check for any errors
- [ ] Verify all credits added correctly
- [ ] Respond to user issues immediately

### Week 1
- [ ] Analyze payment success rate
- [ ] Check for failed payments
- [ ] Review Edge Function performance
- [ ] Gather user feedback

### Month 1
- [ ] Calculate conversion rate
- [ ] Identify popular plans
- [ ] Review refund requests
- [ ] Plan improvements

## Rollback Plan

If critical issues occur:

1. **Disable Buy Plan Page**
   ```typescript
   // In BuyPlan.tsx, add at top:
   return (
     <DashboardLayout>
       <div className="p-8 text-center">
         <p>Payment system temporarily unavailable. Please try again later.</p>
       </div>
     </DashboardLayout>
   );
   ```

2. **Disable Edge Functions**
   ```bash
   # Delete functions temporarily
   supabase functions delete create-razorpay-order
   supabase functions delete verify-razorpay-payment
   ```

3. **Manual Credit Addition**
   ```sql
   -- If payment succeeded but credits not added
   UPDATE profiles 
   SET 
     credits_remaining = credits_remaining + X,
     plan = 'plan_type',
     history_unlocked = true
   WHERE id = 'user_id';
   ```

4. **Refund Process**
   - Login to Razorpay dashboard
   - Find payment by order_id
   - Issue full refund
   - Update payment status:
   ```sql
   UPDATE payments 
   SET status = 'failed' 
   WHERE razorpay_payment_id = 'xxx';
   ```

## Support Scenarios

### Payment Succeeded but Credits Not Added
1. Check payments table for payment record
2. Verify payment status is 'paid'
3. Check Edge Function logs for errors
4. Manually add credits if verification failed
5. Investigate root cause

### Payment Failed but Money Deducted
1. Check Razorpay dashboard for payment status
2. If payment actually failed, money will auto-refund in 5-7 days
3. If payment succeeded, manually add credits
4. Update payment record

### User Wants Refund
1. Check payment record in database
2. Verify credits not used
3. Issue refund via Razorpay dashboard
4. Deduct credits from user account
5. Update payment status to 'failed'

## Maintenance

### Weekly Tasks
- [ ] Review failed payments
- [ ] Check Edge Function errors
- [ ] Monitor payment success rate
- [ ] Respond to support tickets

### Monthly Tasks
- [ ] Analyze revenue
- [ ] Review plan popularity
- [ ] Check for fraud patterns
- [ ] Update pricing if needed

### Quarterly Tasks
- [ ] Review Razorpay fees
- [ ] Optimize Edge Functions
- [ ] Update documentation
- [ ] Plan new features

## Security Checklist

- [ ] Razorpay secret keys never exposed to frontend
- [ ] Payment signature verified on backend
- [ ] RLS policies protect user data
- [ ] HTTPS enforced for all requests
- [ ] CORS configured correctly
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive data
- [ ] Logs don't contain sensitive information

## Performance Checklist

- [ ] Edge Functions respond within 2 seconds
- [ ] Database queries optimized with indexes
- [ ] Razorpay script loads asynchronously
- [ ] No blocking operations on main thread
- [ ] Profile refresh only after successful payment
- [ ] Minimal re-renders during payment flow

## Compliance Checklist

- [ ] Terms of Service updated
- [ ] Privacy Policy includes payment data handling
- [ ] Refund policy clearly stated
- [ ] GST compliance (if applicable)
- [ ] Payment gateway compliance
- [ ] Data retention policy defined

## Success Metrics

Track these metrics:

1. **Conversion Rate**: Visitors to /buy-plan → Completed purchases
2. **Payment Success Rate**: Initiated payments → Successful payments
3. **Average Order Value**: Total revenue / Number of orders
4. **Plan Distribution**: Basic vs Best vs VIP purchases
5. **Time to Purchase**: Account creation → First purchase
6. **Refund Rate**: Refunds / Total purchases
7. **Support Tickets**: Payment-related issues

Target Metrics:
- Payment Success Rate: > 95%
- Conversion Rate: > 10%
- Refund Rate: < 2%
- Support Tickets: < 5% of purchases

## Contact Information

**Razorpay Support**: support@razorpay.com
**Supabase Support**: support@supabase.io
**Internal Team**: [Your team contact]

## Notes

- Keep test mode active until confident
- Document all manual interventions
- Maintain payment reconciliation sheet
- Regular backups of payments table
- Monitor Razorpay dashboard daily
