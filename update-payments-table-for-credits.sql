-- Update payments table to support new credit pack types
-- This migration adds support for 'starter', 'popular', 'pro' in addition to old plan types

-- Drop the old constraint
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_plan_check;

-- Add new constraint with all plan types (old + new)
ALTER TABLE payments ADD CONSTRAINT payments_plan_check 
  CHECK (plan IN ('basic', 'best', 'vip', 'starter', 'popular', 'pro'));

-- Verify the change
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'payments'::regclass
  AND conname = 'payments_plan_check';
