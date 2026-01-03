# Razorpay Integration Guide

## Overview
One-time payment system for Aura Meter using Razorpay. No subscriptions.

## Architecture

### Frontend Flow
1. User clicks plan button on `/buy-plan`
2. Frontend calls Supabase Edge Function: `create-razorpay-order`
3. Razorpay Checkout modal opens
4. User completes payment
5. Frontend calls: `verify-razorpay-payment`
6. Profile updated with credits and plan

### Backend Components

#### Supabase Edge Functions

**create-razorpay-order**
- Creates Razorpay order
- Stores payment record with status 'created'
- Returns order_id and key_id

**verify-razorpay-payment**
- Verifies payment signature
- Updates payment status to 'paid'
- Updates user profile:
  - Adds credits
  - Updates plan type
  - Unlocks history (for best/vip)

### Database Schema

**payments table**
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- plan: TEXT (basic | best | vip)
- amount: INTEGER (in rupees)
- currency: TEXT (default 'INR')
- razorpay_order_id: TEXT
- razorpay_payment_id: TEXT
- razorpay_signature: TEXT
- status: TEXT (created | paid | failed)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**profiles table updates**
```sql
- plan: TEXT (free | basic | best | vip)
- credits_remaining: INTEGER
- history_unlocked: BOOLEAN
```

## Plans Configuration

### Basic Plan
- Price: ₹50
- Credits: 5
- Features: Better AI roast, Faster results

### Best Plan (Most Popular)
- Price: ₹100
- Credits: 12
- Features: History unlock, Stronger roast, Improvement tips

### VIP Plan
- Price: ₹150
- Credits: 25
- Features: All Best features, Priority processing, Detailed roast

## Environment Variables

Required in Supabase Edge Functions:
```
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

Required in Frontend (.env):
```
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

## Payment Flow States

### Loading State
- Button shows "Processing..."
- Disabled state

### Success State
- Toast: "Plan activated. Credits added instantly."
- Profile refreshed
- Redirect to dashboard

### Failure State
- Toast: "Payment failed. Try again."
- Button re-enabled

### Cancelled State
- Toast: "Payment cancelled"
- Button re-enabled

## Security

### Signature Verification
Payment signature verified using HMAC SHA256:
```
generated_signature = hmac_sha256(
  key_secret,
  razorpay_order_id + "|" + razorpay_payment_id
)
```

### Row Level Security
- Users can only view their own payments
- Service role key used for backend operations

## Edge Cases

### Duplicate Payment
- Check payment status before processing
- Prevent double credit addition

### Failed Verification
- Payment marked as failed
- User notified to contact support
- Manual verification required

### Network Failure
- Payment may succeed but verification fails
- Webhook fallback (future implementation)
- Manual reconciliation process

### Plan Downgrade Prevention
- Users cannot buy lower tier plans
- Button disabled if plan already owned
- Plan hierarchy: free < basic < best < vip

### Credit Expiry
- Credits never expire
- One-time purchase model

## Testing

### Test Mode
Use Razorpay test credentials:
- Test Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

### Test Scenarios
1. Successful payment
2. Payment failure
3. Payment cancellation
4. Network interruption
5. Signature mismatch

## Deployment Checklist

- [ ] Run `supabase-payments-table.sql`
- [ ] Deploy Edge Functions
- [ ] Set environment variables
- [ ] Test with Razorpay test mode
- [ ] Switch to live credentials
- [ ] Test live payment
- [ ] Monitor payment logs

## Monitoring

### Payment Logs
Check Supabase Edge Function logs for:
- Order creation errors
- Verification failures
- Signature mismatches

### Database Queries
```sql
-- Failed payments
SELECT * FROM payments WHERE status = 'failed';

-- Recent successful payments
SELECT * FROM payments 
WHERE status = 'paid' 
ORDER BY created_at DESC 
LIMIT 10;

-- User payment history
SELECT * FROM payments 
WHERE user_id = 'xxx' 
ORDER BY created_at DESC;
```

## Future Enhancements

1. Webhook integration for payment status
2. Refund handling
3. Payment history page
4. Invoice generation
5. GST compliance
6. Multiple payment methods
7. Discount codes
8. Referral system
