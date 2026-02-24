
-- Add pdf_url column to expenses table
ALTER TABLE public.expenses ADD COLUMN pdf_url TEXT DEFAULT NULL;

-- Create storage bucket for expense PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('expense-pdfs', 'expense-pdfs', true, 10485760);

-- Allow anyone to read expense PDFs
CREATE POLICY "Anyone can view expense PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'expense-pdfs');

-- Allow anyone to upload expense PDFs (since no auth)
CREATE POLICY "Anyone can upload expense PDFs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'expense-pdfs');

-- Allow anyone to delete expense PDFs
CREATE POLICY "Anyone can delete expense PDFs"
ON storage.objects FOR DELETE
USING (bucket_id = 'expense-pdfs');
