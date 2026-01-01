-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  course TEXT NOT NULL,
  roll_no TEXT NOT NULL UNIQUE,
  semester TEXT,
  access_password TEXT NOT NULL DEFAULT '123456',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  course TEXT NOT NULL,
  file_url TEXT,
  description TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lectures table
CREATE TABLE public.lectures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  course TEXT NOT NULL,
  video_url TEXT,
  duration TEXT,
  description TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exams table
CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  course TEXT NOT NULL,
  instructions TEXT,
  google_form_url TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming',
  exam_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create results table
CREATE TABLE public.results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  marks_obtained INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  percentage DECIMAL(5,2),
  grade TEXT,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fees table
CREATE TABLE public.fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  course TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_proof_url TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (students can view)
CREATE POLICY "Notes are viewable by everyone" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Lectures are viewable by everyone" ON public.lectures FOR SELECT USING (true);
CREATE POLICY "Exams are viewable by everyone" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Students are viewable by everyone" ON public.students FOR SELECT USING (true);
CREATE POLICY "Results are viewable by everyone" ON public.results FOR SELECT USING (true);
CREATE POLICY "Fees are viewable by everyone" ON public.fees FOR SELECT USING (true);

-- Admin policies for full CRUD (using service role or anon for now - will add proper admin auth later)
CREATE POLICY "Anyone can insert notes" ON public.notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update notes" ON public.notes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete notes" ON public.notes FOR DELETE USING (true);

CREATE POLICY "Anyone can insert lectures" ON public.lectures FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update lectures" ON public.lectures FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete lectures" ON public.lectures FOR DELETE USING (true);

CREATE POLICY "Anyone can insert exams" ON public.exams FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update exams" ON public.exams FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete exams" ON public.exams FOR DELETE USING (true);

CREATE POLICY "Anyone can insert students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete students" ON public.students FOR DELETE USING (true);

CREATE POLICY "Anyone can insert results" ON public.results FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update results" ON public.results FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete results" ON public.results FOR DELETE USING (true);

CREATE POLICY "Anyone can insert fees" ON public.fees FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update fees" ON public.fees FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete fees" ON public.fees FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lectures_updated_at BEFORE UPDATE ON public.lectures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON public.exams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_fees_updated_at BEFORE UPDATE ON public.fees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();