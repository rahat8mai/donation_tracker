-- Add category column to expenses table
ALTER TABLE public.expenses
ADD COLUMN category text;