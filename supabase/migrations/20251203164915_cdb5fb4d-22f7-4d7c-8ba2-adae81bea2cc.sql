-- Create collections table for টাকা সংগ্রহ
CREATE TABLE public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  collection_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expenses table for খরচ
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for now)
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access (no authentication required)
CREATE POLICY "Allow public read on collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Allow public insert on collections" ON public.collections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on collections" ON public.collections FOR DELETE USING (true);

CREATE POLICY "Allow public read on expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Allow public insert on expenses" ON public.expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on expenses" ON public.expenses FOR DELETE USING (true);