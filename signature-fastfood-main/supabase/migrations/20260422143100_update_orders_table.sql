-- Add columns to orders table to store user details and address
ALTER TABLE public.orders 
  ALTER COLUMN user_id DROP NOT NULL,
  ADD COLUMN customer_name TEXT,
  ADD COLUMN phone TEXT,
  ADD COLUMN customer_email TEXT,
  ADD COLUMN address TEXT;

-- Update RLS policies to allow guest inserts and viewing
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
