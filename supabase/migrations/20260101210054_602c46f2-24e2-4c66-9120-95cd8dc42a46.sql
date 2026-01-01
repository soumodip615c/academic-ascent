-- Create storage bucket for notes (PDFs)
INSERT INTO storage.buckets (id, name, public) VALUES ('notes', 'notes', true);

-- Create storage bucket for lectures (videos)
INSERT INTO storage.buckets (id, name, public) VALUES ('lectures', 'lectures', true);

-- Allow public access to notes bucket
CREATE POLICY "Notes files are publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'notes');

CREATE POLICY "Anyone can upload notes" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'notes');

CREATE POLICY "Anyone can delete notes" 
ON storage.objects FOR DELETE USING (bucket_id = 'notes');

-- Allow public access to lectures bucket
CREATE POLICY "Lecture files are publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'lectures');

CREATE POLICY "Anyone can upload lectures" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lectures');

CREATE POLICY "Anyone can delete lectures" 
ON storage.objects FOR DELETE USING (bucket_id = 'lectures');