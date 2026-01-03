@echo off
REM Deploy Edge Functions without JWT verification
REM This allows the functions to be called without authentication

echo Deploying create-razorpay-order...
supabase functions deploy create-razorpay-order --no-verify-jwt

echo Deploying verify-razorpay-payment...
supabase functions deploy verify-razorpay-payment --no-verify-jwt

echo.
echo ✅ Both functions deployed successfully!
echo.
echo Note: Functions are now accessible without JWT verification.
echo Make sure your Razorpay secrets are set:
echo   - RAZORPAY_KEY_ID
echo   - RAZORPAY_KEY_SECRET
echo   - SUPABASE_URL
echo   - SUPABASE_SERVICE_ROLE_KEY
