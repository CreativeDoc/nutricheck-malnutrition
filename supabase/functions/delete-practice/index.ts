import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    // Verify the caller is an admin by checking their JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller identity from JWT
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { authorization: authHeader } },
    });
    const { data: { user: caller } } = await anonClient.auth.getUser();

    if (!caller) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Check caller is admin
    const { data: callerProfile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (callerProfile?.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Forbidden: admin role required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { practice_id } = await req.json();

    if (!practice_id) {
      return new Response(
        JSON.stringify({ error: "Missing practice_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Prevent admin from deleting their own practice
    const { data: callerPractice } = await adminClient
      .from("profiles")
      .select("practice_id")
      .eq("id", caller.id)
      .single();

    if (callerPractice?.practice_id === practice_id) {
      return new Response(
        JSON.stringify({ error: "Cannot delete your own practice" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 1. Find all auth user IDs linked to this practice via profiles
    const { data: profiles, error: profilesError } = await adminClient
      .from("profiles")
      .select("id")
      .eq("practice_id", practice_id);

    if (profilesError) {
      throw new Error(`Failed to query profiles: ${profilesError.message}`);
    }

    const userIds = (profiles ?? []).map((p) => p.id);

    // 2. Delete each auth user (this cascades to profiles due to ON DELETE CASCADE)
    const deleteErrors: string[] = [];
    for (const userId of userIds) {
      const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
      if (deleteError) {
        deleteErrors.push(`User ${userId}: ${deleteError.message}`);
      }
    }

    // 3. Delete the practice (cascades to any remaining profiles and screenings)
    const { error: practiceError } = await adminClient
      .from("practices")
      .delete()
      .eq("id", practice_id);

    if (practiceError) {
      throw new Error(`Failed to delete practice: ${practiceError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        deleted_auth_users: userIds.length,
        auth_delete_errors: deleteErrors.length > 0 ? deleteErrors : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
