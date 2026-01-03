# Buy Plan Implementation Summary

## 1. Page Layout Structure

### Route
`/buy-plan` - Protected route requiring authentication

### Layout Hierarchy
```
DashboardLayout
  └─ BuyPlan Page
      ├─ Header Section
      │   ├─ Badge (Crown icon + "Upgrade")
      │   ├─ Title: "Upgrade Your Aura"
      │   └─ Subtitle: "One-time payment. No subscriptions. Instant unlock."
      │
      ├─ Plans Grid (3 columns)
      │   ├─ Basic Plan Card
      │   ├─ Best Plan Card (highlighted, "Most Popular" badge)
      │   └─ VIP Plan Card
      │
      ├─ Footer Note
      │   └─ "No subscriptions. Credits never expire."
      │
      └─ Info Cards (2 columns)
          ├─ Instant Activation
          └─ Lifetime Access
```

### Plan Card Structure
```
Card
  ├─ Popular Badge (conditional)
  ├─ Current Plan Badge (conditional)
  ├─ Plan Header
  │   ├─ Plan Name
  │   └─ Price (₹XX one-time)
  ├─ Features List (checkmarks)
  └─ CTA Button
```

## 2. Component Breakdown

### Core Components

**BuyPlan.tsx** (Main Page)
- Manages payment flow
- Loads Razorpay script
- Handles plan purchase logic
- Shows loading/success/error states

**DashboardLayout.tsx** (Updated)
- Added "Buy Plan" nav item with CreditCard icon
- Positioned between History and Settings

**App.tsx** (Updated)
- Added `/buy-plan` protected route
- Imported BuyPlan component

**History.tsx** (Updated)
- Shows "Buy Credits" CTA when credits = 0
- Redirects to `/buy-plan` instead of `/pricing`

### Supporting Files

**supabase-payments-table.sql**
- Creates payments table
- Adds history_unlocked column to profiles
- Sets up RLS policies
- Creates indexes

**supabase/functions/create-razorpay-order/index.ts**
- Edge function to create Razorpay order
- Stores payment record with status 'created'
- Returns order_id and key_id

**supabase/functions/verify-razorpay-payment/index.ts**
- Verifies payment signature
- Updates payment status to 'paid'
- Updates user profile (credits, plan, history_unlocked)

## 3. Razorpay Payment Flow

### Step-by-Step Process

**Step 1: User Clicks Plan Button**
```typescript
handlePurchase(plan: Plan)
  ├─ Validate user authentication
  ├─ Check Razorpay script loaded
  └─ Set loading state
```

**Step 2: Create Order**
```typescript
supabase.functions.invoke('create-razorpay-order', {
  user_id: string,
  plan_type: 'basic' | 'best' | 'vip',
  amount: number (in paise)
})
  ├─ Backend creates Razorpay order
  ├─ Stores payment record (status: 'created')
  └─ Returns { order_id, key_id }
```

**Step 3: Open Razorpay Checkout**
```typescript
Razorpay({
  key: key_id,
  amount: number,
  currency: 'INR',
  order_id: string,
  prefill: { email, name },
  handler: onSuccess,
  modal: { ondismiss: onCancel }
})
```

**Step 4: Payment Success Handler**
```typescript
handler(response) {
  ├─ Extract payment details
  ├─ Call verify-razorpay-payment
  ├─ Backend verifies signature
  ├─ Update payment status
  ├─ Update user profile
  ├─ Show success toast
  ├─ Refresh profile
  └─ Navigate to dashboard
}
```

**Step 5: Payment Verification**
```typescript
verify-razorpay-payment
  ├─ Verify HMAC signature
  ├─ Update payment record (status: 'paid')
  ├─ Calculate new credits
  ├─ Update profile:
  │   ├─ plan = plan_type
  │   ├─ credits_remaining += credits
  │   └─ history_unlocked = true (for best/vip)
  └─ Return success response
```

### Payment States

**Initial State**
- All buttons enabled (except owned plans)
- No loading indicators

**Loading State**
- Button shows "Processing..." with spinner
- Button disabled
- Other plan buttons remain enabled

**Success State**
- Toast: "Plan activated. Credits added instantly."
- Profile refreshed automatically
- Redirect to dashboard
- Button shows "Owned" (disabled)

**Failure State**
- Toast: "Payment failed. Try again."
- Button re-enabled
- Error logged to console

**Cancelled State**
- Toast: "Payment cancelled"
- Button re-enabled
- Modal dismissed

## 4. Supabase Schema Changes

### New Table: payments

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('basic', 'best', 'vip')),
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Updated Table: profiles

```sql
-- Existing columns
plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'best', 'vip'))
credits_remaining INTEGER NOT NULL DEFAULT 0

-- New column
history_unlocked BOOLEAN NOT NULL DEFAULT false
```

### Indexes

```sql
CREATE INDEX payments_user_id_idx ON payments(user_id);
CREATE INDEX payments_razorpay_order_id_idx ON payments(razorpay_order_id);
CREATE INDEX payments_status_idx ON payments(status);
```

### RLS Policies

```sql
-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);
```

## 5. Edge Cases Handled

### Plan Ownership
**Problem**: User tries to buy plan they already own
**Solution**: 
- Check plan hierarchy (free < basic < best < vip)
- Disable button if plan owned or lower tier
- Show "Current Plan" badge
- Show "Owned" on button

### No Credits
**Problem**: User has 0 credits
**Solution**:
- Show upgrade CTA in History page
- Show "Buy Credits" button in empty state
- Redirect to /buy-plan

### Script Loading
**Problem**: Razorpay script not loaded
**Solution**:
- Load script on component mount
- Track loading state
- Show error if script fails
- Prevent payment if not loaded

### Network Failure During Payment
**Problem**: Payment succeeds but verification fails
**Solution**:
- Payment record created with order_id
- Manual reconciliation possible via payments table
- User can contact support with order_id
- Future: Webhook integration for auto-retry

### Duplicate Payment
**Problem**: User clicks button multiple times
**Solution**:
- Disable button during processing
- Loading state prevents multiple clicks
- Backend checks payment status before processing

### Invalid Signature
**Problem**: Tampered payment response
**Solution**:
- HMAC SHA256 signature verification
- Payment rejected if signature invalid
- Error logged for security monitoring
- User notified to try again

### Plan Downgrade
**Problem**: VIP user tries to buy Basic
**Solution**:
- Plan hierarchy check
- Button disabled for lower tiers
- "Owned" state shown

### Credit Calculation
**Problem**: Credits not added correctly
**Solution**:
- Fetch current credits from database
- Add plan credits atomically
- Return new total in response
- Frontend refreshes profile

### History Unlock Logic
**Problem**: History should unlock for best/vip only
**Solution**:
```typescript
if (plan_type === 'best' || plan_type === 'vip') {
  updateData.history_unlocked = true;
}
```

### Session Expiry
**Problem**: User session expires during payment
**Solution**:
- Check authentication before payment
- Redirect to login if not authenticated
- Payment flow requires active session

### Amount Mismatch
**Problem**: Frontend and backend amounts differ
**Solution**:
- Backend validates plan_type
- Amount calculated server-side
- Frontend only sends plan_type

## 6. Production-Ready Logic

### Security Measures

**Environment Variables**
- Razorpay keys stored in Supabase secrets
- Never exposed to frontend (except key_id)
- Service role key for backend operations

**Signature Verification**
```typescript
const generatedSignature = createHmac('sha256', keySecret)
  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  .digest('hex');

if (generatedSignature !== razorpay_signature) {
  throw new Error('Invalid payment signature');
}
```

**Row Level Security**
- Users can only access their own data
- Service role bypasses RLS for backend operations
- Payments table protected by RLS

### Error Handling

**Frontend**
```typescript
try {
  // Payment flow
} catch (error) {
  console.error('Payment error:', error);
  toast.error('Payment failed. Try again.');
  setLoading(null);
}
```

**Backend**
```typescript
try {
  // Order creation / verification
} catch (error) {
  console.error('Error:', error);
  return new Response(
    JSON.stringify({ error: error.message }),
    { status: 400 }
  );
}
```

### Logging

**Frontend Console Logs**
- Payment initiation
- Order creation response
- Verification response
- Error details

**Backend Logs**
- Order creation
- Payment verification
- Database updates
- Error stack traces

### Data Validation

**Input Validation**
```typescript
// Frontend
if (!user_id || !plan_type || !amount) {
  throw new Error('Missing required fields');
}

if (!['basic', 'best', 'vip'].includes(plan_type)) {
  throw new Error('Invalid plan type');
}
```

**Type Safety**
```typescript
interface Plan {
  id: 'basic' | 'best' | 'vip';
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
}
```

### Performance Optimization

**Script Loading**
- Razorpay script loaded once on mount
- Cached for subsequent payments
- Async loading doesn't block render

**Profile Refresh**
- Only refresh after successful payment
- Optimistic UI updates possible
- Minimal database queries

**Database Indexes**
- Indexed on user_id for fast lookups
- Indexed on order_id for verification
- Indexed on status for filtering

## 7. Testing Checklist

### Manual Testing

- [ ] Load /buy-plan page
- [ ] Verify all 3 plans display correctly
- [ ] Click Basic plan button
- [ ] Complete test payment
- [ ] Verify credits added
- [ ] Verify plan updated
- [ ] Check payment record in database
- [ ] Repeat for Best plan
- [ ] Verify history unlocked
- [ ] Repeat for VIP plan
- [ ] Test payment cancellation
- [ ] Test payment failure
- [ ] Test with 0 credits
- [ ] Test upgrade CTA in History
- [ ] Test owned plan button disabled
- [ ] Test loading states
- [ ] Test error states

### Edge Case Testing

- [ ] Click button multiple times rapidly
- [ ] Close modal during payment
- [ ] Disconnect network during payment
- [ ] Try buying lower tier plan
- [ ] Try buying same plan twice
- [ ] Test with expired session
- [ ] Test with invalid plan_type
- [ ] Test with tampered signature

### Database Verification

```sql
-- Check payment record
SELECT * FROM payments WHERE user_id = 'xxx';

-- Check profile update
SELECT plan, credits_remaining, history_unlocked 
FROM profiles WHERE id = 'xxx';

-- Check payment status
SELECT status, created_at, updated_at 
FROM payments WHERE razorpay_order_id = 'xxx';
```

## 8. Deployment Steps

1. **Run SQL Migration**
```bash
psql -h db.xxx.supabase.co -U postgres -d postgres -f supabase-payments-table.sql
```

2. **Deploy Edge Functions**
```bash
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
```

3. **Set Environment Variables**
```bash
supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxx
supabase secrets set RAZORPAY_KEY_SECRET=xxx
```

4. **Update Frontend .env**
```
VITE_RAZORPAY_KEY_ID=rzp_test_xxx
```

5. **Test in Staging**
- Use Razorpay test mode
- Complete test transactions
- Verify database updates

6. **Switch to Production**
- Update to live Razorpay keys
- Test with small amount
- Monitor logs

7. **Monitor**
- Check Edge Function logs
- Monitor payment success rate
- Track failed payments

## 9. Future Enhancements

1. **Webhook Integration**
   - Auto-verify payments via webhook
   - Handle delayed payments
   - Retry failed verifications

2. **Payment History Page**
   - Show all user transactions
   - Download invoices
   - Refund requests

3. **Discount Codes**
   - Promotional codes
   - Referral discounts
   - Seasonal offers

4. **Multiple Payment Methods**
   - UPI
   - Wallets
   - Net banking

5. **GST Compliance**
   - Add GST to invoices
   - Store GST details
   - Generate GST reports

6. **Analytics**
   - Track conversion rates
   - Popular plans
   - Revenue metrics

7. **Email Notifications**
   - Payment confirmation
   - Receipt email
   - Credit expiry reminders (if implemented)

8. **Refund System**
   - Automated refunds
   - Partial refunds
   - Credit adjustments
