import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLAN_CREDITS = {
  // Old plan types (for backward compatibility)
  basic: 5,
  best: 12,
  vip: 25,
  // New credit pack types
  starter: 5,
  popular: 12,
  pro: 25,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      plan_type,
    } = await req.json();

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !user_id || !plan_type) {
      throw new Error('Missing required fields');
    }

    // Verify signature
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!keySecret) {
      throw new Error('Payment system not configured');
    }

    const generatedSignature = createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('Signature mismatch:', { generatedSignature, razorpay_signature });
      throw new Error('Invalid payment signature');
    }

    // Use service role client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update payment record
    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'paid',
      })
      .eq('razorpay_order_id', razorpay_order_id);

    if (updatePaymentError) {
      console.error('Error updating payment:', updatePaymentError);
      throw updatePaymentError;
    }

    // Get current user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('credits_remaining')
      .eq('id', user_id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

    // Calculate new credits
    const creditsToAdd = PLAN_CREDITS[plan_type as keyof typeof PLAN_CREDITS];
    if (!creditsToAdd) {
      throw new Error(`Invalid plan type: ${plan_type}`);
    }
    const newCredits = (profile?.credits_remaining || 0) + creditsToAdd;

    // Update user profile - just add credits, don't change plan
    const updateData: any = {
      credits_remaining: newCredits,
    };

    const { error: updateProfileError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', user_id);

    if (updateProfileError) {
      console.error('Error updating profile:', updateProfileError);
      throw updateProfileError;
    }

    console.log('Payment verified successfully:', {
      user_id,
      plan_type,
      credits_added: creditsToAdd,
      new_total: newCredits,
    });

    return new Response(
      JSON.stringify({
        success: true,
        credits_added: creditsToAdd,
        new_total: newCredits,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
