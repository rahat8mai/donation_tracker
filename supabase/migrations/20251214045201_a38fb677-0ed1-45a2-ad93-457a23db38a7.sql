-- Add address column to collections table
ALTER TABLE public.collections
ADD COLUMN address text;