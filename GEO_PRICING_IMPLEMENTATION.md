# Geo-Based Pricing Implementation

## Overview
The application now supports geo-based pricing that automatically detects the user's location and displays appropriate pricing:

- **Indian users**: ₹50, ₹100, ₹150 (INR)
- **Non-Indian users**: $2, $4, $6 (USD)

## Implementation Details

### 1. Geolocation Service (`src/lib/geolocation.ts`)
- Uses `ipapi.co` API to detect user's country based on IP address
- Free tier: 1000 requests/day
- Caches the result to avoid multiple API calls
- Falls back to Indian pricing on error

### 2. Pricing Component (`src/components/Pricing.tsx`)
- Fetches user's pricing configuration on mount
- Displays prices with appropriate currency symbol
- Shows loading state while fetching location

### 3. Buy Plan Page (`src/pages/BuyPlan.tsx`)
- Dynamically calculates prices based on user's location
- Passes currency information to Razorpay
- Converts prices to smallest currency unit (paise for INR, cents for USD)

### 4. Razorpay Integration (`supabase/functions/create-razorpay-order/index.ts`)
- Accepts currency parameter (INR or USD)
- Creates orders with appropriate currency
- Validates currency before processing

## Important Notes

### Razorpay Currency Support
**IMPORTANT**: Razorpay primarily supports INR (Indian Rupees) for most merchants. USD and other international currencies require:
1. International payment gateway activation
2. Additional KYC verification
3. Business registration outside India
4. Higher transaction fees

**Current Implementation**: The code is ready for multi-currency support, but you need to:
1. Contact Razorpay support to enable international payments
2. Complete additional verification
3. Update your Razorpay account settings

**Alternative for International Users**:
If Razorpay international payments are not enabled, consider:
1. Using Stripe for international payments
2. Keeping INR pricing for all users
3. Using a payment aggregator that supports multiple currencies

## Testing

### Test Indian User
The geolocation API will automatically detect Indian IPs and show INR pricing.

### Test Non-Indian User
To test non-Indian pricing:
1. Use a VPN to connect from outside India
2. Or manually clear the cache and modify the API response
3. Or use the browser console:
```javascript
// Clear cache
localStorage.clear();
// Reload page
location.reload();
```

## API Usage

### ipapi.co Free Tier
- 1000 requests per day
- No API key required
- Rate limit: 1 request per second

If you need more requests, consider:
1. Upgrading to ipapi.co paid plan
2. Using alternative services (ipgeolocation.io, ip-api.com)
3. Implementing server-side caching

## Fallback Behavior

If geolocation fails:
- Defaults to Indian pricing (₹50, ₹100, ₹150)
- User can still complete purchase
- No error shown to user

## Future Enhancements

1. **Server-side geolocation**: Move detection to edge functions for better reliability
2. **More currencies**: Add support for EUR, GBP, etc.
3. **Manual currency selection**: Allow users to choose their preferred currency
4. **Exchange rate API**: Use real-time exchange rates instead of fixed conversions
5. **Regional pricing**: Different prices for different regions (not just India vs. rest)

## Files Modified

1. `src/lib/geolocation.ts` - New geolocation utility
2. `src/components/Pricing.tsx` - Updated to use geo-based pricing
3. `src/pages/BuyPlan.tsx` - Updated to use geo-based pricing
4. `supabase/functions/create-razorpay-order/index.ts` - Added currency support

## Deployment Checklist

- [ ] Test with Indian IP address
- [ ] Test with non-Indian IP address (VPN)
- [ ] Verify Razorpay international payment support
- [ ] Test payment flow with both currencies
- [ ] Monitor ipapi.co API usage
- [ ] Set up error tracking for geolocation failures
- [ ] Document currency limitations for users

## Support

If users experience issues:
1. Check browser console for geolocation errors
2. Verify ipapi.co API is accessible
3. Confirm Razorpay currency support
4. Check payment gateway logs
