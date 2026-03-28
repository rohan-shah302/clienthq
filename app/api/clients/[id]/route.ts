import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET(_: Request, context: any) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = context.params.id;
  const { data: client, error } = await supabase
    .from("clients").select("*").eq("id", id).single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ client });
}

export async function PATCH(req: Request, context: any) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = context.params.id;
  const body = await req.json();
  const { data, error } = await supabase
    .from("clients").update(body).eq("id", id).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ client: data });
}

export async function DELETE(_: Request, context: any) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = context.params.id;
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}