-- Create a settings table for universal access password
CREATE TABLE public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (students need to verify password)
CREATE POLICY "Settings are viewable by everyone" 
ON public.settings FOR SELECT USING (true);

-- Allow anyone to update settings (admin will use this)
CREATE POLICY "Anyone can update settings" 
ON public.settings FOR UPDATE USING (true);

-- Allow anyone to insert settings
CREATE POLICY "Anyone can insert settings" 
ON public.settings FOR INSERT WITH CHECK (true);

-- Insert default universal access password
INSERT INTO public.settings (key, value) VALUES ('universal_access_password', '123456');

-- Add trigger for updated_at
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();