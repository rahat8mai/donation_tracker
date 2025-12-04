-- Add UPDATE policies for collections and expenses tables
CREATE POLICY "Allow public update on collections" 
ON public.collections 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public update on expenses" 
ON public.expenses 
FOR UPDATE 
USING (true)
WITH CHECK (true);