-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Drop existing policies on collections
DROP POLICY IF EXISTS "Allow public delete on collections" ON public.collections;
DROP POLICY IF EXISTS "Allow public insert on collections" ON public.collections;
DROP POLICY IF EXISTS "Allow public read on collections" ON public.collections;
DROP POLICY IF EXISTS "Allow public update on collections" ON public.collections;

-- Create new secure policies for collections
CREATE POLICY "Anyone can read collections"
ON public.collections
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert collections"
ON public.collections
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update collections"
ON public.collections
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete collections"
ON public.collections
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing policies on expenses
DROP POLICY IF EXISTS "Allow public delete on expenses" ON public.expenses;
DROP POLICY IF EXISTS "Allow public insert on expenses" ON public.expenses;
DROP POLICY IF EXISTS "Allow public read on expenses" ON public.expenses;
DROP POLICY IF EXISTS "Allow public update on expenses" ON public.expenses;

-- Create new secure policies for expenses
CREATE POLICY "Anyone can read expenses"
ON public.expenses
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert expenses"
ON public.expenses
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update expenses"
ON public.expenses
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete expenses"
ON public.expenses
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));