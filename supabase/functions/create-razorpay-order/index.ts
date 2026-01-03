import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 Function invoked - create-razorpay-order');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS request - returning CORS headers');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('📥 Step 1: Reading request body');
    const body = await req.json();
    console.log('📦 Request body:', JSON.stringify(body, null, 2));
    
    const { user_id, plan_type, amount } = body;

    // Validate input
    console.log('🔍 Step 2: Validating input');
    if (!user_id) throw new Error('Missing user_id');
    if (!plan_type) throw new Error('Missing plan_type');
    if (!amount) throw new Error('Missing amount');
    console.log('✅ Input validation passed');

    if (!['starter', 'popular', 'pro', 'basic', 'best', 'vip'].includes(plan_type)) {
      throw new Error(`Invalid plan type: ${plan_type}`);
    }
    console.log('✅ Plan type validation passed');

    // Check environment variables
    console.log('🔍 Step 3: Checking environment variables');
    const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID');
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not configured');
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }
    console.log('✅ All environment variables present');

    // Create Razorpay order using REST API
    console.log('💳 Step 4: Creating Razorpay order via REST API');
    
    // Generate a shorter receipt ID (max 40 characters)
    const timestamp = Date.now().toString();
    const shortUserId = user_id.substring(0, 8); // First 8 chars of UUID
    const receipt = `ord_${shortUserId}_${timestamp}`;
    
    const orderData = {
      amount: amount,
      currency: 'INR',
      receipt: receipt,
    };
    console.log('Order data:', JSON.stringify(orderData, null, 2));

    // Create Basic Auth header
    const authString = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error('Razorpay API error:', errorText);
      throw new Error(`Razorpay API error: ${razorpayResponse.status} - ${errorText}`);
    }

    const order = await razorpayResponse.json();
    console.log('✅ Razorpay order created:', {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

    // Initialize Supabase
    console.log('🔧 Step 5: Initializing Supabase client');
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    console.log('✅ Supabase client initialized');

    // Store payment record
    console.log('💾 Step 6: Storing payment record in database');
    const paymentData = {
      user_id,
      plan: plan_type,
      amount: amount / 100,
      razorpay_order_id: order.id,
      status: 'created',
    };
    console.log('Payment data to insert:', JSON.stringify(paymentData, null, 2));
    
    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from('payments')
      .insert(paymentData)
      .select();

    if (insertError) {
      console.error('❌ Database insert error:', JSON.stringify(insertError, null, 2));
      throw new Error(`Database error: ${insertError.message}`);
    }
    
    console.log('✅ Payment record stored:', JSON.stringify(insertedData, null, 2));

    // Return success
    console.log('🎉 Step 7: Returning success response');
    const response = {
      order_id: order.id,
      key_id: RAZORPAY_KEY_ID,
    };
    console.log('Response:', JSON.stringify(response, null, 2));

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ ERROR CAUGHT:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
