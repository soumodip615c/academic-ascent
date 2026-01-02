import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    console.log("Received webhook data:", JSON.stringify(body));

    // Expected payload from Google Apps Script:
    // {
    //   exam_id: "uuid of the exam",
    //   student_email: "student@email.com" OR student_roll_no: "ROLL123",
    //   marks_obtained: 85,
    //   total_marks: 100,
    //   grade: "A" (optional),
    //   remarks: "Good work" (optional)
    // }

    const { 
      exam_id, 
      student_email, 
      student_roll_no, 
      marks_obtained, 
      total_marks, 
      grade, 
      remarks 
    } = body;

    // Validate required fields
    if (!exam_id) {
      console.error("Missing exam_id");
      return new Response(
        JSON.stringify({ error: "exam_id is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!student_email && !student_roll_no) {
      console.error("Missing student identifier");
      return new Response(
        JSON.stringify({ error: "Either student_email or student_roll_no is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (marks_obtained === undefined || total_marks === undefined) {
      console.error("Missing marks data");
      return new Response(
        JSON.stringify({ error: "marks_obtained and total_marks are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the student by email or roll number
    let studentQuery = supabase.from('students').select('id, name, email, roll_no');
    
    if (student_email) {
      studentQuery = studentQuery.eq('email', student_email);
    } else {
      studentQuery = studentQuery.eq('roll_no', student_roll_no);
    }

    const { data: students, error: studentError } = await studentQuery.limit(1);

    if (studentError) {
      console.error("Error finding student:", studentError);
      return new Response(
        JSON.stringify({ error: "Failed to find student", details: studentError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!students || students.length === 0) {
      console.error("Student not found:", student_email || student_roll_no);
      return new Response(
        JSON.stringify({ error: "Student not found", identifier: student_email || student_roll_no }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const student = students[0];
    console.log("Found student:", student.name, student.id);

    // Verify the exam exists
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .select('id, title')
      .eq('id', exam_id)
      .maybeSingle();

    if (examError || !exam) {
      console.error("Exam not found:", exam_id);
      return new Response(
        JSON.stringify({ error: "Exam not found", exam_id }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Found exam:", exam.title);

    // Calculate percentage
    const percentage = total_marks > 0 ? Math.round((marks_obtained / total_marks) * 100) : 0;

    // Check if result already exists for this student and exam
    const { data: existingResult } = await supabase
      .from('results')
      .select('id')
      .eq('student_id', student.id)
      .eq('exam_id', exam_id)
      .maybeSingle();

    let result;
    if (existingResult) {
      // Update existing result
      console.log("Updating existing result:", existingResult.id);
      const { data, error } = await supabase
        .from('results')
        .update({
          marks_obtained: parseInt(marks_obtained),
          total_marks: parseInt(total_marks),
          percentage,
          grade: grade || null,
          remarks: remarks || null,
        })
        .eq('id', existingResult.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new result
      console.log("Creating new result for student:", student.id, "exam:", exam_id);
      const { data, error } = await supabase
        .from('results')
        .insert({
          student_id: student.id,
          exam_id: exam_id,
          marks_obtained: parseInt(marks_obtained),
          total_marks: parseInt(total_marks),
          percentage,
          grade: grade || null,
          remarks: remarks || null,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    console.log("Result saved successfully:", result.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Result saved successfully",
        result_id: result.id,
        student_name: student.name,
        exam_title: exam.title,
        percentage
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
