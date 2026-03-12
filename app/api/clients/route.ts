import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "../../lib/supabase";
import { FREE_CLIENT_LIMIT } from "../../lib/utils";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("is_pro")
    .eq("clerk_id", userId)
    .single();

  const isPro = profile?.is_pro || false;

  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ clients, isPro });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("is_pro")
    .eq("clerk_id", userId)
    .single();

  const isPro = profile?.is_pro || false;

  if (!isPro) {
    const { count } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if ((count || 0) >= FREE_CLIENT_LIMIT) {
      return NextResponse.json({ error: "Free plan limit reached." }, { status: 403 });
    }
  }

  const body = await req.json();
  const { name, status, notes } = body;
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const { data, error } = await supabase
    .from("clients")
    .insert({ name, status: status || "active", notes, user_id: userId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ client: data });
}