CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) <= 100),
  phone TEXT NOT NULL CHECK (char_length(phone) <= 20),
  email TEXT CHECK (email IS NULL OR char_length(email) <= 255),
  practice_area TEXT CHECK (practice_area IS NULL OR char_length(practice_area) <= 150),
  message TEXT CHECK (message IS NULL OR char_length(message) <= 1000),
  source TEXT NOT NULL DEFAULT 'contact_form' CHECK (source IN ('contact_form', 'chatbot')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon;
GRANT INSERT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an inquiry" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);