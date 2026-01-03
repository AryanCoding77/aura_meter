-- Reset credits for all free plan users to 0
UPDATE profiles
SET credits_remaining = 0
WHERE plan = 'free';

-- Verify the update
SELECT id, email, plan, credits_remaining
FROM profiles
WHERE plan = 'free';
