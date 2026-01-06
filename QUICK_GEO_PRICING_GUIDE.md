# Quick Geo-Based Pricing Guide

## What Changed?

Your pricing page now automatically detects the user's location and shows different prices:

### Indian Users (IP from India)
- Basic: ₹50 (5 credits)
- Best: ₹100 (12 credits)
- VIP: ₹150 (25 credits)

### Non-Indian Users (IP from outside India)
- Basic: $2 (5 credits)
- Best: $4 (12 credits)
- VIP: $6 (25 credits)

## How It Works

1. **User visits pricing page** → System detects their IP location
2. **Location detected** → Shows appropriate currency and prices
3. **User clicks buy** → Razorpay receives correct amount and currency
4. **Payment processed** → Credits added to account

## Important: Razorpay Currency Support

⚠️ **CRITICAL**: Razorpay by default only supports INR (Indian Rupees).

To accept USD payments, you must:
1. Log into your Razorpay Dashboard
2. Go to Settings → Payment Methods
3. Enable "International Payments"
4. Complete additional KYC verification
5. Provide business registration documents

**Without international payments enabled**, USD transactions will fail.

### Alternative Options:

**Option 1**: Keep INR for all users (simplest)
- Change the code to always show INR pricing
- No Razorpay changes needed

**Option 2**: Use Stripe for international payments
- Integrate Stripe alongside Razorpay
- Use Razorpay for Indian users
- Use Stripe for international users

**Option 3**: Show INR equivalent for international users
- Display: "$2 (₹166 approx)"
- Process all payments in INR
- No Razorpay changes needed

## Testing

### Test as Indian User
1. Visit the pricing page normally
2. Should see ₹50, ₹100, ₹150

### Test as Non-Indian User
1. Use a VPN (connect to US, UK, etc.)
2. Visit the pricing page
3. Should see $2, $4, $6

## Files Changed

- `src/lib/geolocation.ts` - Location detection
- `src/components/Pricing.tsx` - Pricing display
- `src/pages/BuyPlan.tsx` - Purchase flow
- `supabase/functions/create-razorpay-order/index.ts` - Order creation

## Quick Rollback

If you want to revert to INR-only pricing:

1. In `src/lib/geolocation.ts`, change the return to always use INR:
```typescript
export async function getUserPricing(): Promise<PricingConfig> {
  return {
    currency: 'INR',
    symbol: '₹',
    prices: { basic: 50, best: 100, vip: 150 },
    isIndia: true,
  };
}
```

2. Redeploy the application

## Next Steps

1. ✅ Code is ready
2. ⏳ Enable international payments in Razorpay (if needed)
3. ⏳ Test with real payments
4. ⏳ Monitor for errors
5. ⏳ Deploy to production

## Need Help?

- Razorpay international payments: https://razorpay.com/docs/payments/payments/international-payments/
- Contact Razorpay support: support@razorpay.com
- Check implementation: See `GEO_PRICING_IMPLEMENTATION.md`
