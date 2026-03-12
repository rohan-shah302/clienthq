import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("client_id");

  let query = supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (clientId) query = query.eq("client_id", clientId);

  const { data: tasks, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, client_id, due_date } = body;
  if (!title || !client_id) return NextResponse.json({ error: "title and client_id required" }, { status: 400 });

  const { data, error } = await supabase
    .from("tasks")
    .insert({ title, client_id, due_date: due_date || null, user_id: userId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ task: data });
}