/// <reference lib="deno.ns" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { z } from "https://esm.sh/zod@3.25.76";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RegisterStudentSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  course: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(30).nullable().optional(),
  accessPassword: z.string().trim().min(1).max(64),
});

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json(500, { error: "Server not configured" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const raw = await req.json().catch(() => null);
  const parsed = RegisterStudentSchema.safeParse(raw);
  if (!parsed.success) {
    return json(400, { error: "Invalid input", issues: parsed.error.issues });
  }

  const { name, email, course, phone, accessPassword } = parsed.data;

  // Get universal access password
  const { data: passwordSetting, error: passwordError } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "universal_access_password")
    .maybeSingle();

  if (passwordError) return json(500, { error: "Failed to read settings" });

  const universalPassword = passwordSetting?.value || "123456";
  if (accessPassword !== universalPassword) {
    return json(401, { error: "Invalid access password" });
  }

  // Prevent duplicate registrations
  const { data: existingStudent, error: existingError } = await supabase
    .from("students")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingError) return json(500, { error: "Failed to check existing student" });
  if (existingStudent) return json(409, { error: "Email already registered" });

  const rollNo = `SCW${crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase()}`;

  const { data: student, error: insertError } = await supabase
    .from("students")
    .insert({
      name,
      email,
      course,
      phone: phone ?? null,
      roll_no: rollNo,
      semester: null,
      is_active: true,
    })
    .select("*")
    .single();

  if (insertError) return json(500, { error: insertError.message });

  return json(200, { student });
});
