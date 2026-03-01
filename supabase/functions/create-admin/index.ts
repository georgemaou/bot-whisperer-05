import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Create admin user
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email: "admin@deepseek.com",
    password: "DeepSeek2025!",
    email_confirm: true,
    user_metadata: { full_name: "Master Admin" },
  });

  if (createError) {
    return new Response(JSON.stringify({ error: createError.message }), { status: 400 });
  }

  // Set role to admin
  const { error: roleError } = await supabase
    .from("user_roles")
    .update({ role: "admin" })
    .eq("user_id", user.user.id);

  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true, userId: user.user.id }), { status: 200 });
});
